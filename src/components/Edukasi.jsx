// Kotak catatan edukatif, dipakai untuk menjelaskan konsep ekonomi/fiskal
// di sela-sela data, supaya orang yang lihat dashboard juga belajar sesuatu,
// bukan cuma lihat angka. Sengaja dibedakan dari .panel biasa (aksen biru,
// bukan merah) supaya kebaca sebagai "penjelasan", bukan "temuan data".
export default function Edukasi({ title, children }) {
  return (
    <div className="kotak-edukasi">
      <div className="kotak-edukasi-judul">
        <span className="tanda">?</span>
        <span>{title}</span>
      </div>
      <div className="kotak-edukasi-isi">{children}</div>
    </div>
  );
}
