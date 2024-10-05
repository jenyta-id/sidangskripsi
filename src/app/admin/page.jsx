"use client";
import { useState } from 'react';
import { db } from '../../firebase'; 
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import styles from './AdminRegis.module.css'; // Import CSS Module

export default function AdminRegis() {
  const [nama, setNama] = useState('');
  const [jurusan, setJurusan] = useState('');
  const [angkatan, setAngkatan] = useState('');
  const [cabangKampus, setCabangKampus] = useState('');
  const [noWhatsapp, setNoWhatsapp] = useState('');
  
  // State untuk pendaftaran dosen
  const [namaDosen, setNamaDosen] = useState('');
  const [jurusanDosen, setJurusanDosen] = useState('');
  const [cabangKampusDosen, setCabangKampusDosen] = useState('');
  const router = useRouter();

  // Generate NIM Mahasiswa
  const generateNim = () => {
    const jurusanCode = jurusan === "TI" ? "10" : "11";
    const cabangKampusCode = cabangKampus === "Harapan Indah" ? "02" : cabangKampus === "Kebon Jeruk" ? "01" : "03";
    return `${angkatan}${jurusanCode}${cabangKampusCode}`;
  };

  // Generate NIM Dosen
  const generateNimDosen = () => {
    const dosenNamaLength = namaDosen.replace(/\s/g, '').length;
    const dosenJurusanCode = jurusanDosen === "TI" ? "10" : "11";
    const dosenCabangKampusCode = cabangKampusDosen === "Harapan Indah" ? "02" : cabangKampusDosen === "Kebon Jeruk" ? "01" : "03";
    return `${dosenNamaLength}${dosenCabangKampusCode}${dosenJurusanCode}`;
  };

  // Submit Mahasiswa
  const handleSubmitMahasiswa = async (e) => {
    e.preventDefault();
    try {
      const nim = generateNim();
      await setDoc(doc(db, "users", nim), {
        nama,
        jurusan,
        angkatan,
        cabangKampus,
        noWhatsapp,
        nim,
        role: "mahasiswa"
      });
      alert("Registrasi Mahasiswa berhasil! NIM mahasiswa: " + nim);
      router.push("/login"); 
    } catch (error) {
      alert("Terjadi kesalahan saat registrasi mahasiswa: " + error.message);
    }
  };

  // Submit Dosen
  const handleSubmitDosen = async (e) => {
    e.preventDefault();
    try {
      const nimDosen = generateNimDosen();
      await setDoc(doc(db, "users", nimDosen), {
        nama: namaDosen,
        jurusan: jurusanDosen,
        cabangKampus: cabangKampusDosen,
        nim: nimDosen,
        role: "dosen"
      });
      alert("Registrasi Dosen berhasil! NIM dosen: " + nimDosen);
      router.push("/login"); 
    } catch (error) {
      alert("Terjadi kesalahan saat registrasi dosen: " + error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Registrasi Mahasiswa</h1>
      <form onSubmit={handleSubmitMahasiswa} className={styles.form}>
        <input
          type="text"
          placeholder="Nama Mahasiswa"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Jurusan (TI atau SI)"
          value={jurusan}
          onChange={(e) => setJurusan(e.target.value)}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Angkatan"
          value={angkatan}
          onChange={(e) => setAngkatan(e.target.value)}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Cabang Kampus (Harapan Indah, Kebon Jeruk, Citra Raya)"
          value={cabangKampus}
          onChange={(e) => setCabangKampus(e.target.value)}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Nomor WhatsApp"
          value={noWhatsapp}
          onChange={(e) => setNoWhatsapp(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Registrasi Mahasiswa</button>
      </form>

      <hr className={styles.separator} />

      <h1 className={styles.title}>Registrasi Dosen</h1>
      <form onSubmit={handleSubmitDosen} className={styles.form}>
        <input
          type="text"
          placeholder="Nama Dosen"
          value={namaDosen}
          onChange={(e) => setNamaDosen(e.target.value)}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Jurusan Dosen (TI atau SI)"
          value={jurusanDosen}
          onChange={(e) => setJurusanDosen(e.target.value)}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Cabang Kampus Dosen (Harapan Indah, Kebon Jeruk, Citra Raya)"
          value={cabangKampusDosen}
          onChange={(e) => setCabangKampusDosen(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Registrasi Dosen</button>
      </form>
    </div>
  );
}