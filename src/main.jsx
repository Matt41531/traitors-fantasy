import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route } from "react-router";
import InitialSelectScreen from "./components/ui/initial-select-screen";
import ScrollToTop from "./components/ui/scroll-to-top";
import TraitorsLayout from "./components/ui/traitors-layout";
import LeagueSetup from "./components/ui/leagueSetup";


// Import Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <BrowserRouter>
      <ScrollToTop/>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/draft-winner" element={<InitialSelectScreen />} />
          <Route path="/draft" element={<TraitorsLayout/>} />
          <Route path="/league" element={<LeagueSetup/>} />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);
