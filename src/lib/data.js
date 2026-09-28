import { useEffect, useState } from "react";

export const DATA_URL = "/fiskal_dashboard.json";

export const nf = (v, d = 0) =>
  v == null || Number.isNaN(v)
    ? "-"
    : Number(v).toLocaleString("id-ID", { minimumFractionDigits: d, maximumFractionDigits: d });

export const LEVEL_WARNA = { Aman: "#0a8a4d", Waspada: "#b25e09", Siaga: "#c22b3d" };
export const KLASTER_WARNA = ["#2f6fb0", "#4338ca", "#0a8a4d", "#c22b3d"];

export const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

function olah(raw) {
  const { meta, negara, klaster_info, pca_scatter, anomali, ekonometrika, ml_forecast_meta, peer_indonesia } = raw;

  const negaraMap = new Map(negara.map((n) => [n.iso, n]));
  const anomaliSet = new Set(anomali.map((a) => a.iso));

  // level tahun terakhir (2025 aktual) tiap negara, utk globe & ringkasan
  const tahunAcuan = meta.tanggal_data_terakhir_aktual;
  const totalLevel = { Aman: 0, Waspada: 0, Siaga: 0 };
  const negaraDenganLevel = [];
  for (const n of negara) {
    const ts = n.timeseries.find((t) => t.t === tahunAcuan);
    if (ts?.fvi_level) {
      totalLevel[ts.fvi_level] = (totalLevel[ts.fvi_level] || 0) + 1;
      negaraDenganLevel.push({ ...n, fvi_skor: ts.fvi_skor, fvi_level: ts.fvi_level, snapshot: ts });
    }
  }

  const benuaList = [...new Set(negara.map((n) => n.benua))].sort();

  return {
    meta, negara, negaraMap, klaster_info, pca_scatter, anomali, anomaliSet,
    ekonometrika, ml_forecast_meta, peer_indonesia, totalLevel, negaraDenganLevel,
    benuaList, tahunAcuan,
  };
}

export function useData() {
  const [state, setState] = useState({ status: "loading" });
  useEffect(() => {
    let batal = false;
    fetch(DATA_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`File ${DATA_URL} tidak ditemukan (status ${r.status})`);
        return r.json();
      })
      .then((raw) => { if (!batal) setState({ status: "ready", data: olah(raw) }); })
      .catch((e) => { if (!batal) setState({ status: "error", error: e.message }); });
    return () => { batal = true; };
  }, []);
  return state;
}
