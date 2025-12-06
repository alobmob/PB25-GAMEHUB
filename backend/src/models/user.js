import db from './db_connect.js';

// Pobranie użytkownika po emailu
async function getByEmail(email) {
  try {
    const [rows] = await db.query(
      'SELECT id, email, password_hash, display_name, role, created_at FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  } catch (err) {
    console.error('user.getByEmail error', err);
    throw err;
  }
}

// Pobranie użytkownika po id
async function getById(id) {
  try {
    const [rows] = await db.query(
      'SELECT id, email, display_name, role, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  } catch (err) {
    console.error('user.getById error', err);
    throw err;
  }
}

const userModel = { getByEmail, getById };

// ✅ export default
export default userModel;
