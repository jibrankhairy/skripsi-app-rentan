"use client";

import { ShieldCheck, Lock, Database } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="relative min-h-screen bg-slate-50 py-16 px-6 overflow-hidden">
      
      {/* 🌌 Blob Background */}
      <div className="absolute top-10 -left-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-[float_12s_ease-in-out_infinite]" />
      <div className="absolute bottom-10 -right-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-[float_15s_ease-in-out_infinite_alternate]" />

      <div className="max-w-4xl mx-auto relative z-10">

        {/* 🔹 Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Kebijakan Privasi
          </h1>
          <p className="text-gray-500">
            Kami berkomitmen menjaga keamanan dan kerahasiaan data Anda
          </p>
        </div>

 <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-3xl p-8 space-y-10 border border-gray-100 transition hover:shadow-2xl hover:-translate-y-1 duration-300 animate-fadeUp">

  {/* Intro */}
  <div className="flex items-start gap-4 group">
    <ShieldCheck className="w-7 h-7 text-indigo-600 mt-1 transition group-hover:scale-110" />
    <p className="text-gray-700 leading-relaxed">
      Kami menghargai privasi pengguna dan berkomitmen untuk melindungi data pribadi Anda
      dalam penggunaan layanan Psychotest Website.
    </p>
  </div>

  {/* 1. Data */}
  <div className="flex items-start gap-4 group">
    <Database className="w-7 h-7 text-blue-600 mt-1 transition group-hover:scale-110" />
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-1">
        1. Data yang Dikumpulkan
      </h2>
      <ul className="list-disc ml-5 text-sm text-gray-600 space-y-1">
        <li>Nama lengkap</li>
        <li>Email atau kontak</li>
        <li>Data hasil tes psikologi</li>
        <li>Data penggunaan sistem</li>
      </ul>
    </div>
  </div>

  {/* 2. Penggunaan */}
  <div className="flex items-start gap-4 group">
    <Lock className="w-7 h-7 text-purple-600 mt-1 transition group-hover:scale-110" />
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-1">
        2. Penggunaan Data
      </h2>
      <ul className="list-disc ml-5 text-sm text-gray-600 space-y-1">
        <li>Pengolahan hasil tes psikologi</li>
        <li>Peningkatan kualitas layanan</li>
        <li>Administrasi dan manajemen sistem</li>
      </ul>
    </div>
  </div>

  {/* 3. Pembayaran */}
  <div className="flex items-start gap-4 group">
    <ShieldCheck className="w-7 h-7 text-green-600 mt-1 transition group-hover:scale-110" />
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-1">
        3. Pembayaran
      </h2>
      <p className="text-gray-700 leading-relaxed">
        Pembayaran layanan psikotes dilakukan melalui pihak ketiga (payment gateway).
        Sistem tidak menyimpan data pembayaran secara langsung sehingga keamanan transaksi
        tetap terjaga.
      </p>
    </div>
  </div>

  {/* 4. Penyimpanan */}
  <div className="flex items-start gap-4 group">
    <Database className="w-7 h-7 text-indigo-500 mt-1 transition group-hover:scale-110" />
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-1">
        4. Penyimpanan Data
      </h2>
      <p className="text-gray-700 leading-relaxed">
        Data pengguna disimpan selama diperlukan untuk mendukung layanan dan
        keperluan administratif, dengan sistem keamanan yang memadai.
      </p>
    </div>
  </div>

  {/* 5. Hak Pengguna */}
  <div className="flex items-start gap-4 group">
    <ShieldCheck className="w-7 h-7 text-pink-500 mt-1 transition group-hover:scale-110" />
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-1">
        5. Hak Pengguna
      </h2>
      <ul className="list-disc ml-5 text-sm text-gray-600 space-y-1">
        <li>Mengakses data pribadi</li>
        <li>Memperbarui data</li>
      </ul>
    </div>
  </div>

  {/* 6. Keamanan */}
  <div className="flex items-start gap-4 group">
    <Lock className="w-7 h-7 text-green-600 mt-1 transition group-hover:scale-110" />
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-1">
        6. Keamanan Data
      </h2>
      <p className="text-gray-700 leading-relaxed">
        Sistem dirancang untuk melindungi data dari akses tidak sah melalui
        mekanisme keamanan yang sesuai.
      </p>
    </div>
  </div>

  {/* 7. Kerahasiaan */}
  <div className="flex items-start gap-4 group">
    <ShieldCheck className="w-7 h-7 text-yellow-500 mt-1 transition group-hover:scale-110" />
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-1">
        7. Kerahasiaan
      </h2>
      <p className="text-gray-700 leading-relaxed">
        Data hasil tes bersifat rahasia dan tidak akan dibagikan tanpa persetujuan pengguna.
      </p>
    </div>
  </div>

  {/* 8. Kontak */}
  <div className="flex items-start gap-4 group">
    <Database className="w-7 h-7 text-blue-500 mt-1 transition group-hover:scale-110" />
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-1">
        8. Kontak
      </h2>
      <p className="text-gray-700 leading-relaxed">
        Untuk pertanyaan terkait kebijakan privasi, silakan hubungi pihak
        Klinik Yuliarpan Medika melalui kontak resmi yang tersedia.
      </p>
    </div>
  </div>

  {/* 9. Perubahan */}
  <div className="flex items-start gap-4 group">
    <ShieldCheck className="w-7 h-7 text-gray-500 mt-1 transition group-hover:scale-110" />
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-1">
        9. Perubahan Kebijakan
      </h2>
      <p className="text-gray-700 leading-relaxed">
        Kebijakan ini dapat diperbarui sewaktu-waktu sesuai kebutuhan sistem.
      </p>
    </div>
  </div>

</div>

        {/* Footer kecil */}
        <div className="text-center mt-10 text-sm text-gray-400 animate-fadeIn">
          © {new Date().getFullYear()} Psychotest Website
        </div>
      </div>

      {/* 🎬 Animations */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease forwards;
        }

        .animate-fadeUp {
          animation: fadeUp 1s ease forwards;
        }
      `}</style>
    </div>
  );
}