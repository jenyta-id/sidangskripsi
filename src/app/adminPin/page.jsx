"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Firestore

export default function AdminPin() {
  const [pin, setPin] = useState(["", "", "", "", ""]);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const correctPin = ["4", "0", "3", "1", "2"];

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('adminUser')); 
    if (storedUser) {
      setUser(storedUser);
    } else {
      alert("Pengguna tidak ditemukan. Silakan login terlebih dahulu.");
      router.push('/adminLogin');
    }
  }, [router]);

  const handlePinChange = (e, index) => {
    const newPin = [...pin];
    newPin[index] = e.target.value;
    setPin(newPin);

    if (e.target.value && index < 4) {
      document.getElementById(`pin-${index + 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (JSON.stringify(pin) === JSON.stringify(correctPin)) {
      try {
        const userRef = doc(db, "users", "admin_user");
        await updateDoc(userRef, {
          role: 'admin'
        });

        alert("Anda sekarang adalah admin!");
        router.push('/admin');
      } catch (error) {
        alert("Terjadi kesalahan saat menambahkan admin.");
      }
    } else {
      alert("PIN salah, silakan coba lagi.");
    }
  };

  return (
    <div>
      <h1>Masukkan PIN Admin</h1>
      <form onSubmit={handleSubmit}>
        {pin.map((digit, index) => (
          <input
            key={index}
            id={`pin-${index}`}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handlePinChange(e, index)}
            style={{ width: '40px', height: '40px', textAlign: 'center', margin: '5px' }}
          />
        ))}
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white' }}>
          Submit
        </button>
      </form>
    </div>
  );
}