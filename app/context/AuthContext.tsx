import React from 'react';
import { createContext, useState } from "react";

export const AuthContext = createContext({});

type propsWithChildren = { children: JSX.Element }

export const AuthProvider = (props: propsWithChildren) => {
    const [accessToken, setAccessToken] = useState<string>();
    const [id, setId] = useState<number>();

    function setUser(accessToken: string, id: number) {
        setAccessToken(accessToken);
        setId(id);
    }

    

    return (
        <AuthContext.Provider value={{ accessToken, id, setUser }}>
            {props.children}
        </AuthContext.Provider>
    )
}