import express from 'express';
import Database from 'better-sqlite3';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.SERVER_PORT || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_PASSWORD) {
  console.error('ERROR: ADMIN_PASSWORD no está definida en .env. El servidor no puede iniciar.');
  process.exit(1);
}

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'] }));
app.use(express.json());

const db = new Database(path.join(__dirname, 'eneatest.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type1_selected TEXT DEFAULT '[]',
    type2_selected TEXT DEFAULT '[]',
    type3_selected TEXT DEFAULT '[]',
    type4_selected TEXT DEFAULT '[]',
    type5_selected TEXT DEFAULT '[]',
    type6_selected TEXT DEFAULT '[]',
    type7_selected TEXT DEFAULT '[]',
    type8_selected TEXT DEFAULT '[]',
    type9_selected TEXT DEFAULT '[]',
    type1_total INTEGER DEFAULT 0,
    type2_total INTEGER DEFAULT 0,
    type3_total INTEGER DEFAULT 0,
    type4_total INTEGER DEFAULT 0,
    type5_total INTEGER DEFAULT 0,
    type6_total INTEGER DEFAULT 0,
    type7_total INTEGER DEFAULT 0,
    type8_total INTEGER DEFAULT 0,
    type9_total INTEGER DEFAULT 0,
    dominant_type INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

app.post('/api/submit', (req, res) => {
  const { name, answers } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'El nombre es requerido' });
  if (!answers) return res.status(400).json({ error: 'Las respuestas son requeridas' });

  const totals = {};
  for (let i = 1; i <= 9; i++) {
    totals[i] = (answers[`type${i}`] || []).length;
  }

  const dominantType = Object.entries(totals).reduce((a, b) =>
    b[1] > a[1] ? b : a
  )[0];

  const stmt = db.prepare(`
    INSERT INTO submissions (
      name,
      type1_selected, type2_selected, type3_selected,
      type4_selected, type5_selected, type6_selected,
      type7_selected, type8_selected, type9_selected,
      type1_total, type2_total, type3_total,
      type4_total, type5_total, type6_total,
      type7_total, type8_total, type9_total,
      dominant_type
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    name.trim(),
    JSON.stringify(answers.type1 || []),
    JSON.stringify(answers.type2 || []),
    JSON.stringify(answers.type3 || []),
    JSON.stringify(answers.type4 || []),
    JSON.stringify(answers.type5 || []),
    JSON.stringify(answers.type6 || []),
    JSON.stringify(answers.type7 || []),
    JSON.stringify(answers.type8 || []),
    JSON.stringify(answers.type9 || []),
    totals[1], totals[2], totals[3],
    totals[4], totals[5], totals[6],
    totals[7], totals[8], totals[9],
    parseInt(dominantType)
  );

  res.json({ success: true, id: result.lastInsertRowid });
});

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, token: ADMIN_PASSWORD });
  } else {
    res.status(401).json({ error: 'Contraseña incorrecta' });
  }
});

function requireAuth(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (token !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  next();
}

app.get('/api/admin/submissions', requireAuth, (req, res) => {
  const rows = db.prepare(
    `SELECT id, name, dominant_type,
     type1_total, type2_total, type3_total,
     type4_total, type5_total, type6_total,
     type7_total, type8_total, type9_total,
     created_at
     FROM submissions ORDER BY created_at DESC`
  ).all();
  res.json(rows);
});

app.get('/api/admin/submissions/:id', requireAuth, (req, res) => {
  const row = db.prepare('SELECT * FROM submissions WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'No encontrado' });
  for (let i = 1; i <= 9; i++) {
    row[`type${i}_selected`] = JSON.parse(row[`type${i}_selected`] || '[]');
  }
  res.json(row);
});

app.delete('/api/admin/submissions/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM submissions WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`ENEA-TEST servidor corriendo en http://localhost:${PORT}`);
});
