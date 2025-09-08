import React, { useEffect, useMemo, useState } from "react";

// =========================================================
// International SEO Roadmap — Interactive (v1.0)
// TailwindCSS-only UI, no external deps
// Default export: <InternationalSEORoadmap />
// =========================================================

const REGIONS = [
  { id: "eu", label: "Europa" },
  { id: "na", label: "Norteamérica" },
  { id: "latam", label: "LatAm" },
  { id: "apac", label: "APAC" },
  { id: "mena", label: "MENA" },
  { id: "ssa", label: "África Subsahariana" },
  { id: "oce", label: "Oceanía" },
];

const COUNTRIES_BY_REGION = {
  eu: [
    "España","Portugal","Francia","Alemania","Italia","Países Bajos","Bélgica","Suiza","Austria","Polonia","República Checa","Suecia","Noruega","Dinamarca","Finlandia","Irlanda","Reino Unido","Rumanía","Hungría","Grecia","Turquía","Ucrania","Serbia","Croacia","Eslovenia","Eslovaquia","Bulgaria","Lituania","Letonia","Estonia","Luxemburgo","Islandia","Malta","Chipre",
  ],
  na: ["Estados Unidos","Canadá","México"],
  latam: [
    "Argentina","Brasil","Chile","Colombia","Perú","Uruguay","Paraguay","Bolivia","Ecuador","Venezuela","Costa Rica","Panamá","Guatemala","Honduras","El Salvador","Nicaragua","República Dominicana","Puerto Rico",
  ],
  apac: [
    "China","Japón","Corea del Sur","India","Hong Kong","Taiwán","Singapur","Tailandia","Vietnam","Filipinas","Indonesia","Malasia","Australia","Nueva Zelanda",
  ],
  mena: [
    "Emiratos Árabes Unidos","Arabia Saudí","Qatar","Kuwait","Omán","Bahrein","Israel","Líbano","Jordania","Egipto","Marruecos","Túnez","Argelia",
  ],
  ssa: [
    "Sudáfrica","Nigeria","Kenya","Ghana","Etiopía","Tanzania","Uganda","Costa de Marfil","Senegal",
  ],
  oce: ["Australia","Nueva Zelanda","Fiyi"],
};

const ENGINES = [
  { id: "google", label: "Google" },
  { id: "bing", label: "Bing" },
  { id: "baidu", label: "Baidu (China)" },
  { id: "yandex", label: "Yandex (Rusia)" },
  { id: "naver", label: "Naver (Corea)" },
  { id: "seznam", label: "Seznam (Chequia)" },
  { id: "yahoojp", label: "Yahoo! Japón" },
  { id: "duckduckgo", label: "DuckDuckGo" },
  { id: "ecos", label: "Ecosia" },
];

const LEGAL_BY_COUNTRY = {
  // principales marcos regulatorios por país/área
  // (no exhaustivo; editable por el usuario en la UI "Añadir tarea legal personalizada")
  "España": ["GDPR/UE", "ePrivacy (cookies)"] ,
  "Francia": ["GDPR/UE", "CNIL cookies"],
  "Alemania": ["GDPR/UE", "TTDSG cookies"],
  "Italia": ["GDPR/UE"],
  "Portugal": ["GDPR/UE"],
  "Países Bajos": ["GDPR/UE"],
  "Bélgica": ["GDPR/UE"],
  "Suiza": ["nLPD (rev.)"],
  "Reino Unido": ["UK GDPR", "PECR"],
  "Estados Unidos": ["CPRA (California)", "COPPA (si aplica)", "State privacy acts"],
  "Canadá": ["PIPEDA"],
  "Brasil": ["LGPD"],
  "México": ["LFPDPPP"],
  "Argentina": ["Habeas Data"],
  "Chile": ["Ley 19.628"],
  "Colombia": ["Ley 1581"],
  "Perú": ["Ley 29733"],
  "China": ["PIPL", "CSL", "ICP (hosting)"] ,
  "Japón": ["APPI"],
  "Corea del Sur": ["PIPA"],
  "India": ["DPDP (2023)"] ,
  "Singapur": ["PDPA"],
  "Tailandia": ["PDPA"],
  "Australia": ["Privacy Act"],
  "Nueva Zelanda": ["Privacy Act"],
  "EAU": ["PDPL"],
  "Arabia Saudí": ["PDPL"],
  "Israel": ["PPL"],
  "Sudáfrica": ["POPIA"],
  "Nigeria": ["NDPR"],
  "Kenya": ["DPA 2019"],
};

