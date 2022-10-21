import React from 'react';
import { useAppContext } from '../../../context_providers/app_context';


export const SignOut = () => {
    const appContext = useAppContext();
    appContext.signOut();
    return (
        <div>
            Signing Out.....
        </div>
    )
}
