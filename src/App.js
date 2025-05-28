import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes } from "./Components/orchestrationService/RoutesConfig";
import { Orchestrator } from "./Components/orchestrationService/Orchestrator";
import "./App.css";
import { DataStoreOrchestrator } from "./Components/orchestrationService/DataStore";

function App() {
  return (
    <BrowserRouter>
      <Orchestrator>
        <DataStoreOrchestrator>
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.id}
                path={route.path}
                element={<route.component />}
              />
            ))}
          </Routes>
        </DataStoreOrchestrator>
      </Orchestrator>
    </BrowserRouter>
  );
}

export default App;
