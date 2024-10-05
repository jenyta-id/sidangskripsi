"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import styles from "./login.module.css"; // Import CSS untuk styling

export default function Login() {
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Reset error sebelum proses login

    try {
      const docRef = doc(db, "users", nim);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        const email = userData.email;

        // Lakukan proses login dengan Firebase Authentication
        await signInWithEmailAndPassword(auth, email, password);

        // Cek role pengguna dan arahkan ke halaman yang sesuai
        if (userData.role === "mahasiswa") {
          router.push("/dashboard");
        } else if (userData.role === "dosen") {
          router.push("/dashboard-dosen");
        } else {
          setError("Role pengguna tidak dikenali.");
        }
      } else {
        setError("NIM tidak ditemukan.");
      }
    } catch (error) {
      setError("Login gagal: " + error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Login</h1>
      <form onSubmit={handleLogin} className={styles.form}>
        <input
          type="text"
          value={nim}
          onChange={(e) => setNim(e.target.value)}
          placeholder="Masukkan NIM"
          className={styles.inputField}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Masukkan Password"
          className={styles.inputField}
        />
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
}