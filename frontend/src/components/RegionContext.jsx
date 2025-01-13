// src/components/RegionContext.js
import React, { createContext, useState } from "react";

export const RegionContext = createContext();

export const RegionProvider = ({ children }) => {
    const [selectedRegion, setSelectedRegion] = useState(null);

    return (
        <RegionContext.Provider value={{ selectedRegion, setSelectedRegion }}>
            {children}
        </RegionContext.Provider>
    );
};



