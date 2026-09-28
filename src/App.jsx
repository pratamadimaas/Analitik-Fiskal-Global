import { useState } from "react";
import { useData } from "./lib/data";
import Global from "./pages/Global.jsx";
import Klaster from "./pages/Klaster.jsx";
import Indonesia from "./pages/Indonesia.jsx";
import Proyeksi from "./pages/Proyeksi.jsx";
import Metodologi from "./pages/Metodologi.jsx";

const TAB = [
  { key: "global", label: "Peta Global" },
  { key: "klaster", label: "Klaster Risiko" },
  { key: "indonesia", label: "Indonesia" },
  { key: "proyeksi", label: "Proyeksi" },
  { key: "metodologi", label: "Metodologi" },
];

export default function App() {
  const state = useData();
  const [tab, setTab] = useState("global");
  const [isoAktif, setIsoAktif] = useState("IDN");

  if (state.status === "loading") return <div className="loading">Memuat data&hellip;</div>;
  if (state.status === "error") return <div className="error">Gagal memuat data: {state.error}</div>;

  const { data } = state;

  const bukaNegara = (iso) => { setIsoAktif(iso); if (tab !== "global") setTab("global"); };

  return (
    <>
      <header className="kop">
        <div className="kop-baris1">
          <div className="kop-judul">
            <span className="eyebrow">Analitik Fiskal Global <span className="folio">Live</span></span>
            <h1>{data.meta.judul}</h1>
            <div className="sub">{data.meta.subjudul}</div>
          </div>
          <div className="kop-kontrol">
            <div className="sel"><span>Cakupan</span><b>{data.meta.jumlah_negara} negara</b></div>
            <div className="sel"><span>Data s.d.</span><b>{data.meta.tanggal_data_terakhir_aktual}</b></div>
            <div className="sel"><span>Proyeksi</span><b>s.d. {Math.max(...data.meta.tahun_proyeksi_ml)}</b></div>
          </div>
        </div>
        <nav className="tab-bar">
          {TAB.map((t) => (
            <button key={t.key} className={tab === t.key ? "on" : ""} onClick={() => setTab(t.key)}>{t.label}</button>
          ))}
        </nav>
      </header>
      <main>
        {tab === "global" && <Global data={data} isoAktif={isoAktif} setIsoAktif={setIsoAktif} />}
        {tab === "klaster" && <Klaster data={data} bukaNegara={bukaNegara} />}
        {tab === "indonesia" && <Indonesia data={data} />}
        {tab === "proyeksi" && <Proyeksi data={data} isoAktif={isoAktif} setIsoAktif={setIsoAktif} />}
        {tab === "metodologi" && <Metodologi data={data} />}
      </main>
    </>
  );
}
