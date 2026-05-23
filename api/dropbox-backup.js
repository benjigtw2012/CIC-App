
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const token = process.env.DROPBOX_ACCESS_TOKEN;
    if (!token) return res.status(200).json({ skipped: true, reason: "Dropbox token not set" });
    const { type, id, payload } = req.body;
    const safeId = String(id || Date.now()).replace(/[^a-zA-Z0-9-_]/g, "_");
    const path = `/CIC App/${type || "backup"}/${safeId}.json`;
    const upload = await fetch("https://content.dropboxapi.com/2/files/upload", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Dropbox-API-Arg": JSON.stringify({ path, mode: "overwrite", autorename: false, mute: true }),
        "Content-Type": "application/octet-stream"
      },
      body: JSON.stringify(payload, null, 2)
    });
    if (!upload.ok) return res.status(500).json({ error: await upload.text() });
    return res.status(200).json({ ok: true, path });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
