"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AnimatedOnScroll from "@/components/ui/animatedonscroll";
import { useSearchParams } from "next/navigation";
import { LayoutGrid, Rows } from "lucide-react";
import { motion } from "framer-motion";

interface TestType {
  id: number;
  name: string;
  desc: string;
  price: string | number;
  img: string;
  badge?: string;
  percentDiscount: number;
  priceDiscount: number;
  originalName?: string;
  comingSoon?: boolean;
}

const formatPrice = (price: string | number) => {
  if (typeof price === "number") {
    return `Rp${price.toLocaleString("id-ID")}`;
  }
  return price;
};

function DashboardInner() {
  const [tests, setTests] = useState<TestType[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "grid" | "masonry">("grid");
  const [sortOption, setSortOption] = useState("Harga Terendah");
  const [user, setUser] = useState<any>(null);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  // const filteredTests = tests
  //   .filter((t) => {
  const filteredTests = tests
  .filter((t) => !t.comingSoon) // ⬅️ WAJIB untuk Tripay
  .filter((t) => {
      const q = searchQuery.trim();
      if (!q) {
        return !showAvailableOnly || !t.comingSoon;
      }

      const name = t.name?.toLowerCase() || "";
      const original = t.originalName?.toLowerCase() || "";

      const matchName = name.includes(q) || original.includes(q);

      return matchName && (!showAvailableOnly || !t.comingSoon);
    })
    .sort((a, b) => {
      const getFinalPrice = (t: TestType) => {
        const base =
          typeof t.price === "string"
            ? parseFloat(t.price.replace(/[^\d]/g, ""))
            : t.price;
        return t.priceDiscount && t.priceDiscount < base
          ? t.priceDiscount
          : base;
      };

      const priceA = getFinalPrice(a);
      const priceB = getFinalPrice(b);

      if (sortOption === "Harga Terendah") return priceA - priceB;
      if (sortOption === "Harga Tertinggi") return priceB - priceA;
      if (sortOption === "Nama A-Z") return a.name.localeCompare(b.name);
      if (sortOption === "Nama Z-A") return b.name.localeCompare(a.name);
      return 0;
    });

  const quotes = [
    "Kenali dirimu, maka kamu akan tahu arah terbaik untuk berkembang.",
    "Setiap tes adalah langkah kecil menuju versi terbaik dirimu.",
    "Psikologi bukan tentang kelemahan, tapi tentang potensi.",
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch("/api/me");
        // Gunakan text() dan try-catch untuk /api/me juga (praktik yang baik)
        const textMe = await res.text();
        let u = null;
        if (textMe) {
          const data = JSON.parse(textMe);
          u = data.user;
          setUser(u);
        }

        let endpoint = "/api/testtypes";
        if (u && u.role === "PERUSAHAAN") {
          endpoint = `/api/company/testtypes?companyId=${u.id}`;
        }

        // --- PERBAIKAN DI SINI ---
        const resTests = await fetch(endpoint);

        if (!resTests.ok) {
          throw new Error(`Gagal fetch tests. HTTP Status: ${resTests.status}`);
        }

        const rawText = await resTests.text();
        if (!rawText) {
          throw new Error("Response API kosong (tidak ada JSON).");
        }

        let testsData: TestType[] = JSON.parse(rawText);
        // -------------------------

        testsData = testsData.map((test) => {
          if (test.name === "CPMI") {
            return { ...test, originalName: "CPMI", name: "WPT" };
          }

          const activeTests = ["WPT", "MSDT"];
          if (!activeTests.includes(test.name)) {
            return { ...test, comingSoon: true };
          }

          return test;
        });

        setTests(testsData);
      } catch (error) {
        console.error("Gagal fetch tests:", error);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const renderPrice = (test: TestType) => {
    const price =
      typeof test.price === "string"
        ? parseFloat(test.price.replace(/[^\d]/g, ""))
        : test.price;

    const hasDiscount =
      test.priceDiscount && Number(test.priceDiscount) < Number(price);

    if (hasDiscount) {
      return (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <p className="text-lg font-extrabold text-blue-600">
              Rp {Number(test.priceDiscount).toLocaleString("id-ID")}
            </p>
            <p className="text-sm line-through text-gray-500">
              Rp {Number(price).toLocaleString("id-ID")}
            </p>
          </div>
          {test.percentDiscount ? (
            <p className="text-xs text-green-600 font-semibold">
              🎉 Diskon {test.percentDiscount}%
            </p>
          ) : null}
        </div>
      );
    }

    return (
      <p className="text-lg font-extrabold text-blue-600">
        Rp {Number(price).toLocaleString("id-ID")}
      </p>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          />
          <motion.p
            className="mt-6 text-lg font-semibold text-blue-600 animate-pulse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Sedang memuat daftar tes psikologi...
          </motion.p>
          <motion.p
            className="mt-3 text-sm text-gray-600 italic text-center max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            “Kesabaran adalah bagian dari perjalanan mengenal diri.”
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div>
            <h1 className="text-4xl font-extrabold animate-gradient-text animate-gradient-hover">
              ✨ Daftar Tes Psikologi
            </h1>

            <motion.p
              className="text-gray-600 mt-2 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Pilih tes sesuai kebutuhanmu untuk berkembang lebih baik
            </motion.p>

            <motion.span
              className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
            >
              🎯 {tests.length} Tes tersedia
            </motion.span>

            <motion.blockquote
              className="mt-4 italic text-blue-800 text-lg border-l-4 border-blue-400 pl-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              "{randomQuote}"
            </motion.blockquote>

            <motion.div
              className="mt-4 flex flex-wrap gap-2"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.1 },
                },
              }}
            >
              {[
                {
                  text: "✅ Hasil Akurat",
                  color: "bg-green-100 text-green-700",
                },
                { text: "🕒 Cepat", color: "bg-purple-100 text-purple-700" },
                {
                  text: "👩‍⚕️ Psikolog Profesional",
                  color: "bg-blue-100 text-blue-700",
                },
                { text: "🔒 Data Aman", color: "bg-pink-100 text-pink-700" },
              ].map((badge, i) => (
                <motion.span
                  key={i}
                  className={`px-3 py-1 rounded-full text-sm ${badge.color}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.15 }}
                >
                  {badge.text}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Right section: sort + view toggle */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 items-center"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <select
              value={sortOption}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "availableOnly") {
                  setShowAvailableOnly((prev) => !prev);
                  return;
                }
                setSortOption(value);
              }}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 shadow-sm"
            >
              <option>Harga Terendah</option>
              <option>Harga Tertinggi</option>
              <option>Nama A-Z</option>
              <option>Nama Z-A</option>
              <option value="availableOnly">
                {showAvailableOnly
                  ? "Tampilkan Semua Tes"
                  : "Hanya yang Sudah Hadir"}
              </option>
            </select>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setView("list")}
                className={`p-2 rounded-lg transition-colors duration-300 ${
                  view === "list"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 border"
                }`}
              >
                <Rows size={20} />
              </button>
              <button
                onClick={() => setView("grid")}
                className={`p-2 rounded-lg transition-colors duration-300 ${
                  view === "grid"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 border"
                }`}
              >
                <LayoutGrid size={20} />
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Content */}
        {view === "list" && (
          <div className="space-y-5">
            {filteredTests.map((test, index) => (
              <AnimatedOnScroll key={index} delay={0.05 * index} duration={0.6}>
                <Link
                  href={
                    test.comingSoon
                      ? "#"
                      : `/tes/${
                          test.originalName
                            ?.toLowerCase()
                            .replace(/\s+/g, "-") ||
                          test.name.toLowerCase().replace(/\s+/g, "-")
                        }`
                  }
                  className={`flex bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden hover:scale-[1.01] ${
                    test.comingSoon ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  <div className="relative w-48 h-32 flex-shrink-0">
                    <Image
                      src={test.img || "/fallback.jpg"}
                      alt={test.name}
                      fill
                      className="object-cover"
                    />
                    {test.comingSoon && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold bg-black/60 px-2 py-1 rounded-full">
                          Segera Hadir
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <h3 className="text-lg font-bold text-gray-900">
                      {test.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {test.desc}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      {test.comingSoon ? (
                        <span className="px-3 py-1 rounded-full bg-gray-400 text-white text-xs font-semibold cursor-not-allowed">
                          Segera Hadir
                        </span>
                      ) : (
                        <>
                          {renderPrice(test)}
                          <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold">
                            Lihat Detail
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              </AnimatedOnScroll>
            ))}
          </div>
        )}

        {view === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTests.map((test, index) => (
              <AnimatedOnScroll key={index} delay={0.05 * index} duration={0.6}>
                <Link
                  href={
                    test.comingSoon
                      ? "#"
                      : `/tes/${
                          test.originalName
                            ?.toLowerCase()
                            .replace(/\s+/g, "-") ||
                          test.name.toLowerCase().replace(/\s+/g, "-")
                        }`
                  }
                  className={`group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition flex flex-col hover:scale-[1.02] ${
                    test.comingSoon ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  <div className="relative w-full h-48">
                    <Image
                      src={test.img || "/fallback.jpg"}
                      alt={test.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <h3 className="absolute bottom-3 left-3 text-xl font-bold text-white drop-shadow-md">
                      {test.name}
                    </h3>
                    {test.comingSoon && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white text-sm font-semibold bg-black/60 px-3 py-1 rounded-full">
                          Segera Hadir
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                      {test.desc}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      {test.comingSoon ? (
                        <span className="px-3 py-1 rounded-full bg-gray-400 text-white text-xs font-semibold cursor-not-allowed">
                          Segera Hadir
                        </span>
                      ) : (
                        <>
                          {renderPrice(test)}
                          <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold">
                            Lihat Detail
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              </AnimatedOnScroll>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Memuat dashboard...</div>}>
      <DashboardInner />
    </Suspense>
  );
}
