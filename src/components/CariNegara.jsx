import { useMemo, useRef, useState } from "react";

export default function CariNegara({ negara, onPilih, placeholder = "Cari nama negara..." }) {
  const [q, setQ] = useState("");
  const [buka, setBuka] = useState(false);
  const wadahRef = useRef(null);

  const hasil = useMemo(() => {
    if (!q.trim()) return [];
    const s = q.trim().toLowerCase();
    return negara.filter((n) => n.nama.toLowerCase().includes(s)).slice(0, 8);
  }, [q, negara]);

  const pilih = (n) => {
    onPilih(n.iso);
    setQ(n.nama);
    setBuka(false);
  };

  return (
    <div className="cari-negara" ref={wadahRef}>
      <input
        type="text"
        value={q}
        placeholder={placeholder}
        onChange={(e) => { setQ(e.target.value); setBuka(true); }}
        onFocus={() => setBuka(true)}
        onBlur={() => setTimeout(() => setBuka(false), 150)}
      />
      {buka && q.trim() && (
        <div className="cari-hasil">
          {hasil.length === 0 && <div className="kosong">Tidak ada negara cocok "{q}"</div>}
          {hasil.map((n) => (
            <button key={n.iso} type="button" onMouseDown={() => pilih(n)}>
              <span>{n.nama}</span>
              <span className="fine mono">{n.benua}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
