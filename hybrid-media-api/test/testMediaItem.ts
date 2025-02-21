/* eslint-disable node/no-unpublished-import */
import {MediaItem} from 'hybrid-types/DBTypes';
import {MessageResponse, UploadResponse} from 'hybrid-types/MessageTypes';
import request from 'supertest';
import {Application} from 'express';

const uploadMediaFile = (
  url: string | Application,
  path: string,
  mediaFile: string,
  token: string,
): Promise<UploadResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post(path)
      .attach('file', mediaFile)
      .set('Authorization', `Bearer ${token}`)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const message: UploadResponse = response.body;
          expect(message.message).toBe('file uploaded');
          expect(message.data?.filename).not.toBe('');
          expect(message.data?.filesize).toBeGreaterThan(0);
          expect(message.data?.media_type).not.toBe('');
          resolve(message);
        }
      });
  });
};

const getMediaItems = (url: string | Application): Promise<MediaItem[]> => {
  return new Promise((resolve, reject) => {
    request(url)
      .get('/api/v1/media')
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const mediaItems: MediaItem[] = response.body;
          mediaItems.forEach((mediaItem) => {
            expect(mediaItem.media_id).toBeGreaterThan(0);
            expect(mediaItem.title).not.toBe('');
            expect(mediaItem.media_type).not.toBe('');
            expect(mediaItem.filename).not.toBe('');
            expect(mediaItem.thumbnail).not.toBe('');
            expect(mediaItem.created_at).not.toBe('');
            expect(mediaItem.filesize).toBeGreaterThan(0);
            expect(mediaItem.user_id).toBeGreaterThan(0);
          });
          resolve(mediaItems);
        }
      });
  });
};

const getMediaItem = (
  url: string | Application,
  id: number,
): Promise<MediaItem> => {
  return new Promise((resolve, reject) => {
    request(url)
      .get(`/api/v1/media/${id}`)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const mediaItem: MediaItem = response.body;
          expect(mediaItem.media_id).toBeGreaterThan(0);
          expect(mediaItem.title).not.toBe('');
          expect(mediaItem.media_type).not.toBe('');
          expect(mediaItem.filename).not.toBe('');
          expect(mediaItem.thumbnail).not.toBe('');
          expect(mediaItem.created_at).not.toBe('');
          expect(mediaItem.filesize).toBeGreaterThan(0);
          expect(mediaItem.user_id).toBeGreaterThan(0);
          resolve(mediaItem);
        }
      });
  });
};

const postMediaItem = (
  url: string | Application,
  path: string,
  token: string,
  mediaItem: Partial<MediaItem>,
): Promise<MessageResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post(path)
      .set('Authorization', `Bearer ${token}`)
      .send(mediaItem)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const message: MessageResponse = response.body;
          expect(message.message).toBe('Media created');
          resolve(message);
        }
      });
  });
};

const putMediaItem = (
  url: string | Application,
  id: number,
  mediaItem: Omit<MediaItem, 'media_id' | 'thumbnail' | 'created_at'>,
): Promise<MessageResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .put(`/api/v1/media/${id}`)
      .send(mediaItem)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const message: MessageResponse = response.body;
          expect(message.message).toBe('media item updated');
          resolve(message);
        }
      });
  });
};

