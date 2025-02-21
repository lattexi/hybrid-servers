/* eslint-disable node/no-unpublished-import */
require('dotenv').config();
import {User} from 'hybrid-types/DBTypes';
import request from 'supertest';
import {Application} from 'express';
import {LoginResponse, UserResponse} from 'hybrid-types/MessageTypes';

// functios to test succesful user routes
const registerUser = (
  url: string | Application,
  path: string,
  user: Partial<User>,
): Promise<UserResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post(path)
      .send(user)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const newUser: UserResponse = response.body;
          expect(newUser.message).toBe('user created');
          expect(newUser.user.user_id).toBeGreaterThan(0);
          expect(newUser.user.username).toBe(user.username);
          expect(newUser.user.email).toBe(user.email);
          expect(newUser.user.created_at).not.toBe('');
          expect(newUser.user.level_name).toBe('User');
          resolve(newUser);
        }
      });
  });
};

const loginUser = (
  url: string | Application,
  path: string,
  user: {username: string; password: string},
): Promise<LoginResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post(path)
      .send(user)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const login: LoginResponse = response.body;
          expect(login.message).toBe('Login successful');
          expect(login.token).not.toBe('');
          expect(login.user.user_id).toBeGreaterThan(0);
          expect(login.user.username).toBe(user.username);
          expect(login.user.email).not.toBe('');
          expect(login.user.created_at).not.toBe('');
          expect(['User', 'Admin', 'Guest']).toEqual(
            expect.arrayContaining([login.user.level_name]),
          );
          resolve(login);
        }
      });
  });
};

export {registerUser, loginUser};
