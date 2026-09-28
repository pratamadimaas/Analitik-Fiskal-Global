import { useMemo, useState } from "react";
import { nf, KLASTER_WARNA, css } from "../lib/data";
import ChartBox, { axis } from "../components/ChartBox.jsx";
import { SectionHead } from "../components/Ui.jsx";
import Edukasi from "../components/Edukasi.jsx";

const IMPLIKASI = {
  0: "Biasanya dipicu pencetakan uang untuk menutup defisit, pelemahan mata uang yang menjalar ke harga impor, atau pencabutan subsidi mendadak. Efeknya berantai: daya beli anjlok, bank sentral terpaksa menaikkan suku bunga tinggi, dan biaya bunga utang pemerintah ikut membengkak, membentuk lingkaran yang sulit diputus tanpa disiplin fiskal dan moneter yang kredibel.",
  1: "Utang tinggi di klaster ini sebagian besar bisa bertahan karena faktor penopang: mata uang sendiri yang dipercaya pasar, basis investor domestik yang dalam (dana pensiun, bank lokal), dan suku bunga historis rendah. Ini pelajaran penting: angka rasio utang yang sama bisa aman untuk satu negara dan berbahaya untuk negara lain, tergantung siapa pemegang utangnya dan seberapa besar kepercayaan pasar.",
  2: "Disiplin fiskal ketat dan surplus neraca berjalan memberi ruang gerak besar saat krisis. Sisi lainnya, sebagian ekonom berargumen negara di klaster ini kadang terlalu konservatif, karena ruang fiskal yang nganggur bisa dipakai untuk investasi publik (pendidikan, infrastruktur) yang justru mendorong pertumbuhan jangka panjang.",
  3: "Defisit neraca berjalan di klaster ini umumnya bukan tanda bahaya, melainkan konsekuensi wajar ekonomi yang sedang mengejar ketertinggalan: mengimpor mesin dan bahan baku untuk investasi yang belum menghasilkan ekspor. Yang jadi penentu aman-tidaknya adalah komposisi pembiayaan: investasi langsung (FDI) jauh lebih stabil daripada utang portofolio jangka pendek yang bisa ditarik mendadak.",
};

