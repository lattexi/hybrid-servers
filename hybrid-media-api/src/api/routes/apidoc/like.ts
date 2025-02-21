/**
 * @api {get} /likes Get All Likes
 * @apiName GetAllLikes
 * @apiGroup Like
 *
 * @apiSuccess {Object[]} likes Array of like objects
 * @apiSuccess {Number} likes.like_id Like's unique ID
 * @apiSuccess {Number} likes.media_id ID of the liked media
 * @apiSuccess {Number} likes.user_id ID of the user who liked
 * @apiSuccess {String} likes.created_at Timestamp when the like was created
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "like_id": 1,
 *         "media_id": 1,
 *         "user_id": 1,
 *         "created_at": "2024-01-26T09:38:08.000Z"
 *       }
 *     ]
 *
 * @apiError LikesNotFound No likes found
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "No likes found"
 *     }
 */

/**
 * @api {post} /likes Like Media
 * @apiName PostLike
 * @apiGroup Like
 *
 * @apiHeader {String} Authorization Bearer token for authentication
 *
 * @apiParam {Number} media_id ID of the media to like (min: 1)
 *
 * @apiSuccess {String} message Success message
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Like added"
 *     }
 *
 * @apiError ValidationError Invalid input parameters
 * @apiError AlreadyLiked User has already liked this media
 * @apiError Unauthorized Authentication required
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Like already exists"
 *     }
 */

/**
 * @api {get} /likes/bymedia/:media_id Get Likes by Media ID
 * @apiName GetLikesByMediaId
 * @apiGroup Like
 *
 * @apiParam {Number} media_id Media's ID (min: 1)
 *
 * @apiSuccess {Object[]} likes Array of like objects
 * @apiSuccess {Number} likes.like_id Like's unique ID
 * @apiSuccess {Number} likes.media_id ID of the liked media
 * @apiSuccess {Number} likes.user_id ID of the user who liked
 * @apiSuccess {String} likes.created_at Timestamp when the like was created
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "like_id": 1,
 *         "media_id": 1,
 *         "user_id": 1,
 *         "created_at": "2024-01-26T09:38:08.000Z"
 *       }
 *     ]
 *
 * @apiError LikesNotFound No likes found for this media
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "No likes found"
 *     }
 */

/**
 * @api {get} /likes/bymedia/user/:media_id Check User Like
 * @apiName CheckUserLike
 * @apiGroup Like
 *
 * @apiHeader {String} Authorization Bearer token for authentication
 *
 * @apiParam {Number} media_id Media's ID (min: 1)
 *
 * @apiSuccess {Number} like_id Like's unique ID
 * @apiSuccess {Number} media_id ID of the liked media
 * @apiSuccess {Number} user_id ID of the user who liked
 * @apiSuccess {String} created_at Timestamp when the like was created
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "like_id": 1,
 *       "media_id": 1,
 *       "user_id": 1,
 *       "created_at": "2024-01-26T09:38:08.000Z"
 *     }
 *
 * @apiError NotLiked User hasn't liked this media
 * @apiError Unauthorized Authentication required
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Like not found"
 *     }
 */

/**
 * @api {get} /likes/byuser/:id Get Likes by User ID or Token
 * @apiName GetLikesByUserIdOrToken
 * @apiGroup Like
 *
 * @apiHeader {String} Authorization Bearer token for authentication
 *
 * @apiParam {Number} [id] Optional User's ID (min: 1). If not provided, user ID from the authentication token will be used
 *
 * @apiSuccess {Object[]} likes Array of like objects
 * @apiSuccess {Number} likes.like_id Like's unique ID
 * @apiSuccess {Number} likes.media_id ID of the liked media
 * @apiSuccess {Number} likes.user_id ID of the user who liked
 * @apiSuccess {String} likes.created_at Timestamp when the like was created
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "like_id": 1,
 *         "media_id": 1,
 *         "user_id": 1,
 *         "created_at": "2024-01-26T09:38:08.000Z"
 *       }
 *     ]
 *
 * @apiError LikesNotFound No likes found for this user
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "No likes found"
 *     }
 */

/**
 * @api {get} /likes/count/:id Get Like Count by Media ID
 * @apiName GetLikeCountByMediaId
 * @apiGroup Like
 *
 * @apiParam {Number} id Media's ID (min: 1)
 *
 * @apiSuccess {Number} count Number of likes for the media
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "count": 5
 *     }
 *
 * @apiError MediaNotFound Media not found
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "No likes found"
 *     }
 */

/**
 * @api {delete} /likes/:id Delete Like
 * @apiName DeleteLike
 * @apiGroup Like
 *
 * @apiHeader {String} Authorization Bearer token for authentication
 *
 * @apiParam {Number} id Like's ID (min: 1)
 *
 * @apiSuccess {String} message Success message
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Like deleted"
 *     }
 *
 * @apiError LikeNotFound Like not found
 * @apiError Unauthorized Not authorized to delete this like
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Like not deleted"
 *     }
 */
