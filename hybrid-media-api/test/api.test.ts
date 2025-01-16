/* eslint-disable node/no-unpublished-import */
/* eslint-disable @typescript-eslint/no-loss-of-precision */
require('dotenv').config();
import {MediaItem, User, UserWithNoPassword} from 'hybrid-types/DBTypes';
import {
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
} from './testMediaItem';
import randomstring from 'randomstring';
import {UploadResponse, UserResponse} from 'hybrid-types/MessageTypes';
import {loginUser, registerUser} from './testUser';
import app from '../src/app';
// const app = 'http://localhost:3000';

const authApi = process.env.AUTH_SERVER as string;
const uploadApi = process.env.UPLOAD_SERVER as string;

describe('Media API', () => {
  // test succesful user routes

  // test create user
  let token: string;
  let user: UserWithNoPassword;
  const testUser: Partial<User> = {
    username: 'Test User ' + randomstring.generate(7),
    email: randomstring.generate(9) + '@user.fi',
    password: 'asdfQEWR1234',
  };
  it('should create a new user', async () => {
    await registerUser(authApi, '/users', testUser);
  });

  // test login
  it('should return a user object and bearer token on valid credentials', async () => {
    const path = authApi + '/auth/login';
    console.log(path);
    const response = await loginUser(authApi, '/auth/login', {
      username: testUser.username!,
      password: testUser.password!,
    });
    token = response.token;
    user = response.user;
  });

  // test upload media file
  let uploadResponse: UploadResponse;
  it('should upload a media file', async () => {
    const mediaFile = './test/testfiles/testPic.jpeg';
    uploadResponse = await uploadMediaFile(
      uploadApi,
      '/upload',
      mediaFile,
      token,
    );
  });

  // post media file
  it('should post a media file', async () => {
    if (uploadResponse.data) {
      const mediaItem: Partial<MediaItem> = {
        title: 'Test Pic',
        description: 'A test picture',
        filename: uploadResponse.data.filename,
        media_type: uploadResponse.data.media_type,
        filesize: uploadResponse.data.filesize,
      };
      await postMediaItem(app, '/api/v1/media', token, mediaItem);
    }
  });

  // test succesful media routes
  let mediaItems: MediaItem[];
  let testMediaItem: MediaItem;
  it('Should get array of media items', async () => {
    mediaItems = await getMediaItems(app);
    testMediaItem = mediaItems[0];
  });

  it('Should get media item by id', async () => {
    const mediaItem = await getMediaItem(app, testMediaItem.media_id);
    expect(mediaItem.media_id).toBe(testMediaItem.media_id);
  });

  it('Should update media item', async () => {
    const updatedItem = {
      title: 'Updated Test Title',
      description: 'Updated test description',
      filename: testMediaItem.filename,
      media_type: testMediaItem.media_type,
      filesize: testMediaItem.filesize,
      user_id: testMediaItem.user_id,
    };
    await putMediaItem(app, testMediaItem.media_id, updatedItem);
  });

  it('Should delete media item', async () => {
    await deleteMediaItem(app, testMediaItem.media_id, token);
  });

  // test 404 error mediaItem routes
  it('Should return 404 when getting non-existent media item', async () => {
    await getNotFoundMediaItem(app, 999999);
  });

  it('Should return 404 when updating non-existent media item', async () => {
    await putNotFoundMediaItem(app, 999999, 'Test media');
  });

  it('Should return 404 when deleting non-existent media item', async () => {
    await deleteNotFoundMediaItem(app, 999999);
  });

  // test 400 error mediaItem routes with invalid data
  it('Should return 400 when posting invalid media item', async () => {
    await postInvalidMediaItem(app, '');
  });

  it('Should return 400 when updating with invalid media item data', async () => {
    await putInvalidMediaItem(app, 'invalid-id', '');
  });

  it('Should return 400 when deleting with invalid media id', async () => {
    await deleteInvalidMediaItem(app, 'invalid-id');
  });

  it('Should return 400 when getting media with invalid id', async () => {
    await getInvalidMediaItem(app, 'invalid-id');
  });

  // TODO: add test for get mediaItem by id
  // TODO: add test for put mediaItem
  // TODO: add test for delete mediaItem

  // test 404 error mediaItem routes
  // TODO: add test for get mediaItem by id
  // TODO: add test for put mediaItem
  // TODO: add test for delete mediaItem

  // test 400 error mediaItem routes with invalid data
  // TODO: add test for post mediaItem
  // TODO: add test for put mediaItem
  // TODO: add test for delete mediaItem
  // TODO: add test for get mediaItem by id

  // test 404 error tags routes
  // TODO: add test for get tag by id
  // TODO: add test for put tag
  // TODO: add test for delete tag

  // test 400 error tags route with invalid data
  // TODO: add test for post tag
  // TODO: add test for put tag
  // TODO: add test for delete tag

  // test 404 error like routes
  // TODO: add test for get like by id
  // TODO: add test for put like
  // TODO: add test for delete like

  // test 400 error like routes with invalid data
  // TODO: add test for post like
  // TODO: add test for put like
  // TODO: add test for delete like
  // TODO: add test for get like by id
});
