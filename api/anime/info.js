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

  const id = String(req.query.id || "");

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({
      error: "ID anime tidak valid."
    });
  }

  try {
    const [detailRes, episodeRes] = await Promise.all([
      fetch(`https://api.jikan.moe/v4/anime/${id}/full`),
      fetch(`https://api.jikan.moe/v4/anime/${id}/episodes?page=1`)
    ]);

    if (!detailRes.ok || !episodeRes.ok) {
      return res.status(502).json({
        error: "Gagal mengambil data anime."
      });
    }

    const detail = await detailRes.json();
    const episodes = await episodeRes.json();

    const anime = detail.data;

    return res.status(200).json({
      anime: {
        id: anime.mal_id,
        title: anime.title,
        image: anime.images?.jpg?.large_image_url,
        synopsis: anime.synopsis,
        totalEpisodes: anime.episodes
      },

      episodes: (episodes.data || []).map(ep => ({
        id: ep.mal_id,
        title: ep.title,
        number: ep.mal_id,
        aired: ep.aired
      })),

      pagination: episodes.pagination
    });

  } catch (error) {
    return res.status(500).json({
      error: "Server gagal mengambil informasi anime."
    });
  }
}
