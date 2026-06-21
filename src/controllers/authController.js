import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { createSession, setSessionCookies } from '../services/auth.js';
import { Session } from '../models/session.js';

export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(400, 'Email in use');
  }

  // Hashing the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const newUser = await User.create({
    email,
    password: hashedPassword,
  });

  // Create a new session
  const newSession = await createSession(newUser._id);

  // Pass the response object and session
  setSessionCookies(res, newSession);

  res.status(201).json(newUser);
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check if a user with this email exists
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid credentials');
  }

  // Compare password hashes
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw createHttpError(401, 'Invalid credentials');
  }

  // Delete the old user session
  await Session.deleteOne({ userId: user._id });

  // Create a new session
  const newSession = await createSession(user._id);

  // Pass the response object and session
  setSessionCookies(res, newSession);

  res.status(200).json(user);
};

export const refreshUserSession = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  if (!sessionId || !refreshToken) {
    throw createHttpError(401, 'Missing session credentials');
  }

  // Find the current session by session id and refresh token
  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  // If no such session exists, return an error
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  // If the session exists, check the validity of the refresh token
  const isSessionTokenExpired = session.refreshTokenValidUntil < new Date();

  // If the refresh token has expired, delete the session and return an error
  if (isSessionTokenExpired) {
    await session.deleteOne();
    res.clearCookie('sessionId');
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    throw createHttpError(401, 'Session token expired');
  }

  // If all checks pass, delete the current session
  await session.deleteOne();

  // Create a new session and add cookies
  const newSession = await createSession(session.userId);

  // Pass the response object and session
  setSessionCookies(res, newSession);

  res.status(200).json({
    message: 'Session refreshed',
  });
};
