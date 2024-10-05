"use client";
import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import styles from "./register.module.css"; // Import CSS untuk styling

export default function Register() {
  const [nim, setNim] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nama, setNama] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [angkatan, setAngkatan] = useState("");
  const [cabangKampus, setCabangKampus] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fungsi untuk mengambil data berdasarkan NIM dari Firestore
  const fetchUserDataByNim = async (nim) => {
    if (nim) {
      try {
        const docRef = doc(db, "users", nim);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setNama(userData.nama || ""); // Isi nama
          setJurusan(userData.jurusan || ""); // Isi jurusan
          setAngkatan(userData.angkatan || ""); // Isi angkatan
          setCabangKampus(userData.cabangKampus || ""); // Isi cabang kampus
          setRole(userData.role || "");
        } else {
          // Reset jika NIM tidak ditemukan
          setNama("");
          setJurusan("");
          setAngkatan("");
          setCabangKampus("");
          setRole("");
        }
      } catch (error) {
        console.error("Error fetching NIM data: ", error);
        setError("Error fetching NIM data");
      }
    }
  };

  // Panggil fetchUserDataByNim setiap kali nim berubah
  useEffect(() => {
    fetchUserDataByNim(nim);
  }, [nim]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null); // Reset error sebelum proses
    try {
      // Membuat akun pengguna baru di Firebase Authentication
      await createUserWithEmailAndPassword(auth, email, password);
      // Menyimpan data tambahan ke Firestore
      await setDoc(doc(db, "users", nim), {
        email,
        nama,
        jurusan,
        angkatan,
        cabangKampus,
        role,
      });
      router.push("/login");
    } catch (error) {
      console.error("Registrasi gagal: ", error.message);
      setError("Registrasi gagal: " + error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Registrasi</h1>
      <form onSubmit={handleRegister} className={styles.formContainer}>
        <input
          type="text"
          className={styles.inputField}
          value={nim}
          onChange={(e) => setNim(e.target.value)}
          placeholder="Masukkan NIM"
        />
        <input
          type="text"
          className={styles.inputField}
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Masukkan Nama"
          readOnly // Set input menjadi hanya baca (auto-fill dari Firestore)
        />
        <input
          type="text"
          className={styles.inputField}
          value={jurusan}
          onChange={(e) => setJurusan(e.target.value)}
          placeholder="Masukkan Jurusan"
          readOnly // Set input menjadi hanya baca (auto-fill dari Firestore)
        />
        <input
          type="text"
          className={styles.inputField}
          value={angkatan}
          onChange={(e) => setAngkatan(e.target.value)}
          placeholder="Masukkan Angkatan"
          readOnly // Set input menjadi hanya baca (auto-fill dari Firestore)
        />
        <input
          type="text"
          className={styles.inputField}
          value={cabangKampus}
          onChange={(e) => setCabangKampus(e.target.value)}
          placeholder="Masukkan Cabang Kampus"
          readOnly // Set input menjadi hanya baca (auto-fill dari Firestore)
        />
        <input
          type="text"
          className={styles.inputField}
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Masukkan Role"
          readOnly // Set input menjadi hanya baca (auto-fill dari Firestore)
        />
        <input
          type="email"
          className={styles.inputField}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Masukkan Email"
        />
        <input
          type="password"
          className={styles.inputField}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Masukkan Password"
        />
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.button}>
          Register
        </button>
      </form>
    </div>
  );
}