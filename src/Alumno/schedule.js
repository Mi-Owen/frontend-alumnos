import React, { useMemo, useState } from "react";
import "./Styles/schedule.css";

const genId = () => crypto.randomUUID?.() ?? String(Math.random());

// genera slots cada hora 09:00–18:00
function daySlots(dateStr) {
  const out = [];
  for (let h = 9; h <= 18; h++) {
    const d = new Date(dateStr + "T00:00:00");
    d.setHours(h, 0, 0, 0);
    out.push(d);
  }
  return out;
}

export default function ScheduleTab({ sessions, setSessions }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [topic, setTopic] = useState("");
  const [teacher, setTeacher] = useState("");
  const [msg, setMsg] = useState("");

  const available = useMemo(() => {
    if (!date) return [];
    const chosenDay = daySlots(date);
    // quita slots pasados y slots ocupados por el alumno en ese día
    const taken = new Set(
      sessions
        .filter(s => s.datetime.startsWith(date))
        .map(s => new Date(s.datetime).toISOString())
    );
    const now = new Date();
    return chosenDay
      .filter(d => d > now) // no permitir pasado
      .filter(d => !taken.has(d.toISOString()));
  }, [date, sessions]);

  function save() {
    setMsg("");
    if (!date || !time) {
      return setMsg("Selecciona fecha y hora disponibles.");
    }
    const dtIso = new Date(`${date}T${time}:00`).toISOString();

    // choque por seguridad
    if (sessions.some(s => s.datetime === dtIso)) {
      return setMsg("Ese horario ya está ocupado. Elige otro.");
    }

    const payload = {
      id: genId(),
      datetime: dtIso,
      topic: topic.trim(),
      teacher: teacher.trim() || "Por asignar",
      status: "scheduled",
    };
    setSessions(arr => [payload, ...arr]);
    setMsg("¡Asesoría agendada!");
    setDate(""); setTime(""); setTopic(""); setTeacher("");
    setTimeout(() => setMsg(""), 2000);
  }

  return (
    <section className="schedule">
      <div className="card">
        <h3>Agendar nueva asesoría</h3>

        <div className="grid2">
          <label>Fecha
            <input type="date" value={date} onChange={e => setDate(e.target.value)} min={today()} />
          </label>

          <label>Hora disponible
            <select value={time} onChange={e => setTime(e.target.value)} disabled={!date}>
              <option value="">{date ? "Selecciona…" : "Elige fecha primero"}</option>
              {available.map(d => {
                const hh = d.toTimeString().slice(0, 5);
                return <option key={hh} value={hh}>{hh}</option>;
              })}
            </select>
            <small className="muted">* Se muestran solo horarios libres y futuros.</small>
          </label>

          <label>Tema (opcional)
            <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Ej. Álgebra, proyecto, etc." />
          </label>

          <label>Docente (opcional)
            <input value={teacher} onChange={e => setTeacher(e.target.value)} placeholder="Si ya conoces el nombre" />
          </label>
        </div>

        {msg && <div className="toast">{msg}</div>}

        <div className="actions">
          <button className="primary" onClick={save}>Agendar</button>
        </div>
      </div>
    </section>
  );
}

function today() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}
