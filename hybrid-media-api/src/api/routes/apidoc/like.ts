/**
 * @api {get} /likes Get Likes
 * @apiName GetLikes
 * @apiGroup Like
 *
 * @apiSuccess {Object[]} likes List of likes.
 * @apiSuccess {Number} likes.like_id ID of the like.
 * @apiSuccess {Number} likes.user_id ID of the user who liked.
 * @apiSuccess {Number} likes.media_id ID of the media that was liked.
 * @apiSuccess {created_at} likes.created_at Timestamp of when the like was created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "like_id": 1,
 *         "user_id": 1,
 *         "media_id": 1
 *         "created_at": "2022-01-01T00:00:00.000Z"
 *       },
 *       ...
 *     ]
 *
 * @apiError LikesNotFound The likes were not found.
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "No likes found"
 *     }
 */
/**
 * @api {post} /likes Post Like
 * @apiName PostLike
 * @apiGroup Like
 *
 * @apiHeader {String} Authorization Bearer token for authentication.
 *
 * @apiParam {Number} media_id ID of the media to be liked.
 *
 * @apiExample {json} Request-Example:
 *     POST /likes
 *     {
 *       "media_id": 1
 *     }
 *
 * @apiSuccess {String} message Success message.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Like added"
 *     }
 *
 * @apiError MediaNotFound The media was not found.
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Like not created"
 *     }
 */
/**
 * @api {get} /likes/bymedia/:id Get Likes by Media ID
 * @apiName GetLikesByMediaId
 * @apiGroup Like
 *
 * @apiParam {Number} id Media's unique ID.
 *
 *
 * @apiSuccess {Object[]} likes List of likes.
 * @apiSuccess {Number} likes.like_id ID of the like.
 * @apiSuccess {Number} likes.user_id ID of the user who liked.
 * @apiSuccess {Number} likes.media_id ID of the media that was liked.
 * @apiSuccess {created_at} likes.created_at Timestamp of when the like was created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "like_id": 1,
 *         "user_id": 1,
 *         "media_id": 1
 *         "created_at": "2022-01-01T00:00:00.000Z"
 *       },
 *       ...
 *     ]
 *
 * @apiError LikesNotFound The likes were not found.
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "No likes found"
 *     }
 */
/**
 * @api {get} /likes/byuser Get Likes by User Token
 * @apiName GetLikesByUserToken
 * @apiGroup Like
 *
 * @apiHeader {String} Authorization Bearer token for authentication.
 *
 * @apiSuccess {Object[]} likes List of likes.
 * @apiSuccess {Number} likes.like_id ID of the like.
 * @apiSuccess {Number} likes.user_id ID of the user who liked.
 * @apiSuccess {Number} likes.media_id ID of the media that was liked.
 * @apiSuccess {created_at} likes.created_at Timestamp of when the like was created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "like_id": 1,
 *         "user_id": 1,
 *         "media_id": 1
 *         "created_at": "2022-01-01T00:00:00.000Z"
 *       },
 *       ...
 *     ]
 *
 * @apiError LikesNotFound The likes were not found.
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
 * @apiParam {Number} id Media's unique ID.
 *
 * @apiSuccess {Number} count Count of likes for the media.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "count": 5
 *     }
 *
 * @apiError LikesNotFound The likes were not found.
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "No likes found"
 *     }
 */
/**
 * @api {delete} /like/:id Delete Like
 * @apiName DeleteLike
 * @apiGroup Like
 *
 * @apiHeader {String} Authorization Bearer token for authentication.
 *
 * @apiParam {Number} id Like's unique ID.
 *
 * @apiSuccess {String} message Success message.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Like deleted"
 *     }
 *
 * @apiError LikeNotFound The like was not found.
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Like not deleted"
 *     }
 */
/**
 * @api {get} /like/bymedia/user/:media_id Get Likes by Media ID and User ID
 * @apiName GetLikesByMediaIdAndUserId
 * @apiGroup Like
 *
 * @apiHeader {String} Authorization Bearer token for authentication.
 *
 * @apiParam {Number} media_id Media's unique ID.
 *
 * @apiExample {json} Request-Example:
 *     GET /like/bymedia/user/1
 *
 * @apiSuccess {Object[]} likes List of Likes.
 * @apiSuccess {Number} likes.id Like's ID.
 * @apiSuccess {Number} likes.media_id Media's ID.
 * @apiSuccess {Number} likes.user_id User's ID.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "likes": [
 *         {
 *           "id": 1,
 *           "media_id": 1,
 *           "user_id": 1
 *         }
 *       ]
 *     }
 *
 * @apiError LikesNotFound No likes were found.
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "No likes found"
 *     }
 */
/**
 * @api {get} /like Get All Likes
 * @apiName GetAllLikes
 * @apiGroup Like
 *
 * @apiSuccess {Object[]} likes Array of like objects
 * @apiSuccess {Number} likes.like_id Like's unique ID
 * @apiSuccess {Number} likes.media_id ID of the liked media
 * @apiSuccess {Number} likes.user_id ID of the user who liked
 * @apiSuccess {String} likes.created_at Timestamp when the like was created
 *
 * @apiSuccessExample Success-Response:
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
 */

/**
 * @api {post} /like Like Media
 * @apiName PostLike
 * @apiGroup Like
 *
 * @apiHeader {String} Authorization Bearer token for authentication
 *
 * @apiParam {Number} media_id ID of the media to like (min: 1)
 *
 * @apiSuccess {String} message Success message
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Like added"
 *     }
 *
 * @apiError ValidationError Invalid media_id
 * @apiError AlreadyLiked User has already liked this media
 * @apiError Unauthorized Authentication required
 */

/**
 * @api {get} /like/bymedia/:media_id Get Likes by Media ID
 * @apiName GetLikesByMediaId
 * @apiGroup Like
 *
 * @apiParam {Number} media_id Media's ID (min: 1)
 *
 * @apiSuccess {Object[]} likes Array of likes for the media
 *
 * @apiError LikesNotFound No likes found for this media
 */

/**
 * @api {get} /like/bymedia/user/:media_id Check User Like
 * @apiName CheckUserLike
 * @apiGroup Like
 *
 * @apiHeader {String} Authorization Bearer token for authentication
 *
 * @apiParam {Number} media_id Media's ID (min: 1)
 *
 * @apiSuccess {Object} like Like object if user has liked the media
 *
 * @apiError NotLiked User hasn't liked this media
 * @apiError Unauthorized Authentication required
 */

/**
 * @api {delete} /like/:id Delete Like
 * @apiName DeleteLike
 * @apiGroup Like
 *
 * @apiHeader {String} Authorization Bearer token for authentication
 *
 * @apiParam {Number} id Like's ID (min: 1)
 *
 * @apiSuccess {String} message Success message
 *
 * @apiError LikeNotFound Like not found
 * @apiError Unauthorized Not authorized to delete this like
 */
