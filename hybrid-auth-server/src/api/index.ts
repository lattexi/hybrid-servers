import express, {Request, Response} from 'express';

import userRoute from './routes/userRoute';
import authRoute from './routes/authRoute';
import {MessageResponse} from 'hybrid-types/MessageTypes';
const router = express.Router();

router.get('/', (req: Request, res: Response<MessageResponse>) => {
  res.json({
    message: 'routes: users, auth',
  });
});

router.use('/auth', authRoute);
router.use('/users', userRoute);

export default router;
