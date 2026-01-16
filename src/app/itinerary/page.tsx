"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getItinerary } from "@/lib/getItinerary";
import {
  Download,
  Printer,
  Share2,
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Utensils,
  Hotel,
  Plane,
  Car,
  Train,
  Ship,
  Sun,
  Moon,
  Coffee,
  ShoppingBag,
  Heart,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Compass,
  Users,
  Star,
  Cloud,
  Umbrella,
  Wifi,
  Smartphone,
  Camera,
  Shield
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Helper function untuk format data
const formatItineraryData = (data: any) => {
  if (!data) return null;

  // 🔴 JIKA STRING (AI kirim markdown)
  if (typeof data === "string") {
    try {
      const cleaned = data
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleaned);
      return normalizeItinerary(parsed);
    } catch {
      return { raw: data };
    }
  }

  // 🔴 JIKA OBJECT LANGSUNG
  return normalizeItinerary(data);
};

const normalizeItinerary = (parsed: any) => {
  // Jika itinerary masih object (day1, day2, ...)
  if (
    parsed.itinerary &&
    !Array.isArray(parsed.itinerary) &&
    typeof parsed.itinerary === "object"
  ) {
    parsed.itinerary = Object.entries(parsed.itinerary).map(
      ([key, value]: any, index) => ({
        day: index + 1,
        ...value,
      })
    );
  }

  return parsed;
};


