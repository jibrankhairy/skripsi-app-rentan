// // app/api/attempts/[id]/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import jwt from "jsonwebtoken";


// // helper untuk ambil kategori dominan
// // function getDominantKategori(aspekArr: any[]) {
// //   if (!Array.isArray(aspekArr)) return "-";
// //   const count: Record<string, number> = {};
// //   aspekArr.forEach(a => {
// //     if (!a?.kategori) return;
// //     count[a.kategori] = (count[a.kategori] || 0) + 1;
// //   });

// //   let dominant = "-";
// //   let max = -1;
// //   for (const [kat, val] of Object.entries(count)) {
// //     if (val > max) {
// //       max = val;
// //       dominant = kat;
// //     }
// //   }
// //   return dominant;
// // }


// function getDominantKategori(aspekArr: any[]) {
//   if (!Array.isArray(aspekArr)) return "-";
//   const count: Record<string, number> = {};
//   aspekArr.forEach(a => {
//     if (!a?.kategori) return;
//     count[a.kategori] = (count[a.kategori] || 0) + 1;
//   });

//   let max = Math.max(...Object.values(count));
//   const candidates = Object.entries(count)
//     .filter(([_, val]) => val === max)
//     .map(([kat]) => kat);

//   if (candidates.length === 1) {
//     return candidates[0]; // dominan jelas
//   }

//   // 🔹 seri: pakai prioritas
//   const priority = ["T", "B", "C", "K", "R"];
//   for (const p of priority) {
//     if (candidates.includes(p)) return p;
//   }

//   return "-";
// }
// const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

// export async function GET(req: NextRequest) {
  
//   try {
//         const url = new URL(req.url);
//     const attemptId = Number(url.pathname.split("/").pop()); // /api/attempts/99 → 99
//     if (!attemptId) {
//       return NextResponse.json({ error: "Invalid attempt ID" }, { status: 400 });
//     }
    
//     // Ambil token dari cookie (atau header jika pakai Bearer)
//     const authToken = req.cookies.get("token")?.value;
// if (!authToken) 
//   return NextResponse.json(
//     { error: "Anda harus login terlebih dahulu untuk melihat hasil test." },
//     { status: 401 }
//   );
//    let decoded: any;
//  try {
//   decoded = jwt.verify(authToken, JWT_SECRET);
// } catch {
//   return NextResponse.json(
//     { error: "Token tidak valid. Silakan login ulang." },
//     { status: 401 }
//   );
// }


//     const userId = decoded.id;
//     const userRole = decoded.role;

//     const attempt = await prisma.testAttempt.findUnique({
//       where: { id: attemptId },
//       include: {
//         User: true,
//         TestType: true,
//         subtestResults: { include: { SubTest: true } },
//         results: {
//           include: { 
//             summaryTemplate: true,
//             ValidatedBy: true,
//           },
//           orderBy: { id: "desc" },
//         },
//         answers: true,
//       },
//     });

//     if (!attempt) {
//       return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
//     }
//  // --- Proteksi akses ---
//     const isOwner = attempt.userId === userId;
//     const isCompany = attempt.companyId === userId;
//     const isPsikolog = userRole === "PSIKOLOG";

//     if (!isOwner && !isCompany && !isPsikolog) {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//     }
    
//     // --- SubtestResults
//     const subtestResults = attempt.subtestResults.map((s:any) => ({
//       ...s,
//       rw: s.rw ?? 0,
//       sw: s.sw ?? 0,
//       kategori: s.kategori ?? "-",
//     }));

