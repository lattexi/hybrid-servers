import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {NextFunction, Request, Response} from 'express';
import CustomError from '../../classes/CustomError';
import {LoginResponse} from 'hybrid-types/MessageTypes';
import {
  createUser,
  getUserByEmail,
  getUserByUsername,
} from '../models/userModel';
import {
  UserWithLevel,
  TokenContent,
  UserWithNoPassword,
} from 'hybrid-types/DBTypes';
import {OAuth2Client} from 'google-auth-library';

const login = async (
  req: Request<{}, {}, {username: string; password: string}>,
  res: Response<LoginResponse>,
  next: NextFunction,
) => {
  try {
    const {username, password} = req.body;
    const user = await getUserByUsername(username);

    if (!bcrypt.compareSync(password, user.password)) {
      next(new CustomError('Incorrect username/password', 403));
      return;
    }

    if (!process.env.JWT_SECRET) {
      next(new CustomError('JWT secret not set', 500));
      return;
    }

    const outUser: Omit<UserWithLevel, 'password'> = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
      level_name: user.level_name,
    };

    const tokenContent: TokenContent = {
      user_id: user.user_id,
      level_name: user.level_name,
    };

    const token = jwt.sign(tokenContent, process.env.JWT_SECRET);

    res.json({
      message: 'Login successful',
      token,
      user: outUser,
    });
  } catch (error) {
    next(error);
  }
};
const googleLogin = async (
  req: Request<{}, {}, {idToken: string}>,
  res: Response<LoginResponse>,
  next: NextFunction,
) => {
  console.log('googleLogin');
  try {
    const {idToken} = req.body;

    if (!process.env.GOOGLE_CLIENT_ID) {
      next(new CustomError('Google Client ID not set', 500));
      return;
    }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      next(new CustomError('Invalid Google token', 400));
      return;
    }

    // Etsitään käyttäjä sähköpostilla
    let user: UserWithNoPassword | null;
    try {
      user = await getUserByEmail(payload.email);
    } catch (err: any) {
      if (err.message !== 'User not found') {
        // Jos kyseessä on jokin muu virhe, heitetään se eteenpäin
        throw err;
      }
      // Jos käyttäjää ei löydy, asetetaan user nulliksi
      user = null;
    }
    if (!user) {
      // Jos käyttäjää ei löydy, rekisteröidään uusi käyttäjä
      // Luodaan satunnainen salasana, jota ei käytetä, sillä kirjautuminen tapahtuu Googlen kautta
      const randomPassword = bcrypt.hashSync(
        Math.random().toString(36).slice(-8),
        10,
      );

      const baseUsername = payload.email.split('@')[0];
      let candidate = baseUsername;
      let counter = 1;
      while (true) {
        try {
          await getUserByUsername(candidate);
          candidate = baseUsername + ++counter;
        } catch (err: any) {
          if (err.message === 'User not found') {
            break;
          }
          throw err;
        }
      }

      const newUserData = {
        username: candidate,
        password: randomPassword,
        email: payload.email,
      };
      user = await createUser(newUserData);
    }

    if (!process.env.JWT_SECRET) {
      next(new CustomError('JWT secret not set', 500));
      return;
    }

    const outUser: Omit<UserWithLevel, 'password'> = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
      level_name: user.level_name,
    };

    const tokenContent: TokenContent = {
      user_id: user.user_id,
      level_name: user.level_name,
    };

    const token = jwt.sign(tokenContent, process.env.JWT_SECRET);

    res.json({
      message: 'Google login successful',
      token,
      user: outUser,
    });
  } catch (error) {
    next(error);
  }
};

export {login, googleLogin};
