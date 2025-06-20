'use client';

import React, { useEffect, useState } from 'react';

type ProfileResponse = {
  isLoggedIn: boolean;
  user: {
    id: string;
    nama_lengkap: string;
    email: string;
    avatar?: string;
  };
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://be-production-0885.up.railway.app';

const ProfilePage = () => {
  const [user, setUser] = useState<ProfileResponse['user'] | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ nama_lengkap: '', email: '' });
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/auth/me`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data: ProfileResponse = await res.json();
          if (data.isLoggedIn) {
            setUser(data.user);
            setFormData({
              nama_lengkap: data.user.nama_lengkap,
              email: data.user.email,
            });
          }
        }
      } catch (err) {
        console.error('Gagal memuat data pengguna', err);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          namaLengkap: formData.nama_lengkap,
          email: formData.email,
        }),
      });

      if (!res.ok) {
        throw new Error('Gagal menyimpan data');
      }

      const data = await res.json();
      console.log(data);
      setStatusMessage('Profil berhasil diperbarui');
      setIsEditing(false);
      window.location.href = '/profile';
    } catch (error) {
      console.error('Request gagal', error);
      setStatusMessage('Gagal menyimpan data');
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-red-50">
        <p className="text-red-600 text-lg font-semibold">Anda belum login.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-purple-100 py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">Profil Pengguna</h1>
          <p className="text-gray-600 mt-2">Kelola informasi dan aktivitas Anda</p>
        </div>

        <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-lg shadow-xl rounded-xl p-8">
          {statusMessage && (
            <p className={`text-center text-sm mb-4 ${statusMessage.includes('berhasil') ? 'text-green-600' : 'text-red-600'}`}>
              {statusMessage}
            </p>
          )}

          <div className="w-36 h-36 bg-orange-500 rounded-full flex items-center justify-center text-white text-6xl font-semibold mx-auto shadow-xl transform hover:scale-110 transition-all duration-300 ease-in-out">
  {user.nama_lengkap?.charAt(0)}
</div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Nama Lengkap</h2>
              {isEditing ? (
                <input
                  type="text"
                  name="nama_lengkap"
                  value={formData.nama_lengkap}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              ) : (
                <p className="text-gray-600">{user.nama_lengkap}</p>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Email</h2>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              ) : (
                <p className="text-gray-600">{user.email}</p>
              )}
            </div>
          </div>

          <div className="mt-8 text-center space-x-4">
            {isEditing ? (
              <>
                <button
                  className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  onClick={handleSave}
                >
                  Simpan
                </button>
                <button
                  className="bg-gray-300 text-gray-800 px-6 py-2 rounded-xl hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      nama_lengkap: user.nama_lengkap,
                      email: user.email,
                    });
                    setStatusMessage('');
                  }}
                >
                  Batal
                </button>
              </>
            ) : (
              <button
                className="bg-orange-500 text-white px-6 py-3 rounded-xl shadow hover:bg-orange-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                onClick={() => setIsEditing(true)}
              >
                Edit Profil
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
