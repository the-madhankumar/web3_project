import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./profile/Login";
import Dashboard from "./Doctor/Dashboard";
import SignupDoctor from "./profile/SignupDoctor";
import SignupPatient from "./profile/SignupPatient";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/demo/AppSidebar";
import Prescription from "./Doctor/Prescription";
import Dashboardpat from "./Patient/Dashboardpat";
import Tablets from "./Patient/Tablets";
import Qrfile from "./pharm/Qrfile";
import SignupPhar from "./profile/SignupPhar";
import { set } from "zod";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [email,setEmail] = useState(null);
  const [name,setName] = useState(null);
  const [phone,setPhone] = useState(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userRole = localStorage.getItem("role");
    const userEmail = localStorage.getItem("email");
    const userName = localStorage.getItem("name");
    const userPhone = localStorage.getItem("phone");

    setName(userName);
    setPhone(userPhone);
    setEmail(userEmail);
    setIsLoggedIn(loggedIn);
    setRole(userRole);
    
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setRole(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("phone");
    console.log("User logged out");
  };

  return (
    <BrowserRouter>
    {isLoggedIn ? (
      <SidebarProvider>
          <AppSidebar handleLogout={handleLogout} role={role} email={email} name={name} phone={phone}/>
              <div className="flex-1">
            <Routes>
              {role === "doctor" && (
                <>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/prescription" element={<Prescription name={name} />} />
                </>
              )}
              {role === "patient" && (
                <>
                  <Route path="/dashboardpat" element={<Dashboardpat email={email} />} />
                  <Route path="/tablets" element={<Tablets />} />
                </>
              )}
              {role === "pharmist" && (
                <>
                  <Route path="/qrfile" element={<Qrfile />} />
                </>
              )}
              {/* Default route */}
              <Route path="*" element={<Navigate to={role === "doctor" ? "/dashboard" : role==="patient" ? "/dashboardpat" : "/qrfile"} />} />
            </Routes>
          </div>
      </SidebarProvider>
    ) : (
      <Routes>
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setRole={setRole} setEmail={setEmail} setName={setName} setPhone={setPhone} />} />
        <Route path="/signupd" element={<SignupDoctor />} />
        <Route path="/signupp" element={<SignupPatient />} />
        <Route path= "/signupphar" element = {<SignupPhar />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    )}
  </BrowserRouter>

  );
}

export default App;
