"use client";

import React from "react";
import Image from "next/image";
import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative text-white pt-0 overflow-hidden">
      {/* 🌊 SVG Wave Transition */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
        <svg
          className="relative block w-full h-[90px]"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86
              C583.57,2,639.87-2.52,694,6.88
              c60.29,10.84,112.17,41.07,171.57,55.61
              c49.71,12,99.88,9.25,148.44-3.88
              c59.66-16.26,113.08-46.5,170-67.9V120H0V27.35
              A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="#001F54"
          />
        </svg>
      </div>

      {/* 💙 Background Gradient */}
<div className="bg-gradient-to-r from-[#3B0764] via-[#1E3A8A] to-[#0F172A] relative pt-14 pb-6 overflow-hidden">
        {/* 🌌 Parallax Blobs */}
     <div className="absolute top-10 left-0 w-80 h-80 bg-purple-700/25 rounded-full blur-3xl -z-10 animate-[float_12s_ease-in-out_infinite]" />
<div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-700/25 rounded-full blur-3xl -z-10 animate-[float_15s_ease-in-out_infinite_alternate]" />
<div className="absolute top-1/2 left-1/3 w-72 h-72 bg-indigo-800/20 rounded-full blur-3xl -z-10 animate-[float_18s_ease-in-out_infinite_reverse]" />

      {/* 💬 Footer Content */}
<div className="w-full px-12 lg:px-20 grid grid-cols-1 md:grid-cols-3 justify-between text-blue-50">
  {/* 🏥 Logo & Deskripsi */}
  <div className="flex flex-col justify-start transition-transform duration-300 hover:scale-[1.02]">
<div className="flex items-center gap-5">
  <div className="relative w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] flex-shrink-0 drop-shadow-lg">
    <Image
      src="/logoklinik21.png"
      alt="Logo Klinik Yuliarpan Medika"
      fill
      className="object-contain"
    />
  </div>
  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight drop-shadow-sm">
    Klinik Yuliarpan Medika
  </h3>
</div>

    <p className="text-blue-100 leading-relaxed text-justify">
      Klinik Yuliarpan Medika merupakan unit usaha di bidang layanan kesehatan
      yang berbadan hukum{" "}
      <span className="font-semibold text-white">PT. Sudami Jaya Medika</span>{" "}
      dan khusus bergerak dalam bidang pelayanan kesehatan.
    </p>

    {/* 🟢 WhatsApp Only */}
    <div className="mt-6">
      <a
        href="https://wa.me/6282363891234"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-green-500 hover:bg-green-600 transition-all hover:scale-105 shadow-lg shadow-green-500/30"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="font-medium">Hubungi via WhatsApp</span>
      </a>
    </div>
  </div>

  {/* 📞 Contact Us */}
  <div className="flex flex-col justify-start md:items-start ml-30">
    <h4 className="text-2xl font-semibold mb-5 flex items-center gap-3 text-white drop-shadow-sm mt-4">
      <Mail className="w-6 h-6 text-blue-200" />
      Contact Us
    </h4>
    <ul className="space-y-1 text-blue-100">
      <li className="flex items-start gap-3 hover:text-white transition-all">
        <MapPin className="w-5 h-5 mt-1 text-blue-200 flex-shrink-0" />
        Jalan Raya Setu No.149, Cibuntu, Cibitung, Bekasi, Jawa Barat 17520.
      </li>
      <li className="flex items-center gap-3 hover:text-white transition-all">
        <Phone className="w-5 h-5 text-blue-200 flex-shrink-0" />
        +62 823-6389-1234
      </li>
      <li className="flex items-center gap-3 hover:text-white transition-all">
        <Mail className="w-5 h-5 text-blue-200 flex-shrink-0" />
        klinikym@gmail.com
      </li>
    </ul>
  </div>

  {/* ⏰ Jam Layanan */}
  <div className="flex flex-col justify-start md:items-start ml-30">
    <h4 className="text-2xl font-semibold mb-5 flex items-center gap-3 text-white drop-shadow-sm mt-4">
      <Clock className="w-6 h-6 text-blue-200" />
      Jam Layanan
    </h4>
    <ul className="space-y-1 text-blue-100">
      <li>
        <strong>Poli Umum:</strong> Senin–Minggu • 24 Jam
      </li>
      <li>
        <strong>Poli Bidan:</strong> Senin–Minggu • 24 Jam
      </li>
      <li>
        <strong>Poli Gigi:</strong> Senin 10.00–13.00, Rabu 16.00–20.00,
        Sabtu 11.00–14.00
      </li>
      <li>
        <strong>Poli Khitan:</strong> Setiap hari sesuai perjanjian
      </li>
      <li>
        <strong>Laboratorium:</strong> Senin–Minggu • 07.00–20.00
      </li>
      <li>
        <strong>USG:</strong> Senin–Sabtu • 10.00–12.00
      </li>
    </ul>
  </div>
</div>


        {/* 🔹 Footer Bottom */}
<div className="mt-8 border-t border-blue-400/40 pt-4 text-center text-blue-100 text-sm tracking-wide">
  <div className="mb-2 flex justify-center gap-4 flex-wrap">
    <a href="/about" className="hover:text-white transition">
      Tentang Kami
    </a>
    <span>|</span>
    <a href="/privacy-policy" className="hover:text-white transition">
      Kebijakan Privasi
    </a>
    <span>|</span>
    <a href="/terms" className="hover:text-white transition">
      Ketentuan Layanan
    </a>
  </div>

  &copy; {new Date().getFullYear()}{" "}
  <span className="font-medium text-white">
    Klinik Yuliarpan Medika
  </span>{" "}
  — PT. Sudami Jaya Medika. All rights reserved.
</div>
      </div>

      {/* 🌀 Floating Animation Keyframes */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-25px) scale(1.05);
          }
          100% {
            transform: translateY(0px) scale(1);
          }
        }
      `}</style>
    </footer>
  );
}
