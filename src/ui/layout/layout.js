import React, { Suspense, useEffect } from 'react';
import { NavigationBar } from '../components/navigation_bar/navigation_bar';
import { Route, Switch, useHistory } from 'react-router-dom';
import { StudentDashboard } from '../screens/student_dashboard/view/student_dashboard';
import { CertificateDetails } from '../screens/certificate_details/view/certificate_details';
import { AddCertificate } from '../screens/add_certificate/view/add_certificate';
import { StudentList } from '../screens/student_list/view/student_list';
import { PendingApprovals } from '../screens/pending_approvals/view/pending_approvals';
import { UserRegistration } from '../screens/user_registration/view/user_registration';
import { InvalidAccountMessage } from '../components/messages/invalid_account_message';
import { InvalidNetworkMessage } from '../components/messages/invalid_network_message';
import { LoadingMessage } from '../components/messages/loading_message';
import { NoMetamaskMessage } from '../components/messages/no_metamask_message';
import { useAppContext } from '../../context_providers/app_context';
import * as ethService from '../../services/ethereum/ethService';
import * as authService from '../../services/firebase/authService';
import * as dbService from '../../services/firebase/databaseService';
import { EditProfile } from '../screens/edit_profile/view/edit_profile';
import { InstituteDashboard } from '../screens/institute_dashboard/view/institute_dashboard';
import { AlertsList } from '../components/alerts/alert_list';
import { SignOut } from '../components/sign_out/sign_out';
import { AllCertificates } from '../screens/all_certificates/view/all_certificates';
import { SearchCertificate } from '../screens/search_certificate/view/search_certificate';

export const Layout = () => {

    const appContext = useAppContext();
    const history = useHistory();
    const networkId = 3;

    const setupApp = async () => {
        //check authentication state
        authService.onAuthStateChanged(async (user) => {
            if (user) {
                const userInfo = await dbService.getUserByEmail(user.email);
                if (!userInfo)
                    return;

                appContext.setAccountType(userInfo.accountType);

                //set the user state
                appContext.setUser(userInfo);

                //set authenticated to true
                appContext.setIsAuthenticated(true);
            }
            else {
                authService.signOutUser();
            }
        });

        //enable metamask
        const isEnabled = await ethService.enable(appContext);
        if (isEnabled) {
            appContext.setIsMetamaskEnabled(true);
        }

        appContext.setIsAppLoaded(true);
    }

    const signOutHandler = () => {
        appContext.signOut();
    }

    useEffect(() => {
        setupApp();
        ethService.listenNetworkChange(appContext);
    }, []);

    useEffect(() => {
        //listen account changed event
        ethService.listenAccountChange(appContext.user?.address, appContext);
        appContext.setIsUserAccountSelected(appContext.currentUserAccount == appContext.user?.address);
    }, [appContext.user]);


    let routes = (
        <Switch>
            <Route path="/sign_out" exact component={SignOut} />
            <Route path="/certificate_details/:key" exact component={CertificateDetails} />
            <Route path="/search_certificate" component={SearchCertificate} />
            <Route path="/" component={UserRegistration} />
        </Switch>
    );

    if (appContext.isAuthenticated && appContext.accountType == 'Student') {
        routes = (
            <Switch>
                <Route path="/certificate_details/:key" exact component={CertificateDetails} />
                <Route path="/pending_approvals" exact component={PendingApprovals} />
                <Route path="/add_certificate" exact component={AddCertificate} />
                <Route path="/edit_profile" exact component={EditProfile} />
                <Route path="/search_certificate" component={SearchCertificate} />
                <Route path="/" component={StudentDashboard} />
            </Switch>
        );
    }

    if (appContext.isAuthenticated && appContext.accountType == 'Institute') {
        routes = (
            <Switch>
                <Route path="/certificate_details/:key" exact component={CertificateDetails} />
                <Route path="/all_certificates" exact component={AllCertificates} />
                <Route path="/students" exact component={StudentList} />
                <Route path="/pending_approvals" exact component={PendingApprovals} />
                <Route path="/add_certificate" exact component={AddCertificate} />
                <Route path="/edit_profile" exact component={EditProfile} />
                <Route path="/search_certificate" component={SearchCertificate} />
                <Route path="/" component={InstituteDashboard} />
            </Switch>
        );
    }
    return (
        appContext.isAppLoaded ?
            appContext.isMetamaskEnabled ?
                appContext.isUserAccountSelected || !appContext.isAuthenticated ?
                    appContext.currentNetwork == networkId || !appContext.isAuthenticated ?
                        <React.Fragment>
                            {/* Navigation Bar */}
                            <NavigationBar />

                            {/* Alerts as notifications */}
                            <AlertsList />

                            {/* This will load the proper page according to the given route */}
                            <Suspense fallback={<p>Loading...</p>}>{routes}</Suspense>

                        </React.Fragment>
                        : <InvalidNetworkMessage />
                    : <InvalidAccountMessage address={appContext.user?.address} signOutHandler={signOutHandler} />
                : <NoMetamaskMessage />
            : <LoadingMessage />
    )
}
