import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router } from "react-router-dom";
import { StationsProvider } from "./providers/stationscontext";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <StationsProvider>
                <Router>
                    <App />
                </Router>
            </StationsProvider>
        </QueryClientProvider>
    </StrictMode>
);
