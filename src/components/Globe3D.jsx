import { useEffect, useMemo, useRef, useState } from "react";
import Globe from "react-globe.gl";
import { LEVEL_WARNA } from "../lib/data";

function useLebarWadah() {
  const ref = useRef(null);
  const [lebar, setLebar] = useState(800);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect?.width;
      if (w) setLebar(w);
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, lebar];
}

// Tekstur globe dibuat sendiri di canvas (grid lintang/bujur), bukan citra
// bumi fotografis dari CDN luar, supaya tidak bergantung aset eksternal dan
// warnanya konsisten dengan aksen indigo dashboard.
function buatTeksturGrid() {
  const w = 1024, h = 512;
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#0d1117";
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "rgba(124,141,251,0.16)";
  ctx.lineWidth = 1;
  for (let lon = 0; lon <= w; lon += w / 12) {
    ctx.beginPath(); ctx.moveTo(lon, 0); ctx.lineTo(lon, h); ctx.stroke();
  }
  for (let lat = 0; lat <= h; lat += h / 8) {
    ctx.beginPath(); ctx.moveTo(0, lat); ctx.lineTo(w, lat); ctx.stroke();
  }
  ctx.strokeStyle = "rgba(124,141,251,0.32)";
  ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke(); // ekuator
  ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.stroke(); // meridian utama

  return c.toDataURL();
}

export default function Globe3D({ negara, benuaAktif, onKlik, fokusIso, tinggi = 480 }) {
  const globeRef = useRef();
  const texture = useMemo(buatTeksturGrid, []);
  const [wadahRef, lebar] = useLebarWadah();

  const points = useMemo(
    () => negara
      .filter((n) => n.lat != null && n.lon != null)
      .map((n) => ({
        ...n,
        dim: benuaAktif && n.benua !== benuaAktif,
        fokus: n.iso === fokusIso,
      })),
    [negara, benuaAktif, fokusIso]
  );

  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;
    g.pointOfView({ lat: 10, lng: 15, altitude: 1.65 }, 0);
    const controls = g.controls();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.35;
      controls.enableZoom = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // terbang ke negara yang dipilih lewat pencarian/tabel (bukan klik langsung di globe)
  useEffect(() => {
    const g = globeRef.current;
    if (!g || !fokusIso) return;
    const target = negara.find((n) => n.iso === fokusIso);
    if (!target || target.lat == null || target.lon == null) return;
    const controls = g.controls();
    if (controls) controls.autoRotate = false;
    g.pointOfView({ lat: target.lat, lng: target.lon, altitude: 1.15 }, 1200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fokusIso]);

  return (
    <div ref={wadahRef} style={{ width: "100%" }}>
    <Globe
      ref={globeRef}
      width={lebar}
      height={tinggi}
      backgroundColor="rgba(0,0,0,0)"
      globeImageUrl={texture}
      showAtmosphere={true}
      atmosphereColor="#7c8dfb"
      atmosphereAltitude={0.14}
      pointsData={points}
      pointLat="lat"
      pointLng="lon"
      pointColor={(d) => (d.dim ? "rgba(148,154,143,0.18)" : LEVEL_WARNA[d.fvi_level] || "#5a89a8")}
      pointAltitude={(d) => (d.fokus ? 0.045 : 0.012)}
      pointRadius={(d) => (d.fokus ? 0.75 : d.dim ? 0.28 : 0.42)}
      ringsData={points.filter((p) => p.fokus)}
      ringLat="lat"
      ringLng="lon"
      ringColor={() => (t) => `rgba(124,141,251,${1 - t})`}
      ringMaxRadius={4.5}
      ringPropagationSpeed={2.2}
      ringRepeatPeriod={900}
      pointLabel={(d) =>
        `<div style="font-family:'JetBrains Mono',monospace;background:#0d1117ee;border:1px solid #262c37;border-radius:6px;padding:7px 11px;color:#eceef2;font-size:11px;">
          <b style="color:#7c8dfb">${d.nama}</b><br/>FVI ${d.fvi_skor?.toFixed(1) ?? "-"} ${d.fvi_level ?? ""}
        </div>`
      }
      onPointClick={(d) => onKlik?.(d.iso)}
      onPointHover={(d) => { document.body.style.cursor = d ? "pointer" : "default"; }}
    />
    </div>
  );
}