export default function ItineraryPage() {
  const router = useRouter();
  const [payload, setPayload] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [formattedData, setFormattedData] = useState<any>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("trip_payload");
    if (raw) {
      const parsed = JSON.parse(raw);
      setPayload(parsed);
      fetchItinerary(parsed);
    } else {
      setError("Tidak ada data perjalanan. Silakan kembali ke halaman utama dan isi form.");
      setLoading(false);
    }
  }, []);

  async function fetchItinerary(data: any) {
    try {
      setLoading(true);
      setError(null);
      const res = await getItinerary(data);

      if (!res.success) {
        setError("AI sedang sibuk. Coba beberapa saat lagi atau perbarui data perjalanan Anda.");
      } else {
        // Format result dari AI
        const formatted = formatItineraryData(res.data || res);
        setResult(formatted);
        setFormattedData(formatted);
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memproses itinerary. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      const element = document.getElementById("itinerary-content");
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(
        `itinerary-${payload?.transportation?.to || "trip"}-${new Date()
          .toISOString()
          .split("T")[0]}.pdf`
      );
    } catch (err) {
      console.error(err);
      alert("Gagal membuat PDF");
    } finally {
      setIsGeneratingPDF(false);
    }
  };


  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    try {
      const element = document.getElementById("itinerary-content");
      if (!element) {
        alert("Konten itinerary tidak ditemukan");
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = 210;
      const pageHeight = 297;
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const pdfBlob = pdf.output("blob");
      const fileName = `itinerary-${payload?.transportation?.to || "perjalanan"}.pdf`;

      const file = new File([pdfBlob], fileName, {
        type: "application/pdf",
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "Itinerary Perjalanan",
          text: "Berikut itinerary perjalanan dalam bentuk PDF",
          files: [file],
        });
      } else {
        pdf.save(fileName);
        alert("Perangkat tidak mendukung share file, PDF diunduh otomatis.");
      }
    } catch (err) {
      console.error("Share PDF error:", err);
      alert("Gagal membagikan PDF");
    }
  };

  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'Pesawat': return <Plane className="w-5 h-5" />;
      case 'Kereta': return <Train className="w-5 h-5" />;
      case 'Bus': return <Car className="w-5 h-5" />;
      case 'Kapal': return <Ship className="w-5 h-5" />;
      case 'Kendaraan Pribadi': return <Car className="w-5 h-5" />;
      case 'Rental Mobil': return <Car className="w-5 h-5" />;
      default: return <Plane className="w-5 h-5" />;
    }
  };

  const formatCurrency = (amount: string | number) => {
    if (!amount || amount === '0') return 'Rp 0';

    // Jika string seperti "500.000 - 1.000.000"
    if (typeof amount === 'string' && amount.includes('-')) {
      const parts = amount.split('-').map(part => {
        const num = parseInt(part.replace(/[^\d]/g, '')) || 0;
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(num);
      });
      return parts.join(' - ');
    }

    const num = typeof amount === 'string' ? parseInt(amount.replace(/[^\d]/g, '')) || 0 : amount;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const renderAIData = () => {
    if (!formattedData) return null;

    // Jika data memiliki raw text (output langsung dari AI)
    if (formattedData.raw) {
      return (
        <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-2xl border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Itinerary dari AI</h3>
          <pre className="whitespace-pre-wrap font-sans text-gray-700 bg-white p-4 rounded-lg border">
            {formattedData.raw}
          </pre>
        </div>
      );
    }

    // Jika data sudah terstruktur dari AI
    return (
      <>
        {/* Transportation Details */}
        {formattedData.transportation && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <Plane className="w-6 h-6 text-blue-600" />
              Detail Transportasi
            </h3>
            {typeof formattedData.transportation === 'string' ? (
              <p className="text-gray-700">{formattedData.transportation}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Rekomendasi</p>
                  <p className="font-semibold text-gray-800">
                    {formattedData.transportation.recommended}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Durasi</p>
                  <p className="font-semibold text-gray-800">
                    {formattedData.transportation.duration}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Estimasi Harga</p>
                  <p className="font-semibold text-gray-800">
                    {formattedData.transportation.estimated_price}
                  </p>
                </div>

                {formattedData.transportation.notes && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Catatan</p>
                    <p className="text-gray-700">{formattedData.transportation.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Accommodation Details */}
        {formattedData.accommodation && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <Hotel className="w-6 h-6 text-purple-600" />
              Detail Penginapan
            </h3>
            {typeof formattedData.accommodation === 'string' ? (
              <p className="text-gray-700">{formattedData.accommodation}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Area Rekomendasi</p>
                  <p className="font-semibold text-gray-800">
                    {formattedData.accommodation.recommended_area}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Tipe</p>
                  <p className="font-semibold text-gray-800">
                    {formattedData.accommodation.type}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Harga / Malam</p>
                  <p className="font-semibold text-gray-800">
                    {formattedData.accommodation.price_per_night}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-semibold text-gray-800">
                    {formattedData.accommodation.total_price}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Daily Itinerary */}
        {formattedData.itinerary && Array.isArray(formattedData.itinerary) && (
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Calendar className="w-7 h-7 text-emerald-600" />
              Jadwal Harian dari AI
            </h3>

            <div className="space-y-6">
              {formattedData.itinerary.map((day: any, index: number) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                          {day.day || index + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-xl">Hari {day.day || index + 1}</h4>
                          {day.title && <p className="text-white/80 text-sm">{day.title}</p>}
                        </div>
                      </div>
                      {day.estimated_cost && (
                        <div className="text-right">
                          <div className="text-lg font-bold">{formatCurrency(day.estimated_cost)}</div>
                          <div className="text-white/80 text-sm">Estimasi Biaya</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Jika formatnya object dengan morning, afternoon, evening */}
                    {day.morning || day.afternoon || day.evening ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {day.morning && (
                          <div className="space-y-4">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 flex items-center justify-center flex-shrink-0">
                                <Sun className="w-6 h-6 text-yellow-500" />
                              </div>
                              <div>
                                <h5 className="font-bold text-gray-800">Pagi</h5>
                                <p className="text-gray-600 mt-1">{day.morning}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {day.afternoon && (
                          <div className="space-y-4">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 flex items-center justify-center flex-shrink-0">
                                <Coffee className="w-6 h-6 text-orange-500" />
                              </div>
                              <div>
                                <h5 className="font-bold text-gray-800">Siang</h5>
                                <p className="text-gray-600 mt-1">{day.afternoon}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {day.evening && (
                          <div className="space-y-4">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center flex-shrink-0">
                                <Moon className="w-6 h-6 text-blue-500" />
                              </div>
                              <div>
                                <h5 className="font-bold text-gray-800">Malam</h5>
                                <p className="text-gray-600 mt-1">{day.evening}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      // Jika formatnya string atau format lain
                      <div className="text-gray-700 whitespace-pre-wrap">
                        {typeof day === 'string' ? day : JSON.stringify(day, null, 2)}
                      </div>
                    )}

                    {day.notes && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h6 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          Catatan
                        </h6>
                        <p className="text-gray-600">{day.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cost Summary */}
        {formattedData.cost_summary && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <DollarSign className="w-6 h-6 text-emerald-600" />
              Ringkasan Biaya
            </h3>
            {typeof formattedData.cost_summary === 'string' ? (
              <p className="text-gray-700">{formattedData.cost_summary}</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(formattedData.cost_summary).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-2">
                    <span className="capitalize text-gray-600">
                      {key.replace("_", " ")}
                    </span>
                    <span className="font-bold text-gray-800">
                      {formatCurrency(value as string)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tips */}
        {formattedData.tips && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-purple-600" />
              Tips & Saran
            </h3>
            {Array.isArray(formattedData.tips) ? (
              <ul className="space-y-3">
                {formattedData.tips.map((tip: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{tip}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">{formattedData.tips}</p>
            )}
          </div>
        )}

        {/* Additional AI Recommendations */}
        {formattedData.recommendations && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <Heart className="w-6 h-6 text-blue-600" />
              Rekomendasi Tambahan
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap">{formattedData.recommendations}</p>
          </div>
        )}
      </>
    );
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Compass className="w-16 h-16 text-blue-600 animate-spin mx-auto" />
            <Sparkles className="w-8 h-8 text-purple-500 absolute -top-2 -right-2 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mt-6">Membuat Itinerary</h2>
          <p className="text-gray-600 mt-2">AI sedang merencanakan perjalanan terbaik untuk Anda...</p>
          <div className="mt-6 space-y-2">
            <div className="h-2 w-64 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full overflow-hidden mx-auto">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-sm text-gray-500">Ini mungkin memakan waktu beberapa detik</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-4 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Buat Itinerary Baru
            </button>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Itinerary Perjalanan Anda
            </h1>
            <div className="flex items-center gap-4 mt-2 text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{payload?.transportation?.from || 'Jakarta'} → {payload?.transportation?.to || 'Bali'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{payload?.trip?.days || 3} Hari</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50"
            >
              {isGeneratingPDF ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Memproses...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download PDF
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 hover:shadow-lg transition-all"
            >
              <Printer className="w-5 h-5" />
              Print
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
            >
              <Share2 className="w-5 h-5" />
              Bagikan
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-red-700 text-lg">Oops! Ada masalah</h3>
                <p className="text-red-600 mt-1">{error}</p>
                <button
                  onClick={() => router.push('/')}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Buat Itinerary Baru
                </button>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div id="itinerary-content" className="space-y-8">
            {/* Trip Overview Card */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-8 md:p-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Compass className="w-10 h-10" />
                      <div>
                        <h2 className="text-2xl font-bold">Ringkasan Perjalanan</h2>
                        <p className="text-white/80">Dibuat khusus untuk Anda</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <div className="text-2xl font-bold">{payload?.trip?.days || 3}</div>
                        <div className="text-white/80 text-sm">Hari</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <div className="text-2xl font-bold">{payload?.accommodation?.guests || 2}</div>
                        <div className="text-white/80 text-sm">Orang</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <div className="text-2xl font-bold">{payload?.accommodation?.nights || 3}</div>
                        <div className="text-white/80 text-sm">Malam</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <div className="text-2xl font-bold">{payload?.trip?.pace || 'Normal'}</div>
                        <div className="text-white/80 text-sm">Tempo</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <h3 className="font-bold text-lg mb-3">Budget</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white/80">Transport</span>
                        <span className="font-bold">{formatCurrency(payload?.transportation?.transportBudget || '0')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/80">Penginapan</span>
                        <span className="font-bold">{formatCurrency(payload?.accommodation?.budgetPerNight || '0')}/malam</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/80">Aktivitas</span>
                        <span className="font-bold">{formatCurrency(payload?.trip?.activityBudget || '0')}/hari</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Generated Content */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-6 md:p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Itinerary yang Dihasilkan AI</h2>
                  <p className="text-gray-600">Rencana perjalanan yang dipersonalisasi berdasarkan pilihan Anda</p>
                </div>
              </div>

              {renderAIData()}
            </div>

            {/* Essential Tips Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-emerald-600" />
                  Persiapan Penting
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Smartphone className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Unduh peta offline dan aplikasi penting</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Camera className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Bawa powerbank dan perlengkapan dokumentasi</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Wifi className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Siapkan akses internet (SIM card/roaming)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-amber-600" />
                  Checklist Dokumen
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Tiket dan boarding pass</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Konfirmasi booking hotel</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Identitas diri (KTP/Paspor)</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-gray-500 text-sm pt-6 border-t border-gray-200">
              <p className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                Itinerary ini dibuat dengan bantuan AI • Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}
                <Sparkles className="w-4 h-4 text-purple-500" />
              </p>
              <p className="mt-2">Selamat menikmati perjalanan Anda! Jangan lupa berbagi pengalaman.</p>
            </div>
          </div>
        )}

        {/* Print Styles */}
        <style jsx global>{`
          @media print {
  body {
    background: white !important;
  }

  button {
    display: none !important;
  }

  .shadow,
  .shadow-lg,
  .shadow-2xl {
    box-shadow: none !important;
  }

  .bg-gradient-to-r {
    background: #ffffff !important;
  }

  .rounded-2xl,
  .rounded-3xl {
    border-radius: 8px !important;
  }

  .text-transparent {
    color: #111827 !important;
  }

  svg {
    color: #111827 !important;
  }

  #itinerary-content {
    width: 100%;
    padding: 0;
  }
}

        `}</style>
      </div>
    </main>
  );
}