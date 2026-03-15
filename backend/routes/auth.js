import express from 'express';
import User from '../models/User.js';
import { getAuth } from 'firebase-admin/auth';
import { getApps } from 'firebase-admin/app';

const router = express.Router();

// Helper to check if Firebase is initialized
const ensureFirebaseInitialized = () => {
  if (getApps().length === 0) {
    throw new Error('Firebase Admin is not initialized. Check server logs for initialization errors.');
  }
};

// Create or update user
router.post('/user', async (req, res) => {
  try {
    ensureFirebaseInitialized();
    
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: 'Token required' });
    }

    const decodedToken = await getAuth().verifyIdToken(token);
    const { uid, email, name, picture } = decodedToken;

    let user = await User.findOne({ firebaseUid: uid });

    if (user) {
      // Update existing user
      user.email = email;
      user.name = name;
      user.photoURL = picture;
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        firebaseUid: uid,
        email,
        name,
        photoURL: picture,
      });
    }

    res.json({ user });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ message: 'Authentication failed', error: error.message });
  }
});

export default router;

