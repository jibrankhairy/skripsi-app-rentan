"use client";

import { Building2, Target, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-slate-50 py-16 px-6 overflow-hidden">
      
      {/* 🌌 Blob Background (halus, bukan ganggu) */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-[float_12s_ease-in-out_infinite]" />
      <div className="absolute bottom-20 -right-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-[float_15s_ease-in-out_infinite_alternate]" />

      <div className="max-w-4xl mx-auto relative z-10">

        {/* 🔹 Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tentang Kami
          </h1>
          <p className="text-gray-500">
            Mengenal lebih dekat layanan Psychotest Website
          </p>
        </div>

        {/* 🔹 Card */}
      <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-3xl p-8 space-y-8 border border-gray-100 transition hover:shadow-2xl animate-fadeUp">

  {/* 🧠 Deskripsi */}
  <div className="flex items-start gap-4 group">
    <Building2 className="w-7 h-7 text-indigo-600 mt-1 transition group-hover:scale-110" />
    <p className="text-gray-700 leading-relaxed">
      <strong>Psychotest Website</strong> merupakan aplikasi berbasis web
      yang digunakan untuk pelaksanaan tes psikologi secara digital. Sistem ini
      dirancang untuk membantu proses evaluasi psikologis secara lebih efisien,
      cepat, dan terstruktur.
    </p>
  </div>

  {/* 🏢 Pengelola */}
  <div className="flex items-start gap-4 group">
    <Building2 className="w-7 h-7 text-blue-600 mt-1 transition group-hover:scale-110" />
    <p className="text-gray-700 leading-relaxed">
      Sistem ini dikelola oleh tim pengembang yang bekerja sama dengan 
      <span className="font-semibold text-gray-900"> Klinik Yuliarpan Medika </span>
      di bawah naungan PT. Sudami Jaya Medika sebagai penyedia layanan psikotes resmi.
    </p>
  </div>

  {/* 🎯 Tujuan */}
  <div className="flex items-start gap-4 group">
    <Target className="w-7 h-7 text-purple-600 mt-1 transition group-hover:scale-110" />
    <p className="text-gray-700 leading-relaxed">
      Layanan ini digunakan untuk mendukung kebutuhan seleksi kerja,
      pendidikan, serta pemeriksaan psikologis lainnya sesuai dengan
      standar yang berlaku di Klinik Yuliarpan Medika.
    </p>
  </div>

  {/* ⚙️ Fitur */}
  <div className="flex items-start gap-4 group">
    <Target className="w-7 h-7 text-indigo-500 mt-1 transition group-hover:scale-110" />
    <div className="text-gray-700 leading-relaxed space-y-1">
      <p>Fitur utama dalam sistem ini meliputi:</p>
      <ul className="list-disc ml-5 text-sm text-gray-600 space-y-1">
        <li>Pendaftaran peserta secara online</li>
        <li>Pelaksanaan tes psikologi berbasis web</li>
        <li>Validasi peserta menggunakan QR Code</li>
        <li>Pengolahan hasil tes otomatis</li>
        <li>Pembayaran digital terintegrasi</li>
      </ul>
    </div>
  </div>

  {/* 🔄 Alur */}
  <div className="flex items-start gap-4 group">
    <Target className="w-7 h-7 text-pink-500 mt-1 transition group-hover:scale-110" />
    <div className="text-gray-700 leading-relaxed space-y-1">
      <p>Alur penggunaan sistem:</p>
      <ol className="list-decimal ml-5 text-sm text-gray-600 space-y-1">
        <li>Registrasi akun</li>
        <li>Memilih layanan psikotes</li>
        <li>Melakukan pembayaran</li>
        <li>Mengikuti tes</li>
        <li>Melihat hasil evaluasi</li>
      </ol>
    </div>
  </div>

  {/* 🔐 Keamanan */}
  <div className="flex items-start gap-4 group">
    <ShieldCheck className="w-7 h-7 text-green-600 mt-1 transition group-hover:scale-110" />
    <p className="text-gray-700 leading-relaxed">
      Sistem ini dirancang dengan memperhatikan keamanan data pengguna.
      Data disimpan secara aman dan hanya digunakan untuk keperluan layanan
      psikotes. Transaksi pembayaran dilakukan melalui payment gateway
      terpercaya untuk menjamin keamanan dan transparansi proses pembayaran.
    </p>
  </div>

</div>
        {/* 🔹 Footer kecil */}
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