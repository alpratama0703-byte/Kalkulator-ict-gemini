export async function onRequestPost({ request, env }) {
  try {
    if (!env.GEMINI_API_KEY) return Response.json({error:"Secret GEMINI_API_KEY belum disetel di Cloudflare Pages > Settings > Variables and Secrets."},{status:500});
    const body = await request.json();
    const match = String(body.imageData || "").match(/^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/);
    if (!match) return Response.json({error:"Gambar tidak valid. Gunakan PNG, JPG, atau WebP."},{status:400});
    if (match[2].length > 11000000) return Response.json({error:"Gambar terlalu besar."},{status:413});
    const prompt = `Analisis screenshot chart XAUUSD untuk edukasi dalam bahasa Indonesia. Timeframe yang dipilih pengguna: ${String(body.timeframe||"tidak diketahui").slice(0,80)}. Catatan: ${String(body.notes||"tidak ada").slice(0,800)}.
Jangan mengarang harga/struktur yang tidak terbaca. Beri bagian: (1) keterbacaan, (2) bias BUY/SELL/NETRAL/BELUM CUKUP DATA beserta alasan, (3) ICT liquidity/sweep, MSS/CHOCH, OB, FVG dengan jelas menyatakan bila tidak terlihat/terkonfirmasi, (4) skenario BUY dan SELL bersyarat, (5) entry/invalidasi/target hanya jika harga jelas; jika tidak jangan menebak, (6) checklist M15 konteks -> M5 setup -> M1 pemicu. Jangan mengklaim melihat timeframe lain jika gambar hanya satu timeframe. Ini bukan sinyal pasti dan jangan menjanjikan profit.`;
    const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent", {
      method:"POST", headers:{"Content-Type":"application/json","x-goog-api-key":env.GEMINI_API_KEY},
      body:JSON.stringify({contents:[{parts:[{text:prompt},{inline_data:{mime_type:match[1],data:match[2]}}]}],generationConfig:{temperature:0.2,maxOutputTokens:1800}})
    });
    const j = await r.json();
    if (!r.ok) return Response.json({error:j?.error?.message||"Gemini API gagal."},{status:r.status});
    const analysis=(j.candidates?.[0]?.content?.parts||[]).map(p=>p.text||"").join("\n").trim();
    if (!analysis) return Response.json({error:"Gemini tidak mengembalikan hasil teks."},{status:502});
    return Response.json({analysis});
  } catch(e) { return Response.json({error:"Kesalahan saat memproses permintaan."},{status:500}); }
} 
