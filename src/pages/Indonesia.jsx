import { useMemo, useState } from "react";
import { nf, css } from "../lib/data";
import ChartBox, { axis } from "../components/ChartBox.jsx";
import { SectionHead, Level } from "../components/Ui.jsx";
import Edukasi from "../components/Edukasi.jsx";

const WARNA_PEER = ["#2f6fb0", "#0a8a4d", "#c22b3d", "#8b5cf6", "#c2760a", "#2ba39a", "#6366f1", "#d1478f"];

export default function Indonesia({ data }) {
  const { peer_indonesia, tahunAcuan } = data;
  const [grup, setGrup] = useState("asean");

  const idn = peer_indonesia.find((p) => p.iso === "IDN");
  const daftar = useMemo(
    () => peer_indonesia.filter((p) => (grup === "asean" ? p.grup_asean : p.grup_em)),
    [peer_indonesia, grup]
  );

  const ringkasan2025 = daftar
    .map((p) => ({ ...p, snap: p.timeseries.find((t) => t.t === tahunAcuan) }))
    .filter((p) => p.snap)
    .sort((a, b) => a.snap.fvi_skor - b.snap.fvi_skor);

  const peringkat = ringkasan2025.findIndex((p) => p.iso === "IDN") + 1;

  return (
    <div className="page">
      <div className="garis-statistik">
        <div className="item"><b>#{peringkat}</b><span>Peringkat teraman dari {ringkasan2025.length} peer</span></div>
        <div className="item"><b>{nf(idn?.timeseries.find(t=>t.t===tahunAcuan)?.fvi_skor,1)}</b><span>Skor kerentanan {tahunAcuan}</span></div>
        <div className="item"><b>{nf(idn?.timeseries.find(t=>t.t===tahunAcuan)?.debt_gdp,1)}%</b><span>Utang / PDB</span></div>
        <div className="item"><b>{nf(idn?.timeseries.find(t=>t.t===tahunAcuan)?.pdb_growth,1)}%</b><span>Pertumbuhan PDB</span></div>
      </div>

      <section className="panel">
        <SectionHead title="Indonesia dibanding negara peer" note="Data aktual 2025, diurutkan dari yang paling aman">
          <div className="tab-inline" style={{ marginBottom: 0, border: "none" }}>
            <button className={grup === "asean" ? "on" : ""} onClick={() => setGrup("asean")}>ASEAN</button>
            <button className={grup === "em" ? "on" : ""} onClick={() => setGrup("em")}>Emerging market G20</button>
          </div>
        </SectionHead>
        <table className="ledger">
          <thead>
            <tr><th className="no">No.</th><th>Negara</th><th className="num">Utang/PDB</th><th className="num">Keseimbangan</th><th className="num">Neraca berjalan</th><th className="num">Skor</th><th>Status</th></tr>
          </thead>
          <tbody>
            {ringkasan2025.map((p, i) => (
              <tr key={p.iso} className={p.iso === "IDN" ? "aktif" : ""}>
                <td className="no">{String(i + 1).padStart(2, "0")}</td>
                <td>{p.nama}{p.iso === "IDN" && <b style={{ color: "var(--accent)" }}> &larr; kita</b>}</td>
                <td className="num">{nf(p.snap.debt_gdp, 1)}%</td>
                <td className="num">{nf(p.snap.net_lending_gdp, 1)}%</td>
                <td className="num">{nf(p.snap.current_account_gdp, 1)}%</td>
                <td className="num">{nf(p.snap.fvi_skor, 1)}</td>
                <td><Level level={p.snap.fvi_level} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="fine" style={{ marginTop: 10 }}>
          Posisi aman Indonesia bukan kebetulan: UU Keuangan Negara mewajibkan defisit APBN tidak melebihi 3% PDB dan
          utang pemerintah tidak melebihi 60% PDB, aturan yang lebih ketat dari kebanyakan negara berkembang lain
          di daftar ini. Kombinasi disiplin fiskal itu dengan pertumbuhan ekonomi yang konsisten di atas 5% adalah alasan
          utama skor kerentanan Indonesia tetap rendah dibanding tetangganya.
        </p>
      </section>

      <Edukasi title='Kenapa Singapura tampak "Waspada"?'>
        <p>
          Rasio utang bruto Singapura (~171% PDB) terlihat mengkhawatirkan di atas kertas, tapi angka itu menyesatkan kalau
          dibaca sama seperti negara lain. Sebagian besar utang itu adalah <b>Singapore Government Securities</b> yang
          diterbitkan bukan untuk membiayai defisit, melainkan untuk kebutuhan pasar modal domestik dan dana pensiun wajib
          (CPF), dan pemerintah Singapura punya aset & cadangan yang jauh melebihi utangnya (Net Lending justru
          <b> positif</b> +4,2% PDB, artinya negara ini sebenarnya menabung, bukan berutang neto). Ini contoh nyata kenapa
          rasio utang bruto saja tidak cukup untuk menilai kesehatan fiskal. Perlu dilihat juga utang neto, komposisi
          pemegang utang, dan aset yang menopangnya.
        </p>
      </Edukasi>

      <section className="panel">
        <SectionHead title="Tren skor kerentanan 2016-2030" note="Garis putus = proyeksi resmi IMF" />
        <ChartBox
          label="Tren skor kerentanan fiskal"
          height={340}
          deps={[grup]}
          make={() => {
            const datasets = daftar.map((p, i) => {
              const hist = p.timeseries.filter((t) => !t.proyeksi_imf);
              const fc = p.timeseries.filter((t) => t.proyeksi_imf);
              const labels = p.timeseries.map((t) => t.t);
              const dataHist = [...hist.map((t) => t.fvi_skor), ...Array(fc.length).fill(null)];
              const dataFc = [...Array(hist.length - 1).fill(null), hist[hist.length - 1]?.fvi_skor, ...fc.map((t) => t.fvi_skor)];
              const isIdn = p.iso === "IDN";
              return [
                { label: p.nama, data: dataHist, borderColor: isIdn ? "#4338ca" : WARNA_PEER[i % WARNA_PEER.length], backgroundColor: "transparent", borderWidth: isIdn ? 3 : 1.4, pointRadius: 0, tension: 0.15 },
                { label: `${p.nama} (proyeksi)`, data: dataFc, borderColor: isIdn ? "#4338ca" : WARNA_PEER[i % WARNA_PEER.length], backgroundColor: "transparent", borderWidth: isIdn ? 3 : 1.4, borderDash: [4, 3], pointRadius: 0, tension: 0.15 },
              ];
            }).flat();
            const labels = daftar[0]?.timeseries.map((t) => t.t) || [];
            return {
              type: "line",
              data: { labels, datasets },
              options: {
                maintainAspectRatio: false,
                interaction: { mode: "index", intersect: false },
                plugins: {
                  legend: { position: "bottom", labels: { color: css("--text-secondary"), boxWidth: 10, font: { size: 10 }, filter: (item) => !item.text.includes("(proyeksi)") } },
                },
                scales: { x: axis({ grid: false, ticks: { maxTicksLimit: 8 } }), y: axis({ title: "Skor kerentanan (0-100)" }) },
              },
            };
          }}
        />
        <p className="fine" style={{ marginTop: 10 }}>Skor dihitung relatif terhadap 196 negara tiap tahun, jadi kenaikan skor peer lain juga bisa menggeser posisi relatif Indonesia meski indikator domestik tidak berubah banyak.</p>
      </section>

      <Edukasi title="Membaca lonjakan tahun 2020">
        <p>
          Hampir semua garis di grafik di atas melonjak tajam sekitar 2020, itu pandemi COVID-19, bukan kesalahan
          data. Penerimaan negara anjlok karena aktivitas ekonomi terhenti, sementara belanja untuk bantuan sosial dan
          kesehatan melonjak, membuat defisit dan rasio utang banyak negara naik drastis dalam waktu singkat. Yang
          membedakan negara satu dengan lain bukan apakah mengalami lonjakan itu (hampir semua mengalami), tapi
          <b> seberapa cepat mereka pulih</b> sesudahnya, dan di situlah disiplin fiskal jangka panjang teruji.
        </p>
      </Edukasi>
    </div>
  );
}
