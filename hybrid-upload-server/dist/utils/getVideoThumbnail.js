"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const path_1 = __importDefault(require("path"));
const getVideoThumbnail = (videoUrl) => {
    return new Promise((resolve, reject) => {
        const thumbnails = [];
        const originalName = path_1.default.basename(videoUrl);
        const gifFilename = `./uploads/${originalName}-animation.gif`;
        // First generate thumbnails
        (0, fluent_ffmpeg_1.default)().input(videoUrl);
        // First generate thumbnails
        (0, fluent_ffmpeg_1.default)()
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
            (0, fluent_ffmpeg_1.default)()
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
exports.default = getVideoThumbnail;
//# sourceMappingURL=getVideoThumbnail.js.map