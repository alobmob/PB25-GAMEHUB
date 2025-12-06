import bcrypt from 'bcrypt';
import userModel from '../models/user.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.getByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    req.session.user = {
      id: user.id,
      displayName: user.display_name,
      email: user.email
    };

    res.json({
      message: 'Logged in',
      user: {
        id: user.id,
        displayName: user.display_name,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.json({ message: 'Logged out' });
  });
};

export const me = async (req, res) => {
  if (req.session && req.session.user) {
    const user = await userModel.getById(req.session.user.id);
    return res.json({ user });
  }
  res.status(401).json({ error: 'Unauthorized' });
};
