import React, { createContext, useContext, useState } from "react";
import { useAppContext } from "./app_context";
import { useAlertContext } from "./alert_context";
import * as authService from '../services/firebase/authService';
import * as dbService from '../services/firebase/databaseService';
import * as ethService from '../services/ethereum/ethService';

export const RegistrationContext = createContext();

const RegistrationContextProvider = props => {

    const appContext = useAppContext();
    const { setIsAuthenticated, setUser, currentUserAccount, accountType } = appContext;
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const alertContext = useAlertContext();

    const authenticateAsync = async (isSignup, name, email, password, instituteAddress) => {
        setIsAuthenticating(true);

        const address = ethService.toChecksumAddress(currentUserAccount);
        try {
            if (isSignup) {
                //if user already exist return false
                var u = await dbService.getUserByAddress(address);
                if (u) {
                    alertContext.showError("Current Address is already in use by another account.");
                    setIsAuthenticating(false);
                    setIsAuthenticated(false);
                    return false;
                }
                //sign up user
                await authService.signUpUser(email, password);

                let contractAddress;

                //if user is institute deploy its contract
                if (accountType == "Institute") {
                    alertContext.showWarning("Please wait, Deploying contract....");
                    appContext.setIsTransactionRunning(true);

                    contractAddress = await ethService.deployInstituteContract();
                    if (contractAddress) {

                        alertContext.showSuccess("Contract Deployment Successfully");
                    }
                    else {
                        alertContext.showError("Contract Deployment Failed");
                    }
                    appContext.setIsTransactionRunning(false);
                }

                //upload user info to firebase
                await dbService.setUser(address, {
                    name: name,
                    email: email,
                    address: address,
                    instituteAddress: instituteAddress,
                    accountType: accountType,
                    contractAddress: contractAddress ?? '',
                    imgUrl: '',
                });
                const user = await dbService.getUserByEmail(email);
                setUser(user);
            }
            else {
                //sign in user
                await authService.signInUser(email, password);
            }
            setIsAuthenticating(false);
            setIsAuthenticated(true);
            return true;
        }
        catch (e) {
            setIsAuthenticating(false);
            setIsAuthenticated(false);
            switch (e.code) {
                case 'auth/user-not-found':
                    alertContext.showError("Invalid email address");
                    break;
                default:
                    alertContext.showError(e.message);
                    break;
            }
            return false;
        }
    }

    return (
        <RegistrationContext.Provider value={{
            isAuthenticating, setIsAuthenticating,
            isSignUp, setIsSignUp,
            authenticateAsync
        }}>
            {props.children}
        </RegistrationContext.Provider>
    );
};

export const useRegistrationContext = () => useContext(RegistrationContext);

export default RegistrationContextProvider;