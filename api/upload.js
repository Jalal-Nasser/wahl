import { put } from '@vercel/blob'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }
  try {
    const { filename, contentType, dataBase64 } = req.body || {}
    if (!filename || !contentType || !dataBase64) {
      return res.status(400).json({ error: 'Missing filename, contentType or dataBase64' })
    }
    const buffer = Buffer.from(dataBase64, 'base64')
    const key = `uploads/${Date.now()}-${filename}`
    const blob = await put(key, buffer, {
      access: 'public',
      contentType,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })
    return res.status(200).json({ url: blob.url })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
