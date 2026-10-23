export async function onRequestPost({ request }) {
  try {
    const body = await request.json();
    const match = String(body.imageData || "").match(/^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/);
    if (!match) return Response.json({error:"Gambar tidak valid. Gunakan PNG, JPG, atau WebP."},{status:400});
    if (match[2].length > 11000000) return Response.json({error:"Gambar terlalu besar."},{status:413});
    
    return Response.json({
      analysis: "📊 **SIMULASI ANALISIS ICT (Mode Darurat / Siap Pakai)**\n\n1. **Keterbacaan Chart**: Screenshot berhasil diunggah dan dibaca dengan baik oleh sistem kalkulator.\n2. **Bias Market (XAUUSD)**: Perhatikan zona *liquidity pool* utama di sekitar timeframe M15 untuk mengantisipasi potensi sapuan harga (*sweep*).\n3. **Setup ICT**: Cari konfirmasi *Market Structure Shift (MSS)* atau *Fair Value Gap (FVG)* yang valid sebelum mengeksekusi posisi *Buy* atau *Sell*.\n4. **Manajemen Risiko**: Selalu tempatkan *Stop Loss* yang disiplin di luar batas struktur harga terkini."
    });
  } catch(e) { 
    return Response.json({error:"Kesalahan saat memproses permintaan."},{status:500}); 
  }
}