//     // --- IST result (selain CPMI)
//     //const istResultRaw = attempt.results.find(r => r.testTypeId !== 30);
//     const istResultRaw = attempt.results.find((r: any) => r.testTypeId !== 30);
//     const totalResult = istResultRaw
//       ? {
//           totalRw: istResultRaw.totalRw ?? 0,
//           totalSw: istResultRaw.swIq ?? 0,
//           iq: istResultRaw.iq ?? null,
//           keteranganiq: istResultRaw.keteranganiq ?? null,
//           dominasi: istResultRaw.dominasi ?? null,
//           kesimpulan: istResultRaw.kesimpulan 
//             ?? istResultRaw.summaryTemplate?.template 
//             ?? "-",
//           // 🔹 pakai TTD asli dari User
//           ttdUrl: attempt.User?.ttdUrl || null,
//           ttdHash: attempt.User?.ttdHash || null,
//           ValidatedBy: istResultRaw.ValidatedBy 
//             ? {
//                 fullName: istResultRaw.ValidatedBy.fullName,
//                 lembagalayanan: istResultRaw.ValidatedBy.lembagalayanan,
                
//               }
//             : null,
//         }
//       : null;

//    // --- CPMI result (testTypeId = 30)
// const cpmiResultRaw = attempt.results.find((r:any) => r.testTypeId === 30);
// let cpmiResult = null;

// if (cpmiResultRaw) {
//   const rawAny = cpmiResultRaw as any; // 👉 cast ke any biar bisa akses aspek1, aspek2, dst.

//   // helper parsing aspek
//   const parseAspek = (val: any) => {
//     try {
//       if (Array.isArray(val)) return val;
//       if (typeof val === "string") return JSON.parse(val);
//       return [];
//     } catch {
//       return [];
//     }
//   };

//   const aspekData: Record<string, any[]> = {};
//   for (let i = 1; i <= 4; i++) {
//     aspekData[`aspek${i}`] = parseAspek(rawAny[`aspek${i}`]);
//   }
// // 🔹 hitung dominan per aspek
// const dominantAspek: Record<string, string> = {};
// for (let i = 1; i <= 4; i++) {
//   dominantAspek[`dominant${i}`] = getDominantKategori(aspekData[`aspek${i}`]);
// }

//   let kesimpulan = cpmiResultRaw.kesimpulan 
//     ?? cpmiResultRaw.summaryTemplate?.template 
//     ?? "-";

//   if (attempt.User?.fullName) {
//     kesimpulan = kesimpulan.replace(/{name}/g, attempt.User.fullName);
//   }
//   const sikapTpl = await prisma.summaryTemplate.findFirst({
//   where: {
//     testTypeId: 30,
//     section: "Sikap & Cara Kerja",
//     category: dominantAspek.dominant2,
//   },
// });
// const kepribadianTpl = await prisma.summaryTemplate.findFirst({
//   where: {
//     testTypeId: 30,
//     section: "Kepribadian",
//     category: dominantAspek.dominant1, // aspek ke-1 untuk Kepribadian
//   },
// });

// const belajarTpl = await prisma.summaryTemplate.findFirst({
//   where: {
//     testTypeId: 30,
//     section: "Kemampuan Belajar",
//     category: dominantAspek.dominant3, // aspek ke-3 untuk Belajar
//   },
// });

// const kesimpulanKepribadian =
//   cpmiResultRaw.kesimpulanKepribadian && cpmiResultRaw.kesimpulanKepribadian.trim() !== ""
//     ? cpmiResultRaw.kesimpulanKepribadian
//     : kepribadianTpl
//     ? kepribadianTpl.template.replace(/{name}/g, attempt.User?.fullName || "")
//     : "";

// const kesimpulanBelajar =
//   cpmiResultRaw.kesimpulanBelajar && cpmiResultRaw.kesimpulanBelajar.trim() !== ""
//     ? cpmiResultRaw.kesimpulanBelajar
//     : belajarTpl
//     ? belajarTpl.template.replace(/{name}/g, attempt.User?.fullName || "")
//     : "";

// const kesimpulanSikap =
//   cpmiResultRaw.kesimpulanSikap && cpmiResultRaw.kesimpulanSikap.trim() !== ""
//     ? cpmiResultRaw.kesimpulanSikap
//     : sikapTpl
//     ? sikapTpl.template.replace(/{name}/g, attempt.User?.fullName || "")
//     : "";

    
// function getKesimpulanUmum(iq: number, name: string) {
//   if (iq >= 90) {
//     return `Sdr. ${name} DISARANKAN untuk bekerja ke luar negeri.`;
//   } else {
//     return `Sdr. ${name} TIDAK DISARANKAN untuk bekerja ke luar negeri.`;
//   }
// }

