import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // State untuk menyimpan daftar catatan
  const [catatan, setCatatan] = useState([]);
  // State untuk menyimpan judul catatan yang sedang ditulis
  const [judul, setJudul] = useState('');
  // State untuk menyimpan isi catatan yang sedang ditulis
  const [isi, setisi] = useState('');
  // State untuk menyimpan pesan respons dari server
  const [responseMessage, setResponseMessage] = useState('');

  // Mengambil daftar catatan dari server saat komponen dimuat atau diperbarui
  useEffect(() => {
    ambilCatatan();
  }, []); // Gunakan array kosong sebagai dependensi agar hanya dijalankan sekali saat komponen dimuat

  // Fungsi untuk mengirim catatan baru ke server
  const kirimCatatan = async (e) => {
    e.preventDefault(); // Mencegah perilaku default form submit

    try {
      const response = await axios.post('http://localhost:3002/v1/todos_auth', {
        judul,
        isi
      }, {
        headers: {
          Authorization: 'Bearer a1b2c3d4e5f6'
        }
      }); // Mengirim data catatan baru ke server
      setJudul(''); // Mengosongkan judul setelah mengirim catatan
      setisi(''); // Mengosongkan isi setelah mengirim catatan
      ambilCatatan(); // Memperbarui daftar catatan setelah mengirim catatan baru
      setResponseMessage({ message: response.data.message, bgColor:'bg-green-200', textColor:'text-green-800'}); // Menyimpan pesan respons dari server
    } catch (error) {
      console.log(error.message);
    }
  };

  // Fungsi untuk mengambil daftar catatan dari server
  const ambilCatatan = async () => {
    try {
      const response = await axios.get('http://localhost:3002/v1/todos_auth', {
        headers: {
          Authorization: 'Bearer a1b2c3d4e5f6'
        }
      }); // Mengambil data catatan dari server
      setCatatan(response.data.data); // Menyimpan data catatan ke dalam state
    } catch (error) {
      console.log(error.message);
    }
  };

  // Fungsi untuk menghapus catatan berdasarkan ID
  const hapusCatatan = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3002/v1/todos_auth/${id}`, {
        headers: {
          Authorization: 'Bearer a1b2c3d4e5f6'
        }
      }); // Menghapus catatan dari server berdasarkan ID
      ambilCatatan(); // Memperbarui daftar catatan setelah menghapus catatan
      setResponseMessage({ message: response.data.message, bgColor:'bg-red-200', textColor:'text-red-800'}); // Menyimpan pesan respons dari server dengan background merah
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-5">
      <h1 className="text-2xl font-bold mb-4">To-Do-List</h1>
      {responseMessage.message && (
        <div className={`${responseMessage.bgColor} ${responseMessage.textColor} py-2 px-4 mb-4 rounded-md flex justify-between items-center`}>
          <span>{responseMessage.message}</span>
          <button onClick={() => setResponseMessage("")} className='text-sm text-gray-600 focus:outline-none ml-2'>&times;</button>
        </div>
      )}
      <form className="mb-4" onSubmit={kirimCatatan}>
        {/* Input untuk judul catatan */}
        <input
          type="text"
          className="w-full mb-2 px-3 py-4 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          placeholder="Judul"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
        />
        {/* Input untuk isi catatan */}
        <textarea
          className="w-full mb-2 px-3 py-4 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          placeholder="Isi Catatan"
          onChange={(e) => setisi(e.target.value)}
          value={isi}
        ></textarea>
        {/* Tombol untuk menambahkan catatan */}
        <button
          type="submit"
          className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-red-600"
        >
          Add
        </button>
      </form>
      <div>
        {/* Menampilkan daftar catatan */}
        {catatan.map((catatan) => (
          <div className="bg-white shadow-md rounded-md p-4 mb-4" key={catatan.id}>
            <h2 className="text-xl font-semibold mb-2">{catatan.judul}</h2>
            <p className="text-gray-700 mb-2">{catatan.isi}</p>
            {/* Tombol untuk menghapus catatan */}
            <button
              className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
              onClick={() => hapusCatatan(catatan.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