const BASE_PHASES = [
  {
    id: "discovery",
    title: "Fase 0 · Descubrimiento & Prioridad de Mercados",
    color: "from-emerald-500 to-teal-500",
    tasks: [
      { id: "mkt-sizing", label: "Análisis de demanda y TAM por país (volumen, estacionalidad, SERPs)", tag: "Research" },
      { id: "segmentation", label: "Definir segmentos y buyer persona por país / idioma (B2B/B2C)", tag: "Research" },
      { id: "kw-local", label: "Keyword research localizado (no traducción literal)", tag: "Keywords" },
      { id: "comp-local", label: "Benchmark de competencia local (top10, contenidos, enlaces)", tag: "Competencia" },
      { id: "prioritization", label: "Priorizar mercados (impacto × esfuerzo)", tag: "Strategy" },
    ],
  },
  {
    id: "tech",
    title: "Fase 1 · Fundamentos Técnicos Internacionales",
    color: "from-blue-500 to-indigo-500",
    tasks: [
      { id: "structure", label: "Decidir estructura (ccTLD / subdominio / subcarpeta) por mercado", tag: "Arquitectura" },
      { id: "hreflang", label: "Mapa de URLs y etiquetas hreflang + x-default", tag: "Indexación" },
      { id: "cdn", label: "CDN/Edge + georuta + compresión y caché por región", tag: "Velocidad" },
      { id: "mobile", label: "Mobile-first: Core Web Vitals por país (LCP/INP/CLS)", tag: "UX" },
      { id: "schema", label: "Datos estructurados traducidos / localizados", tag: "Rich" },
      { id: "robots", label: "Robots.txt y meta robots habilitando bots locales (Baidu/Yandex/Naver)", tag: "Rastreo" },
      { id: "sitemaps", label: "Sitemaps por locale (índice) + envío en cada webmaster tool", tag: "Rastreo" },
    ],
  },
  {
    id: "content",
    title: "Fase 2 · Contenido & Localización",
    color: "from-violet-500 to-fuchsia-500",
    tasks: [
      { id: "loc-vs-trans", label: "Estrategia de localización vs. traducción (transcreación)", tag: "Contenido" },
      { id: "style", label: "Guía de estilo por idioma (tono, medidas, moneda, formatos)", tag: "Contenido" },
      { id: "onpage", label: "Títulos/H1/ALT/meta por país e idioma (longitud y matices)", tag: "On-page" },
      { id: "ux-local", label: "UX local: moneda, métodos de pago, shipping, soporte local", tag: "UX" },
      { id: "clusters", label: "Topic clusters y calendar editorial por país", tag: "Plan" },
      { id: "media", label: "Medios e imágenes localizadas (no texto incrustado sin traducir)", tag: "Contenido" },
    ],
  },
  {
    id: "offpage",
    title: "Fase 3 · Autoridad, Local & PR",
    color: "from-amber-500 to-orange-500",
    tasks: [
      { id: "gmb", label: "SEO local: Fichas locales (GMB/Yandex/Mapas locales) por sede", tag: "Local" },
      { id: "citations", label: "Citas NAP y directorios locales consistentes", tag: "Local" },
      { id: "links-local", label: "Linkbuilding local (medios, blogs, patrocinios)", tag: "Enlaces" },
      { id: "digital-pr", label: "Digital PR y colaboraciones con influencers locales", tag: "PR" },
      { id: "social", label: "Estrategia social por país (WeChat/Weibo, VK, Line/Kakao…)", tag: "Social" },
    ],
  },
  {
    id: "engines",
    title: "Fase 4 · Ajustes por Buscador",
    color: "from-cyan-500 to-sky-500",
    tasks: [], // se inyectan según motores seleccionados
  },
  {
    id: "analytics",
    title: "Fase 5 · Medición, Gobierno & Cumplimiento",
    color: "from-lime-500 to-green-500",
    tasks: [
      { id: "props", label: "Props por locale en GSC/Bing/Baidu/Yandex/Naver", tag: "Tracking" },
      { id: "ga", label: "Segmentos/propiedades por país en Analytics + objetivos y ecommerce", tag: "Tracking" },
      { id: "dash", label: "Dashboards por país (posiciones, tráfico, conversiones)", tag: "BI" },
      { id: "alerts", label: "Alertas por país (caídas, indexación, Vitals)", tag: "Ops" },
      { id: "governance", label: "RACI de internacional: ownership y SLAs por mercado", tag: "Organización" },
      { id: "legal", label: "Cumplimiento legal por país (cookies, privacidad, avisos)", tag: "Legal" },
    ],
  },
  {
    id: "launch",
    title: "Fase 6 · Lanzamiento, QA & Iteración",
    color: "from-rose-500 to-pink-500",
    tasks: [
      { id: "qa", label: "QA por país: rastreo, SERP, snippets, UX móvil", tag: "QA" },
      { id: "rollout", label: "Roll-out progresivo (piloto → expansión)", tag: "Release" },
      { id: "iterate", label: "Ciclo continuo: hipótesis → cambios → medición", tag: "CRO/SEO" },
    ],
  },
];

