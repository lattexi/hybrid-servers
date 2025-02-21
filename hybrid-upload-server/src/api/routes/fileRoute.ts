import express, {NextFunction, Request, Response} from 'express';
import {deleteFile, uploadFile} from '../controllers/uploadController';
import multer from 'multer';
import {authenticate, makeThumbnail} from '../../middlewares';
import CustomError from '../../classes/CustomError';
import {TokenContent} from 'hybrid-types/DBTypes';
import randomstring from 'randomstring';

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    const userId = (req as Request).res?.locals.user.user_id;
    const extension = file.originalname.split('.').pop();
    // generate random filename
    const randomName = randomstring.generate(20);
    const newFilename = `${randomName}_${userId}.${extension}`;
    cb(null, newFilename);
  },
});

const upload = multer({storage}).single('file');

const doUpload = (
  req: Request,
  res: Response<unknown, {user: TokenContent}>,
  next: NextFunction,
) => {
  upload(req, res, (err) => {
    if (err) {
      next(new CustomError(err.message, 400));
      return;
    }

    if (
      req.file &&
      (req.file.mimetype.includes('image') ||
        req.file.mimetype.includes('video'))
    ) {
      next();
    }
  });
};

const router = express.Router();

router.route('/upload').post(authenticate, doUpload, makeThumbnail, uploadFile);

router.route('/delete/:filename').delete(authenticate, deleteFile);

export default router;