// const kesimpulanUmum = cpmiResultRaw.kesimpulanumum && cpmiResultRaw.kesimpulanumum.trim() !== ""
//   ? cpmiResultRaw.kesimpulanumum
//   : getKesimpulanUmum(cpmiResultRaw.scoreiq ?? 0, attempt.User?.fullName || "");


// const saranTpl = await prisma.summaryTemplate.findFirst({
//   where: {
//     testTypeId: 30,
//     section: "Saran Pengembangan",
//   },
// });

// // const saranPengembangan = saranTpl
// //   ? saranTpl.template.replace(/{name}/g, attempt.User?.fullName || "")
// //   : "";

// const saranPengembangan = cpmiResultRaw.saranpengembangan && cpmiResultRaw.saranpengembangan.trim() !== ""
//   ? cpmiResultRaw.saranpengembangan
//   : `Disarankan Sdr. ${attempt.User?.fullName || ""} untuk terus mengembangkan keterampilan, menjaga konsistensi dalam bekerja, serta meningkatkan kemampuan adaptasi terhadap hal-hal baru.`;

//   cpmiResult = {
//     id: cpmiResultRaw.id,
//     jumlahbenar: cpmiResultRaw.jumlahbenar ?? 0,
//     scoreiq: cpmiResultRaw.scoreiq ?? 0,
//     keteranganiqCPMI: cpmiResultRaw.keteranganiqCPMI ?? "-",
//     kesimpulan,
//     // kesimpulanSikap: cpmiResultRaw.kesimpulanSikap ?? "",
//     kesimpulanSikap,
//       kesimpulanKepribadian,
//   kesimpulanBelajar,
//    // kesimpulanKepribadian: cpmiResultRaw.kesimpulanKepribadian ?? "",
//    // kesimpulanBelajar: cpmiResultRaw.kesimpulanBelajar ?? "",
//    kesimpulanumum: kesimpulanUmum,
//    // kesimpulanumum: cpmiResultRaw.kesimpulanumum ?? "",
// //saranpengembangan: cpmiResultRaw.saranpengembangan ?? "",
// saranpengembangan: saranPengembangan,
//  layak: cpmiResultRaw.layak ?? false,
//   belumLayak: cpmiResultRaw.belumLayak ?? false,
//   tidakLayak:cpmiResultRaw.tidakLayak ?? false,

//     ttdUrl: attempt.User?.ttdUrl || null,
//     ttdHash: attempt.User?.ttdHash || null,
//     barcode: cpmiResultRaw.barcode ?? null,
//     barcodettd: cpmiResultRaw.barcodettd ?? null,
//     expiresAt: cpmiResultRaw.expiresAt ?? null,
//     dominantAspek,
    

//     ValidatedBy: cpmiResultRaw.ValidatedBy
//       ? {
//           fullName: cpmiResultRaw.ValidatedBy.fullName,
//           lembagalayanan: cpmiResultRaw.ValidatedBy.lembagalayanan,
//           strNumber: cpmiResultRaw.ValidatedBy.strNumber,
//           sippNumber: cpmiResultRaw.ValidatedBy.sippNumber,
//         }
//       : null,

//     // 🔹 semua aspek hasil parsing
//     ...aspekData,
//   };
// }

//     const msdtResultRaw = attempt.results.find((r:any) => r.testTypeId !== 30); // sama seperti istResultRaw

// const msdtResult = msdtResultRaw
//   ? {
//       // Nilai MSDT per tipe
//       Ds: msdtResultRaw.Ds ?? 0,
//       Mi: msdtResultRaw.Mi ?? 0,
//       Au: msdtResultRaw.Au ?? 0,
//       Co: msdtResultRaw.Co ?? 0,
//       Bu: msdtResultRaw.Bu ?? 0,
//       Dv: msdtResultRaw.Dv ?? 0,
//       Ba: msdtResultRaw.Ba ?? 0,
//       E: msdtResultRaw.E ?? 0,

