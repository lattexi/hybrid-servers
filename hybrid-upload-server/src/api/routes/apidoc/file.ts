/**
 * @api {post} /upload Upload File
 * @apiName UploadFile
 * @apiGroup File
 *
 * @apiPermission token
 *
 * @apiHeader {String} Authorization Bearer token for authentication.
 * @apiHeader Content-Type multipart/form-data
 *
 * @apiParam {File} file The file to be uploaded.
 *
 * @apiSuccess {String} message Success message.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "file uploaded",
 *       "data": {
 *         "filename": "example.png",
 *         "media_type": "image/png",
 *         "filesize": 12345
 *       }
 *     }
 *
 * @apiError Unauthorized The user is not authenticated.
 * @apiError BadRequest The file is not provided in the request.
 * @apiError InternalServerError There's an error while processing the file or uploading it.
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Invalid Request
 *     {
 *       "message": "You suck at uploading files"
 *     }
 */
/**
 * @api {delete} /delete/:filename Delete File
 * @apiName DeleteFile
 * @apiGroup File
 *
 * @apiDescription This endpoint deletes a file. Only the owner of the file or an admin can delete a file.
 *
 * @apiHeader {String} Authorization Bearer token for authentication.
 *
 * @apiPermission token
 *
 * @apiParam {String} filename The name of the file to be deleted.
 *
 * @apiSuccess {String} message Success message.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "File deleted"
 *     }
 *
 * @apiError UserNotAuthorized The user is not authorized to delete the file.
 * @apiError FileNotFound The file was not found.
 * @apiError FilenameNotValid The filename is not valid.
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "File not found"
 *     }
 */
