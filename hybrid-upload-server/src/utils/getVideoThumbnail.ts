import ffmpeg from 'fluent-ffmpeg';

const getVideoThumbnail = (videoUrl: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const filenames: string[] = []; // Array to hold the filenames

    ffmpeg()
      .input(videoUrl)
      .screenshots({
        count: 5, // Number of thumbnails to generate
        filename: './uploads/%b-thumb-%i.png', // Filename pattern with index
        size: '640x480', // Set the size of the thumbnails
      })
      .on('end', () => {
        resolve(filenames); // Resolve with the array of filenames
      })
      .on('error', (error) => {
        console.error('ffmpeg', error);
        reject(error); // Reject the promise if an error occurs
      })
      .on('filenames', (generatedFilenames) => {
        // Capture the filenames generated by ffmpeg
        filenames.push(...generatedFilenames);
      });
  });
};

export default getVideoThumbnail;