const deleteMediaItem = (
  url: string | Application,
  id: number,
  token: string,
): Promise<MessageResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .delete(`/api/v1/media/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const message: MessageResponse = response.body;
          expect(message.message).toBe('media item deleted');
          resolve(message);
        }
      });
  });
};

// functions to test not found 404 for mediaItem routes
const getNotFoundMediaItem = (
  url: string | Application,
  id: number,
): Promise<MessageResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .get(`/api/v1/media/${id}`)
      .expect(404, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const message: MessageResponse = response.body;
          expect(message.message).not.toBe('');
          resolve(message);
        }
      });
  });
};

const putNotFoundMediaItem = (
  url: string | Application,
  id: number,
  media_name: string,
): Promise<MessageResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .put(`/api/v1/media/${id}`)
      .send({media_name})
      .expect(404, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const message: MessageResponse = response.body;
          expect(message.message).not.toBe('');
          resolve(message);
        }
      });
  });
};

const deleteNotFoundMediaItem = (
  url: string | Application,
  id: number,
): Promise<MessageResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .delete(`/api/v1/media/${id}`)
      .expect(404, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const message: MessageResponse = response.body;
          expect(message.message).not.toBe('');
          resolve(message);
        }
      });
  });
};

// functions to test invalid data 400 for mediaItem routes
const postInvalidMediaItem = (
  url: string | Application,
  media_name: string,
): Promise<MessageResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/api/v1/media')
      .send({media_name})
      .expect(400, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const message: MessageResponse = response.body;
          expect(message.message).not.toBe('');
          resolve(message);
        }
      });
  });
};

const putInvalidMediaItem = (
  url: string | Application,
  id: string,
  media_name: string,
): Promise<MessageResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .put(`/api/v1/media/${id}`)
      .send({media_name})
      .expect(400, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const message: MessageResponse = response.body;
          expect(message.message).not.toBe('');
          resolve(message);
        }
      });
  });
};

const deleteInvalidMediaItem = (
  url: string | Application,
  id: string,
): Promise<MessageResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .delete(`/api/v1/media/${id}`)
      .expect(400, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const message: MessageResponse = response.body;
          expect(message.message).not.toBe('');
          resolve(message);
        }
      });
  });
};

const getInvalidMediaItem = (
  url: string | Application,
  id: string,
): Promise<MessageResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .get(`/api/v1/media/${id}`)
      .expect(400, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const message: MessageResponse = response.body;
          expect(message.message).not.toBe('');
          resolve(message);
        }
      });
  });
};

const getMediaItemsWithPagination = (
  url: string | Application,
  page: number,
  limit: number,
): Promise<MediaItem[]> => {
  return new Promise((resolve, reject) => {
    request(url)
      .get(`/api/v1/media?page=${page}&limit=${limit}`)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const mediaItems: MediaItem[] = response.body;
          expect(mediaItems.length).toBeLessThanOrEqual(limit);
          resolve(mediaItems);
        }
      });
  });
};

const getMostLikedMedia = (url: string | Application): Promise<MediaItem> => {
  return new Promise((resolve, reject) => {
    request(url)
      .get('/api/v1/media/mostliked')
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const mediaItem: MediaItem = response.body;
          expect(mediaItem.media_id).toBeGreaterThan(0);
          resolve(mediaItem);
        }
      });
  });
};

const getMediaByUser = (
  url: string | Application,
  userId: number,
): Promise<MediaItem[]> => {
  return new Promise((resolve, reject) => {
    request(url)
      .get(`/api/v1/media/byuser/${userId}`)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const mediaItems: MediaItem[] = response.body;
          mediaItems.forEach((item) => {
            expect(item.user_id).toBe(userId);
          });
          resolve(mediaItems);
        }
      });
  });
};

const getMediaByToken = (
  url: string | Application,
  token: string,
): Promise<MediaItem[]> => {
  return new Promise((resolve, reject) => {
    request(url)
      .get('/api/v1/media/bytoken')
      .set('Authorization', `Bearer ${token}`)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const mediaItems: MediaItem[] = response.body;
          resolve(mediaItems);
        }
      });
  });
};

export {
  uploadMediaFile,
  getMediaItems,
  getMediaItem,
  postMediaItem,
  putMediaItem,
  deleteMediaItem,
  getNotFoundMediaItem,
  putNotFoundMediaItem,
  deleteNotFoundMediaItem,
  postInvalidMediaItem,
  putInvalidMediaItem,
  deleteInvalidMediaItem,
  getInvalidMediaItem,
  getMediaItemsWithPagination,
  getMostLikedMedia,
  getMediaByUser,
  getMediaByToken,
};
