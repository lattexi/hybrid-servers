import express, {Request, Response} from 'express';

import mediaRoute from './routes/mediaRoute';
import tagRoute from './routes/tagRoute';
import likeRoute from './routes/likeRoute';
import commentRoute from './routes/commentRoute';
import ratingRoute from './routes/ratingRoute';
import {MessageResponse} from 'hybrid-types/MessageTypes';

const router = express.Router();

router.get('/', (req: Request, res: Response<MessageResponse>) => {
  res.json({
    message: 'media api v1',
  });
});

router.use('/media', mediaRoute);
router.use('/tags', tagRoute);
router.use('/likes', likeRoute);
router.use('/comments', commentRoute);
router.use('/ratings', ratingRoute);

export default router;
