import { CalendarDays, Download, ExternalLink, Moon, Search, Sparkles, SunMedium } from "lucide-react";
import { useMemo, useState } from "react";
import Starfield from "./Starfield";
import { buildYearEvents, dayLabel, monthLabel, type CelestialEvent, type EventKind } from "./astro";

const filters: Array<{ id: EventKind | "todos"; label: string }> = [
  { id: "todos", label: "Todos" },
  { id: "lua", label: "Lua" },
  { id: "eclipse", label: "Eclipses" },
  { id: "estacao", label: "Estacoes" },
  { id: "meteoros", label: "Meteoros" },
  { id: "zodiaco", label: "Zodiaco" },
];

const sourceLinks = [
  ["NASA SKYCAL", "https://eclipse.gsfc.nasa.gov/SKYCAL/SKYCAL.html"],
  ["NASA Night Sky Network", "https://nightsky.jpl.nasa.gov/events/"],
  ["Astronomy Engine", "https://github.com/cosinekitty/astronomy"],
  ["Timeanddate astronomy events", "https://www.timeanddate.com/astronomy/sights-to-see.html"],
] as const;

export default function App() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [filter, setFilter] = useState<EventKind | "todos">("todos");
  const [query, setQuery] = useState("");
  const events = useMemo(() => buildYearEvents(year), [year]);
  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return events.filter((event) => {
      const matchesFilter = filter === "todos" || event.kind === filter;
      const matchesQuery = !term || `${event.title} ${event.summary} ${event.kind}`.toLowerCase().includes(term);
      return matchesFilter && matchesQuery;
    });
  }, [events, filter, query]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = visible.find((event) => event.id === selectedId) ?? visible[0] ?? events[0];

  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, month) => ({
      month,
      label: new Intl.DateTimeFormat("pt-BR", { month: "long", timeZone: "UTC" }).format(new Date(Date.UTC(year, month, 1))),
      events: visible.filter((event) => event.date.getUTCMonth() === month),
    }));
  }, [visible, year]);

  function downloadJson() {
    const blob = new Blob([JSON.stringify(visible, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `eclipse-calendar-${year}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="cinema">
      <Starfield />
      <section className="shell">
        <header className="header">
          <div>
            <span className="kicker"><Sparkles size={16} /> Eclipse Calendar</span>
            <h1>Calendario anual de acontecimentos celestes</h1>
          </div>
          <div className="yearbox">
            <button onClick={() => setYear((value) => value - 1)}>-</button>
            <input value={year} onChange={(event) => setYear(Number(event.target.value) || new Date().getFullYear())} />
            <button onClick={() => setYear((value) => value + 1)}>+</button>
          </div>
        </header>

        <section className="dashboard">
          <aside className="controls">
            <label className="search">
              <Search size={16} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar lua, eclipse, signo..." />
            </label>
            <div className="filter-grid">
              {filters.map((item) => (
                <button key={item.id} className={filter === item.id ? "active" : ""} onClick={() => setFilter(item.id)}>
                  {item.label}
                </button>
              ))}
            </div>
            <button className="download" onClick={downloadJson}>
              <Download size={16} /> Exportar JSON
            </button>

            <div className="source-box">
              <h2>Fontes abertas</h2>
              {sourceLinks.map(([label, url]) => (
                <a key={url} href={url} target="_blank" rel="noreferrer">
                  {label} <ExternalLink size={13} />
                </a>
              ))}
            </div>
          </aside>

          <section className="orbital-panel">
            <CinematicEvent event={selected} total={visible.length} />
            <div className="month-grid">
              {months.map((month) => (
                <article key={month.month}>
                  <h3>{month.label}</h3>
                  <div className="month-events">
                    {month.events.slice(0, 5).map((event) => (
                      <button key={event.id} className={event.id === selected.id ? "selected" : ""} onClick={() => setSelectedId(event.id)}>
                        <span>{dayLabel(event.date)}</span>
                        {event.title}
                      </button>
                    ))}
                    {month.events.length === 0 && <small>Sem eventos no filtro</small>}
                    {month.events.length > 5 && <small>+{month.events.length - 5} eventos</small>}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="timeline">
            <h2><CalendarDays size={18} /> Linha do tempo</h2>
            <div>
              {visible.map((event) => (
                <button key={event.id} className={event.id === selected.id ? "selected" : ""} onClick={() => setSelectedId(event.id)}>
                  <span>{dayLabel(event.date)}</span>
                  <strong>{event.title}</strong>
                  <small>{event.kind}</small>
                </button>
              ))}
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}

function CinematicEvent({ event, total }: { event: CelestialEvent; total: number }) {
  const icon = event.kind === "lua" ? <Moon /> : event.kind === "estacao" || event.kind === "zodiaco" ? <SunMedium /> : <Sparkles />;
  return (
    <section className="event-stage">
      <div className={`eclipse-orb ${event.kind}`}>
        <span />
      </div>
      <div className="event-copy">
        <span className="date">{dayLabel(event.date)} UTC</span>
        <h2>{icon}{event.title}</h2>
        <p>{event.summary}</p>
        <div className="meta-row">
          <span>{monthLabel(event.date)}</span>
          <span>{event.kind}</span>
          <span>{total} eventos no filtro</span>
        </div>
        <a href={event.sourceUrl} target="_blank" rel="noreferrer">
          Fonte: {event.source}
        </a>
      </div>
    </section>
  );
}

