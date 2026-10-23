Export async function onRequestPost({ request, env }) {
  try {
    If (!env.GEMINI_API_KEY) return Response.json({error:"Secret GEMINI_API_KEY belum disetel di Cloudflare Pages > Settings > Variables and Secrets."},{status:500});
    Const body = await request.json();
    Const match = String(body.imageData || "").match(/^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/);
    If (!match) return Response.json({error:"Gambar tidak valid. Gunakan PNG, JPG, atau WebP."},{status:400});
    If (match[2].length > 11000000) return Response.json({error:"Gambar terlalu besar."},{status:413});
    Const prompt = `Analisis screenshot chart XAUUSD untuk edukasi dalam bahasa Indonesia. Timeframe yang dipilih pengguna: ${String(body.timeframe||"tidak diketahui").slice(0,80)}. Catatan: ${String(body.notes||"tidak ada").slice(0,800)}.
Jangan mengarang harga/struktur yang tidak terbaca. Beri bagian: (1) keterbacaan, (2) bias BUY/SELL/NETRAL/BELUM CUKUP DATA beserta alasan, (3) ICT liquidity/sweep, MSS/CHOCH, OB, FVG dengan jelas menyatakan bila tidak terlihat/terkonfirmasi, (4) skenario BUY dan SELL bersyarat, (5) entry/invalidasi/target hanya jika harga jelas; jika tidak jangan menebak, (6) checklist M15 konteks -> M5 setup -> M1 pemicu. Jangan mengklaim melihat timeframe lain jika gambar hanya satu timeframe. Ini bukan sinyal pasti dan jangan menjanjikan profit.`;
    Const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent", {
      Method:"POST", headers:{"Content-Type":"application/json","x-goog-api-key":env.GEMINI_API_KEY},
      Body:JSON.stringify({contents:[{parts:[{text:prompt},{inline_data:{mime_type:match[1],data:match[2]}}]}],generationConfig:{temperature:0.2,maxOutputTokens:1800}})
    });
    Const j = await r.json();
    If (!r.ok) return Response.json({error:j?.error?.message||"Gemini API gagal."},{status:r.status});
    Const analysis=(j.candidates?.[0]?.content?.parts||[]).map(p=>p.text||"").join("\n").trim();
    If (!analysis) return Response.json({error:"Gemini tidak mengembalikan hasil teks."},{status:502});
    Return Response.json({analysis});
  } catch(e) { return Response.json({error:"Kesalahan saat memproses permintaan."},{status:500}); }
}
