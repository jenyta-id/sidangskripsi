"use client";
import { useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import styles from "./dashboard.module.css"; // Import CSS untuk styling

export default function Dashboard() {
  const [jadwal, setJadwal] = useState("");
  const [dosenNim, setDosenNim] = useState("");
  const [message, setMessage] = useState(null); // For success or error message
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null); // Reset message
    try {
      const user = auth.currentUser;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const mahasiswa = docSnap.data();
        await addDoc(collection(db, "penjadwalan"), {
          mahasiswaNim: mahasiswa.nim,
          dosenNim,
          jadwal,
        });
        setMessage({ type: "success", text: "Jadwal berhasil ditambahkan" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Gagal mengajukan jadwal: " + error.message });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard Mahasiswa</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={jadwal}
          onChange={(e) => setJadwal(e.target.value)}
          placeholder="Masukkan Jadwal Sidang"
          className={styles.inputField}
        />
        <input
          type="text"
          value={dosenNim}
          onChange={(e) => setDosenNim(e.target.value)}
          placeholder="Masukkan NIM Dosen Pembimbing"
          className={styles.inputField}
        />
        <button type="submit" className={styles.button}>
          Ajukan Jadwal
        </button>
      </form>

      {/* Display success or error message */}
      {message && (
        <p className={message.type === "success" ? styles.success : styles.error}>
          {message.text}
        </p>
      )}
    </div>
  );
}