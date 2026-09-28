import { nf } from "../lib/data";
import { SectionHead } from "../components/Ui.jsx";

const GLOSARIUM = [
  ["Utang / PDB", "Total utang pemerintah dibagi total nilai ekonomi setahun (PDB). Ukuran seberapa besar beban utang dibanding kemampuan ekonomi menanggungnya, bukan ukuran apakah utang itu \"banyak\" secara nominal."],
  ["Keseimbangan fiskal (Net Lending)", "Selisih penerimaan dan belanja pemerintah dalam setahun. Negatif = defisit (belanja lebih besar, pemerintah menambah utang baru), positif = surplus (pemerintah menabung)."],
  ["Neraca berjalan (Current Account)", "Selisih ekspor dan impor barang/jasa plus pendapatan investasi dari/ke luar negeri. Defisit berarti negara net menerima dana dari luar negeri untuk menutup selisih itu."],
  ["Panel fixed-effects", "Teknik regresi yang membandingkan perubahan dalam satu negara dari waktu ke waktu (bukan sekadar membandingkan negara satu dengan lainnya secara mentah), sehingga karakteristik unik tiap negara dan tren global tiap tahun yang tidak berubah otomatis \"dikontrol\" (disingkirkan pengaruhnya) dari hasil."],
  ["p-value & signifikansi", "Ukuran seberapa besar kemungkinan suatu pola muncul cuma karena kebetulan acak. p-value di bawah 0,05 secara konvensi dianggap \"signifikan\", artinya polanya cukup kuat untuk dipercaya bukan kebetulan. Di atas itu, hasilnya belum cukup meyakinkan untuk disimpulkan sebagai pola nyata."],
  ["Z-score & persentil", "Z-score mengukur seberapa jauh nilai suatu negara dari rata-rata dunia (dalam satuan standar deviasi). Persentil mengurutkan semua negara dari terendah ke tertinggi dan menyatakan posisi suatu negara sebagai persen, sehingga skor 80 berarti negara itu lebih \"tertekan\" dibanding 80% negara lain."],
  ["MAE (Mean Absolute Error)", "Rata-rata selisih mutlak antara prediksi model dan angka realisasi sebenarnya, dalam satuan yang sama dengan datanya (poin persentase). Semakin kecil, semakin akurat."],
  ["Isolation Forest", "Algoritma machine learning yang mendeteksi data \"ganjil\" dengan mengukur seberapa mudah suatu titik data terpisah dari titik-titik lain lewat pembelahan acak berulang. Titik yang gampang terisolasi dianggap anomali."],
  ["PCA (Principal Component Analysis)", "Teknik meringkas banyak indikator (di sini 6 indikator fiskal) menjadi 2 sumbu baru yang paling banyak menangkap perbedaan antar negara, supaya bisa digambar dalam satu grafik 2 dimensi tanpa kehilangan terlalu banyak informasi."],
];

