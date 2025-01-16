import express from 'express';
import {
  mediaListGet,
  mediaGet,
  mediaPost,
  mediaPut,
  mediaDelete,
  mediaByUserGet,
  mediaListMostLikedGet,
} from '../controllers/mediaController';
import {authenticate, validationErrors} from '../../middlewares';
import {body, param, query} from 'express-validator';

const router = express.Router();

router
  .route('/')
  .get(
    query('page').optional().isInt({min: 1}).toInt(),
    query('limit').optional().isInt({min: 1}).toInt(),
    validationErrors,
    mediaListGet,
  )
  .post(
    authenticate,
    body('title')
      .trim()
      .notEmpty()
      .isString()
      .isLength({min: 3, max: 128})
      .escape(),
    body('description')
      .trim()
      .notEmpty()
      .isString()
      .isLength({max: 1000})
      .escape(),
    body('filename')
      .trim()
      .notEmpty()
      .isString()
      .matches(/^[\w.-]+$/)
      .escape(),
    body('media_type').trim().notEmpty().isMimeType(),
    body('filesize').notEmpty().isInt({min: 1}).toInt(),
    validationErrors,
    mediaPost,
  );

router.route('/mostliked').get(mediaListMostLikedGet);

router
  .route('/:id')
  .get(param('id').isInt({min: 1}).toInt(), validationErrors, mediaGet)
  .put(
    authenticate,
    param('id').isInt({min: 1}).toInt(),
    body('title')
      .optional()
      .trim()
      .isString()
      .isLength({min: 3, max: 128})
      .escape(),
    body('description')
      .optional()
      .trim()
      .isString()
      .isLength({max: 1000})
      .escape(),
    validationErrors,
    mediaPut,
  )
  .delete(
    authenticate,
    param('id').isInt({min: 1}).toInt(),
    validationErrors,
    mediaDelete,
  );

router.route('/byuser/:id').get(mediaByUserGet);

router.route('/bytoken').get(authenticate, mediaByUserGet);

export default router;
