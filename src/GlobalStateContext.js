import React, { createContext, useState } from 'react';

export const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
    const [formData, setFormData] = useState({
        works: [],
        interests: {}
    });

    const updateFormData = (key, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
    };

    return (
        <GlobalStateContext.Provider value={{ formData, updateFormData }}>
            {children}
        </GlobalStateContext.Provider>
    );
};