const ENGINE_TASKS = {
  google: [
    { id: "g-core", label: "Core Web Vitals (LCP, INP, CLS) por país", tag: "Google" },
    { id: "g-amp", label: "(Opcional) AMP donde aporte valor", tag: "Google" },
    { id: "g-sitelinks", label: "Datos estructurados + enlaces de sitio / breadcrumbs", tag: "Google" },
  ],
  bing: [
    { id: "b-indexnow", label: "IndexNow habilitado (Bing/Yandex)", tag: "Bing" },
    { id: "b-bwt", label: "Bing Webmaster: sitemap y geotargeting", tag: "Bing" },
    { id: "b-soc", label: "Señales sociales (monitoriza impacto)", tag: "Bing" },
  ],
  baidu: [
    { id: "bd-lang", label: "Contenido en chino simplificado + keyword research CN", tag: "Baidu" },
    { id: "bd-hosting", label: "Hosting/CDN en China + licencia ICP si aplica", tag: "Baidu" },
    { id: "bd-meta", label: "Usar meta keywords y metadatos optimizados para Baidu", tag: "Baidu" },
    { id: "bd-mip", label: "Baidu MIP / Baijiahao (publicaciones móviles)", tag: "Baidu" },
    { id: "bd-js", label: "Prerender/SSR para JS pesado (rastreador limitado)", tag: "Baidu" },
  ],
  yandex: [
    { id: "yx-region", label: "Asignar región en Yandex.Webmaster", tag: "Yandex" },
    { id: "yx-metrica", label: "Instalar Yandex Metrica (mapas de calor/behaviour)", tag: "Yandex" },
    { id: "yx-original", label: "Enviar Original Texts (protección de autoría)", tag: "Yandex" },
    { id: "yx-turbo", label: "(Opcional) Yandex Turbo Pages", tag: "Yandex" },
    { id: "yx-js", label: "Prerender/SSR para JS (render limitado)", tag: "Yandex" },
  ],
  naver: [
    { id: "nv-blog", label: "Abrir y nutrir Blog de Naver (ecosistema)", tag: "Naver" },
    { id: "nv-cafe", label: "Participar en Naver Café / Knowledge iN", tag: "Naver" },
    { id: "nv-webmaster", label: "Naver Webmaster Tools: envío de sitemaps", tag: "Naver" },
    { id: "nv-kr", label: "Contenido en coreano y marca/autoridad local", tag: "Naver" },
  ],
  seznam: [
    { id: "sz-cz", label: "Contenido en checo + dominio .cz (si viable)", tag: "Seznam" },
    { id: "sz-webmaster", label: "Seznam Webmaster + backlinks locales", tag: "Seznam" },
  ],
  yahoojp: [
    { id: "yj-google", label: "SEO Google Japón (Yahoo usa index de Google)", tag: "Yahoo! JP" },
    { id: "yj-local", label: "Localización total al japonés (APPI)", tag: "Yahoo! JP" },
  ],
  duckduckgo: [
    { id: "ddg-privacy", label: "Buenas prácticas de privacidad (no trackers invasivos)", tag: "DDG" },
  ],
  ecos: [
    { id: "eco-bing", label: "Cobertura en Bing (Ecosia se alimenta de Bing)", tag: "Ecosia" },
  ],
};

