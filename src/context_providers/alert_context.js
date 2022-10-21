import React, { createContext, useContext, useState } from "react";
import { v4 as guid } from 'uuid';

export const AlertContext = createContext();

const AlertContextProvider = props => {
    const [alertList, setAlertList] = useState([]);

    const showMessage = (message) => {
        setAlertList((value) => {
            return [
                ...value,
                {
                    id: guid(),
                    type: "MESSAGE",
                    message: message,
                    wasShown: false
                }
            ]
        });
    }
    const showError = (message) => {
        setAlertList((value) => {
            return [
                ...value,
                {
                    id: guid(),
                    type: "ERROR",
                    message: message,
                    wasShown: false
                }
            ]
        });
    }
    const showWarning = (message) => {
        setAlertList((value) => {
            return [
                ...value,
                {
                    id: guid(),
                    type: "WARNING",
                    message: message,
                    wasShown: false
                }
            ]
        });
    }
    const showSuccess = (message) => {
        setAlertList((value) => {
            return [
                ...value,
                {
                    id: guid(),
                    type: "SUCCESS",
                    message: message,
                    wasShown: false
                }
            ]
        });
    }

    const removeAlert = (id) => {
        setAlertList((value) => {
            const index = value.findIndex((i) => i.id == id);
            if (index > -1) {
                value.splice(index, 1);
            }
            return value;
        });
    }

    return (
        <AlertContext.Provider value={{
            alertList,
            showError,
            showMessage,
            showSuccess,
            showWarning,
            removeAlert
        }}>
            {props.children}
        </AlertContext.Provider>
    );
}

export const useAlertContext = () => useContext(AlertContext);

export default AlertContextProvider;