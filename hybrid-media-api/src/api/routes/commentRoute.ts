import express from 'express';
import {
  commentListGet,
  commentListByMediaIdGet,
  commentListByUserGet,
  commentCountByMediaIdGet,
  commentGet,
  commentPost,
  commentPut,
  commentDelete,
} from '../controllers/commentController';
import {authenticate, validationErrors} from '../../middlewares';
import {body, param} from 'express-validator';

const router = express.Router();

router
  .route('/')
  .get(commentListGet)
  .post(
    authenticate,
    body('comment_text')
      .trim()
      .notEmpty()
      .isString()
      .isLength({min: 1})
      .escape(),
    body('media_id').notEmpty().isInt({min: 1}).toInt(),
    validationErrors,
    commentPost,
  );

router
  .route('/bymedia/:id')
  .get(
    param('id').isInt({min: 1}).toInt(),
    validationErrors,
    commentListByMediaIdGet,
  );

router.route('/byuser').get(authenticate, commentListByUserGet);

router
  .route('/count/:id')
  .get(
    param('id').isInt({min: 1}).toInt(),
    validationErrors,
    commentCountByMediaIdGet,
  );

router
  .route('/:id')
  .get(param('id').isInt({min: 1}).toInt(), validationErrors, commentGet)
  .put(
    authenticate,
    param('id').isInt({min: 1}).toInt(),
    body('comment_text')
      .trim()
      .notEmpty()
      .isString()
      .isLength({min: 1})
      .escape(),
    validationErrors,
    commentPut,
  )
  .delete(
    authenticate,
    param('id').isInt({min: 1}).toInt(),
    validationErrors,
    commentDelete,
  );

export default router;
