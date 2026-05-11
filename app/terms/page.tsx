"use client";

import { FileText, UserCheck, ShieldAlert, RefreshCcw } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="relative min-h-screen bg-slate-50 py-16 px-6 overflow-hidden">
      
      {/* 🌌 Blob Background */}
      <div className="absolute top-10 -left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-[float_12s_ease-in-out_infinite]" />
      <div className="absolute bottom-10 -right-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-[float_15s_ease-in-out_infinite_alternate]" />

      <div className="max-w-4xl mx-auto relative z-10">

        {/* 🔹 Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Ketentuan Layanan
          </h1>
          <p className="text-gray-500">
            Ketentuan penggunaan layanan Psychotest Website
          </p>
        </div>

        {/* 🔹 Card */}
        <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-3xl p-8 space-y-10 border border-gray-100 transition hover:shadow-2xl hover:-translate-y-1 duration-300 animate-fadeUp">

          {/* Intro */}
          <div className="flex items-start gap-4">
            <FileText className="w-7 h-7 text-purple-600 mt-1" />
            <p className="text-gray-700 leading-relaxed">
              Dengan menggunakan layanan ini, Anda dianggap telah membaca, memahami,
              dan menyetujui seluruh ketentuan yang berlaku.
            </p>
          </div>

          {/* 1 */}
          <div className="flex items-start gap-4 group">
            <UserCheck className="w-7 h-7 text-indigo-600 mt-1 transition group-hover:scale-110" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                1. Penggunaan Sistem
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Layanan ini digunakan untuk pelaksanaan tes psikologi yang bertujuan
                untuk kebutuhan seleksi kerja, pendidikan, serta keperluan lainnya
                termasuk Calon Pekerja Migran Indonesia (CPMI). Pengguna wajib menggunakan
                sistem sesuai dengan tujuan yang telah ditentukan dan tidak menyalahgunakan layanan.
              </p>
            </div>
          </div>

          {/* 2 */}
          <div className="flex items-start gap-4 group">
            <ShieldAlert className="w-7 h-7 text-blue-600 mt-1 transition group-hover:scale-110" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                2. Akun Pengguna
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Pengguna bertanggung jawab atas keamanan akun, termasuk menjaga kerahasiaan
                data login serta seluruh aktivitas yang terjadi dalam akun tersebut.
              </p>
            </div>
          </div>

{/* 3 */}
<div className="flex items-start gap-4 group">
  <FileText className="w-7 h-7 text-indigo-600 mt-1 transition group-hover:scale-110" />
  <div>
    <h2 className="text-lg font-semibold text-gray-800 mb-1">
      3. Hasil Tes Psikologi
    </h2>
    <p className="text-gray-700 leading-relaxed">
      Hasil tes psikologi yang diperoleh melalui sistem ini telah melalui proses
      evaluasi dan validasi oleh tenaga profesional (psikolog). Hasil tersebut dapat
      digunakan sebagai bahan pertimbangan dalam kebutuhan kerja, pendidikan,
      maupun keperluan administratif lainnya.
    </p>
  </div>
</div>

{/* 4 */}
<div className="flex items-start gap-4 group">
  <ShieldAlert className="w-7 h-7 text-red-500 mt-1 transition group-hover:scale-110" />
  <div>
    <h2 className="text-lg font-semibold text-gray-800 mb-1">
      4. Pembatasan Tanggung Jawab
    </h2>
    <p className="text-gray-700 leading-relaxed">
      Kami tidak bertanggung jawab atas penyalahgunaan hasil tes oleh pihak lain
      di luar tujuan yang telah ditetapkan, serta segala kerugian yang timbul akibat
      penggunaan layanan yang tidak sesuai dengan ketentuan.
    </p>
  </div>
</div>

          {/* 5 */}
          <div className="flex items-start gap-4 group">
            <RefreshCcw className="w-7 h-7 text-purple-600 mt-1 transition group-hover:rotate-12" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                5. Perubahan Layanan
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Kami berhak untuk mengubah, memperbarui, atau menghentikan sebagian maupun
                seluruh layanan sewaktu-waktu tanpa pemberitahuan sebelumnya.
              </p>
            </div>
          </div>
{/* 6. Pembayaran */}
<div className="flex items-start gap-4 group">
  <ShieldAlert className="w-7 h-7 text-green-600 mt-1 transition group-hover:scale-110" />
  <div>
    <h2 className="text-lg font-semibold text-gray-800 mb-1">
      6. Pembayaran
    </h2>
    <p className="text-gray-700 leading-relaxed">
      Pembayaran layanan dilakukan secara online melalui metode yang tersedia
      pada sistem. Seluruh transaksi diproses melalui pihak ketiga (payment gateway).
      Pembayaran yang telah dilakukan tidak dapat dikembalikan kecuali dalam kondisi tertentu
      sesuai kebijakan yang berlaku.
    </p>
  </div>
</div>
{/* 7. Larangan Penggunaan */}
<div className="flex items-start gap-4 group">
  <ShieldAlert className="w-7 h-7 text-red-500 mt-1 transition group-hover:scale-110" />
  <div>
    <h2 className="text-lg font-semibold text-gray-800 mb-1">
      7. Larangan Penggunaan
    </h2>
    <ul className="list-disc ml-5 text-sm text-gray-600 space-y-1">
      <li>Menyalahgunakan sistem untuk tujuan ilegal</li>
      <li>Mengakses data tanpa izin</li>
      <li>Melakukan manipulasi hasil tes</li>
    </ul>
  </div>
</div>
{/* 8. Hak dan Kewajiban */}
<div className="flex items-start gap-4 group">
  <UserCheck className="w-7 h-7 text-indigo-500 mt-1 transition group-hover:scale-110" />
  <div>
    <h2 className="text-lg font-semibold text-gray-800 mb-1">
      8. Hak dan Kewajiban Pengguna
    </h2>
    <p className="text-gray-700 leading-relaxed">
      Pengguna berhak mendapatkan layanan sesuai ketentuan, serta wajib
      memberikan data yang benar dan menjaga keamanan akun masing-masing.
    </p>
  </div>
</div>
{/* 9. Persetujuan */}
<div className="flex items-start gap-4 group">
  <FileText className="w-7 h-7 text-gray-500 mt-1 transition group-hover:scale-110" />
  <div>
    <h2 className="text-lg font-semibold text-gray-800 mb-1">
      9. Persetujuan
    </h2>
    <p className="text-gray-700 leading-relaxed">
      Dengan menggunakan layanan ini, pengguna dianggap telah menyetujui seluruh
      ketentuan yang berlaku tanpa pengecualian.
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