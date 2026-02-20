import { useState, useEffect } from "react";
function App() {

  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showError, setShowError] = useState(false);
  const [scanData, setScanData] = useState(null);
  const [hasRecs, setHasRecs] = useState(false);

  const variations: {
    [key: string]: string[]
  } = {
    P: ["P"],
    A: ["A", "Λ", "Δ"],
    R: ["R", "Я"],
    D: ["D"],
    O: ["O", "Ø",],
    X: ["X", "⤫"],
    "-": ["-"],
  };
  const base_word = "PARADOX-";
  useEffect(() => {
    const logo = document.getElementById("logoText");
    function randomizeLogo() {
      if (!logo) return;
      let new_text = "";
      for (let char of base_word) {
        const options = variations[char] || [char];
        const random_char = options[Math.floor(Math.random() * options.length)];
        new_text += random_char;
      }
      logo.textContent = new_text;
    }
    randomizeLogo();
    const interval = setInterval(() => {
      randomizeLogo();
    }, 1000 + Math.random() * 1000);
    return () => clearInterval(interval);

  }, []);


  const scanSite = async () => {
    const input = document.getElementById('urlInput')?.value.trim() || "";
    if (!input) {
      return;
    }
    setShowResult(false);
    setShowError(false);
    setLoading(true);
    try {
      let data;
      try {
        const response = await fetch(`https://api-point-web-scan.vercel.app/?url=${input.replace("https", "").replace("http", "").replace("://", "").replace("www.", "")}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        let data_wait = await response.json();
        data = data_wait.scan_result;
        setScanData(data);
        setShowResult(true);
      } catch (fetchError) {
        setLoading(false);
        setShowError(true);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setShowError(true);
    }
  }
  const bgcolour = (rating: string) => {
    if (rating == 'A' || rating == '6/6') {
      return 'bg-emerald-500';
    }
    else if (rating == 'B' || rating == '5/6') {
      return 'bg-green-400'
    }
    else if (rating == 'C' || rating == '4/6') {
      return 'bg-yellow-400'
    }
    else if (rating == 'D' || rating == '3/6') {
      return 'bg-orange-500'
    }
    else if (rating == 'E' || rating == '1/6' || rating == '0/6') {
      return 'bg-red-500'
    }
    else {
      return 'bg-blue-300'
    }
  }
  const get = (path: string, obj = scanData) =>
    path.split('.').reduce((acc: any, c: string) => acc?.[c], obj) ?? 'N/A';


  return (
    <div className="theme-card-bg p-4 md:p-10 flex flex-col items-center">
      <div className="w-full flex flex-col items-center justify-center text-center mt-24 mb-12">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4"
          style={{ letterSpacing: "-2px" }}>
          <span id="logoText" className="wave-text">PΛЯΛDOX-</span>v3.14.159
        </h1>
        <p className="opacity-70 mono-font text-lg">
          — Advanced heuristic analysis for modern web endpoints —
        </p>
      </div>
      <div className="w-full max-w-5xl">
        <div className="theme-card p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow flex flex-col">
              <label className="mono-font text-xs uppercase mb-2 opacity-70">Target URL</label>
              <input type="text" id="urlInput" placeholder="epoxylang.js.org"
                className="w-full bg-transparent border-b-2 p-2 mono-font text-lg focus:border-[var(--accent-color)] transition"
                style={{ borderColor: "var(--border-color)" }} />
            </div>
            <div className="flex items-end">
              <button onClick={scanSite}
                className="theme-card px-8 py-3 font-bold uppercase tracking-wide hover:translate-y-1 hover:shadow-none transition-all active:translate-y-2">
                Scan Now
              </button>
            </div>
          </div>
          {loading && <div className={`loader-line mt-6 ${loading ? "block" : "hidden"}`}></div>}
        </div>
        {showError && <div className="w-full p-4 mb-6 border border-red-500 text-red-500 bg-red-50 mono-font">An Error occurred.. Plzz try again</div>}
        {showResult && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="theme-card p-4 flex items-center justify-center relative">
                <div className="relative w-full flex items-center justify-center">
                  <div className="absolute w-20 h-20 rounded-full bg-white flex items-center justify-center z-20 border border-[var(--border-color)]">
                    <img id="favicon" src={`https://www.google.com/s2/favicons?domain=https://${get('site.domain')}&sz=256`} className="w-[4.5rem] h-[4.5rem] object-contain rounded-full" />
                  </div>
                  <div className="theme-card-tr w-28 absolute top-[35px] mt-[-0.25rem] left-[-16px] flex flex-col items-center">
                    <div className="flex flex-inline">
                      <div id="domainTextnum" className={`border-r border-b w-14 h-14 flex items-center justify-center ${bgcolour(get('ratings.domain.passed'))}`}>{get('ratings.domain.passed')}</div>
                      <div id="domainText" className={`w-14 h-14 border-b flex items-center justify-center ${bgcolour(get('ratings.domain.rating'))}`}>{get('ratings.domain.rating')}</div>
                    </div>
                    <span className="pt-1 pb-1 text-xs opacity-70 uppercase">Domain Rating</span>
                  </div>
                  <div className="theme-card-tl w-28 absolute top-[35px] mt-[-0.25rem] right-[-16px] flex flex-col items-center">
                    <div className="flex flex-inline">
                      <div id="tlsTextnum" className={`border-r border-b w-14 h-14 flex items-center justify-center ${bgcolour(get('ratings.tls.passed'))}`}>{get('ratings.tls.passed')}</div>
                      <div id="tlsText" className={`w-14 h-14 border-b flex items-center justify-center ${bgcolour(get('ratings.tls.rating'))}`}>{get('ratings.tls.rating')}</div>
                    </div>
                    <span className="pt-1 pb-1 text-xs opacity-70 uppercase">TLS Rating</span>
                  </div>
                  <div className="theme-card-bl w-28 absolute bottom-[36px] mb-[-0.25rem] left-[-16px] flex flex-col items-center">
                    <div className="flex flex-inline">
                      <div id="totalTextnum" className={`border-r border-b w-14 h-14 flex items-center justify-center ${bgcolour('6/6')}`}>6/6</div>
                      <div className={`w-14 h-14 border-b flex items-center justify-center ${bgcolour(get('ratings.total.rating'))}`}>
                        {get('ratings.total.rating')}
                      </div>
                    </div>
                    <span className="pt-1 pb-1 text-xs opacity-70 uppercase">Total Rating</span>
                  </div>
                  <div className="theme-card-br w-28 absolute bottom-[36px] mb-[-0.25rem] right-[-16px] flex flex-col items-center">
                    <div className="flex flex-inline">
                      <div id="secureTextnum" className={`border-r border-b w-14 h-14 flex items-center justify-center ${bgcolour(get('ratings.security.passed'))}`}>{get('ratings.security.passed')}</div>
                      <div id="secureText" className={`w-14 h-14 border-b flex items-center justify-center ${bgcolour(get('ratings.security.rating'))}`}>{get('ratings.security.rating')}</div>
                    </div>
                    <span className="pt-1 pb-1 text-xs opacity-70 uppercase">Secure Rating</span>
                  </div>
                  <div className="absolute top-1/2 left-1/2 w-48 h-48 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="absolute w-[7.5rem] h-[1px] bg-[var(--border-color)] rotate-[32deg] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute w-[7.5rem] h-[1px] bg-[var(--border-color)] -rotate-[32deg] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                </div>
              </div>
              <div className="theme-card px-6 pt-5 pb-4 md:col-span-1">
                <h3 className="mono-font text-sm uppercase border-b pb-2 mb-3 opacity-70" style={{ borderColor: "var(--border-color)" }}># Target Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs opacity-50 uppercase">IP Address</p>
                    <div className="mono-font text-sm flex flex-col gap-1">
                      {
                        Array.isArray(get('site.ip')) ? get('site.ip').length >= 3 ? get('site.ip').slice(0, 3).map((ip: string, i: number) => (
                          <span key={i}>{ip || "IP ~ not found"}</span>
                        )) : (
                          get('site.ip').push("IP ~ not found"),
                          get('site.ip').push("IP ~ not found"),
                          get('site.ip').push("IP ~ not found"),
                          get('site.ip').slice(0, 3).map((ip: string, i: number) => (
                            <span key={i}>{ip || "IP ~ not found"}</span>
                          )
                          )) : get('site.ip')
                      }
                    </div>

                  </div>
                  <div>
                    <p className="text-xs opacity-50 uppercase">Server / CDN</p>
                    <p className="mono-font text-sm">{Array.isArray(get('site.cdn')) ? get('site.cdn').join(', ') : 'Direct / Unknown'}</p>
                  </div>
                  <div className="flex flex-inline col-span-2 flex items-center gap-3">
                    <img src={`https://api-point-search.vercel.app/icon/${get('site.running_on') == 'N/A' ? "Unknown" : get('site.running_on')}`} className="w-12" />
                    <div className="border-l pl-4"> <p className="text-xs opacity-50 uppercase">CMS / Software</p>
                      <p className="mono-font text-sm">{Array.isArray(get('site.running_on')) ? get('site.running_on').join(', ') : (
                        Array.isArray(get('site.powered_by')) ? get('site.powered_by').join(', ') : "Unknown"
                      )}</p></div>
                  </div>
                </div>
              </div>
              <div className="theme-card p-6 h-full">
                <div className="flex justify-between items-center border-b pb-2 mb-3" style={{ borderColor: "var(--border-color)" }}>
                  <h3 className="mono-font text-sm uppercase opacity-70"># TLS Certificate</h3>
                </div>
                <ul className="space-y-3 mono-font text-sm">
                  <li className="flex justify-between">
                    <span className="opacity-60 uppercase text-xs">Domain:</span>
                    <span className="text-right">{get('site.domain')}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="opacity-60 uppercase text-xs">Issuer:</span>
                    <span className="text-right">{get('tls.cert_issuer')}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="opacity-60 uppercase text-xs">Expires:</span>
                    <span className="text-right">{get('tls.cert_expires')}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="opacity-60 uppercase text-xs">Authority:</span>
                    <span className="text-right">{get('tls.cert_authority')}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* <div className="theme-card p-6 h-full md:col-span-1">
                <h3 className="mono-font text-sm uppercase border-b pb-2 mb-3 opacity-70" style={{ borderColor: "var(--border-color)" }}># System Recommendations</h3>
                <div id="recommendationsList" className="space-y-2 h-34 overflow-y-auto pr-2">
                  <div className="text-sm opacity-50 italic">No critical issues found.</div>
                </div>
              </div> */}
              <div className="theme-card p-6 h-full md:col-span-2">
                <h3 className="mono-font text-sm uppercase border-b pb-2 mb-3 opacity-70" style={{ borderColor: "var(--border-color)" }}># Linked Files</h3>
                <div id="linkedFilesList" className="space-y-2 h-34 overflow-y-auto pr-2">
                  <p className="text-xs opacity-50 uppercase">Domain URLs</p>
                  {Array.isArray(get('links.urls')) && get('links.urls').length > 0 ? get('links.urls').map((file: string, i: number) => (
                    <div key={i} className="text-sm"><a href={get('site.final_url').endsWith("/") ? get('site.final_url').slice(0, -1) + file : get('site.final_url') + file} target="_blank">{get('site.final_url').endsWith("/") ? get('site.final_url').slice(0, -1) + file : get('site.final_url') + file}</a></div>
                  )) : ""}
                  <p className="text-xs opacity-50 uppercase pt-3">Local JavaScript Files</p>
                  {Array.isArray(get('links.js_local')) && get('links.js_local').length > 0 ? get('links.js_local').map((file: string, i: number) => (
                    <div key={i} className="text-sm"><a href={get('site.final_url').endsWith("/") ? get('site.final_url').slice(0, -1) + file : get('site.final_url') + file} target="_blank">{get('site.final_url').endsWith("/") ? get('site.final_url').slice(0, -1) + file : get('site.final_url') + file}</a></div>
                  )) : <div className="text-sm">No linked JavaScript files found.</div>}
                  <p className="text-xs opacity-50 uppercase pt-3">External JavaScript Files</p>
                  {Array.isArray(get('links.js_external')) && get('links.js_external').length > 0 ? get('links.js_external').map((file: string, i: number) => (
                    <div key={i} className="text-sm"><a href={file} target="_blank">{file}</a></div>
                  )) : <div className="text-sm">No external linked JavaScript files found.</div>}
                </div>
              </div>
            </div>
            {/* <div className="theme-card p-4">
          <div>
            <div className="cursor-pointer mono-font text-xs uppercase font-bold flex justify-between">
              <span>View Raw JSON Payload</span>
              <span>+</span>
            </div>
            <pre id="rawJson" className="mt-4 p-4 text-xs overflow-x-auto mono-font opacity-80 bg-opacity-10" style={{ backgroundColor: "rgba(0,0,0,0.05)" }}></pre>
          </div>
        </div> */}
          </div>
        )}
      </div>
      <div className="mt-12 opacity-70 text-bold text-sm mono-font text-center">
      </div>

    </div>
  )
}

export default App;
