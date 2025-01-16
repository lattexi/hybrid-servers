import express from 'express';
import {
  likeListGet,
  likeListByMediaIdGet,
  likeListByUserIdGet,
  likePost,
  likeDelete,
  likeCountByMediaIdGet,
  likeByMediaIdAndUserIdGet,
} from '../controllers/likeController';
import {authenticate, validationErrors} from '../../middlewares';
import {body, param} from 'express-validator';

const router = express.Router();

router
  .route('/')
  .get(likeListGet)
  .post(
    authenticate,
    body('media_id').isInt({min: 1}).toInt(),
    validationErrors,
    likePost,
  );

router
  .route('/bymedia/:media_id')
  .get(
    param('media_id').isInt({min: 1}).toInt(),
    validationErrors,
    likeListByMediaIdGet,
  );

router
  .route('/bymedia/user/:media_id')
  .get(
    authenticate,
    param('media_id').isInt({min: 1}).toInt(),
    validationErrors,
    likeByMediaIdAndUserIdGet,
  );

router
  .route('/byuser/:id')
  .get(
    authenticate,
    param('id').isInt({min: 1}).toInt(),
    validationErrors,
    likeListByUserIdGet,
  );

router
  .route('/count/:id')
  .get(
    param('id').isInt({min: 1}).toInt(),
    validationErrors,
    likeCountByMediaIdGet,
  );

router
  .route('/:id')
  .delete(
    authenticate,
    param('id').isInt({min: 1}).toInt(),
    validationErrors,
    likeDelete,
  );

export default router;
