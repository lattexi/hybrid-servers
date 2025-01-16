import {Request, Response, NextFunction} from 'express';
import CustomError from '../../classes/CustomError';
import fs from 'fs';
import {TokenContent} from 'hybrid-types/DBTypes';
import {MessageResponse} from 'hybrid-types/MessageTypes';

const UPLOAD_DIR = './uploads';

type UploadResponse = MessageResponse & {
  data: {
    filename: string;
    media_type: string;
    filesize: number;
    screenshots?: string[];
  };
};

const uploadFile = async (
  req: Request,
  res: Response<UploadResponse, {user: TokenContent; screenshots: string[]}>,
  next: NextFunction
) => {
  const tempFiles: string[] = [];
  try {
    if (!req.file) {
      throw new CustomError('file not valid', 400);
    }

    const extension = req.file.originalname.split('.').pop();
    if (!extension) {
      throw new CustomError('Invalid file extension', 400);
    }

    // Append user_id to the random filename
    const filename = `${req.file.filename}_${res.locals.user.user_id}.${extension}`;
    const targetPath = `${UPLOAD_DIR}/${filename}`;
    tempFiles.push(req.file.path);

    try {
      fs.renameSync(req.file.path, targetPath);

      const thumbPath = `${req.file.path}-thumb.png`;
      if (fs.existsSync(thumbPath)) {
        const targetThumbPath = `${UPLOAD_DIR}/${filename}-thumb.png`;
        fs.renameSync(thumbPath, targetThumbPath);
      }

      if (res.locals.screenshots?.length > 0) {
        res.locals.screenshots = res.locals.screenshots.map((screenshot) => {
          const screenshotName = screenshot.split('-').pop();
          if (!screenshotName) {
            throw new CustomError('Invalid screenshot name', 400);
          }

          const targetScreenshotPath = `${UPLOAD_DIR}/${filename}-thumb-${screenshotName}`;
          fs.renameSync(screenshot, targetScreenshotPath);
          return `${filename}-thumb-${screenshotName}`;
        });
      }
    } catch {
      // Cleanup any created files on error
      cleanup(tempFiles);
      throw new CustomError('Error processing files', 500);
    }

    const response: UploadResponse = {
      message: 'file uploaded',
      data: {
        filename,
        media_type: req.file.mimetype,
        filesize: req.file.size,
      },
    };

    // if file is video, get thumbnails
    if (req.file.mimetype.includes('video')) {
      // get thumbnails
      const filenames = res.locals.screenshots;
      response.data.screenshots = filenames;
    }

    res.json(response);
  } catch (error) {
    cleanup(tempFiles);
    next(
      error instanceof CustomError
        ? error
        : new CustomError((error as Error).message, 400)
    );
  }
};

const deleteFile = async (
  req: Request<{filename: string}>,
  res: Response<MessageResponse, {user: TokenContent}>,
  next: NextFunction
) => {
  try {
    const {filename} = req.params;
    if (!filename) {
      throw new CustomError('filename not valid', 400);
    }

    // Check ownership by extracting user_id from filename
    if (res.locals.user.level_name !== 'Admin') {
      const fileUserId = filename.split('_').pop()?.split('.')[0];
      if (!fileUserId || fileUserId !== res.locals.user.user_id.toString()) {
        throw new CustomError('user not authorized', 401);
      }
    }

    const filePath = `${UPLOAD_DIR}/${filename}`;
    const thumbPath = `${UPLOAD_DIR}/${filename}-thumb.png`;

    if (!fs.existsSync(filePath)) {
      throw new CustomError('file not found', 404);
    }

    try {
      if (fs.existsSync(thumbPath)) {
        fs.unlinkSync(thumbPath);
      }
      fs.unlinkSync(filePath);
    } catch {
      throw new CustomError('Error deleting files', 500);
    }

    res.json({message: 'File deleted'});
  } catch (error) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError((error as Error).message, 400)
    );
  }
};

// Helper function to clean up temporary files
const cleanup = (files: string[]) => {
  files.forEach((file) => {
    try {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    } catch (error) {
      console.error(`Error cleaning up file ${file}:`, error);
    }
  });
};

export {uploadFile, deleteFile};
