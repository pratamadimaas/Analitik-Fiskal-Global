export function SectionHead({ title, note, children }) {
  return (
    <div className="section-head">
      <h2>{title}</h2>
      {children || (note && <span className="note">{note}</span>)}
    </div>
  );
}

export function Level({ level }) {
  if (!level) return <span className="fine">-</span>;
  return <span className={`level ${level}`}>{level}</span>;
}

export function Cap({ level }) {
  if (!level) return null;
  return <span className={`cap ${level}`}>{level}</span>;
}

export function Select({ label, value, onChange, options, labels, all }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value ?? ""} onChange={(e) => onChange(e.target.value || null)}>
        {all !== undefined && <option value="">{all ?? "Semua"}</option>}
        {options.map((o) => (
          <option key={o} value={o}>{labels ? labels[o] ?? o : o}</option>
        ))}
      </select>
    </label>
  );
}
