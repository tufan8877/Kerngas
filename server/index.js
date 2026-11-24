import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import nodemailer from 'nodemailer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 10000);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 6, fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)),
});
const contactLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 8, standardHeaders: 'draft-7', legacyHeaders: false, message: { error: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.' } });
const isAllowedImage = (buffer, mimetype) => {
  const jpeg = mimetype === 'image/jpeg' && buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]));
  const png = mimetype === 'image/png' && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const webp = mimetype === 'image/webp' && buffer.subarray(0, 4).toString() === 'RIFF' && buffer.subarray(8, 12).toString() === 'WEBP';
  return jpeg || png || webp;
};

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '100kb' }));
app.use(express.static(path.join(__dirname, '../dist')));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.post('/api/contact', contactLimiter, upload.array('photos', 6), async (req, res) => {
  const body = req.body;
  const required = ['firstName', 'lastName', 'phone', 'email', 'service', 'description', 'street', 'houseNumber', 'zip', 'city'];
  if (required.some((field) => typeof body[field] !== 'string' || !body[field].trim()) || body.privacy !== 'on') {
    return res.status(400).json({ error: 'Bitte füllen Sie alle Pflichtfelder aus.' });
  }
  if (!/^\S+@\S+\.\S+$/.test(body.email) || body.description.length > 5000) return res.status(400).json({ error: 'Bitte prüfen Sie E-Mail-Adresse und Beschreibung.' });
  const files = Array.isArray(req.files) ? req.files : [];
  if (files.some((file) => !isAllowedImage(file.buffer, file.mimetype))) return res.status(400).json({ error: 'Mindestens eine Datei ist kein gültiges JPG, PNG oder WebP.' });
  const attachments = files.map((file) => ({ filename: file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_'), content: file.buffer, contentType: file.mimetype }));
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.CONTACT_EMAIL) return res.status(503).json({ error: 'E-Mail-Versand ist derzeit nicht eingerichtet.' });
  const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: Number(process.env.SMTP_PORT) === 465, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
  const address = `${body.street} ${body.houseNumber}${body.staircase ? `, Stiege ${body.staircase}` : ''}${body.door ? `, Tür ${body.door}` : ''}, ${body.zip} ${body.city}`;
  const text = [`${body.requestType || 'Anfrage'}`, '', `Name: ${body.firstName} ${body.lastName}`, `Telefon: ${body.phone}`, `E-Mail: ${body.email}`, `Leistung: ${body.service}`, `Adresse: ${address}`, `Hersteller: ${body.manufacturer || '-'}`, `Gerätetyp: ${body.deviceType || '-'}`, `Ausführung: ${body.deviceClass || '-'}`, `Geräteart: ${body.deviceKind || '-'}`, `Fehlercode: ${body.errorCode || '-'}`, `Gewünschter Termin: ${body.preferredDate || '-'}`, `Alternative: ${body.alternativeDate || '-'}`, '', 'Beschreibung:', body.description].join('\n');
  try {
    await transporter.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, to: process.env.CONTACT_EMAIL, replyTo: body.email, subject: `Neue ${body.requestType || 'Anfrage'} von ${body.firstName} ${body.lastName}`, text, attachments });
    await transporter.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, to: body.email, subject: 'Ihre Anfrage bei kerngas', text: `Vielen Dank für Ihre Anfrage. Wir haben Ihre Nachricht erhalten und melden uns persönlich. Eine Anfrage ist noch keine verbindliche Terminbestätigung.\n\nIhre Angaben:\n${text}` });
    return res.status(202).json({ ok: true });
  } catch (error) {
    console.error('Mail delivery failed', error);
    return res.status(502).json({ error: 'Die Nachricht konnte nicht versendet werden.' });
  }
});

app.use((_req, res) => res.sendFile(path.join(__dirname, '../dist/index.html')));
app.listen(port, '0.0.0.0', () => console.log(`kerngas server listening on ${port}`));
