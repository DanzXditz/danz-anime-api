export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const query = String(req.query.q || "").trim();

  if (query.length < 3) {
    return res.status(400).json({
      error: "Masukkan minimal 3 karakter."
    });
  }

  try {
    const response = await fetch(
      "https://api.jikan.moe/v4/anime?q=" +
      encodeURIComponent(query) + "&limit=10"
    );

    if (!response.ok) {
      return res.status(502).json({
        error: "Server katalog anime sedang bermasalah."
      });
    }

    const result = await response.json();

    return res.status(200).json({
      data: (result.data || []).map(anime => ({
        mal_id: anime.mal_id,
        title: anime.title,
        title_english: anime.title_english,
        type: anime.type,
        episodes: anime.episodes,
        image: anime.images?.jpg?.image_url
      }))
    });

  } catch (error) {
    return res.status(500).json({
      error: "Gagal menghubungi server anime."
    });
  }
}