export default function Klaster({ data, bukaNegara }) {
  const { klaster_info, pca_scatter, anomali } = data;
  const [klasterAktif, setKlasterAktif] = useState(null);

  const byCluster = useMemo(() => {
    const m = new Map();
    for (const p of pca_scatter) {
      if (!m.has(p.klaster)) m.set(p.klaster, []);
      m.get(p.klaster).push(p);
    }
    return m;
  }, [pca_scatter]);

  return (
    <div className="page">
      <section className="panel">
        <SectionHead title="Empat arketipe risiko fiskal" note="K-Means, dihitung dari 176 negara non-anomali, snapshot 2025" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
          {klaster_info.map((k) => (
            <div key={k.id} className="panel" style={{ borderLeft: `3px solid ${KLASTER_WARNA[k.id]}`, cursor: "pointer" }}
              onClick={() => setKlasterAktif(klasterAktif === k.id ? null : k.id)}>
              <div className="fine mono" style={{ color: KLASTER_WARNA[k.id], marginBottom: 4 }}>KLASTER {k.id}</div>
              <h3 style={{ fontSize: 16, fontStyle: "italic", marginBottom: 6 }}>{k.label}</h3>
              <p className="fine" style={{ marginBottom: 10 }}>{k.deskripsi}</p>
              <div className="entri-baris"><span className="fine">Anggota</span><b className="mono">{k.jumlah_negara} negara</b></div>
              <div className="entri-baris"><span className="fine">Rata-rata utang/PDB</span><b className="mono">{nf(k.rata2_debt_gdp, 1)}%</b></div>
              <div className="entri-baris"><span className="fine">Rata-rata pertumbuhan</span><b className="mono">{nf(k.rata2_pdb_growth, 1)}%</b></div>
              <div className="entri-baris"><span className="fine">Contoh</span><span className="fine" style={{ textAlign: "right" }}>{k.contoh_negara.slice(0, 3).join(", ")}</span></div>
              <p className="fine" style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border)" }}>{IMPLIKASI[k.id]}</p>
            </div>
          ))}
        </div>
      </section>

      <Edukasi title="Kenapa klasterisasi, bukan cuma diranking?">
        <p>
          Meranking 196 negara dari "terbaik" ke "terburuk" memaksa kita mengasumsikan satu ukuran keberhasilan yang sama
          untuk semua negara. Padahal negara maju dengan utang tinggi tapi mata uang kuat (Klaster 1) menghadapi risiko yang
          <i> berbeda jenis</i>, bukan cuma berbeda besar, dari negara berkembang yang tumbuh cepat sambil menanggung defisit
          neraca berjalan (Klaster 3). Klasterisasi mengelompokkan negara berdasarkan <b>pola gabungan</b> beberapa indikator
          sekaligus, sehingga perbandingan yang muncul lebih adil: negara dibandingkan dengan kelompok yang menghadapi
          persoalan sejenis, bukan dengan semua negara lain sekaligus.
        </p>
      </Edukasi>

      <section className="panel">
        <SectionHead title="Sebaran klaster (PCA 2 dimensi)" note="Tiap titik = satu negara. Klik legenda kartu di atas untuk sorot satu klaster." />
        <ChartBox
          label="Sebaran klaster PCA"
          height={420}
          deps={[klasterAktif]}
          make={() => ({
            type: "scatter",
            data: {
              datasets: klaster_info.map((k) => ({
                label: `${k.id}. ${k.label}`,
                data: (byCluster.get(k.id) || []).map((p) => ({ x: p.pc1, y: p.pc2, nama: p.nama })),
                backgroundColor: klasterAktif === null || klasterAktif === k.id ? KLASTER_WARNA[k.id] : "rgba(148,154,143,0.15)",
                pointRadius: klasterAktif === null || klasterAktif === k.id ? 4.5 : 3,
              })),
            },
            options: {
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "bottom", labels: { color: css("--text-secondary"), boxWidth: 10, font: { size: 10.5 } } },
                tooltip: { callbacks: { label: (c) => c.raw.nama } },
              },
              scales: { x: axis({ title: "Komponen utama 1" }), y: axis({ title: "Komponen utama 2" }) },
            },
          })}
        />
        <p className="fine" style={{ marginTop: 10 }}>
          Sumbu di grafik ini bukan indikator asli. Keduanya adalah "komponen utama" (PCA), ramuan tertimbang dari
          6 indikator fiskal yang paling banyak menjelaskan perbedaan antar negara. Yang penting dibaca bukan angka
          sumbunya, tapi <b>jarak dan pengelompokan</b>: titik yang berdekatan berarti profil fiskalnya mirip, titik yang
          jauh dari kerumunan berarti kombinasi indikatornya cukup unik dibanding negara lain.
        </p>
      </section>

      <section className="panel">
        <SectionHead title="Negara anomali statistik" note={`${anomali.length} negara di luar pola umum, dikeluarkan dari klasterisasi dan ditangani terpisah`} />
        <table className="ledger">
          <thead>
            <tr><th className="no">No.</th><th>Negara</th><th className="num">Utang/PDB</th><th className="num">Keseimbangan</th><th className="num">Neraca berjalan</th><th className="num">Inflasi</th><th className="num">Skor anomali</th></tr>
          </thead>
          <tbody>
            {anomali.map((a, i) => (
              <tr key={a.iso} onClick={() => bukaNegara(a.iso)}>
                <td className="no">{String(i + 1).padStart(2, "0")}</td>
                <td>{a.nama}</td>
                <td className="num">{nf(a.debt_gdp, 1)}%</td>
                <td className="num">{nf(a.net_lending_gdp, 1)}%</td>
                <td className="num">{nf(a.current_account_gdp, 1)}%</td>
                <td className="num">{nf(a.inflasi, 1)}%</td>
                <td className="num">{nf(a.skor_anomali, 2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="fine" style={{ marginTop: 10 }}>Dideteksi dengan Isolation Forest atas 6 indikator fiskal utama, kontaminasi 6%. Sebagian besar mencerminkan krisis riil (perang, hiperinflasi) sehingga masuk akal secara ekonomi, bukan kesalahan data.</p>
      </section>

      <Edukasi title="Anomali statistik ≠ negara buruk">
        <p>
          "Anomali" di sini murni istilah statistik: kombinasi indikator negara itu berbeda jauh dari mayoritas, bukan
          penilaian moral atau vonis "negara gagal". Sebagian anomali memang mencerminkan krisis nyata (Venezuela dengan
          inflasi ratusan persen, Sudan dan Ukraina dengan konflik bersenjata). Tapi sebagian lain justru anomali karena
          <b> terlalu sehat</b>. Kuwait dan Makau tercatat anomali karena surplus fiskal dan neraca berjalannya jauh di
          atas rata-rata dunia. Itu sebabnya negara-negara ini dikeluarkan dulu dari klasterisasi: kalau dibiarkan ikut,
          mereka akan menarik pusat klaster ke arah yang tidak mewakili pola umum negara lain.
        </p>
      </Edukasi>
    </div>
  );
}
