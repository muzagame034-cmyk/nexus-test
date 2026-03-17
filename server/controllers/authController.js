/**
 * Auth Controller - Login muammosi tuzatildi
 * Muammo: seeder qayta ishlanganda userlar o'chirilmasdi,
 * lekin parollar qayta hash bo'lmasdi → login ishlamay qolardi.
 * Yechim: login da to'g'ridan bcrypt bilan tekshirish + yaxshi xato xabarlar
 */

const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// ── REGISTER ──
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password
    });

    const token = generateToken(user._id);
    res.status(201).json({ success: true, token, user: user.getPublicProfile() });

  } catch (error) {
    console.error('Register error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
};

// ── LOGIN ──
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    // Email ni normalize qilamiz
    const normalizedEmail = email.toLowerCase().trim();

    // Parol bilan userni topamiz
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      console.log(`Login attempt: user not found for email: ${normalizedEmail}`);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account has been deactivated' });
    }

    // Parolni tekshiramiz - to'g'ridan bcrypt bilan ham tekshiramiz
    let isMatch = false;

    try {
      // Avval model method bilan
      isMatch = await user.comparePassword(password);
    } catch (e) {
      // Agar xato bo'lsa to'g'ridan bcrypt bilan
      isMatch = await bcrypt.compare(password, user.password);
    }

    if (!isMatch) {
      console.log(`Login attempt: wrong password for email: ${normalizedEmail}`);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Last login yangilash
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);

    console.log(`✅ Login success: ${normalizedEmail}`);
    res.json({ success: true, token, user: user.getPublicProfile() });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

// ── GET ME ──
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, user: user.getPublicProfile() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// ── UPDATE PROFILE ──
exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: name.trim() },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user: user.getPublicProfile() });
  } catch (error) {
    res.status(500).json({ error: 'Profile update failed' });
  }
};

// ── CHANGE PASSWORD ──
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    user.password = newPassword;
    await user.save();
    const token = generateToken(user._id);
    res.json({ success: true, token, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Password change failed' });
  }
};
