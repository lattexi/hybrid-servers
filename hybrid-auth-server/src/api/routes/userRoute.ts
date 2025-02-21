import express from 'express';
import {
  checkEmailExists,
  checkToken,
  checkUsernameExists,
  userDelete,
  userDeleteAsAdmin,
  userGet,
  userListGet,
  userPost,
  userPut,
  userPutAsAdmin,
} from '../controllers/userController';
import {authenticate, validationErrors} from '../../middlewares';
import {body, param} from 'express-validator';

const router = express.Router();

router.get('/', userListGet);

router.post(
  '/',
  body('username')
    .trim()
    .escape()
    .isLength({min: 3, max: 50})
    .withMessage('Username must be between 3-50 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      'Username can only contain letters, numbers, underscores and dashes',
    ),
  body('password')
    .isString()
    .isLength({min: 5})
    .withMessage('Password must be at least 5 characters long'),
  body('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Invalid email format'),
  validationErrors,
  userPost,
);

router.put(
  '/',
  authenticate,
  body('username')
    .optional()
    .trim()
    .escape()
    .isLength({min: 3, max: 50})
    .withMessage('Username must be between 3-50 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      'Username can only contain letters, numbers, underscores and dashes',
    ),
  body('password')
    .optional()
    .isString()
    .isLength({min: 5})
    .withMessage('Password must be at least 5 characters long'),
  body('email')
    .optional()
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Invalid email format'),
  validationErrors,
  userPut,
);

router.delete('/', authenticate, userDelete);

router.get('/token', authenticate, checkToken);

router.route('/:id').get(param('id').isNumeric(), validationErrors, userGet);

router.route('/:id').put(
  authenticate,
  param('id').isNumeric(),
  body('username')
    .optional()
    .trim()
    .escape()
    .isLength({min: 3, max: 50})
    .withMessage('Username must be between 3-50 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      'Username can only contain letters, numbers, underscores and dashes',
    ),
  body('password')
    .optional()
    .isString()
    .isLength({min: 5})
    .withMessage('Password must be at least 5 characters long'),
  body('email')
    .optional()
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Invalid email format'),
  validationErrors,
  userPutAsAdmin,
);

router
  .route('/:id')
  .delete(
    authenticate,
    param('id').isNumeric(),
    validationErrors,
    userDeleteAsAdmin,
  );

router.get(
  '/email/:email',
  param('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Invalid email format'),
  validationErrors,
  checkEmailExists,
);

router.get(
  '/username/:username',
  param('username')
    .trim()
    .escape()
    .isLength({min: 3, max: 50})
    .withMessage('Username must be between 3-50 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      'Username can only contain letters, numbers, underscores and dashes',
    ),
  validationErrors,
  checkUsernameExists,
);

export default router;
