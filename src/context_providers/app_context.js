import React, { createContext, useState, useContext } from "react";
import * as authService from '../services/firebase/authService';
import { useHistory } from 'react-router-dom';

export const AppContext = createContext();

const AppContextProvider = props => {

    //true if browser supports metamask
    const [isMetamaskEnabled, setIsMetamaskEnabled] = useState(false);

    //true when app if fully loaded
    const [isAppLoaded, setIsAppLoaded] = useState(false);

    //true when use is signed in
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    //true if the selected metamask account address is the same as the account address of currently signed in user
    const [isUserAccountSelected, setIsUserAccountSelected] = useState(false);

    //true if a transaction to ethereum blockchain is in progress, and remains true until the transaction is written to the block
    const [isTransactionRunning, setIsTransactionRunning] = useState(false);

    //the current ethereum account select in metamask wallet
    const [currentUserAccount, setCurrentUserAccount] = useState(null);

    //the current selected network on metamask wallet
    const [currentNetwork, setCurrentNetwork] = useState(null);

    //the information of currently signed in use
    const [user, setUser] = useState(null);

    //account have two types (Student | Institute)
    const [accountType, setAccountType] = useState('Student');


    const routeHistory = useHistory();

    const signOut = () => {
        authService.signOutUser();
        setIsAuthenticated(false);
        setUser(null);
        routeHistory.push('/');
    }

    return (
        <AppContext.Provider value={{
            isMetamaskEnabled, setIsMetamaskEnabled,
            isAppLoaded, setIsAppLoaded,
            isAuthenticated, setIsAuthenticated,
            isUserAccountSelected, setIsUserAccountSelected,
            isTransactionRunning, setIsTransactionRunning,
            currentUserAccount, setCurrentUserAccount,
            currentNetwork, setCurrentNetwork,
            accountType, setAccountType,
            user, setUser,
            signOut
        }}>
            {props.children}
        </AppContext.Provider>
    );
}

export const useAppContext = () => useContext(AppContext);

export default AppContextProvider;