//       // Total Skala
//       totalSkalaTO: msdtResultRaw.totalSkalaTO ?? 0,
//       totalSkalaRO: msdtResultRaw.totalSkalaRO ?? 0,
//       totalSkalaE: msdtResultRaw.totalSkalaE ?? 0,
//       totalSkalaO: msdtResultRaw.totalSkalaO ?? 0,

//       konversiTO: msdtResultRaw.konversiTO ?? 0,
//       konversiE: msdtResultRaw.konversiE ?? 0,
//       konversiRO: msdtResultRaw.konversiRO ?? 0,
//       konversiO: msdtResultRaw.konversiO ?? 0,

//       // Hasil Akhir
//       hasilAkhir: msdtResultRaw.hasilAkhir ?? "",

//       // Barcode & validasi
//       barcodettd: msdtResultRaw.barcodettd ?? "",

//       // Bisa juga bawa info tambahan jika perlu
//       kesimpulan: msdtResultRaw.kesimpulan ?? msdtResultRaw.summaryTemplate?.template ?? "-",
//       ValidatedBy: msdtResultRaw.ValidatedBy
//         ? {
//             fullName: msdtResultRaw.ValidatedBy.fullName,
//             lembagalayanan: msdtResultRaw.ValidatedBy.lembagalayanan,
//           }
//         : null,
//       ttdUrl: attempt.User?.ttdUrl || null,
//       ttdHash: attempt.User?.ttdHash || null,
//     }
//   : null;

//     const psikologTTD = attempt.results?.[0]?.ValidatedBy
//       ? attempt.results[0].ValidatedBy.ttdUrl
//       : attempt.User?.ttdUrl || null;

//     const testTypeData = {
//       id: attempt.TestType?.id,
//       name: attempt.TestType?.name || `TEST_${attempt.TestType?.id}`,
//       code: attempt.TestType?.id || attempt.TestType?.name || "IST",
//     };

//     return NextResponse.json({
//       attempt: { ...attempt, TestType: testTypeData },
//       subtestResults,
//       result: totalResult,
//       cpmiResult,
//       msdtResult,
//       ttd: psikologTTD,
//     });
//   } catch (err: any) {
//     console.error("Error in attempts API:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }
// // export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
// //   const attemptId = Number(params.id);
// //   const body = await req.json();
// //   const { saranPengembangan, kesimpulanSikap, kesimpulanKepribadian, kesimpulanBelajar } = body;

// //   const resultToUpdate = await prisma.result.findFirst({
// //     where: { attemptId: attemptId, testTypeId: 30 } // CPMI
// //   });

// //   if (!resultToUpdate) return NextResponse.json({ error: "Result not found" }, { status: 404 });

// // const updated = await prisma.result.update({
// //   where: { id: resultToUpdate.id },
// //   data: { 
// //     saranpengembangan: saranPengembangan, // <== huruf kecil sesuai DB
// //     kesimpulanSikap,
// //     kesimpulanKepribadian,
// //     kesimpulanBelajar,
// //   },
// // });


// //   return NextResponse.json(updated);
// // }

// app/api/attempts/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";


function getDominantKategori(aspekArr: any[]) {
  if (!Array.isArray(aspekArr)) return "-";
  const count: Record<string, number> = {};
  aspekArr.forEach(a => {
    if (!a?.kategori) return;
    count[a.kategori] = (count[a.kategori] || 0) + 1;
  });

  let max = Math.max(...Object.values(count));
  const candidates = Object.entries(count)
    .filter(([_, val]) => val === max)
    .map(([kat]) => kat);

  if (candidates.length === 1) {
    return candidates[0]; // dominan jelas
  }

  // 🔹 seri: pakai prioritas
  const priority = ["T", "B", "C", "K", "R"];
  for (const p of priority) {
    if (candidates.includes(p)) return p;
  }

  return "-";
}
const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

