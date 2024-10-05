"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import styles from "./dashboardDosen.module.css"; // Import CSS untuk styling

export default function DashboardDosen() {
  const [penjadwalan, setPenjadwalan] = useState([]);

  useEffect(() => {
    const fetchPenjadwalan = async () => {
      try {
        const user = auth.currentUser;
        const q = query(collection(db, "penjadwalan"), where("dosenNim", "==", user.uid));
        const querySnapshot = await getDocs(q);
        setPenjadwalan(querySnapshot.docs.map(doc => doc.data()));
      } catch (error) {
        console.log(error);
      }
    };
    fetchPenjadwalan();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard Dosen</h1>
      
      {/* Tampilkan tabel penjadwalan */}
      {penjadwalan.length > 0 ? (
        <table className={styles.tableContainer}>
          <thead>
            <tr>
              <th>NIM Mahasiswa</th>
              <th>Jadwal Sidang</th>
            </tr>
          </thead>
          <tbody>
            {penjadwalan.map((jadwal, index) => (
              <tr key={index}>
                <td>{jadwal.mahasiswaNim}</td>
                <td>{jadwal.jadwal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.noData}>Belum ada penjadwalan sidang.</p>
      )}
    </div>
  );
}