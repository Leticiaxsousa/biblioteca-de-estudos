import React, { useEffect, useState } from "react";
import { supabase } from "./services/supabaseClient";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/ResetPassword";

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("login");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setView("dashboard");
      }
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (_event === "PASSWORD_RECOVERY") {
        setView("reset-password");
        return;
      }
      if (session?.user) {
        setUser(session.user);
        setView("dashboard");

        const id = session.user.id;
        const name = session.user.user_metadata?.name || session.user.email;

        supabase
          .from("profiles")
          .select("id")
          .eq("id", id)
          .then(({ data }) => {
            if (!data || data.length === 0)
              supabase.from("profiles").upsert({ id, name });
          });
      } else {
        setUser(null);
        setView("login");
      }
    });

    const subscription = data?.subscription;
    return () => subscription?.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setView("login");
  };

  return (
  <>
    {!user && view !== "reset-password" && (
      <Login onLogin={setUser} goTo={setView} />
    )}

    {view === "register" && (
      <Register goTo={setView} />
    )}

    {view === "reset-password" && (
      <ResetPassword goTo={setView} />
    )}

    {user && view === "dashboard" && (
      <Dashboard user={user} onLogout={handleLogout} />
    )}
  </>
);

}