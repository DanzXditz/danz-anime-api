
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

  return res.status(501).json({
    error: "Sumber video belum dikonfigurasi.",
    message: "Tambahkan sumber video legal milik sendiri atau penyedia streaming berlisensi."
  });
}
