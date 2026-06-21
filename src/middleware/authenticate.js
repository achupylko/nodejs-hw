import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  const { sessionId, accessToken } = req.cookies;

  // Check for cookie presence
  if (!sessionId || !accessToken) {
    throw createHttpError(401, 'Missing session credentials');
  }

  // If cookies are present, look for session
  const session = await Session.findOne({
    _id: sessionId,
    accessToken,
  });

  // If there is no such session, return an error
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  // Check the access token expiration date
  const isAccessTokenExpired = session.accessTokenValidUntil < new Date();
  if (isAccessTokenExpired) {
    throw createHttpError(401, 'Access token expired');
  }

  // If everything is fine with the token and the session exists, look for the user
  const user = await User.findById(session.userId);

  // If user not found, return error
  if (!user) {
    throw createHttpError(401);
  }

  // If the user exists, add it to the request
  req.user = user;

  // Pass control on
  next();
};
