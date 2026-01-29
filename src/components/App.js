import React, { useState, useEffect } from "react";
import AppDashboard from "./AppDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  const [user, setUser] = useState(null); // Initially null
  const [isRegister, setIsRegister] = useState(false);

  // Optional: persist login across refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setUser({ token }); 
  }, []);

  // Conditional rendering
  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        {isRegister ? (
          <>
            <Register onRegister={(u) => setUser(u)} />
            <p
              style={{ cursor: "pointer", color: "blue" }}
              onClick={() => setIsRegister(false)}
            >
              Already have an account? Login
            </p>
          </>
        ) : (
          <>
            <Login onLogin={(u) => setUser(u)} />
            <p
              style={{ cursor: "pointer", color: "blue" }}
              onClick={() => setIsRegister(true)}
            >
              New user? Register
            </p>
          </>
        )}
      </div>
    );
  }

  // Show dashboard only when user is logged in
  return <AppDashboard user={user} />;
}
