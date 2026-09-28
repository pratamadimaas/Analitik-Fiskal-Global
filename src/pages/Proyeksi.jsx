import { useState } from "react";
import { nf, css } from "../lib/data";
import ChartBox, { axis } from "../components/ChartBox.jsx";
import { SectionHead, Select } from "../components/Ui.jsx";
import Edukasi from "../components/Edukasi.jsx";

const INDIKATOR = {
  debt_gdp: { label: "Utang / PDB", satuan: "%" },
  pdb_growth: { label: "Pertumbuhan PDB riil", satuan: "%" },
  inflasi: { label: "Inflasi (CPI)", satuan: "%" },
};

export default function Proyeksi({ data, isoAktif, setIsoAktif }) {
  const { negara, ml_forecast_meta, meta } = data;
  const [indikator, setIndikator] = useState("debt_gdp");
  const namaOpsi = Object.fromEntries(negara.map((n) => [n.iso, n.nama]));
  const opsiIso = negara.map((n) => n.iso).sort((a, b) => namaOpsi[a].localeCompare(namaOpsi[b]));

  const n = data.negaraMap.get(isoAktif) || data.negaraMap.get("IDN");
  const mae = ml_forecast_meta.validasi_holdout;
  const maeKey = { debt_gdp: "mae_rata2_debt_gdp_pp", pdb_growth: "mae_rata2_pdb_growth_pp", inflasi: "mae_rata2_inflasi_pp" }[indikator];

  return (
    <div className="page">
      <div className="filters">
        <Select label="Negara" value={n.iso} onChange={setIsoAktif} options={opsiIso} labels={namaOpsi} />
        <Select label="Indikator" value={indikator} onChange={setIndikator} options={Object.keys(INDIKATOR)} labels={Object.fromEntries(Object.entries(INDIKATOR).map(([k, v]) => [k, v.label]))} />
      </div>

      <section className="panel">
        <SectionHead title={`${INDIKATOR[indikator].label}: ${n.nama}`} note="Solid = aktual, putus kuningan = proyeksi resmi IMF, putus abu = perpanjangan ML" />
        <ChartBox
          label="Historis dan proyeksi"
          height={360}
          deps={[n.iso, indikator]}
          make={() => {
            const hist = n.timeseries.filter((t) => !t.proyeksi_imf);
            const imf = n.timeseries.filter((t) => t.proyeksi_imf);
            const ml = n.forecast_ml;
            const labels = [...hist.map((t) => t.t), ...imf.map((t) => t.t), ...ml.map((t) => t.t)];
            const dataHist = [...hist.map((t) => t[indikator]), ...Array(imf.length + ml.length).fill(null)];
            const dataImf = [...Array(hist.length - 1).fill(null), hist[hist.length - 1]?.[indikator], ...imf.map((t) => t[indikator]), ...Array(ml.length).fill(null)];
            const dataMl = [...Array(hist.length + imf.length - 1).fill(null), imf[imf.length - 1]?.[indikator], ...ml.map((t) => t[indikator])];
            return {
              type: "line",
              data: {
                labels,
                datasets: [
                  { label: "Aktual", data: dataHist, borderColor: css("--text"), backgroundColor: "transparent", borderWidth: 2, pointRadius: 0, tension: 0.15 },
                  { label: "Proyeksi IMF", data: dataImf, borderColor: css("--accent"), backgroundColor: "transparent", borderWidth: 2, borderDash: [4, 3], pointRadius: 0, tension: 0.15 },
                  { label: "Perpanjangan ML", data: dataMl, borderColor: css("--info"), backgroundColor: "transparent", borderWidth: 2, borderDash: [2, 3], pointRadius: 0, tension: 0.15 },
                ],
              },
              options: {
                maintainAspectRatio: false,
                interaction: { mode: "index", intersect: false },
                plugins: { legend: { position: "bottom", labels: { color: css("--text-secondary"), boxWidth: 10, font: { size: 11 } } } },
                scales: { x: axis({ grid: false, ticks: { maxTicksLimit: 10 } }), y: axis({ title: `${INDIKATOR[indikator].label} (${INDIKATOR[indikator].satuan})` }) },
              },
            };
          }}
        />
      </section>

      <Edukasi title="Kenapa utang bisa turun sendiri tanpa dilunasi">
        <p>
          Rasio utang/PDB bergerak menurut aturan sederhana: naik kalau pemerintah defisit (belanja lebih besar dari
          penerimaan), dan naik-turunnya juga ditentukan oleh <b>selisih antara suku bunga utang dan pertumbuhan ekonomi</b>
          (dikenal sebagai <span className="mono">r &minus; g</span>). Kalau ekonomi tumbuh lebih cepat dari bunga yang
          dibayar, PDB "menyusul" tumpukan utang sehingga rasionya mengecil dengan sendirinya, tanpa pemerintah
          perlu melunasi sepeser pun.
        </p>
        <p>
          Ini kenapa Indonesia dengan pertumbuhan ~5% bisa menjaga rasio utangnya stabil di sekitar 40% meski tetap
          defisit tiap tahun, sementara Jepang menanggung utang &gt;200% PDB tapi tidak kolaps karena suku bunga
          obligasinya nyaris nol dan mayoritas pemegang utangnya investor domestik (bank &amp; dana pensiun Jepang
          sendiri), bukan investor asing yang bisa panik dan menarik dana sewaktu-waktu. Dua negara, dua rasio utang yang
          jauh berbeda, dua cerita risiko yang sama sekali berbeda pula.
        </p>
      </Edukasi>

      <section className="panel">
        <SectionHead title="Akurasi model perpanjangan ML" note="Validasi holdout: latih s.d. 2023, uji prediksi 2025 vs realisasi" />
        <div className="split equal">
          <div>
            <div className="angka-besar">{nf(mae[maeKey], 2)}</div>
            <span className="fine">MAE rata-rata (poin persentase) untuk {INDIKATOR[indikator].label}</span>
          </div>
          <p className="fine">{mae.catatan}</p>
        </div>
        <p className="catatan-kaki" style={{ marginTop: 14 }}>{ml_forecast_meta.metode}</p>
      </section>

      <Edukasi title="Batas wajar model perpanjangan ini">
        <p>
          Model machine learning ini belajar dari pola historis 2016-2025 dan proyeksi resmi IMF 2026-2030, lalu
          mengekstrapolasi pola itu ke 2031-2035. Ini masuk akal untuk kondisi "normal", tapi model apa pun,
          termasuk ini, <b>tidak bisa memprediksi guncangan tak terduga</b>: pandemi baru, konflik geopolitik, krisis
          finansial global, atau perubahan kebijakan mendadak. Makin jauh proyeksinya (2035 lebih tidak pasti daripada
          2031), makin besar pula kemungkinan selisihnya dari realisasi. Perlakukan garis putus-putus biru sebagai
          "kalau tren berlanjut", bukan ramalan pasti.
        </p>
      </Edukasi>
    </div>
  );
}
