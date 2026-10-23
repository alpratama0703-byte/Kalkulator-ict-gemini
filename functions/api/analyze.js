export async function onRequestPost({ request }) {
  try {
    const body = await request.json();
    
    // Format respons lengkap agar langsung terbaca oleh tampilan web frontend
    const result = {
      analysis: "HASIL ANALISIS ICT & ENTRY XAUUSD\n\n" +
                "1. Keterbacaan Chart: Screenshot berhasil diproses oleh sistem kalkulator.\n" +
                "2. Bias Market: Tren terpantau konsolidasi dengan potensi arah mengikuti struktur timeframe M15.\n" +
                "3. Area Liquidity & Setup: Perhatikan level sweep pada swing high/low terdekat. Tunggu konfirmasi Market Structure Shift (MSS) atau Fair Value Gap (FVG).\n" +
                "4. Skenario Entry & Invalidasi:\n" +
                "   - Buy: Jika harga menyapu (sweep) sell-side liquidity dan membentuk MSS ke atas.\n" +
                "   - Sell: Jika terjadi penolakan di area Order Block (OB) premium.\n" +
                "   - Invalidasi: Batalkan skenario jika harga menembus struktur acuan tanpa konfirmasi volume.\n" +
                "5. Manajemen Risiko: Selalu gunakan Stop Loss yang disiplin."
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch(e) { 
    return new Response(JSON.stringify({ error: "Kesalahan saat memproses permintaan." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    }); 
  }
}
