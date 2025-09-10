"use client";

import { useEffect, useMemo, useState } from "react";

/* Branding */
const BRAND = {
  primaryFrom: "#00F5A0",
  primaryTo: "#00D9F5",
  ink: "#1f2937",
  bg: "#ffffff",
  panel: "#f8fafc",
  border: "#e2e8f0",
};

/* Datasets */
const REGIONS = [
  { id: "eu", label: "Europa" },
  { id: "na", label: "Norteamérica" },
  { id: "latam", label: "LatAm" },
  { id: "apac", label: "APAC" },
  { id: "mena", label: "MENA" },
  { id: "ssa", label: "África Subsahariana" },
  { id: "oce", label: "Oceanía" },
];

const COUNTRIES_BY_REGION: Record<string, string[]> = {
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

const PRESETS = [
  {
    id: "global-default",
    label: "Global Default (Google + Bing)",
    countries: ["España","México","Estados Unidos","Reino Unido","Alemania","Francia","Brasil","Argentina","Colombia","Chile","Italia"],
    engines: ["google","bing"],
    structure: "subfolder",
  },
  {
    id: "apac-baidu-naver",
    label: "APAC (Baidu + Naver + Google)",
    countries: ["China","Japón","Corea del Sur","Singapur","Australia"],
    engines: ["baidu","naver","google"],
    structure: "subdomain",
  },
  {
    id: "china-only",
    label: "China only (Baidu)",
    countries: ["China"],
    engines: ["baidu"],
    structure: "cctld",
  },
];

const LEGAL_BY_COUNTRY: Record<string, string[]> = {
  "España": ["GDPR/UE", "ePrivacy (cookies)"],
  "Francia": ["GDPR/UE", "CNIL cookies"],
  "Alemania": ["GDPR/UE", "TTDSG cookies"],
  "Italia": ["GDPR/UE"],
  "Portugal": ["GDPR/UE"],
  "Países Bajos": ["GDPR/UE"],
  "Bélgica": ["GDPR/UE"],
  "Suiza": ["nLPD (rev.)"],
  "Reino Unido": ["UK GDPR", "PECR"],
  "Estados Unidos": ["CPRA/CCPA", "COPPA (si aplica)"],
  "Brasil": ["LGPD"],
  "México": ["LFPDPPP"],
  "Argentina": ["Habeas Data"],
  "Chile": ["Ley 19.628"],
  "Colombia": ["Ley 1581"],
  "Perú": ["Ley 29733"],
  "China": ["PIPL", "CSL", "ICP (hosting)"],
  "Japón": ["APPI"],
  "Corea del Sur": ["PIPA"],
  "India": ["DPDP (2023)"],
  "Singapur": ["PDPA"],
  "EAU": ["PDPL"],
  "Sudáfrica": ["POPIA"],
};

const BASE_PHASES = [
  {
    id: "discovery",
    title: "Fase 0 · Descubrimiento & Priorización",
    color: "from-[#00F5A0] to-[#00D9F5]",
    tasks: [
      { id: "mkt-sizing", label: "Análisis de demanda y TAM por país", tag: "Research" },
      { id: "segmentation", label: "Buyer persona por país / idioma (B2B/B2C)", tag: "Research" },
      { id: "kw-local", label: "Keyword research localizado", tag: "Keywords" },
      { id: "comp-local", label: "Benchmark competencia local", tag: "Competencia" },
      { id: "prioritization", label: "Priorización mercados (impacto × esfuerzo)", tag: "Strategy" },
    ],
  },
  {
    id: "tech",
    title: "Fase 1 · Fundamentos Técnicos",
    color: "from-[#00D9F5] to-sky-500",
    tasks: [
      { id: "structure", label: "Estructura (ccTLD / subdominio / subcarpeta)", tag: "Arquitectura" },
      { id: "hreflang", label: "Mapa de URLs + hreflang + x-default", tag: "Indexación" },
      { id: "cdn", label: "CDN/Edge + caché por región", tag: "Velocidad" },
      { id: "mobile", label: "Mobile-first & CWV por país (LCP/INP/CLS)", tag: "UX" },
      { id: "schema", label: "Datos estructurados localizados", tag: "Rich" },
      { id: "robots", label: "Robots para bots locales (Baidu/Yandex/Naver)", tag: "Rastreo" },
      { id: "sitemaps", label: "Sitemaps por locale + envío", tag: "Rastreo" },
    ],
  },
  {
    id: "content",
    title: "Fase 2 · Contenido & Localización",
    color: "from-fuchsia-500 to-pink-500",
    tasks: [
      { id: "loc-vs-trans", label: "Localización vs. traducción (transcreación)", tag: "Contenido" },
      { id: "style", label: "Guía de estilo (tono, moneda, formatos)", tag: "Contenido" },
      { id: "onpage", label: "Títulos/H1/ALT/meta por país", tag: "On-page" },
      { id: "ux-local", label: "UX local: pagos, shipping, soporte", tag: "UX" },
      { id: "clusters", label: "Topic clusters + calendario por país", tag: "Plan" },
      { id: "media", label: "Medios e imágenes localizadas", tag: "Contenido" },
    ],
  },
  {
    id: "offpage",
    title: "Fase 3 · Autoridad, Local & PR",
    color: "from-amber-500 to-orange-500",
    tasks: [
      { id: "gmb", label: "Fichas locales (GMB/Yandex/Mapas locales)", tag: "Local" },
      { id: "citations", label: "Citas NAP y directorios locales", tag: "Local" },
      { id: "links-local", label: "Linkbuilding local (medios, blogs)", tag: "Enlaces" },
      { id: "digital-pr", label: "Digital PR y colaboraciones", tag: "PR" },
      { id: "social", label: "Estrategia social por país (WeChat/VK/Line…)", tag: "Social" },
    ],
  },
  {
    id: "engines",
    title: "Fase 4 · Ajustes por Buscador",
    color: "from-cyan-500 to-sky-500",
    tasks: [],
  },
  {
    id: "analytics",
    title: "Fase 5 · Medición, Gobierno & Legal",
    color: "from-lime-500 to-green-500",
    tasks: [
      { id: "props", label: "Props por locale en GSC/Bing/Baidu/Yandex/Naver", tag: "Tracking" },
      { id: "ga", label: "Analytics por país + objetivos/ecommerce", tag: "Tracking" },
      { id: "dash", label: "Dashboards (posiciones, tráfico, conversiones)", tag: "BI" },
      { id: "alerts", label: "Alertas por país (caídas, indexación, Vitals)", tag: "Ops" },
      { id: "governance", label: "RACI: ownership y SLAs por mercado", tag: "Org" },
      { id: "legal", label: "Cumplimiento legal por país (cookies/privacidad)", tag: "Legal" },
    ],
  },
  {
    id: "launch",
    title: "Fase 6 · Lanzamiento, QA & Iteración",
    color: "from-rose-500 to-pink-500",
    tasks: [
      { id: "qa", label: "QA por país: rastreo, SERP, snippets, móvil", tag: "QA" },
      { id: "rollout", label: "Roll-out progresivo (piloto → expansión)", tag: "Release" },
      { id: "iterate", label: "Ciclo continuo: hipótesis → cambios → medición", tag: "CRO/SEO" },
    ],
  },
];

const ENGINE_TASKS: Record<string, any[]> = {
  google: [
    { id: "g-core", label: "Core Web Vitals por país", tag: "Google" },
    { id: "g-amp", label: "(Opc.) AMP si aporta valor", tag: "Google" },
    { id: "g-sitelinks", label: "Datos estructurados + breadcrumbs", tag: "Google" },
  ],
  bing: [
    { id: "b-indexnow", label: "IndexNow habilitado (Bing/Yandex)", tag: "Bing" },
    { id: "b-bwt", label: "Bing Webmaster: sitemap y geotargeting", tag: "Bing" },
    { id: "b-soc", label: "Monitoriza señales sociales", tag: "Bing" },
  ],
  baidu: [
    { id: "bd-lang", label: "Contenido en chino simplificado + KW CN", tag: "Baidu" },
    { id: "bd-hosting", label: "Hosting/CDN en China + licencia ICP", tag: "Baidu" },
    { id: "bd-meta", label: "Meta keywords + metadatos optimizados", tag: "Baidu" },
    { id: "bd-mip", label: "Baidu MIP / Baijiahao", tag: "Baidu" },
    { id: "bd-js", label: "Prerender/SSR para JS pesado", tag: "Baidu" },
  ],
  yandex: [
    { id: "yx-region", label: "Asignar región en Yandex.Webmaster", tag: "Yandex" },
    { id: "yx-metrica", label: "Instalar Yandex Metrica", tag: "Yandex" },
    { id: "yx-original", label: "Enviar Original Texts", tag: "Yandex" },
    { id: "yx-turbo", label: "(Opc.) Yandex Turbo Pages", tag: "Yandex" },
    { id: "yx-js", label: "Prerender/SSR para JS", tag: "Yandex" },
  ],
  naver: [
    { id: "nv-blog", label: "Blog de Naver (ecosistema)", tag: "Naver" },
    { id: "nv-cafe", label: "Naver Café / Knowledge iN", tag: "Naver" },
    { id: "nv-webmaster", label: "Naver Webmaster Tools", tag: "Naver" },
    { id: "nv-kr", label: "Contenido en coreano + marca local", tag: "Naver" },
  ],
  seznam: [
    { id: "sz-cz", label: "Contenido en checo + dominio .cz (si viable)", tag: "Seznam" },
    { id: "sz-webmaster", label: "Seznam Webmaster + backlinks locales", tag: "Seznam" },
  ],
  yahoojp: [
    { id: "yj-google", label: "SEO Google Japón (Yahoo usa Google)", tag: "Yahoo! JP" },
    { id: "yj-local", label: "Localización completa (APPI)", tag: "Yahoo! JP" },
  ],
  duckduckgo: [
    { id: "ddg-privacy", label: "Buenas prácticas de privacidad", tag: "DDG" },
  ],
  ecos: [
    { id: "eco-bing", label: "Cobertura en Bing (Ecosia usa Bing)", tag: "Ecosia" },
  ],
};

const STRUCTURE_INFO: Record<string, any> = {
  cctld: {
    title: "ccTLD (dominio por país)",
    pros: ["Señal geográfica fuerte", "Confianza local", "Independencia por mercado"],
    cons: ["Coste/operación altos", "Autoridad fragmentada", "Gestión compleja"],
  },
  subdomain: {
    title: "Subdominio (pais.dominio.com)",
    pros: ["Separación por mercado", "Geo-targeting individual", "Riesgo aislado"],
    cons: ["Autoridad parcialmente separada", "Menos local que ccTLD"],
  },
  subfolder: {
    title: "Subcarpeta (dominio.com/pais/)",
    pros: ["Autoridad concentrada", "Gestión sencilla", "Menor coste"],
    cons: ["Señal local más débil", "Dependencia del raíz"],
  },
};

const STORAGE_KEY = "intl_seo_roadmap_next_v3";

/* Component */
export default function Page() {
  const [regions, setRegions] = useState<string[]>(["eu","na","latam","apac"]);
  const [countries, setCountries] = useState<string[]>(["España","México","Estados Unidos","Brasil","China","Japón","Corea del Sur","Alemania","Reino Unido"]);
  const [engines, setEngines] = useState<string[]>(["google","bing","baidu","yandex","naver","yahoojp","seznam"]);
  const [b2b, setB2B] = useState(true);
  const [b2c, setB2C] = useState(true);
  const [structure, setStructure] = useState<"cctld"|"subdomain"|"subfolder">("subfolder");
  const [view, setView] = useState<"global"|"market">("global");

  const [phases] = useState<any[]>(BASE_PHASES);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [checkedByCountry, setCheckedByCountry] = useState<Record<string, Record<string, boolean>>>({});
  const [evidenceByCountry, setEvidenceByCountry] = useState<Record<string, Record<string, any>>>({});
  const [taskDefaults, setTaskDefaults] = useState<Record<string, {weight:number,hours:number}>>({});
  const [customLegal, setCustomLegal] = useState<{country:string,label:string}[]>([]);
  const [planText, setPlanText] = useState("");

  const [phaseSchedule, setPhaseSchedule] = useState<Record<string, {start:string, days:number}>>(()=>{
    const o: Record<string, {start:string, days:number}> = {};
    BASE_PHASES.forEach((p,i)=>{ o[p.id] = { start: new Date(Date.now() + i*7*864e5).toISOString().slice(0,10), days: 7 }; });
    return o;
  });

  /* load */
  useEffect(()=>{
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return;
      const s = JSON.parse(raw);
      setRegions(s.regions || regions);
      setCountries(s.countries || countries);
      setEngines(s.engines || engines);
      setB2B(s.b2b ?? b2b);
      setB2C(s.b2c ?? b2c);
      setStructure(s.structure || structure);
      setChecked(s.checked || {});
      setCheckedByCountry(s.checkedByCountry || {});
      setEvidenceByCountry(s.evidenceByCountry || {});
      setTaskDefaults(s.taskDefaults || {});
      setPhaseSchedule(s.phaseSchedule || phaseSchedule);
      setCustomLegal(s.customLegal || []);
    }catch(e){}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  /* save */
  useEffect(()=>{
    const toSave = { regions, countries, engines, b2b, b2c, structure, checked, checkedByCountry, evidenceByCountry, taskDefaults, phaseSchedule, customLegal };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  },[regions, countries, engines, b2b, b2c, structure, checked, checkedByCountry, evidenceByCountry, taskDefaults, phaseSchedule, customLegal]);

  /* derived */
  const phasesWithEngines = useMemo(()=>{
    const clone = JSON.parse(JSON.stringify(phases));
    const idx = clone.findIndex((p:any)=>p.id==="engines");
    if(idx>=0) clone[idx].tasks = engines.flatMap(e=>ENGINE_TASKS[e]||[]);
    return clone;
  },[phases, engines]);

  const legalTasks = useMemo(()=>{
    const list: {country:string,label:string}[] = [];
    countries.forEach((c:string)=>{
      const arr = LEGAL_BY_COUNTRY[c];
      if(arr) arr.forEach((l:string) => list.push({ country:c, label: `${c}: ${l}`}));
    });
    customLegal.forEach(x=> list.push({ country:x.country, label: `${x.country}: ${x.label}` }));
    return list;
  },[countries, customLegal]);

  const visibleTaskKeys = useMemo(()=>{
    const keys: string[] = [];
    phasesWithEngines.forEach((phase:any) => phase.tasks.forEach((t:any) => keys.push(`${phase.id}__${t.id}`)));
    return keys;
  },[phasesWithEngines]);

  const globalCompleted = useMemo(()=> visibleTaskKeys.filter(k=>checked[k]).length, [visibleTaskKeys, checked]);
  const globalProgress = visibleTaskKeys.length ? Math.round((globalCompleted/visibleTaskKeys.length)*100) : 0;

  /* helpers */
  function getCountryChecked(country:string){ return checkedByCountry[country] || {}; }
  function setCountryChecked(country:string, key:string, value:boolean){
    setCheckedByCountry(prev => ({ ...prev, [country]: { ...(prev[country]||{}), [key]: value } }));
  }
  function getEvidence(country:string, key:string){ return (evidenceByCountry[country] || {})[key] || {}; }
  function setEvidence(country:string, key:string, patch:any){
    setEvidenceByCountry(prev => ({ ...prev, [country]: { ...(prev[country]||{}), [key]: { ...(prev[country]?.[key]||{}), ...patch }}}));
  }
  function getDefaults(key:string){ return taskDefaults[key] || { weight: 1, hours: 2 }; }
  function setDefaults(key:string, patch:Partial<{weight:number,hours:number}>){ setTaskDefaults(prev => ({ ...prev, [key]: { ...(prev[key]||{weight:1,hours:2}), ...patch } })); }
  function toggleTaskGlobal(phaseId:string, taskId:string){
    const key = `${phaseId}__${taskId}`;
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  }
  function toggleLegal(idx:number){
    const key = `legal__${idx}`;
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  }
  function resetAll(){
    if(typeof window !== "undefined" && !confirm("¿Seguro que quieres reiniciar el roadmap?")) return;
    setChecked({});
    setCheckedByCountry({});
    setEvidenceByCountry({});
  }
  function applyPreset(id:string){
    const p:any = PRESETS.find((x:any)=>x.id===id);
    if(!p) return;
    setCountries(p.countries);
    setEngines(p.engines);
    setStructure(p.structure);
  }
  function addCountryManually(){
    const name = typeof window !== "undefined" ? prompt("Añade país o mercado (ej. Hong Kong, Québec)…") : "";
    if(!name) return;
    if(!countries.includes(name)) setCountries([...countries, name]);
  }
  function addCustomLegal(){
    const country = typeof window !== "undefined" ? prompt("¿Para qué país/mercado es la tarea legal?") : "";
    if(!country) return;
    const label = typeof window !== "undefined" ? prompt("Describe la tarea legal (ej. 'Consent Mode v2' o 'Aviso de cookies bilingüe')") : "";
    if(!label) return;
    setCustomLegal([...customLegal, { country, label }]);
  }

  function download(filename:string, content:string, type="text/plain"){
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
  }
  function exportJSON(){
    const state = { regions, countries, engines, b2b, b2c, structure, checked, checkedByCountry, evidenceByCountry, taskDefaults, phaseSchedule, customLegal };
    download(`roadmap-seo-internacional-${new Date().toISOString().slice(0,10)}.json`, JSON.stringify(state, null, 2), "application/json");
  }
  function exportCSVTasks(){
    const rows = [[
      "country","phase","task_id","task_label","tag","engine_phase","done","weight","hours","gsc","jira","evidence_url","notes"
    ].join(",")];

    const enginePhaseId = "engines";

    countries.forEach(country=>{
      const countryChecked = getCountryChecked(country);
      phasesWithEngines.forEach((phase:any)=>{
        phase.tasks.forEach((task:any)=>{
          const key = `${phase.id}__${task.id}`;
          const done = countryChecked[key] ? 1 : 0;
          const def = getDefaults(key);
          const ev = getEvidence(country, key);
          const row = [
            country,
            phase.title.replace(/,/g," "),
            key,
            task.label.replace(/,/g," "),
            task.tag,
            phase.id===enginePhaseId ? 1 : 0,
            done,
            ev.weight ?? def.weight,
            ev.hours ?? def.hours,
            ev.gsc || "",
            ev.jira || "",
            ev.url || "",
            (ev.notes || "").replace(/\n/g," ")
          ].map(v => typeof v === 'string' && v.includes(',') ? `"${v}"` : v as any);
          rows.push(row.join(","));
        });
      });
      // Legal
      legalTasks.forEach((lt:any,i:number)=>{
        if(lt.country !== country) return;
        const key = `legal__${i}`;
        const done = countryChecked[key] ? 1 : 0;
        const ev = getEvidence(country, key);
        const row = [
          country,
          "Fase 5 · Legal",
          key,
          lt.label.replace(/,/g," "),
          "Legal",
          0,
          done,
          ev?.weight ?? 1,
          ev?.hours ?? 1,
          ev?.gsc || "",
          ev?.jira || "",
          ev?.url || "",
          (ev?.notes || "").replace(/\n/g," ")
        ].map(v => typeof v === 'string' && v.includes(',') ? `"${v}"` : v as any);
        rows.push(row.join(","));
      });
    });

    download(`roadmap_tasks_${new Date().toISOString().slice(0,10)}.csv`, rows.join("\n"), "text/csv");
  }
  function exportTimelineCSV(){
    const rows = [["phase_id","phase_title","start","days","end"].join(",")];
    Object.entries(phaseSchedule).forEach(([pid, cfg])=>{
      const title = BASE_PHASES.find(p=>p.id===pid)?.title || pid;
      const start = new Date((cfg as any).start);
      const end = new Date(start.getTime() + ((cfg as any).days||0)*864e5);
      rows.push([pid, title.replace(/,/g," "), (cfg as any).start, (cfg as any).days, end.toISOString().slice(0,10)].join(","));
    });
    download(`roadmap_timeline_${new Date().toISOString().slice(0,10)}.csv`, rows.join("\n"), "text/csv");
  }

  function generatePlanText(){
    const lines: string[] = [];
    lines.push("PLAN DE SEO INTERNACIONAL");
    lines.push("=============================\n");
    lines.push(`📍 MERCADOS OBJETIVO (${countries.length}):`);
    lines.push(`${countries.join(", ")}\n`);
    lines.push(`🌍 REGIONES: ${regions.map(r => REGIONS.find(x=>x.id===r)?.label || r).join(", ")}`);
    lines.push(`🔍 MOTORES: ${engines.map(e => ENGINES.find(x=>x.id===e)?.label || e).join(", ")}`);
    lines.push(`💼 MODELO: ${b2b?"B2B":""}${b2b&&b2c?" + ":""}${b2c?"B2C":""}`);
    lines.push(`🏗️ ESTRUCTURA: ${STRUCTURE_INFO[structure].title}\n`);
    lines.push("─────────────────────────────────────────────────\n");

    phasesWithEngines.forEach((phase:any)=>{
      lines.push(`${phase.title.toUpperCase()}`);
      lines.push("─".repeat(phase.title.length));
      phase.tasks.forEach((t:any)=>{
        const key = `${phase.id}__${t.id}`;
        const mark = checked[key] ? "✅" : "⬜";
        const def = getDefaults(key);
        lines.push(`${mark} ${t.label} [${t.tag}] (Peso: ${def.weight}, Horas: ${def.hours})`);
      });
      lines.push("");
    });

    lines.push("CUMPLIMIENTO LEGAL POR PAÍS");
    lines.push("─────────────────────────────");
    legalTasks.forEach((lt:any,i:number)=>{
      const key = `legal__${i}`;
      const mark = checked[key] ? "✅" : "⬜";
      lines.push(`${mark} ${lt.label}`);
    });

    setPlanText(lines.join("\n"));
    setTimeout(()=>document.getElementById("plan-output")?.scrollIntoView({ behavior:"smooth"}), 50);
  }

  return (
    <div className="min-h-screen pb-20" style={{ background: BRAND.bg, color: BRAND.ink }}>
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur border-b" style={{ borderColor: BRAND.border }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-[-0.02em]">Roadmap SEO Internacional</h1>
            <p className="text-slate-600 text-sm md:text-base">Herramienta completa para planificar y ejecutar estrategias de SEO internacional</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-3 py-2 text-sm text-slate-600 hover:text-slate-900 underline" onClick={() => document.getElementById('help-section')?.scrollIntoView({ behavior: 'smooth' })}>❓ Cómo usar</button>
            <select onChange={e=> applyPreset((e.target as HTMLSelectElement).value)} defaultValue="" className="px-3 py-2 rounded-lg bg-white border border-slate-300 text-sm hover:border-slate-400">
              <option value="" disabled>🚀 Presets rápidos</option>
              {PRESETS.map(p => (<option key={p.id} value={p.id}>{p.label}</option>))}
            </select>
          </div>
        </div>
      </header>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 pt-6 pb-2">
        <div className="grid md:grid-cols-12 gap-4">
          {/* Regiones */}
          <div className="md:col-span-3" style={{ background: BRAND.panel, border:`1px solid ${BRAND.border}`}}>
            <div className="p-4 rounded-2xl">
              <h3 className="font-semibold mb-2">Regiones</h3>
              <div className="flex flex-wrap gap-2">
                {REGIONS.map((r:any) => (
                  <button key={r.id} onClick={() => setRegions(prev => prev.includes(r.id) ? prev.filter(x=>x!==r.id) : [...prev, r.id])} className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${regions.includes(r.id) ? "bg-blue-500 text-white border-blue-500" : "bg-white border-slate-300 hover:bg-slate-50"}`}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Países */}
          <div className="md:col-span-5" style={{ background: BRAND.panel, border:`1px solid ${BRAND.border}`}}>
            <div className="p-4 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Países ({countries.length})</h3>
                <button onClick={addCountryManually} className="text-xs underline underline-offset-4">Añadir país</button>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {regions.map((r:any) => (
                  <details key={r} className="bg-slate-800/60 rounded-xl p-3 border border-slate-700">
                    <summary className="cursor-pointer text-sm font-medium">{REGIONS.find(x=>x.id===r)?.label}</summary>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(COUNTRIES_BY_REGION[r]||[]).map((c:string) => (
                        <button key={c} onClick={() => setCountries(prev => prev.includes(c) ? prev.filter(x=>x!==c) : [...prev, c])} className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${countries.includes(c) ? "bg-green-500 text-white border-green-500" : "bg-white border-slate-300 hover:bg-slate-50"}`}>
                          {c}
                        </button>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {countries.map((c:string) => (
                  <span key={c} className="px-2.5 py-1 rounded-full bg-slate-800 text-xs border border-slate-700 flex items-center gap-2">
                    {c}
                    <button onClick={() => setCountries(prev => prev.filter(x=>x!==c))} className="opacity-70 hover:opacity-100">✕</button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Motores + Modelo + Estructura */}
          <div className="md:col-span-4" style={{ background: BRAND.panel, border:`1px solid ${BRAND.border}`}}>
            <div className="p-4 rounded-2xl">
              <h3 className="font-semibold mb-2">Buscadores</h3>
              <div className="flex flex-wrap gap-2">
                {ENGINES.map((e:any) => (
                  <button key={e.id} onClick={() => setEngines(prev => prev.includes(e.id) ? prev.filter(x=>x!==e.id) : [...prev, e.id])} className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${engines.includes(e.id) ? "bg-purple-500 text-white border-purple-500" : "bg-white border-slate-300 hover:bg-slate-50"}`}>
                    {e.label}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-4">
                <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={b2b} onChange={(e)=>setB2B((e.target as HTMLInputElement).checked)} /> B2B</label>
                <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={b2c} onChange={(e)=>setB2C((e.target as HTMLInputElement).checked)} /> B2C</label>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-1">Estructura del sitio</h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {Object.entries(STRUCTURE_INFO).map(([k,v]) => (
                    <label key={k} className={`rounded-xl border p-3 cursor-pointer ${structure===k?"border-emerald-400 bg-emerald-500/10":"border-slate-700 bg-slate-800"}`}>
                      <div className="flex items-center gap-2 mb-1"><input type="radio" name="structure" checked={structure===k} onChange={()=>setStructure(k as any)} /><span className="font-semibold">{(v as any).title}</span></div>
                      <div className="text-slate-300">✅ {(v as any).pros[0]}</div>
                      <div className="text-slate-300">⚠️ {(v as any).cons[0]}</div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section id="help-section" className="max-w-7xl mx-auto px-4 pb-6">
        <div className="rounded-2xl p-6 border" style={{ background: BRAND.panel, borderColor: BRAND.border }}>
          <div className="flex items-start gap-4">
            <div className="text-3xl">📚</div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-4">Cómo usar esta herramienta</h2>
              <div className="grid md:grid-cols-2 gap-6 text-sm leading-relaxed">
                <div>
                  <h3 className="font-semibold mb-2 text-blue-600">🌍 1. Configura tus mercados</h3>
                  <p className="text-slate-600 mb-3">Selecciona las regiones y países donde quieres implementar SEO internacional. Puedes usar los presets rápidos o personalizarlo.</p>
                  
                  <h3 className="font-semibold mb-2 text-green-600">🔍 2. Elige buscadores</h3>
                  <p className="text-slate-600 mb-3">Selecciona los motores de búsqueda relevantes para tus mercados (Google, Bing, Baidu para China, Yandex para Rusia, etc.).</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-purple-600">✓ 3. Trabaja con el checklist</h3>
                  <p className="text-slate-600 mb-3">Usa el <strong>Checklist global</strong> para una vista general o <strong>Checklist por mercado</strong> para detalles específicos, evidencias y estimaciones.</p>
                  
                  <h3 className="font-semibold mb-2 text-orange-600">📤 4. Exporta y planifica</h3>
                  <p className="text-slate-600">Genera el plan de texto, exporta a CSV para Notion, o descarga todo en JSON. Configura el timeline por fases.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="max-w-7xl mx-auto px-4 pb-4">
        <div className="flex items-center gap-2">
          <button onClick={()=>setView("global")} className={`px-4 py-2 rounded-xl border transition-colors ${view==='global'?"bg-blue-500 text-white border-blue-500":"bg-white text-slate-700 border-slate-300 hover:bg-slate-50"}`}>📋 Checklist global</button>
          <button onClick={()=>setView("market")} className={`px-4 py-2 rounded-xl border transition-colors ${view==='market'?"bg-blue-500 text-white border-blue-500":"bg-white text-slate-700 border-slate-300 hover:bg-slate-50"}`}>🌍 Checklist por mercado</button>
        </div>
      </section>

      {/* Global progress */}
      {view === 'global' && (
        <section className="max-w-7xl mx-auto px-4 pb-4">
          <div className="p-4 rounded-2xl" style={{ background: BRAND.panel, border:`1px solid ${BRAND.border}`}}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm">Progreso global: <span className="font-semibold">{globalCompleted}</span> / {visibleTaskKeys.length}</p>
              <p className="text-sm">{globalProgress}%</p>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full" style={{ width: `${globalProgress}%`, background:`linear-gradient(90deg, ${BRAND.primaryFrom}, ${BRAND.primaryTo})` }} />
            </div>
          </div>
        </section>
      )}

      {/* GLOBAL VIEW */}
      {view === 'global' && (
        <main className="max-w-7xl mx-auto px-4 pb-12">
          <div className="space-y-6">
            {phasesWithEngines.map((phase:any) => (
              <section key={phase.id} className="rounded-2xl overflow-hidden" style={{ border:`1px solid ${BRAND.border}`}}>
                <header className={`p-4 bg-gradient-to-r ${phase.color}`}>
                  <h2 className="text-lg md:text-xl font-bold">{phase.title}</h2>
                </header>
                <div className="p-4" style={{ background: BRAND.bg }}>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {phase.tasks.length === 0 && (<li className="text-sm text-slate-400">No hay tareas (añade motores de búsqueda para esta fase).</li>)}
                    {phase.tasks.map((task:any) => {
                      const key = `${phase.id}__${task.id}`;
                      const def = getDefaults(key);
                      return (
                        <li key={key} className="flex items-start gap-3 p-3 rounded-xl border bg-slate-900/60" style={{ borderColor: BRAND.border }}>
                          <input type="checkbox" className="mt-1" checked={!!checked[key]} onChange={() => toggleTaskGlobal(phase.id, task.id)} />
                          <div className="flex-1">
                            <p className="text-sm leading-snug">{task.label}</p>
                            <div className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">{task.tag}</div>
                          </div>
                          <div className="text-right text-xs">
                            <div className="flex items-center gap-2">
                              <label>Peso</label>
                              <input type="number" min={0} value={def.weight} onChange={(e)=>setDefaults(key,{weight:Number((e.target as HTMLInputElement).value)})} className="w-16 px-2 py-1 rounded bg-slate-800 border border-slate-700" />
                            </div>
                            <div className="mt-1 flex items-center gap-2">
                              <label>Horas</label>
                              <input type="number" min={0} value={def.hours} onChange={(e)=>setDefaults(key,{hours:Number((e.target as HTMLInputElement).value)})} className="w-16 px-2 py-1 rounded bg-slate-800 border border-slate-700" />
                            </div>
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
                        {legalTasks.length === 0 && (<li className="text-sm text-slate-400">Sin tareas legales detectadas. Añade países o crea tareas personalizadas.</li>)}
                        {legalTasks.map((lt:any, i:number) => {
                          const key = `legal__${i}`;
                          return (
                            <li key={key} className="flex items-start gap-3 p-3 rounded-xl border bg-slate-900/60" style={{ borderColor: BRAND.border }}>
                              <input type="checkbox" className="mt-1" checked={!!checked[key]} onChange={() => toggleLegal(i)} />
                              <div className="flex-1">
                                <p className="text-sm leading-snug">{lt.label}</p>
                                <div className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">Legal</div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {phase.id === "tech" && (
                    <div className="mt-6">
                      <h3 className="font-semibold mb-2">Guía rápida de estructura</h3>
                      <div className="grid md:grid-cols-3 gap-3 text-sm">
                        {Object.entries(STRUCTURE_INFO).map(([k,v]) => (
                          <div key={k} className="rounded-xl border p-3" style={{ borderColor: structure===k?"#34d399":BRAND.border, background: structure===k?"rgba(16,185,129,0.1)":"rgba(15,23,42,0.6)" }}>
                            <div className="font-semibold mb-1">{(v as any).title}</div>
                            <div className="text-slate-300">Pros:
                              <ul className="list-disc ml-5">
                                {(v as any).pros.map((p:string,i:number)=>(<li key={i}>{p}</li>))}
                              </ul>
                            </div>
                            <div className="text-slate-300 mt-2">Contras:
                              <ul className="list-disc ml-5">
                                {(v as any).cons.map((c:string,i:number)=>(<li key={i}>{c}</li>))}
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
          <section id="plan-output" className="mt-8 rounded-2xl p-4" style={{ background: BRAND.panel, border:`1px solid ${BRAND.border}`}}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">📋 Plan de Ejecución</h3>
              <div className="flex gap-2">
                <button onClick={() => navigator.clipboard.writeText(planText)} className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-sm">📋 Copiar</button>
                <button onClick={() => window.print()} className="px-3 py-1.5 rounded-lg text-white text-sm font-medium" style={{ background: `linear-gradient(90deg, ${BRAND.primaryFrom}, ${BRAND.primaryTo})` }}>🖨️ Imprimir</button>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 font-mono text-sm leading-relaxed whitespace-pre-line" style={{ minHeight: '300px' }}>
              {planText || "Pulsa '✨ Generar Plan' en la barra inferior para crear tu resumen ejecutable..."}
            </div>
          </section>
        </main>
      )}

      {/* MARKET VIEW */}
      {view === 'market' && (
        <main className="max-w-7xl mx-auto px-4 pb-16">
          <div className="space-y-8">
            {countries.map(country => {
              const countryChecked = getCountryChecked(country);
              const keys = [...visibleTaskKeys];
              const countryLegal = legalTasks.map((lt:any, i:number) => ({...lt, key:`legal__${i}`})).filter((lt:any) => lt.country === country);
              const total = keys.length + countryLegal.length;
              const done = keys.filter(k => countryChecked[k]).length + countryLegal.filter(lt => countryChecked[lt.key]).length;
              const pct = total ? Math.round((done/total)*100) : 0;

              return (
                <section key={country} className="rounded-2xl overflow-hidden" style={{ border:`1px solid ${BRAND.border}`}}>
                  <header className="p-4" style={{ background:`linear-gradient(90deg, ${BRAND.primaryFrom}, ${BRAND.primaryTo})`, color:"#0b1220" }}>
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg md:text-xl font-bold">{country}</h2>
                      <div className="text-sm">{pct}%</div>
                    </div>
                    <div className="w-full h-2 rounded-full bg-black/20 mt-2">
                      <div className="h-full bg-black/40" style={{ width: `${pct}%` }} />
                    </div>
                  </header>

                  <div className="p-4" style={{ background: BRAND.bg }}>
                    {phasesWithEngines.map((phase:any) => (
                      <div key={phase.id} className="mb-6">
                        <h3 className="font-semibold mb-3 text-slate-200">{phase.title}</h3>
                        <ul className="grid md:grid-cols-2 gap-3">
                          {phase.tasks.map((task:any) => {
                            const key = `${phase.id}__${task.id}`;
                            const def = getDefaults(key);
                            const ev = getEvidence(country, key);
                            return (
                              <li key={key} className="p-3 rounded-xl border bg-slate-900/60" style={{ borderColor: BRAND.border }}>
                                <div className="flex items-start gap-3">
                                  <input type="checkbox" className="mt-1" checked={!!countryChecked[key]} onChange={(e)=> setCountryChecked(country, key, (e.target as HTMLInputElement).checked)} />
                                  <div className="flex-1">
                                    <p className="text-sm leading-snug">{task.label}</p>
                                    <div className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">{task.tag}</div>
                                  </div>
                                </div>
                                {/* Evidence & estimates */}
                                <div className="mt-3 grid md:grid-cols-2 gap-3 text-xs">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2"><span className="w-16">Peso</span><input type="number" min={0} value={ev.weight ?? def.weight} onChange={(e)=> setEvidence(country, key, { weight:Number((e.target as HTMLInputElement).value) })} className="w-24 px-2 py-1 rounded bg-slate-800 border border-slate-700" /></div>
                                    <div className="flex items-center gap-2"><span className="w-16">Horas</span><input type="number" min={0} value={ev.hours ?? def.hours} onChange={(e)=> setEvidence(country, key, { hours:Number((e.target as HTMLInputElement).value) })} className="w-24 px-2 py-1 rounded bg-slate-800 border border-slate-700" /></div>
                                  </div>
                                  <div className="space-y-2">
                                    <input type="url" placeholder="Enlace GSC / Baidu Webmaster…" value={ev.gsc || ""} onChange={(e)=> setEvidence(country, key, { gsc:(e.target as HTMLInputElement).value })} className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700" />
                                    <div className="grid grid-cols-2 gap-2">
                                      <input type="text" placeholder="Ticket Jira" value={ev.jira || ""} onChange={(e)=> setEvidence(country, key, { jira:(e.target as HTMLInputElement).value })} className="px-2 py-1 rounded bg-slate-800 border border-slate-700" />
                                      <input type="url" placeholder="URL evidencia (capturas/docs)" value={ev.url || ""} onChange={(e)=> setEvidence(country, key, { url:(e.target as HTMLInputElement).value })} className="px-2 py-1 rounded bg-slate-800 border border-slate-700" />
                                    </div>
                                  </div>
                                </div>
                                <textarea placeholder="Notas / contexto / decisiones" value={ev.notes || ""} onChange={(e)=> setEvidence(country, key, { notes:(e.target as HTMLTextAreaElement).value })} className="mt-2 w-full px-2 py-2 rounded bg-slate-800 border border-slate-700 text-xs" rows={2} />
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}

                    {/* Legal per country */}
                    <div className="mt-6">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-slate-200">Legal</h3>
                        <button onClick={addCustomLegal} className="text-xs underline underline-offset-4">Añadir tarea legal personalizada</button>
                      </div>
                      <ul className="mt-3 grid md:grid-cols-2 gap-3">
                        {countryLegal.length === 0 && <li className="text-sm text-slate-400">Sin tareas legales detectadas para {country}.</li>}
                        {countryLegal.map((lt:any) => {
                          const ev = getEvidence(country, lt.key);
                          return (
                            <li key={lt.key} className="p-3 rounded-xl border bg-slate-900/60" style={{ borderColor: BRAND.border }}>
                              <div className="flex items-start gap-3">
                                <input type="checkbox" className="mt-1" checked={!!countryChecked[lt.key]} onChange={(e)=> setCountryChecked(country, lt.key, (e.target as HTMLInputElement).checked)} />
                                <div className="flex-1">
                                  <p className="text-sm leading-snug">{lt.label}</p>
                                  <div className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">Legal</div>
                                </div>
                              </div>
                              <div className="mt-3 grid md:grid-cols-2 gap-3 text-xs">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2"><span className="w-16">Peso</span><input type="number" min={0} value={ev.weight ?? 1} onChange={(e)=> setEvidence(country, lt.key, { weight:Number((e.target as HTMLInputElement).value) })} className="w-24 px-2 py-1 rounded bg-slate-800 border border-slate-700" /></div>
                                  <div className="flex items-center gap-2"><span className="w-16">Horas</span><input type="number" min={0} value={ev.hours ?? 1} onChange={(e)=> setEvidence(country, lt.key, { hours:Number((e.target as HTMLInputElement).value) })} className="w-24 px-2 py-1 rounded bg-slate-800 border border-slate-700" /></div>
                                </div>
                                <div className="space-y-2">
                                  <input type="url" placeholder="Enlace a política / CMP / Consent" value={ev.gsc || ""} onChange={(e)=> setEvidence(country, lt.key, { gsc:(e.target as HTMLInputElement).value })} className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700" />
                                  <div className="grid grid-cols-2 gap-2">
                                    <input type="text" placeholder="Ticket Jira" value={ev.jira || ""} onChange={(e)=> setEvidence(country, lt.key, { jira:(e.target as HTMLInputElement).value })} className="px-2 py-1 rounded bg-slate-800 border border-slate-700" />
                                    <input type="url" placeholder="URL evidencia" value={ev.url || ""} onChange={(e)=> setEvidence(country, lt.key, { url:(e.target as HTMLInputElement).value })} className="px-2 py-1 rounded bg-slate-800 border border-slate-700" />
                                  </div>
                                </div>
                              </div>
                              <textarea placeholder="Notas" value={ev.notes || ""} onChange={(e)=> setEvidence(country, lt.key, { notes:(e.target as HTMLTextAreaElement).value })} className="mt-2 w-full px-2 py-2 rounded bg-slate-800 border border-slate-700 text-xs" rows={2} />
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </main>
      )}

      {/* Timeline */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="rounded-2xl p-4" style={{ background:"rgba(15,23,42,0.7)", border:`1px solid ${BRAND.border}`}}>
          <h3 className="font-semibold mb-3">Timeline por fases</h3>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            {BASE_PHASES.map(p => {
              const cfg = phaseSchedule[p.id] || { start: new Date().toISOString().slice(0,10), days: 7 };
              const start = cfg.start;
              const days = cfg.days;
              const end = new Date(new Date(start).getTime() + days*864e5).toISOString().slice(0,10);
              return (
                <div key={p.id} className="p-3 rounded-xl border bg-slate-900/60" style={{ borderColor: BRAND.border }}>
                  <div className="font-semibold mb-2">{p.title}</div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Inicio</div>
                      <input type="date" value={start} onChange={(e)=> setPhaseSchedule(prev => ({...prev, [p.id]: { ...(prev[p.id]||{start:'', days:0}), start:(e.target as HTMLInputElement).value }}))} className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Días</div>
                      <input type="number" min={0} value={days} onChange={(e)=> setPhaseSchedule(prev => ({...prev, [p.id]: { ...(prev[p.id]||{start:'', days:0}), days:Number((e.target as HTMLInputElement).value) }}))} className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Fin</div>
                      <input type="date" value={end} readOnly className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700 opacity-70" />
                    </div>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-slate-800">
                    <div className="h-full" style={{ width: `${Math.min(100, (days/42)*100)}%`, background:`linear-gradient(90deg, ${BRAND.primaryFrom}, ${BRAND.primaryTo})` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-slate-400">Consejo: usa CSV Timeline para importar en Notion/Sheets y componer un Gantt.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-slate-500 text-xs">© {new Date().getFullYear()} International SEO Roadmap — Branded for Jorge J. Rolo</footer>
      
      {/* Sticky CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-600">Acciones:</span>
              <button onClick={resetAll} className="px-3 py-1.5 rounded-lg text-sm border border-slate-300 hover:bg-slate-50">🔄 Reiniciar</button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={exportJSON} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 hover:bg-slate-200 border border-slate-300">📄 JSON</button>
              <button onClick={exportCSVTasks} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 hover:bg-slate-200 border border-slate-300">📊 CSV Tasks</button>
              <button onClick={exportTimelineCSV} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 hover:bg-slate-200 border border-slate-300">📅 Timeline</button>
              <button onClick={generatePlanText} className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white" style={{ background: `linear-gradient(90deg, ${BRAND.primaryFrom}, ${BRAND.primaryTo})` }}>✨ Generar Plan</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
