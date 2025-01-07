import "./App.css";
import AuthHeader from "./components/ui/auth-header";
import { SignedIn } from "@clerk/clerk-react";
// import TraitorsLayout from "./components/ui/traitors-layout";
import Dashboard from "./components/ui/dashboard";

function App() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <AuthHeader></AuthHeader>
      <SignedIn>
        <Dashboard></Dashboard>
      </SignedIn>
    </div>
  );
}

export default App;