const STRUCTURE_INFO = {
  cctld: {
    title: "ccTLD (dominio por país)",
    pros: ["Señal geográfica fuerte", "Confianza del usuario local", "Independencia por mercado"],
    cons: ["Coste/operación altos", "Autoridad fragmentada", "Gestión compleja"],
  },
  subdomain: {
    title: "Subdominio (pais.dominio.com)",
    pros: ["Separación por mercado", "Config geotargeting individual", "Riesgo aislado"],
    cons: ["Autoridad parcialmente separada", "Percepción menos local que ccTLD"],
  },
  subfolder: {
    title: "Subcarpeta (dominio.com/pais/)",
    pros: ["Autoridad concentrada", "Gestión sencilla", "Menor coste"],
    cons: ["Señal local más débil", "Dependencia del dominio raíz"],
  },
};

const STORAGE_KEY = "intl_seo_roadmap_v1";

export default function InternationalSEORoadmap() {
  const [regions, setRegions] = useState(["eu", "na", "latam", "apac"]);
  const [countries, setCountries] = useState(["España", "México", "Estados Unidos", "Brasil", "China", "Japón", "Corea del Sur", "Alemania", "Reino Unido"]);
  const [engines, setEngines] = useState(["google", "bing", "baidu", "yandex", "naver", "yahoojp", "seznam"]);
  const [b2b, setB2B] = useState(true);
  const [b2c, setB2C] = useState(true);
  const [structure, setStructure] = useState("subfolder");
  const [phases, setPhases] = useState(BASE_PHASES);
  const [checked, setChecked] = useState({});
  const [customLegal, setCustomLegal] = useState([]); // {country, label}
  const [planText, setPlanText] = useState("");

  // Load/Save
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const state = JSON.parse(raw);
      setRegions(state.regions || regions);
      setCountries(state.countries || countries);
      setEngines(state.engines || engines);
      setB2B(state.b2b ?? b2b);
      setB2C(state.b2c ?? b2c);
      setStructure(state.structure || structure);
      setChecked(state.checked || {});
      setCustomLegal(state.customLegal || []);
    } catch (e) {
      console.warn("No se pudo cargar el roadmap guardado");
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const toSave = { regions, countries, engines, b2b, b2c, structure, checked, customLegal };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, [regions, countries, engines, b2b, b2c, structure, checked, customLegal]);

  // Inject engine-specific tasks into Fase 4
  const phasesWithEngines = useMemo(() => {
    const clone = JSON.parse(JSON.stringify(phases));
    const idx = clone.findIndex(p => p.id === "engines");
    if (idx >= 0) {
      clone[idx].tasks = engines.flatMap(e => ENGINE_TASKS[e] || []);
    }
    return clone;
  }, [phases, engines]);

  // Legal tasks for selected countries
  const legalTasks = useMemo(() => {
    const list = [];
    countries.forEach(c => {
      const arr = LEGAL_BY_COUNTRY[c];
      if (arr) arr.forEach(l => list.push({ country: c, label: `${c}: ${l}` }));
    });
    customLegal.forEach(x => list.push({ country: x.country, label: `${x.country}: ${x.label}` }));
    return list;
  }, [countries, customLegal]);

  // Build visible tasks and progress
  const visibleTasks = useMemo(() => {
    const tasks = [];
    phasesWithEngines.forEach(phase => {
      phase.tasks.forEach(t => tasks.push(`${phase.id}__${t.id}`));
    });
    legalTasks.forEach((t, i) => tasks.push(`legal__${i}`));
    return tasks;
  }, [phasesWithEngines, legalTasks]);

  const completed = useMemo(() => visibleTasks.filter(id => checked[id]).length, [visibleTasks, checked]);
  const progress = visibleTasks.length ? Math.round((completed / visibleTasks.length) * 100) : 0;

  function toggleTask(phaseId, taskId) {
    const key = `${phaseId}__${taskId}`;
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function toggleLegal(idx) {
    const key = `legal__${idx}`;
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function resetAll() {
    if (!confirm("¿Seguro que quieres reiniciar el roadmap?")) return;
    setChecked({});
  }

  function downloadJSON() {
    const blob = new Blob([
      JSON.stringify({ regions, countries, engines, b2b, b2c, structure, checked, customLegal }, null, 2),
    ], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `roadmap-seo-internacional-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJSON(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const state = JSON.parse(reader.result);
        setRegions(state.regions || []);
        setCountries(state.countries || []);
        setEngines(state.engines || []);
        setB2B(Boolean(state.b2b));
        setB2C(Boolean(state.b2c));
        setStructure(state.structure || "subfolder");
        setChecked(state.checked || {});
        setCustomLegal(state.customLegal || []);
        alert("Roadmap importado correctamente");
      } catch (err) {
        alert("Archivo no válido");
      }
    };
    reader.readAsText(file);
  }

  function addCountryManually() {
    const name = prompt("Añade país o mercado (ej. Hong Kong, Québec)…");
    if (!name) return;
    if (!countries.includes(name)) setCountries([...countries, name]);
  }

  function addCustomLegal() {
    const country = prompt("¿Para qué país/mercado es la tarea legal?");
    if (!country) return;
    const label = prompt("Describe la tarea legal (ej. 'Consent Mode v2' o 'Aviso de cookies en árabe y francés')");
    if (!label) return;
    setCustomLegal([...customLegal, { country, label }]);
  }

  function removeCustomLegal(i) {
    const next = [...customLegal];
    next.splice(i, 1);
    setCustomLegal(next);
  }

  function generatePlanText() {
    const lines = [];
    lines.push(`# Plan de SEO Internacional — Resumen ejecutable`);
    lines.push("");
    lines.push(`Mercados (${countries.length}): ${countries.join(", ")}`);
    lines.push(`Regiones: ${regions.map(r => REGIONS.find(x=>x.id===r)?.label || r).join(", ")}`);
    lines.push(`Motores: ${engines.map(e => ENGINES.find(x=>x.id===e)?.label || e).join(", ")}`);
    lines.push(`Modelo: ${b2b?"B2B":""}${b2b&&b2c?" + ":""}${b2c?"B2C":""}`);
    lines.push(`Estructura: ${STRUCTURE_INFO[structure].title}`);
    lines.push("\n---\n");

    BASE_PHASES.forEach(p => {
      const phase = phasesWithEngines.find(x => x.id === p.id) || p;
      lines.push(`## ${phase.title}`);
      phase.tasks.forEach(t => {
        const key = `${phase.id}__${t.id}`;
        const mark = checked[key] ? "[x]" : "[ ]";
        lines.push(`- ${mark} ${t.label} (${t.tag})`);
      });
      if (phase.id === "analytics" && legalTasks.length) {
        lines.push("### Legal por país");
        legalTasks.forEach((lt, i) => {
          const key = `legal__${i}`;
          const mark = checked[key] ? "[x]" : "[ ]";
          lines.push(`- ${mark} ${lt.label}`);
        });
      }
      lines.push("");
    });

    setPlanText(lines.join("\n"));
    setTimeout(() => {
      const el = document.getElementById("plan-output");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur bg-slate-950/70 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-[-0.02em]">Roadmap SEO Internacional</h1>
            <p className="text-slate-300 text-sm md:text-base">Guía interactiva paso a paso para planificar, ejecutar y escalar SEO multipaís/multidioma.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={resetAll} className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm">Reiniciar</button>
            <button onClick={downloadJSON} className="px-3 py-2 rounded-lg bg-slate-200 text-slate-900 hover:bg-white text-sm">Exportar JSON</button>
            <label className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm cursor-pointer">
              Importar JSON
              <input type="file" accept="application/json" onChange={importJSON} className="hidden" />
            </label>
            <button onClick={generatePlanText} className="px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-semibold">Generar Plan</button>
          </div>
        </div>
      </header>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 pt-6 pb-2">
        <div className="grid md:grid-cols-12 gap-4">
          <div className="md:col-span-3 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
            <h3 className="font-semibold mb-2">Regiones</h3>
            <div className="flex flex-wrap gap-2">
              {REGIONS.map(r => (
                <button key={r.id} onClick={() => setRegions(prev => prev.includes(r.id) ? prev.filter(x=>x!==r.id) : [...prev, r.id])} className={`px-3 py-1.5 rounded-full text-sm border ${regions.includes(r.id) ? "bg-slate-100 text-slate-900 border-slate-100" : "bg-slate-800 border-slate-700"}`}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-5 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Países ({countries.length})</h3>
              <button onClick={addCountryManually} className="text-xs underline underline-offset-4">Añadir país</button>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {regions.map(r => (
                <details key={r} className="bg-slate-800/60 rounded-xl p-3 border border-slate-700">
                  <summary className="cursor-pointer text-sm font-medium">{REGIONS.find(x=>x.id===r)?.label}</summary>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(COUNTRIES_BY_REGION[r]||[]).map(c => (
                      <button key={c} onClick={() => setCountries(prev => prev.includes(c) ? prev.filter(x=>x!==c) : [...prev, c])} className={`px-3 py-1.5 rounded-full text-sm border ${countries.includes(c) ? "bg-emerald-500 text-slate-950 border-emerald-500" : "bg-slate-700 border-slate-600"}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </details>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {countries.map(c => (
                <span key={c} className="px-2.5 py-1 rounded-full bg-slate-800 text-xs border border-slate-700 flex items-center gap-2">
                  {c}
                  <button onClick={() => setCountries(prev => prev.filter(x=>x!==c))} className="opacity-70 hover:opacity-100">✕</button>
                </span>
              ))}
            </div>
          </div>

          <div className="md:col-span-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
            <h3 className="font-semibold mb-2">Buscadores</h3>
            <div className="flex flex-wrap gap-2">
              {ENGINES.map(e => (
                <button key={e.id} onClick={() => setEngines(prev => prev.includes(e.id) ? prev.filter(x=>x!==e.id) : [...prev, e.id])} className={`px-3 py-1.5 rounded-full text-sm border ${engines.includes(e.id) ? "bg-sky-500 text-slate-950 border-sky-500" : "bg-slate-800 border-slate-700"}`}>
                  {e.label}
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-4">
              <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={b2b} onChange={(e)=>setB2B(e.target.checked)} /> B2B</label>
              <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={b2c} onChange={(e)=>setB2C(e.target.checked)} /> B2C</label>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-1">Estructura del sitio</h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {Object.entries(STRUCTURE_INFO).map(([k,v]) => (
                  <label key={k} className={`rounded-xl border p-3 cursor-pointer ${structure===k?"border-emerald-400 bg-emerald-500/10":"border-slate-700 bg-slate-800"}`}>
                    <div className="flex items-center gap-2 mb-1"><input type="radio" name="structure" checked={structure===k} onChange={()=>setStructure(k)} /><span className="font-semibold">{v.title}</span></div>
                    <div className="text-slate-300">✅ {v.pros[0]}</div>
                    <div className="text-slate-300">⚠️ {v.cons[0]}</div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress */}
      <section className="max-w-7xl mx-auto px-4 pb-4">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm">Progreso total: <span className="font-semibold">{completed}</span> / {visibleTasks.length}</p>
            <p className="text-sm">{progress}%</p>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </section>

      {/* Phases */}
      <main className="max-w-7xl mx-auto px-4 pb-16">
        <div className="space-y-6">
          {phasesWithEngines.map(phase => (
            <section key={phase.id} className="border border-slate-800 rounded-2xl overflow-hidden">
              <header className={`p-4 bg-gradient-to-r ${phase.color}`}>
                <h2 className="text-lg md:text-xl font-bold">{phase.title}</h2>
              </header>
              <div className="p-4 bg-slate-950">
                <ul className="grid md:grid-cols-2 gap-3">
                  {phase.tasks.length === 0 && (
                    <li className="text-sm text-slate-400">No hay tareas (añade motores de búsqueda para esta fase).</li>
                  )}
                  {phase.tasks.map(task => {
                    const key = `${phase.id}__${task.id}`;
                    return (
                      <li key={key} className="flex items-start gap-3 p-3 rounded-xl border border-slate-800 bg-slate-900/60">
                        <input type="checkbox" className="mt-1" checked={!!checked[key]} onChange={() => toggleTask(phase.id, task.id)} />
                        <div>
                          <p className="text-sm leading-snug">{task.label}</p>
                          <div className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">{task.tag}</div>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {phase.id === "analytics" && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Tareas legales por país</h3>
                      <div className="flex gap-2">
                        <button onClick={addCustomLegal} className="text-xs underline underline-offset-4">Añadir tarea legal personalizada</button>
                      </div>
                    </div>
                    <ul className="mt-3 grid md:grid-cols-2 gap-3">
                      {legalTasks.length === 0 && (
                        <li className="text-sm text-slate-400">Sin tareas legales detectadas. Añade países o crea tareas personalizadas.</li>
                      )}
                      {legalTasks.map((lt, i) => {
                        const key = `legal__${i}`;
                        const isCustom = customLegal.some((x, idx) => `legal__${legalTasks.length - customLegal.length + idx}` === key);
                        return (
                          <li key={key} className="flex items-start gap-3 p-3 rounded-xl border border-slate-800 bg-slate-900/60">
                            <input type="checkbox" className="mt-1" checked={!!checked[key]} onChange={() => toggleLegal(i)} />
                            <div className="flex-1">
                              <p className="text-sm leading-snug">{lt.label}</p>
                              <div className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">Legal</div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                    {customLegal.length > 0 && (
                      <div className="mt-2 text-xs text-slate-400">
                        <p className="mb-1">Personalizadas:</p>
                        <ul className="flex flex-wrap gap-2">
                          {customLegal.map((x, i) => (
                            <li key={i} className="px-2 py-1 rounded bg-slate-800 border border-slate-700 flex items-center gap-2">
                              {x.country}: {x.label}
                              <button onClick={() => removeCustomLegal(i)} className="opacity-70 hover:opacity-100">✕</button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {phase.id === "tech" && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">Guía rápida de estructura</h3>
                    <div className="grid md:grid-cols-3 gap-3 text-sm">
                      {Object.entries(STRUCTURE_INFO).map(([k,v]) => (
                        <div key={k} className={`rounded-xl border p-3 ${structure===k?"border-emerald-400 bg-emerald-500/10":"border-slate-800 bg-slate-900/60"}`}>
                          <div className="font-semibold mb-1">{v.title}</div>
                          <div className="text-slate-300">Pros:
                            <ul className="list-disc ml-5">
                              {v.pros.map((p,i)=>(<li key={i}>{p}</li>))}
                            </ul>
                          </div>
                          <div className="text-slate-300 mt-2">Contras:
                            <ul className="list-disc ml-5">
                              {v.cons.map((c,i)=>(<li key={i}>{c}</li>))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </section>
          ))}
        </div>

        {/* Plan preview */}
        <section id="plan-output" className="mt-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Plan en texto (Markdown)</h3>
            <div className="flex gap-2">
              <button onClick={() => navigator.clipboard.writeText(planText)} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm">Copiar</button>
              <button onClick={() => window.print()} className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-900 hover:bg-white text-sm">Imprimir / PDF</button>
            </div>
          </div>
          <textarea value={planText} onChange={(e)=>setPlanText(e.target.value)} rows={10} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm font-mono" placeholder="Pulsa ‘Generar Plan’ para crear el resumen ejecutable…" />
        </section>

        {/* Help */}
        <section className="mt-8 text-slate-300 text-sm leading-relaxed">
          <h4 className="font-semibold mb-1">Cómo usar este roadmap</h4>
          <ol className="list-decimal ml-5 space-y-1">
            <li>Selecciona <b>regiones</b>, añade <b>países</b> y marca los <b>buscadores</b> relevantes.</li>
            <li>Elige la <b>estructura</b> (ccTLD, subdominio o subcarpeta).</li>
            <li>Recorre las fases y marca las <b>tareas completadas</b>. La fase 4 se adapta a los motores elegidos.</li>
            <li>En <b>Medición & Legal</b>, revisa y completa las tareas de cumplimiento por país; añade las personalizadas que necesites.</li>
            <li>Genera el <b>Plan</b> en Markdown para compartirlo o ejecutarlo con tu equipo. Puedes <b>exportar/importar</b> el estado en JSON.</li>
          </ol>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-10 text-center text-slate-500 text-xs">© {new Date().getFullYear()} International SEO Roadmap — Built with ❤️</footer>
    </div>
  );
}
