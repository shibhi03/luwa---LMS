import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { routes } from "./RoutesConfig";

const OrchestratorContext = createContext();

export const Orchestrator = ({ children }) => {
    const navigate = useNavigate();

    const getIndex = (path) => routes.findIndex(r => r.path === path);

    const routeNext = (currentPath) => {
        const index = getIndex(currentPath);
        console.log(currentPath);
        console.log(index);

        if (index >= 0 && index < routes.length - 1) {
            navigate(routes[index + 1].path);
        }
    }

    const routeBack = (currentPath) => {
        const index = getIndex(currentPath);
        console.log(currentPath);
        console.log(index);

        if (index > 0) {
            console.log(routes[index - 1].path);
            navigate(routes[index - 1].path);
        }
    }

    const routeTo = (id) => {
        const route = routes.find(r => r.id === id)
        if (route) navigate(route.path);
    }

    return (
        <OrchestratorContext.Provider value={{ routeNext, routeBack, routeTo}}>
            {children}
        </OrchestratorContext.Provider>
    );
};

export const useOrchestrator = () => useContext(OrchestratorContext);