function TabelParam({ parameter }) {
  return (
    <table className="ledger" style={{ marginTop: 10 }}>
      <thead><tr><th>Variabel</th><th className="num">Koefisien</th><th className="num">t-stat</th><th className="num">p-value</th><th>Signifikan (5%)</th></tr></thead>
      <tbody>
        {parameter.map((p) => (
          <tr key={p.variabel} style={{ cursor: "default" }}>
            <td className="mono">{p.variabel}</td>
            <td className="num">{nf(p.koefisien, 4)}</td>
            <td className="num">{nf(p.t_stat, 2)}</td>
            <td className="num">{nf(p.p_value, 4)}</td>
            <td>{p.signifikan_5persen ? "Ya" : "Tidak"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Metodologi({ data }) {
  const { ekonometrika, meta } = data;
  const m1 = ekonometrika.model_1_fiscal_reaction_function;
  const m2 = ekonometrika.model_2_ambang_utang_pertumbuhan;

  return (
    <div className="page">
      <section className="panel">
        <SectionHead title="Sumber data" />
        <ul style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <li className="fine">{meta.sumber_data}: {meta.jumlah_negara} negara, {meta.tahun_aktual[0]} sampai {meta.tahun_aktual.at(-1)} aktual, {meta.tahun_proyeksi_imf[0]} sampai {meta.tahun_proyeksi_imf.at(-1)} proyeksi resmi IMF.</li>
          <li className="fine">Koordinat &amp; benua negara: klasifikasi ISO3 (pycountry-convert) + tabel centroid negara publik, di-embed langsung ke pipeline.</li>
        </ul>
      </section>

      <section className="panel">
        <SectionHead title="Istilah kunci" note="Untuk pembaca yang bukan berlatar belakang ekonomi/statistik" />
        <table className="ledger">
          <thead><tr><th style={{ width: 220 }}>Istilah</th><th>Penjelasan</th></tr></thead>
          <tbody>
            {GLOSARIUM.map(([istilah, penjelasan]) => (
              <tr key={istilah} style={{ cursor: "default" }}>
                <td><b>{istilah}</b></td>
                <td className="fine">{penjelasan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel">
        <SectionHead title="Indeks Kerentanan Fiskal (Early Warning)" />
        <p className="fine">Komposit 4 pilar, dihitung sebagai z-score lintas negara pada tahun yang sama (cross-sectional), lalu diskalakan ke persentil 0-100:</p>
        <table className="ledger" style={{ marginTop: 10 }}>
          <thead><tr><th>Pilar</th><th className="num">Bobot</th><th>Arah buruk</th></tr></thead>
          <tbody>
            <tr style={{ cursor: "default" }}><td>Beban utang (Debt/PDB)</td><td className="num">35%</td><td className="fine">makin tinggi</td></tr>
            <tr style={{ cursor: "default" }}><td>Keseimbangan fiskal (Net Lending)</td><td className="num">30%</td><td className="fine">makin defisit</td></tr>
            <tr style={{ cursor: "default" }}><td>Neraca berjalan (Current Account)</td><td className="num">20%</td><td className="fine">makin defisit</td></tr>
            <tr style={{ cursor: "default" }}><td>Inflasi (CPI)</td><td className="num">15%</td><td className="fine">makin tinggi</td></tr>
          </tbody>
        </table>
        <p className="fine" style={{ marginTop: 10 }}>Tingkatan: <b>Aman</b> (skor &lt;55), <b>Waspada</b> (55 sampai 79), <b>Siaga</b> (&ge;80, top ~20% dunia).</p>
      </section>

      <section className="panel">
        <SectionHead title="Model ekonometrika 1: Fiscal Reaction Function" note={`n=${m1.n_observasi}, ${m1.n_negara} negara, panel fixed-effects (entitas+tahun)`} />
        <p className="fine">{m1.deskripsi}</p>
        <TabelParam parameter={m1.parameter} />
        <p className="catatan-kaki" style={{ marginTop: 12 }}>{m1.interpretasi}</p>
      </section>

      <section className="panel">
        <SectionHead title="Model ekonometrika 2: Uji ambang utang-pertumbuhan" note={`n=${m2.n_observasi}, panel fixed-effects`} />
        <p className="fine">{m2.deskripsi}</p>
        <TabelParam parameter={m2.parameter} />
        <p className="catatan-kaki" style={{ marginTop: 12 }}>{m2.interpretasi}</p>
      </section>

      <section className="panel">
        <SectionHead title="Machine learning" />
        <p className="fine"><b>Deteksi anomali:</b> Isolation Forest, 6 indikator fiskal utama, kontaminasi 6%, dijalankan sebelum klasterisasi supaya outlier ekstrem (krisis, hiperinflasi) tidak mendominasi kelompok.</p>
        <p className="fine" style={{ marginTop: 8 }}><b>Klasterisasi:</b> K-Means (k=4, dipilih dari silhouette score) atas negara non-anomali, fitur distandarkan, divisualisasikan lewat PCA 2 dimensi.</p>
        <p className="fine" style={{ marginTop: 8 }}><b>Forecasting lanjutan:</b> {data.ml_forecast_meta.metode}</p>
      </section>

      <section className="panel">
        <SectionHead title="Kenapa indikator early warning ini berguna" />
        <p className="fine">
          Krisis fiskal jarang datang tiba-tiba tanpa jejak. Biasanya didahului kombinasi utang yang menumpuk, defisit
          yang melebar, dan ketergantungan pada dana asing yang makin besar, jauh sebelum krisis benar-benar meletus.
          Masalahnya, satu indikator saja gampang menyesatkan (utang tinggi bisa aman atau berbahaya tergantung konteks,
          seperti dibahas di halaman Indonesia). Indeks komposit yang menggabungkan beberapa sinyal sekaligus, dipadu
          klasterisasi untuk konteks pembanding yang tepat, memberi gambaran lebih lengkap untuk mendukung keputusan
          kebijakan, semisal kapan perlu memperketat defisit, kapan ruang fiskal masih aman untuk stimulus, atau negara
          peer mana yang polanya relevan untuk dipelajari.
        </p>
      </section>

      <section className="panel">
        <SectionHead title="Batasan & asumsi" />
        <p className="fine">Skor kerentanan bersifat relatif terhadap negara lain pada tahun yang sama, bukan probabilitas krisis. Perpanjangan ML 2031 sampai 2035 mengasumsikan pola historis berlanjut dan tidak memperhitungkan guncangan tak terduga. Beberapa negara (mis. Singapura) punya struktur neraca khas yang membuat rasio utang headline kurang sebanding langsung dengan negara lain. Ini prototipe analisis, bukan alat operasional resmi.</p>
      </section>
    </div>
  );
}
