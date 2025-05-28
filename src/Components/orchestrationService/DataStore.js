import { createContext, useContext, useEffect, useState } from "react";

const DataStoreContext = createContext();

const STORAGE_KEY = "luwa_data_store";

export const DataStoreOrchestrator = ({ children }) => {
    const [data, setData] = useState(async() =>  {
        const saved = await localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : {};
    });

    console.log(data);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, [data]);

    const updateData = (key, value) => {
        setData((prev) => ({...prev, [key]: value}));
    }

    const getData = (key) => data[key];

    return (
        <DataStoreContext.Provider value={{ updateData, getData }} >
            {children}
        </DataStoreContext.Provider>
    )
}

export const useDataStore = () => useContext(DataStoreContext);
