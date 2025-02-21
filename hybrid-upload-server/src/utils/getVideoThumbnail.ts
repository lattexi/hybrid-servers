import ffmpeg from 'fluent-ffmpeg';
import path from 'path';

const getVideoThumbnail = (
  videoUrl: string,
): Promise<{thumbnails: string[]; gif: string}> => {
  return new Promise((resolve, reject) => {
    const thumbnails: string[] = [];
    const originalName = path.basename(videoUrl);
    const gifFilename = `./uploads/${originalName}-animation.gif`;

    // First generate thumbnails
    ffmpeg().input(videoUrl);
    // First generate thumbnails
    ffmpeg()
      .input(videoUrl)
      .screenshots({
        count: 5,
        filename: `./uploads/${originalName}-thumb-%i.png`,
        size: '640x?',
      })
      .on('filenames', (filenames) => {
        thumbnails.push(...filenames);
      })
      .on('end', () => {
        // Then generate GIF after thumbnails are done
        ffmpeg()
          .input(videoUrl)
          .outputOptions([
            '-vf',
            'fps=5,scale=480:-1:flags=lanczos',
            '-c:v',
            'gif',
            '-f',
            'gif',
          ])
          .output(gifFilename)
          .on('end', () => {
            // Both processes completed successfully
            resolve({
              thumbnails,
              gif: gifFilename,
            });
          })
          .on('error', (err) => {
            console.log('GIF generation error:', err);
            // Still resolve with thumbnails even if GIF fails
            resolve({
              thumbnails,
              gif: '',
            });
          })
          .run();
      })
      .on('error', (err) => {
        console.log('Screenshot generation error:', err);
        reject(err);
      });
  });
};

export default getVideoThumbnail;
