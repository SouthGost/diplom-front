import React from 'react';
import { createContext, useState } from "react";

export const TrainingContext = createContext({});

type propsWithChildren = { children: JSX.Element }

export const TrainingProvider = (props: propsWithChildren) => {
    const [count, setCount] = useState<number>(0);

    function update(accessToken: string, id: number) {
        setCount((prevCount) => prevCount + 1);
    }



    return (
        <TrainingContext.Provider value={{ count, update }}>
            {props.children}
        </TrainingContext.Provider>
    )
}