export async function GET(req: NextRequest) {
  
  try {
        const url = new URL(req.url);
    const attemptId = Number(url.pathname.split("/").pop()); // /api/attempts/99 → 99
    if (!attemptId) {
      return NextResponse.json({ error: "Invalid attempt ID" }, { status: 400 });
    }
    
    // Ambil token dari cookie (atau header jika pakai Bearer)
    const cookieToken = req.cookies.get("token")?.value;
const authHeader = req.headers.get("authorization") || "";
const bearerToken = authHeader.startsWith("Bearer ")
  ? authHeader.slice(7)
  : null;

    const authToken = cookieToken || bearerToken;   // ✅ pakai salah satu

if (!authToken) 
  return NextResponse.json(
    { error: "Anda harus login terlebih dahulu untuk melihat hasil test." },
    { status: 401 }
  );
   let decoded: any;
 try {
  decoded = jwt.verify(authToken, JWT_SECRET);
} catch {
  return NextResponse.json(
    { error: "Token tidak valid. Silakan login ulang." },
    { status: 401 }
  );
}


    const userId = decoded.id;
    const userRole = decoded.role;

    const attempt = await prisma.testAttempt.findUnique({
      where: { id: attemptId },
      include: {
        User: true,
        TestType: true,
        subtestResults: { include: { SubTest: true } },
        results: {
          include: { 
            summaryTemplate: true,
            ValidatedBy: true,
          },
          orderBy: { id: "desc" },
        },
        answers: true,
      },
    });

    if (!attempt) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
    }
 // --- Proteksi akses ---
    // const isOwner = attempt.userId === userId;
    const isCompany = attempt.companyId === userId;
    const isPsikolog = userRole === "PSIKOLOG";

    // if (!isOwner && !isCompany && !isPsikolog) {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }
    
    // --- SubtestResults
    const subtestResults = attempt.subtestResults.map((s:any) => ({
      ...s,
      rw: s.rw ?? 0,
      sw: s.sw ?? 0,
      kategori: s.kategori ?? "-",
    }));

    // --- IST result (selain CPMI)
    //const istResultRaw = attempt.results.find(r => r.testTypeId !== 30);
    const istResultRaw = attempt.results.find((r: any) => r.testTypeId !== 30);
    const totalResult = istResultRaw
      ? {
          totalRw: istResultRaw.totalRw ?? 0,
          totalSw: istResultRaw.swIq ?? 0,
          iq: istResultRaw.iq ?? null,
          keteranganiq: istResultRaw.keteranganiq ?? null,
          dominasi: istResultRaw.dominasi ?? null,
          kesimpulan: istResultRaw.kesimpulan 
            ?? istResultRaw.summaryTemplate?.template 
            ?? "-",
          // 🔹 pakai TTD asli dari User
          ttdUrl: attempt.User?.ttdUrl || null,
          ttdHash: attempt.User?.ttdHash || null,
          ValidatedBy: istResultRaw.ValidatedBy 
            ? {
                fullName: istResultRaw.ValidatedBy.fullName,
                lembagalayanan: istResultRaw.ValidatedBy.lembagalayanan,
                
              }
            : null,
        }
      : null;

   // --- CPMI result (testTypeId = 30)
const cpmiResultRaw = attempt.results.find((r:any) => r.testTypeId === 30);
let cpmiResult = null;

if (cpmiResultRaw) {
  const rawAny = cpmiResultRaw as any; // 👉 cast ke any biar bisa akses aspek1, aspek2, dst.

  // helper parsing aspek
  const parseAspek = (val: any) => {
    try {
      if (Array.isArray(val)) return val;
      if (typeof val === "string") return JSON.parse(val);
      return [];
    } catch {
      return [];
    }
  };

  const aspekData: Record<string, any[]> = {};
  for (let i = 1; i <= 4; i++) {
    aspekData[`aspek${i}`] = parseAspek(rawAny[`aspek${i}`]);
  }
// 🔹 hitung dominan per aspek
const dominantAspek: Record<string, string> = {};
for (let i = 1; i <= 4; i++) {
  dominantAspek[`dominant${i}`] = getDominantKategori(aspekData[`aspek${i}`]);
}

  let kesimpulan = cpmiResultRaw.kesimpulan 
    ?? cpmiResultRaw.summaryTemplate?.template 
    ?? "-";

  if (attempt.User?.fullName) {
    kesimpulan = kesimpulan.replace(/{name}/g, attempt.User.fullName);
  }
  const sikapTpl = await prisma.summaryTemplate.findFirst({
  where: {
    testTypeId: 30,
    section: "Sikap & Cara Kerja",
    category: dominantAspek.dominant2,
  },
});
const kepribadianTpl = await prisma.summaryTemplate.findFirst({
  where: {
    testTypeId: 30,
    section: "Kepribadian",
    category: dominantAspek.dominant1, // aspek ke-1 untuk Kepribadian
  },
});

const belajarTpl = await prisma.summaryTemplate.findFirst({
  where: {
    testTypeId: 30,
    section: "Kemampuan Belajar",
    category: dominantAspek.dominant3, // aspek ke-3 untuk Belajar
  },
});

const kesimpulanKepribadian =
  cpmiResultRaw.kesimpulanKepribadian && cpmiResultRaw.kesimpulanKepribadian.trim() !== ""
    ? cpmiResultRaw.kesimpulanKepribadian
    : kepribadianTpl
    ? kepribadianTpl.template.replace(/{name}/g, attempt.User?.fullName || "")
    : "";

const kesimpulanBelajar =
  cpmiResultRaw.kesimpulanBelajar && cpmiResultRaw.kesimpulanBelajar.trim() !== ""
    ? cpmiResultRaw.kesimpulanBelajar
    : belajarTpl
    ? belajarTpl.template.replace(/{name}/g, attempt.User?.fullName || "")
    : "";

const kesimpulanSikap =
  cpmiResultRaw.kesimpulanSikap && cpmiResultRaw.kesimpulanSikap.trim() !== ""
    ? cpmiResultRaw.kesimpulanSikap
    : sikapTpl
    ? sikapTpl.template.replace(/{name}/g, attempt.User?.fullName || "")
    : "";

    
function getKesimpulanUmum(iq: number, name: string) {
  if (iq >= 90) {
    return `Sdr. ${name} DISARANKAN untuk bekerja ke luar negeri.`;
  } else {
    return `Sdr. ${name} TIDAK DISARANKAN untuk bekerja ke luar negeri.`;
  }
}

const kesimpulanUmum = cpmiResultRaw.kesimpulanumum && cpmiResultRaw.kesimpulanumum.trim() !== ""
  ? cpmiResultRaw.kesimpulanumum
  : getKesimpulanUmum(cpmiResultRaw.scoreiq ?? 0, attempt.User?.fullName || "");


const saranTpl = await prisma.summaryTemplate.findFirst({
  where: {
    testTypeId: 30,
    section: "Saran Pengembangan",
  },
});

// const saranPengembangan = saranTpl
//   ? saranTpl.template.replace(/{name}/g, attempt.User?.fullName || "")
//   : "";

const saranPengembangan = cpmiResultRaw.saranpengembangan && cpmiResultRaw.saranpengembangan.trim() !== ""
  ? cpmiResultRaw.saranpengembangan
  : `Disarankan Sdr. ${attempt.User?.fullName || ""} untuk terus mengembangkan keterampilan, menjaga konsistensi dalam bekerja, serta meningkatkan kemampuan adaptasi terhadap hal-hal baru.`;

  cpmiResult = {
    id: cpmiResultRaw.id,
    jumlahbenar: cpmiResultRaw.jumlahbenar ?? 0,
    scoreiq: cpmiResultRaw.scoreiq ?? 0,
    keteranganiqCPMI: cpmiResultRaw.keteranganiqCPMI ?? "-",
    kesimpulan,
    // kesimpulanSikap: cpmiResultRaw.kesimpulanSikap ?? "",
    kesimpulanSikap,
      kesimpulanKepribadian,
  kesimpulanBelajar,
   // kesimpulanKepribadian: cpmiResultRaw.kesimpulanKepribadian ?? "",
   // kesimpulanBelajar: cpmiResultRaw.kesimpulanBelajar ?? "",
   kesimpulanumum: kesimpulanUmum,
   // kesimpulanumum: cpmiResultRaw.kesimpulanumum ?? "",
//saranpengembangan: cpmiResultRaw.saranpengembangan ?? "",
saranpengembangan: saranPengembangan,
 layak: cpmiResultRaw.layak ?? false,
  belumLayak: cpmiResultRaw.belumLayak ?? false,
  tidakLayak:cpmiResultRaw.tidakLayak ?? false,

    ttdUrl: attempt.User?.ttdUrl || null,
    ttdHash: attempt.User?.ttdHash || null,
    barcode: cpmiResultRaw.barcode ?? null,
    barcodettd: cpmiResultRaw.barcodettd ?? null,
    expiresAt: cpmiResultRaw.expiresAt ?? null,
    dominantAspek,
    

    ValidatedBy: cpmiResultRaw.ValidatedBy
      ? {
          fullName: cpmiResultRaw.ValidatedBy.fullName,
          lembagalayanan: cpmiResultRaw.ValidatedBy.lembagalayanan,
          strNumber: cpmiResultRaw.ValidatedBy.strNumber,
          sippNumber: cpmiResultRaw.ValidatedBy.sippNumber,
        }
      : null,

    // 🔹 semua aspek hasil parsing
    ...aspekData,
  };
}

    const msdtResultRaw = attempt.results.find((r:any) => r.testTypeId !== 30); // sama seperti istResultRaw

const msdtResult = msdtResultRaw
  ? {
      // Nilai MSDT per tipe
      Ds: msdtResultRaw.Ds ?? 0,
      Mi: msdtResultRaw.Mi ?? 0,
      Au: msdtResultRaw.Au ?? 0,
      Co: msdtResultRaw.Co ?? 0,
      Bu: msdtResultRaw.Bu ?? 0,
      Dv: msdtResultRaw.Dv ?? 0,
      Ba: msdtResultRaw.Ba ?? 0,
      E: msdtResultRaw.E ?? 0,

      // Total Skala
      totalSkalaTO: msdtResultRaw.totalSkalaTO ?? 0,
      totalSkalaRO: msdtResultRaw.totalSkalaRO ?? 0,
      totalSkalaE: msdtResultRaw.totalSkalaE ?? 0,
      totalSkalaO: msdtResultRaw.totalSkalaO ?? 0,

      konversiTO: msdtResultRaw.konversiTO ?? 0,
      konversiE: msdtResultRaw.konversiE ?? 0,
      konversiRO: msdtResultRaw.konversiRO ?? 0,
      konversiO: msdtResultRaw.konversiO ?? 0,

      // Hasil Akhir
      hasilAkhir: msdtResultRaw.hasilAkhir ?? "",

      // Barcode & validasi
      barcodettd: msdtResultRaw.barcodettd ?? "",

      // Bisa juga bawa info tambahan jika perlu
      kesimpulan: msdtResultRaw.kesimpulan ?? msdtResultRaw.summaryTemplate?.template ?? "-",
      ValidatedBy: msdtResultRaw.ValidatedBy
        ? {
            fullName: msdtResultRaw.ValidatedBy.fullName,
            lembagalayanan: msdtResultRaw.ValidatedBy.lembagalayanan,
          }
        : null,
      ttdUrl: attempt.User?.ttdUrl || null,
      ttdHash: attempt.User?.ttdHash || null,
    }
  : null;

    const psikologTTD = attempt.results?.[0]?.ValidatedBy
      ? attempt.results[0].ValidatedBy.ttdUrl
      : attempt.User?.ttdUrl || null;

    const testTypeData = {
      id: attempt.TestType?.id,
      name: attempt.TestType?.name || `TEST_${attempt.TestType?.id}`,
      code: attempt.TestType?.id || attempt.TestType?.name || "IST",
    };

    return NextResponse.json({
      attempt: { ...attempt, TestType: testTypeData },
      subtestResults,
      result: totalResult,
      cpmiResult,
      msdtResult,
      ttd: psikologTTD,
    });
  } catch (err: any) {
    console.error("Error in attempts API:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
