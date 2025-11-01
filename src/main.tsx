import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./App.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router } from "react-router-dom";
import { StationsProvider } from "./providers/stationscontext";
import { MapTypeProvider } from "./providers/mapcontext.tsx";
import { LanguageProvider } from "./providers/languagecontext";
import "./i18n"

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <StationsProvider>
                <MapTypeProvider>
                    <LanguageProvider>
                        <Router>
                            <App />
                        </Router>
                    </LanguageProvider>
                </MapTypeProvider>
            </StationsProvider>
        </QueryClientProvider>
    </StrictMode>
);
