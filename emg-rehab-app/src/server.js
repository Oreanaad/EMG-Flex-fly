import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const pool = new Pool({
  user: 'postgres', // Cambia esto por tus datos de Postgres
  host: 'localhost',
  database: 'EMG',
  password: 'Oreana123',
  port: 5432,
});

app.post('/api/save-session', async (req, res) => {
  const { mode, score, samples } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Insertar cabecera de sesión
    const sessionRes = await client.query(
      'INSERT INTO emg_sessions (game_mode, score) VALUES ($1, $2) RETURNING id',
      [mode, score]
    );
    const sessionId = sessionRes.rows[0].id;

    // 2. Preparar inserción masiva de muestras
    // Transformamos el array de objetos en un array de valores para SQL
    const values = [];
    const placeholders = [];
    
    samples.forEach((s, i) => {
      const offset = i * 7;
      placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7})`);
      values.push(sessionId, s.t, s.a, s.b, s.q, s.co, s.f);
    });

    const query = `
      INSERT INTO emg_samples (session_id, timestamp, val_a, val_b, quality, co_contraction, fatigue_detected)
      VALUES ${placeholders.join(',')}
    `;

    await client.query(query, values);
    await client.query('COMMIT');

    res.json({ success: true, sessionId });
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    res.status(500).json({ error: e.message });
  } finally {
    client.release();
  }
});

app.listen(3001, () => console.log('Servidor clínico en puerto 3001'));