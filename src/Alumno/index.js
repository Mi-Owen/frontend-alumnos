import React, { useEffect, useState } from "react";
import "./Styles/index.css";

import DashboardTab from "./dashboard";
import ScheduleTab from "./schedule";
import SessionsTab from "./sessions";
import SettingsTab from "./settings";

export default function StudentModule({ onLogout }) {
  const [tab, setTab] = useState("dashboard");

  // estado compartido mínimo: sesiones en localStorage
  const [sessions, setSessions] = useState(() => {
    try {
      const raw = localStorage.getItem("studentSessions");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("studentSessions", JSON.stringify(sessions));
    } catch {}
  }, [sessions]);

  return (
    <div className="student-shell">
      <header className="student-header">
        <h1>Panel del Alumno</h1>
        <nav className="tabs">
          <button className={tab === "dashboard" ? "active" : ""} onClick={() => setTab("dashboard")}>Dashboard</button>
          <button className={tab === "schedule" ? "active" : ""} onClick={() => setTab("schedule")}>Agendar</button>
          <button className={tab === "sessions" ? "active" : ""} onClick={() => setTab("sessions")}>Mis asesorías</button>
          <button className={tab === "settings" ? "active" : ""} onClick={() => setTab("settings")}>Ajustes</button>
        </nav>
      </header>

      <main className="student-main">
        {tab === "dashboard" && <DashboardTab sessions={sessions} />}
        {tab === "schedule" && <ScheduleTab sessions={sessions} setSessions={setSessions} />}
        {tab === "sessions" && <SessionsTab sessions={sessions} setSessions={setSessions} />}
        {tab === "settings" && <SettingsTab onLogout={onLogout} />}
      </main>
    </div>
  );
}
