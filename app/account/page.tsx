"use client";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EditProfile from "@/components/account/editprofile";

interface User {
  id: number;
  email: string;
  fullName: string;
  role?: string;
  birthDate?: string;
  createdAt?: string;
  updatedAt?: string;
  profileImage?: string;
  ttdUrl?: string;
  lembagalayanan?: string;
  strNumber?: number;
  sippNumber?: number;
  phone?: number;
  address?: number;
  education?: string;
}

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [testHistory, setTestHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [ttdPreview, setTtdPreview] = useState<string>(""); // Untuk preview file baru
  const [savedTtd, setSavedTtd] = useState<string>(""); // Untuk TTD yang sudah tersimpan
  const [isSavingTtd, setIsSavingTtd] = useState(false);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Hitung pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const paginatedTests = testHistory.slice(indexOfFirstRow, indexOfLastRow);
  const { toast } = useToast();

  // 🔹 Ambil user via API middleware
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        if (!data.user) router.push("/login");
        else {
          setUser(data.user);
          console.log("Fetched user with ttdUrl:", data.user.ttdUrl);
          console.log("TTD saved (partial):", data.user.ttdUrl?.slice(0, 50));

          // Set savedTtd dengan ttdUrl yang ada
          setSavedTtd(data.user.ttdUrl || "");
          // Reset ttdPreview karena ini untuk file baru
          setTtdPreview("");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  // 🔹 Ambil riwayat tes user
  useEffect(() => {
    if (
      user &&
      !["PSIKOLOG", "SUPERADMIN", "PERUSAHAAN"].includes(user.role || "")
    ) {
      const fetchTestHistory = async () => {
        setIsLoadingHistory(true);
        try {
          const res = await fetch(`/api/user/${user.id}/attempts`, {
            credentials: "include",
          });
          if (!res.ok) throw new Error("Gagal mengambil riwayat tes");
          const data = await res.json();
          setTestHistory(data.attempts || []);
        } catch (err) {
          console.error("Error fetching test history:", err);
          setTestHistory([]);
        } finally {
          setIsLoadingHistory(false);
        }
      };
      fetchTestHistory();
    }
  }, [user]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    router.push("/login");
  };

  const handleSaveSuccess = (updatedUser: User) => {
    setUser((prev) => (prev ? { ...prev, ...updatedUser } : updatedUser));
    setSavedTtd(updatedUser.ttdUrl || "");
    setIsEditing(false);
  };

  // Handle file upload untuk TTD
  const handleTtdFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi file
    if (!file.type.startsWith("image/")) {
      alert("Hanya file gambar yang diperbolehkan");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      // 2MB
      alert("Ukuran file maksimal 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setTtdPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Simpan TTD ke database
  const handleSaveTtd = async () => {
    if (!ttdPreview || ttdPreview.trim() === "") {
      toast({
        title: "Gagal Menyimpan",
        description: "Silakan pilih file TTD terlebih dahulu!",
        variant: "warning",
        position: "center",
        duration: 3000,
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "Gagal Menyimpan",
        description: "User ID tidak ditemukan!",
        variant: "error",
        position: "center",
        duration: 3000,
      });
      return;
    }

    setIsSavingTtd(true);
    try {
      const res = await fetch("/api/update-ttd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId: user.id,
          ttd: ttdPreview,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal menyimpan TTD");
      }

      setUser((prev) => (prev ? { ...prev, ttdUrl: ttdPreview } : prev));
      setSavedTtd(ttdPreview);
      setTtdPreview("");

      toast({
        title: "Berhasil",
        description: "TTD berhasil disimpan!",
        variant: "success",
        position: "center",
        duration: 3000,
      });
    } catch (err: any) {
      console.error("Error saving TTD:", err);
      toast({
        title: "Gagal Menyimpan",
        description: err.message || "Terjadi kesalahan saat menyimpan TTD.",
        variant: "error",
        position: "center",
        duration: 3000,
      });
    } finally {
      setIsSavingTtd(false);
    }
  };

  // Reset TTD
  const handleResetTtd = () => {
    setTtdPreview(""); // Clear preview file baru
  };

  // // Delete TTD
  // const handleDeleteTtd = async () => {
  //   if (!confirm("Apakah Anda yakin ingin menghapus TTD yang tersimpan?")) {
  //     return;
  //   }

  //   setIsSavingTtd(true);
  //   try {
  //     const res = await fetch("/api/update-ttd", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       credentials: "include",
  //       body: JSON.stringify({
  //         userId: user?.id,
  //         ttd: "" // Kosongkan TTD
  //       }),
  //     });

  //     const data = await res.json();
  //     if (!res.ok) {
  //       throw new Error(data.message || "Gagal menghapus TTD");
  //     }

  //     // Update state
  //     setUser(prev => prev ? { ...prev, ttdUrl: "" } : prev);
  //     setSavedTtd("");
  //     setTtdPreview("");
  //     alert("TTD berhasil dihapus!");
  //   } catch (err: any) {
  //     console.error('Error deleting TTD:', err);
  //     alert("Gagal menghapus TTD: " + err.message);
  //   } finally {
  //     setIsSavingTtd(false);
  //   }
  // };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-lg font-medium text-gray-700">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

        {/* Profil Utama */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 flex items-center space-x-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 flex items-center justify-center bg-blue-600 text-white text-3xl font-semibold">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span>
                {user.fullName
                  ? (() => {
                      const parts = user.fullName.trim().split(" ");
                      const first = parts[0]?.[0] || "";
                      const last =
                        parts.length > 1 ? parts[parts.length - 1][0] : "";
                      return (first + last).toUpperCase();
                    })()
                  : "?"}
              </span>
            )}
          </div>

          <div className="flex-grow">
            <h2 className="text-xl font-semibold text-gray-900">
              {user.fullName || "Nama Pengguna"}
            </h2>
            <p className="text-sm text-gray-600">{user.role || "User"}</p>
          </div>

          <div>
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <span>Edit profile</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.187 1.187 3.712 3.712 1.187-1.187a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                <path d="M5.25 5.25a3 3 0 003 3h.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H8.25a3 3 0 00-3 3z" />
              </svg>
            </button>
          </div>
        </div>

        {/* TTD Section - hanya untuk PSIKOLOG */}
        {user.role === "PSIKOLOG" && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Tanda Tangan Digital
            </h3>

            {/* TTD yang sudah tersimpan */}
            {savedTtd && (
              <div className="mb-6">
                {/*  <label className="block text-sm font-medium text-gray-700 mb-2">
                  TTD Tersimpan:
                </label> */}
                {/* 
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex items-center justify-center">
                  {savedTtd && savedTtd.startsWith("data:image") && (
  <img
    src={savedTtd}
    alt="TTD Tersimpan"
    className="max-w-full max-h-32 object-contain"
  />
)}

                </div>
                */}

                {/* <div className="mt-2 flex justify-end">
                  <button
                    onClick={handleDeleteTtd}
                    disabled={isSavingTtd}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Hapus TTD
                  </button>
                </div> */}
              </div>
            )}

            {/* Upload TTD Baru */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">
                {savedTtd ? "Ganti TTD:" : "Upload TTD Baru:"}
              </h4>

              {/* Preview file baru */}
              {ttdPreview && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview File Baru:
                  </label>
                  <div className="border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
                    <div className="flex justify-center">
                      <img
                        src={ttdPreview}
                        alt="TTD Tersimpan"
                        className="w-40 h-auto object-contain rounded-md shadow"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Upload File */}
              <div className="mb-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleTtdFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: JPG, PNG. Maksimal 2MB.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveTtd}
                  disabled={!ttdPreview || isSavingTtd}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    ttdPreview && !isSavingTtd
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isSavingTtd
                    ? "Menyimpan..."
                    : savedTtd
                      ? "Ganti TTD"
                      : "Simpan TTD"}
                </button>

                {ttdPreview && (
                  <button
                    onClick={handleResetTtd}
                    disabled={isSavingTtd}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Batal
                  </button>
                )}
              </div>

              {/* Status Info */}
              {savedTtd && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    ✓ TTD telah tersimpan dan akan digunakan untuk validasi
                    dokumen
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 🌟 Informasi Pribadi */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Personal Information
            </h3>
          </div>

          {/* USER */}
          {user.role === "USER" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <label className="block text-gray-500">Full Name</label>
                <p className="font-medium text-gray-800">
                  {user.fullName || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-gray-500">Date of Birth</label>
                <p className="font-medium text-gray-800">
                  {user.birthDate
                    ? new Date(user.birthDate).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-gray-500">Email</label>
                <p className="font-medium text-gray-800">
                  {user.email || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-gray-500">Education</label>
                <p className="font-medium text-gray-800">
                  {user.education || "N/A"}
                </p>
              </div>
            </div>
          )}

          {/* PSIKOLOG */}
          {user.role === "PSIKOLOG" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <label className="block text-gray-500">Full Name</label>
                <p className="font-medium text-gray-800">
                  {user.fullName || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-gray-500">Email</label>
                <p className="font-medium text-gray-800">
                  {user.email || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-gray-500">
                  Fasyankes / Lembaga Layanan Psikologi
                </label>
                <p className="font-medium text-gray-800">
                  {user.lembagalayanan || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-gray-500">Nomor STR / SIK</label>
                <p className="font-medium text-gray-800">
                  {user.strNumber || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-gray-500">
                  Nomor SIPP / SIPPK
                </label>
                <p className="font-medium text-gray-800">
                  {user.sippNumber || "N/A"}
                </p>
              </div>
            </div>
          )}

          {/* PERUSAHAAN */}
          {user.role === "PERUSAHAAN" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <label className="block text-gray-500">Full Name</label>
                <p className="font-medium text-gray-800">
                  {user.fullName || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-gray-500">Email</label>
                <p className="font-medium text-gray-800">
                  {user.email || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-gray-500">Address</label>
                <p className="font-medium text-gray-800">
                  {user.address || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-gray-500">Phone</label>
                <p className="font-medium text-gray-800">
                  {user.phone || "N/A"}
                </p>
              </div>
            </div>
          )}

          {/* ADMIN / SUPERADMIN */}
          {(user.role === "SUPERADMIN" || user.role === "ADMIN") && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <label className="block text-gray-500">Full Name</label>
                <p className="font-medium text-gray-800">
                  {user.fullName || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-gray-500">Email</label>
                <p className="font-medium text-gray-800">
                  {user.email || "N/A"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Riwayat Tes hanya untuk role "USER" biasa */}
        {!["PSIKOLOG", "SUPERADMIN", "PERUSAHAAN"].includes(
          user.role || "",
        ) && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Riwayat Tes
            </h3>

            {/* Statistik ringkasan tes */}
            {!isLoadingHistory &&
              testHistory.length > 0 &&
              (() => {
                const totalTes = testHistory.length;
                const totalSelesai = testHistory.filter(
                  (t) => t.status === "Selesai",
                ).length;
                const totalVerifikasi = testHistory.filter(
                  (t) => t.status === "Sedang diverifikasi psikolog",
                ).length;
                const totalDikerjakan =
                  testHistory.filter((t) => t.status === "Dikerjakan").length ||
                  0; // opsional jika ada status ini

                return (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <p className="text-xs text-blue-600 font-medium">
                        Total Tes Dibeli
                      </p>
                      <p className="text-2xl font-bold text-blue-700">
                        {totalTes}
                      </p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg text-center">
                      <p className="text-xs text-yellow-600 font-medium">
                        Sedang Diverifikasi
                      </p>
                      <p className="text-2xl font-bold text-yellow-700">
                        {totalVerifikasi}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <p className="text-xs text-green-600 font-medium">
                        Tes Selesai
                      </p>
                      <p className="text-2xl font-bold text-green-700">
                        {totalSelesai}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <p className="text-xs text-gray-600 font-medium">
                        Sedang Dikerjakan
                      </p>
                      <p className="text-2xl font-bold text-gray-700">
                        {totalDikerjakan}
                      </p>
                    </div>
                  </div>
                );
              })()}

            {/* Pagination dan jumlah baris */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <label className="text-sm text-gray-700 mr-2">
                  Rows per page:
                </label>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-md text-sm px-2 py-1"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <div className="text-sm text-gray-600">
                Page {currentPage} of{" "}
                {Math.ceil(testHistory.length / rowsPerPage) || 1}
              </div>
            </div>

            <div className="overflow-x-auto">
              {isLoadingHistory ? (
                <p className="text-center text-gray-500 py-4">
                  Memuat riwayat...
                </p>
              ) : testHistory.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                        Nama Tes
                      </th>
                      <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                        Tanggal Pengerjaan
                      </th>
                      <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                        Hasil Test
                      </th>
                      {/*<th className="px-6 py-3 relative"><span className="sr-only">Aksi</span></th> */}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedTests.map((historyItem) => (
                      <tr key={historyItem.id}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          {historyItem.testType.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {new Date(historyItem.completedAt).toLocaleDateString(
                            "id-ID",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              historyItem.status === "Selesai"
                                ? "bg-green-100 text-green-800"
                                : historyItem.status ===
                                    "Sedang diverifikasi psikolog"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {historyItem.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                          {historyItem.status === "Selesai" ? (
                            <a
                              href={`/tes/hasil/${historyItem.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Lihat Hasil
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-gray-500 py-4">
                  Anda belum pernah mengerjakan tes apapun.
                </p>
              )}
            </div>

            {/* Navigasi halaman */}
            {!isLoadingHistory && testHistory.length > 0 && (
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-200 transition"
                >
                  Prev
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(
                        Math.ceil(testHistory.length / rowsPerPage),
                        p + 1,
                      ),
                    )
                  }
                  disabled={
                    currentPage === Math.ceil(testHistory.length / rowsPerPage)
                  }
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-200 transition"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tombol Logout */}
        <div className="mt-8 text-center">
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            Logout
          </button>
        </div>

        {isEditing && (
          <EditProfile
            user={user}
            onClose={() => setIsEditing(false)}
            onSave={handleSaveSuccess}
          />
        )}
      </div>
      <Toaster />
    </main>
  );
}
