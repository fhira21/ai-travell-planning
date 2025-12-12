// src/app/itinerary/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getItinerary } from "@/lib/getItinerary"; // ensure path correct

export default function ItineraryPage() {
  const [payload, setPayload] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("trip_payload");
    if (raw) {
      setPayload(JSON.parse(raw));
      fetchItinerary(JSON.parse(raw));
    } else {
      setError("Tidak ada data perjalanan. Kembali ke halaman utama dan isi form.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchItinerary(data: any) {
    try {
      setLoading(true);
      setError(null);
      const res = await getItinerary(data);
      if (!res.success) {
        setError("AI gagal membuat itinerary.");
      } else {
        setResult(res.data);
      }
    } catch (err: any) {
      setError(err.message || "Terjadi error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold text-[#FF7E5F]">Hasil Itinerary</h1>

          {loading && <p className="mt-4">Memproses itinerary... Mohon tunggu.</p>}

          {error && <p className="mt-4 text-red-500">{error}</p>}

          {!loading && result && (
            <div className="mt-6 space-y-6">
              {/* If AI returned structured JSON keys, render nicely */}
              {result.transportation ? (
                <>
                  <section className="p-4 border rounded">
                    <h2 className="font-semibold">Transportasi</h2>
                    <pre className="whitespace-pre-wrap mt-2 text-sm">{JSON.stringify(result.transportation, null, 2)}</pre>
                  </section>

                  <section className="p-4 border rounded">
                    <h2 className="font-semibold">Penginapan</h2>
                    <pre className="whitespace-pre-wrap mt-2 text-sm">{JSON.stringify(result.accommodation, null, 2)}</pre>
                  </section>

                  <section className="p-4 border rounded">
                    <h2 className="font-semibold">Itinerary Harian</h2>
                    {Array.isArray(result.itinerary) ? (
                      result.itinerary.map((d: any) => (
                        <div key={d.day} className="mt-3 p-3 bg-gray-50 rounded">
                          <h3 className="font-semibold">Hari {d.day}</h3>
                          <p><strong>Pagi:</strong> {d.morning}</p>
                          <p><strong>Siang:</strong> {d.afternoon}</p>
                          <p><strong>Malam:</strong> {d.evening}</p>
                          <p className="mt-1 text-sm text-gray-600"><strong>Estimasi biaya:</strong> {d.estimated_cost}</p>
                        </div>
                      ))
                    ) : (
                      <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(result.itinerary, null, 2)}</pre>
                    )}
                  </section>

                  <section className="p-4 border rounded">
                    <h2 className="font-semibold">Ringkasan Biaya</h2>
                    <pre className="whitespace-pre-wrap mt-2 text-sm">{JSON.stringify(result.cost_summary, null, 2)}</pre>
                  </section>

                  <section className="p-4 border rounded">
                    <h2 className="font-semibold">Tips</h2>
                    <ul className="list-disc ml-6 mt-2">
                      {(result.tips || []).map((t: string, i: number) => <li key={i}>{t}</li>)}
                    </ul>
                  </section>
                </>
              ) : (
                <pre className="whitespace-pre-wrap">{result.raw || JSON.stringify(result)}</pre>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
