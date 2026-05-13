import fs from 'fs';
import path from 'path';
import os from 'os';
import FormData from 'form-data';
import axios from 'axios';

export async function transcribe(req, res) {
  try {
    const { audio, mimeType } = req.body;

    if (!audio) {
      return res.status(400).json({ error: 'No audio data provided.' });
    }

    const audioBuffer = Buffer.from(audio, 'base64');

    const extMap = {
      'audio/webm': 'webm',
      'audio/ogg':  'ogg',
      'audio/wav':  'wav',
      'audio/mp4':  'mp4',
      'audio/mpeg': 'mp3',
    };
    const ext = extMap[mimeType] || 'webm';

    const tmpPath = path.join(os.tmpdir(), `moustakbali_${Date.now()}.${ext}`);
    fs.writeFileSync(tmpPath, audioBuffer);

    // Use Groq Whisper — same GROQ_API_KEY, no extra key needed
    const form = new FormData();
    form.append('file', fs.createReadStream(tmpPath), {
      filename: `audio.${ext}`,
      contentType: mimeType || 'audio/webm',
    });
    form.append('model', 'whisper-large-v3');
    // language omitted → Whisper auto-detects Arabic, Darija, French, etc.
    form.append('response_format', 'json');

    const response = await axios.post(
      'https://api.groq.com/openai/v1/audio/transcriptions',
      form,
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          ...form.getHeaders(),
        },
      }
    );

    fs.unlinkSync(tmpPath);

    return res.json({ text: response.data.text });
  } catch (error) {
    console.error('Transcription error:', error?.response?.data || error.message);
    return res.status(500).json({ error: 'Transcription failed.' });
  }
}
