export async function onRequestPost({ request }) {
  try {
    // Tempel API key Groq Anda di sini (ganti 'gsk_... dengan key Anda)
    const apiKey = "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"; 
    if (!apiKey || apiKey.startsWith("gsk_KunciApiGroqAndaDiSini")) {
      return Response.json({ error: "API Key Groq belum disetel di file analyze.js." }, { status: 500 });
    }

    const body = await request.json();
    const timeframe = String(body.timeframe || "M1").slice(0, 20);
    const notes = String(body.notes || "Tidak ada").slice(0, 300);

    const match = String(body.imageData || "").match(/^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/);
    if (!match) return Response.json({ error: "Gambar tidak valid. Gunakan PNG, JPG, atau WebP." }, { status: 400 });
    if (match[2].length > 11000000) return Response.json({ error: "Gambar terlalu besar." }, { status: 413 });

    const prompt = `Bertindaklah sebagai AI Trading Expert ICT (Inner Circle Trader) profesional ala Rynd_FxTrade. Analisis screenshot chart XAUUSD yang dilampirkan ini secara langsung dan dinamis.
Timeframe: ${timeframe}
Catatan pengguna: ${notes}

Berikan hasil analisis persis dalam format struktur teks markdown berikut:

📊 **SUPERCALL AI ANALYSIS [ By : Rynd_FxTrade ]**

**Pair:** XAUUSD (Gold vs US Dollar)
**Timeframe:** ${timeframe}

**Keputusan:** [Tentukan BUY / SELL / NETRAL beserta keterangan singkat]

📍 **Entry:** [Tentukan kisaran harga entry berdasarkan chart]
🛑 **Stop Loss:** [Tentukan level Stop Loss]
🎯 **Take Profit 1:** [Tentukan TP 1]
🎯 **Take Profit 2:** [Tentukan TP 2]
📊 **Risk Reward:** [Contoh: Sekitar 1:1 hingga 1:2]
✅ **Confidence:** [Contoh: Medium (70-75%)]

🔍 **Alasan Analisa**
* **Trend market:** [Analisis tren berdasarkan gambar chart]
* **Struktur market:** [Analisis pergerakan atau penolakan harga]
* **BOS / ChoCH:** [Kondisi Market Structure Shift]
* **Liquidity:** [Area sweep liquidity / liquidity pool]
* **Order Block / FVG:** [Zona OB atau Fair Value Gap yang terlihat]`;

    // Menggunakan model Vision Groq (Llama 3 Vision) yang mampu membaca gambar chart secara langsung
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST", 
      headers: { 
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${apiKey}` 
      },
      body: JSON.stringify({
        model: "llama-3.2-11b-vision-preview",
        messages: [{
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: `data:${match[1]};base64,${match[2]}` } }
          ]
        }],
        temperature: 0.3,
        max_tokens: 1500
      })
    });
    
    const j = await r.json();
    if (!r.ok) return Response.json({ error: j?.error?.message || "Groq API gagal memproses gambar." }, { status: r.status });

    const aiAnalysis = j.choices?.[0]?.message?.content || "";
    if (!aiAnalysis) return Response.json({ error: "AI tidak mengembalikan hasil teks analisis." }, { status: 502 });

    return Response.json({ analysis: aiAnalysis, result: aiAnalysis, data: aiAnalysis });
  } catch(e) { 
    return Response.json({ error: "Kesalahan internal saat memproses permintaan." }, { status: 500 }); 
  }
}
