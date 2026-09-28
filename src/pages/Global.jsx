import { useMemo, useState } from "react";
import { nf } from "../lib/data";
import Globe3D from "../components/Globe3D.jsx";
import CariNegara from "../components/CariNegara.jsx";
import { SectionHead, Level, Select } from "../components/Ui.jsx";
import Edukasi from "../components/Edukasi.jsx";

const URUT = {
  skor_desc: { label: "Skor tertinggi dulu", fn: (a, b) => b.fvi_skor - a.fvi_skor },
  skor_asc: { label: "Skor terendah dulu", fn: (a, b) => a.fvi_skor - b.fvi_skor },
  nama: { label: "Nama negara (A-Z)", fn: (a, b) => a.nama.localeCompare(b.nama) },
};

export default function Global({ data, isoAktif, setIsoAktif }) {
  const { negaraDenganLevel, totalLevel, benuaList, tahunAcuan, anomaliSet } = data;
  const [benuaAktif, setBenuaAktif] = useState(null);
  const [levelAktif, setLevelAktif] = useState(null);
  const [urut, setUrut] = useState("skor_desc");

  const negaraFokus = data.negaraMap.get(isoAktif);
  const snapshotFokus = negaraFokus?.timeseries.find((t) => t.t === tahunAcuan);

  const totalNegara = totalLevel.Aman + totalLevel.Waspada + totalLevel.Siaga;

  const daftarTersaring = useMemo(
    () => [...negaraDenganLevel]
      .filter((n) => !benuaAktif || n.benua === benuaAktif)
      .filter((n) => !levelAktif || n.fvi_level === levelAktif)
      .sort(URUT[urut].fn),
    [negaraDenganLevel, benuaAktif, levelAktif, urut]
  );

  return (
    <div className="page">
      <div className="garis-statistik">
        <div className="item"><b>{data.meta.jumlah_negara}</b><span>Negara tercakup</span></div>
        <div className="item"><b className="tekan">{totalLevel.Siaga}</b><span>Status siaga</span></div>
        <div className="item"><b>{totalLevel.Waspada}</b><span>Status waspada</span></div>
        <div className="item"><b>{data.anomali.length}</b><span>Negara anomali statistik</span></div>
        <div className="item"><b>{tahunAcuan}</b><span>Snapshot data aktual</span></div>
      </div>

      <Edukasi title="Cara membaca peta ini">
        <p>
          Setiap negara diberi <b>skor kerentanan fiskal 0-100</b>, hasil gabungan empat indikator yang masing-masing
          punya cerita ekonominya sendiri:
        </p>
        <dl>
          <dt>Utang / PDB</dt>
          <dd>Bukan otomatis buruk kalau tinggi. Yang menentukan adalah kemampuan bayar: apakah ekonomi tumbuh lebih cepat dari bunga utangnya, dan siapa yang memegang utang itu (domestik biasanya lebih aman dari asing). Tapi utang tinggi mengurangi ruang gerak saat krisis datang.</dd>
          <dt>Keseimbangan fiskal</dt>
          <dd>Defisit terus-menerus berarti utang terus menumpuk. Defisit kecil masih bisa membuat rasio utang turun kalau pertumbuhan ekonomi cukup tinggi, mekanismenya dibahas di halaman Proyeksi.</dd>
          <dt>Neraca berjalan</dt>
          <dd>Defisit neraca berjalan berarti negara bergantung pada dana asing untuk menutup selisih ekspor-impornya. Sehat kalau dananya masuk sebagai investasi produktif (pabrik, infrastruktur), berisiko kalau cuma menutup konsumsi, karena dana asing bisa kabur cepat saat sentimen berubah ("sudden stop").</dd>
          <dt>Inflasi</dt>
          <dd>Inflasi tinggi menggerus daya beli masyarakat dan memaksa bank sentral menaikkan suku bunga, yang pada gilirannya memperberat beban bunga utang pemerintah sendiri.</dd>
        </dl>
        <p style={{ marginTop: 10 }}>
          Skor dihitung <b>relatif terhadap negara lain di tahun yang sama</b>, bukan angka mutlak. Alasannya: "utang 80% PDB"
          punya arti berbeda untuk Jepang (mayoritas dipegang investor domestik, suku bunga nyaris nol) dibanding negara
          berkembang yang banyak berutang dalam dolar. Membandingkan lintas negara pada waktu yang sama membuat penilaian lebih adil.
        </p>
      </Edukasi>

      <section className="panel" style={{ padding: 0 }}>
        <div style={{ padding: "16px 22px 0" }}>
          <SectionHead title="Peta kerentanan fiskal dunia" note="Cari negara, klik titik di globe, atau pilih dari tabel di bawah." />
        </div>
        <div className="filters" style={{ padding: "0 22px 14px", alignItems: "flex-end" }}>
          <label className="field" style={{ minWidth: 240 }}>
            <span>Cari negara</span>
            <CariNegara negara={negaraDenganLevel} onPilih={setIsoAktif} />
          </label>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span className="fine" style={{ textTransform: "uppercase", letterSpacing: "0.06em", fontSize: 11 }}>Benua</span>
            <div className="chip-row">
              <span className={`chip-benua ${!benuaAktif ? "on" : ""}`} onClick={() => setBenuaAktif(null)}>Semua</span>
              {benuaList.map((b) => (
                <span key={b} className={`chip-benua ${benuaAktif === b ? "on" : ""}`} onClick={() => setBenuaAktif(b === benuaAktif ? null : b)}>{b}</span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span className="fine" style={{ textTransform: "uppercase", letterSpacing: "0.06em", fontSize: 11 }}>Status</span>
            <div className="chip-row">
              {["Aman", "Waspada", "Siaga"].map((lv) => (
                <span key={lv} className={`chip-benua ${levelAktif === lv ? "on" : ""}`} onClick={() => setLevelAktif(lv === levelAktif ? null : lv)}>{lv}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="globe-wrap">
          <div className="globe-hud">
            LAT/LON GRID &middot; <b>{daftarTersaring.length}</b> / {negaraDenganLevel.length} TITIK TAMPIL<br />
            SUMBER: IMF WEO APRIL 2026
          </div>
          <Globe3D negara={daftarTersaring} benuaAktif={benuaAktif} onKlik={setIsoAktif} fokusIso={isoAktif} tinggi={480} />
          <div className="globe-legend">
            <span><i style={{ background: "#0a8a4d" }}></i>Aman</span>
            <span><i style={{ background: "#b25e09" }}></i>Waspada</span>
            <span><i style={{ background: "#c22b3d" }}></i>Siaga</span>
          </div>
          {negaraFokus && snapshotFokus && (
            <div className="kartu-negara">
              <button className="tutup" onClick={() => setIsoAktif(null)}>&times;</button>
              <div className="judul">
                <h3>{negaraFokus.nama}</h3>
                <Level level={snapshotFokus.fvi_level} />
              </div>
              <div className="baris"><span>Benua</span><span>{negaraFokus.benua}</span></div>
              <div className="baris"><span>Skor kerentanan</span><span>{nf(snapshotFokus.fvi_skor, 1)} / 100</span></div>
              <div className="baris"><span>Utang / PDB</span><span>{nf(snapshotFokus.debt_gdp, 1)}%</span></div>
              <div className="baris"><span>Keseimbangan fiskal</span><span>{nf(snapshotFokus.net_lending_gdp, 1)}%</span></div>
              <div className="baris"><span>Neraca berjalan</span><span>{nf(snapshotFokus.current_account_gdp, 1)}%</span></div>
              <div className="baris"><span>Inflasi</span><span>{nf(snapshotFokus.inflasi, 1)}%</span></div>
              {anomaliSet.has(isoAktif) && <p className="fine" style={{ marginTop: 8, color: "var(--danger)" }}>Terdeteksi sebagai anomali statistik, lihat tab Klaster Risiko.</p>}
            </div>
          )}
        </div>
      </section>

      <section className="panel">
        <SectionHead title="Daftar negara" note={`Menampilkan ${Math.min(30, daftarTersaring.length)} dari ${daftarTersaring.length} negara tersaring (total ${totalNegara})`}>
          <div className="legenda-level">
            <span className="Siaga">&#9632; Siaga <b>{totalLevel.Siaga}</b></span>
            <span className="Waspada">&#9632; Waspada <b>{totalLevel.Waspada}</b></span>
            <span className="Aman">&#9632; Aman <b>{totalLevel.Aman}</b></span>
          </div>
        </SectionHead>
        <div className="filters" style={{ marginBottom: 14 }}>
          <Select label="Urutkan" value={urut} onChange={setUrut} options={Object.keys(URUT)} labels={Object.fromEntries(Object.entries(URUT).map(([k, v]) => [k, v.label]))} />
        </div>
        <table className="ledger">
          <thead>
            <tr><th className="no">No.</th><th>Negara</th><th>Benua</th><th className="num">Utang/PDB</th><th className="num">Keseimbangan</th><th className="num">Skor</th><th>Status</th></tr>
          </thead>
          <tbody>
            {daftarTersaring.slice(0, 30).map((n, i) => (
              <tr key={n.iso} className={n.iso === isoAktif ? "aktif" : ""} onClick={() => setIsoAktif(n.iso)}>
                <td className="no">{String(i + 1).padStart(2, "0")}</td>
                <td>{n.nama}</td>
                <td className="fine">{n.benua}</td>
                <td className="num">{nf(n.snapshot.debt_gdp, 1)}%</td>
                <td className="num">{nf(n.snapshot.net_lending_gdp, 1)}%</td>
                <td className="num">{nf(n.fvi_skor, 1)}</td>
                <td><Level level={n.fvi_level} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
