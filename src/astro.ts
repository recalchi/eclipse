import * as Astronomy from "astronomy-engine";

export type EventKind = "lua" | "eclipse" | "estacao" | "meteoros" | "zodiaco" | "planetario";

export type CelestialEvent = {
  id: string;
  kind: EventKind;
  title: string;
  date: Date;
  summary: string;
  source: string;
  sourceUrl: string;
};

const moonQuarterNames = ["Lua nova", "Quarto crescente", "Lua cheia", "Quarto minguante"];

const meteorTemplates = [
  { month: 0, day: 3, title: "Pico das Quadrantidas" },
  { month: 3, day: 22, title: "Pico das Liridas" },
  { month: 4, day: 6, title: "Pico das Eta Aquaridas" },
  { month: 7, day: 12, title: "Pico das Perseidas" },
  { month: 9, day: 21, title: "Pico das Orionidas" },
  { month: 10, day: 17, title: "Pico das Leonidas" },
  { month: 11, day: 14, title: "Pico das Geminidas" },
];

const zodiacTemplates = [
  ["Aries", 2, 20],
  ["Touro", 3, 20],
  ["Gemeos", 4, 21],
  ["Cancer", 5, 21],
  ["Leao", 6, 22],
  ["Virgem", 7, 23],
  ["Libra", 8, 23],
  ["Escorpiao", 9, 23],
  ["Sagitario", 10, 22],
  ["Capricornio", 11, 21],
  ["Aquario", 0, 20],
  ["Peixes", 1, 19],
] as const;

function eventDate(year: number, month: number, day: number) {
  return new Date(Date.UTC(year, month, day, 12, 0, 0));
}

function astroDate(value: any): Date {
  if (value instanceof Date) return value;
  if (value?.date instanceof Date) return value.date;
  if (typeof value?.date === "function") return value.date();
  if (value?.ut !== undefined && Astronomy.MakeTime) return Astronomy.MakeTime(value).date;
  return new Date(value);
}

function inYear(date: Date, year: number) {
  return date.getUTCFullYear() === year;
}

function addMoonPhases(events: CelestialEvent[], year: number) {
  const end = eventDate(year + 1, 0, 1);
  let quarter = (Astronomy as any).SearchMoonQuarter(eventDate(year, 0, 1));
  let guard = 0;
  while (quarter && guard < 60) {
    const date = astroDate(quarter.time);
    if (date >= end) break;
    if (inYear(date, year)) {
      const phase = moonQuarterNames[quarter.quarter] ?? "Fase lunar";
      events.push({
        id: `moon-${date.toISOString()}`,
        kind: "lua",
        title: phase,
        date,
        summary: `${phase} calculada localmente para UTC. Use como ponto de estudo e ajuste fuso/localidade conforme a observacao.`,
        source: "Astronomy Engine",
        sourceUrl: "https://github.com/cosinekitty/astronomy",
      });
    }
    quarter = (Astronomy as any).NextMoonQuarter(quarter);
    guard += 1;
  }
}

function addSeasons(events: CelestialEvent[], year: number) {
  const seasons = (Astronomy as any).Seasons(year);
  const entries = [
    ["Equinocio de marco", seasons.mar_equinox ?? seasons.MarchEquinox],
    ["Solsticio de junho", seasons.jun_solstice ?? seasons.JuneSolstice],
    ["Equinocio de setembro", seasons.sep_equinox ?? seasons.SeptemberEquinox],
    ["Solsticio de dezembro", seasons.dec_solstice ?? seasons.DecemberSolstice],
  ] as const;
  entries.forEach(([title, time]) => {
    const date = astroDate(time);
    events.push({
      id: `season-${title}-${year}`,
      kind: "estacao",
      title,
      date,
      summary: "Marco solar do ano, util para estudar ciclos sazonais, luz, sombra e simbolismo astrologico.",
      source: "Astronomy Engine",
      sourceUrl: "https://github.com/cosinekitty/astronomy",
    });
  });
}

function addEclipses(events: CelestialEvent[], year: number) {
  const end = eventDate(year + 1, 0, 1);
  const start = eventDate(year, 0, 1);
  const defs = [
    {
      title: "Eclipse solar",
      first: () => (Astronomy as any).SearchGlobalSolarEclipse(start),
      next: (event: any) => (Astronomy as any).NextGlobalSolarEclipse(event.peak),
    },
    {
      title: "Eclipse lunar",
      first: () => (Astronomy as any).SearchLunarEclipse(start),
      next: (event: any) => (Astronomy as any).NextLunarEclipse(event.peak),
    },
  ];

  defs.forEach((def) => {
    let event = def.first();
    let guard = 0;
    while (event && guard < 8) {
      const date = astroDate(event.peak);
      if (date >= end) break;
      if (inYear(date, year)) {
        events.push({
          id: `${def.title}-${date.toISOString()}`,
          kind: "eclipse",
          title: `${def.title}${event.kind ? ` ${String(event.kind).toLowerCase()}` : ""}`,
          date,
          summary: "Evento calculado globalmente. A visibilidade depende da localidade, clima e horizonte.",
          source: "Astronomy Engine",
          sourceUrl: "https://github.com/cosinekitty/astronomy",
        });
      }
      event = def.next(event);
      guard += 1;
    }
  });
}

function addTemplates(events: CelestialEvent[], year: number) {
  meteorTemplates.forEach((item) => {
    events.push({
      id: `meteor-${item.month}-${item.day}`,
      kind: "meteoros",
      title: item.title,
      date: eventDate(year, item.month, item.day),
      summary: "Pico anual aproximado de chuva de meteoros. Confirme condicoes locais e fase da Lua antes de observar.",
      source: "Timeanddate astronomy events",
      sourceUrl: "https://www.timeanddate.com/astronomy/sights-to-see.html",
    });
  });

  zodiacTemplates.forEach(([sign, month, day]) => {
    events.push({
      id: `zodiac-${sign}`,
      kind: "zodiaco",
      title: `Entrada solar em ${sign}`,
      date: eventDate(year, month, day),
      summary: "Marcador astrologico sazonal para estudo simbolico. Nao e previsao cientifica ou astronomia observacional.",
      source: "Calendario tropical convencional",
      sourceUrl: "https://www.timeanddate.com/astronomy/sights-to-see.html",
    });
  });
}

export function buildYearEvents(year: number): CelestialEvent[] {
  const events: CelestialEvent[] = [];
  addMoonPhases(events, year);
  addSeasons(events, year);
  addEclipses(events, year);
  addTemplates(events, year);
  return events.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function monthLabel(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", { month: "long", timeZone: "UTC" }).format(date);
}

export function dayLabel(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(date);
}

