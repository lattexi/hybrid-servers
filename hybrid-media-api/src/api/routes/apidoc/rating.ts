/**
 * @api {get} /rating Get All Ratings
 * @apiName GetRatingList
 * @apiGroup Rating
 *
 * @apiSuccess {Object[]} Array of rating objects
 * @apiSuccess {Number} rating_id Rating's unique ID
 * @apiSuccess {Number} rating_value Rating value (1-5)
 * @apiSuccess {Number} media_id ID of the rated media
 * @apiSuccess {Number} user_id ID of the user who rated
 * @apiSuccess {String} created_at Timestamp when rating was created
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "rating_id": 1,
 *         "rating_value": 5,
 *         "media_id": 1,
 *         "user_id": 1,
 *         "created_at": "2024-01-26T09:38:08.000Z"
 *       }
 *     ]
 *
 * @apiError RatingsNotFound No ratings found
 */
/**
 * @api {get} /ratings/bymedia/:id Request Rating List by Media ID
 * @apiName GetRatingListByMediaId
 * @apiGroup Rating
 *
 * @apiParam {Number} id Media's unique ID.
 *
 * @apiSuccess {Object[]} ratings List of Ratings.
 * @apiSuccess {Number} ratings.rating_id ID of the Rating.
 * @apiSuccess {Number} ratings.rating_value Value of the Rating.
 * @apiSuccess {Number} ratings.media_id ID of the Media.
 * @apiSuccess {Date} ratings.created_at Timestamp of when the Rating was created.
 * @apiSuccess {Number} ratings.user_id ID of the User who gave the Rating.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "rating_id": 1,
 *         "rating_value": 5,
 *         "media_id": 1,
 *         "created_at": "2022-01-01T00:00:00.000Z",
 *         "user_id": 1
 *       }
 *     ]
 *
 * @apiError NoRatingsFound No ratings found for the specified media ID.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "No ratings found"
 *     }
 */
/**
 * @api {get} /ratings/byuser Request Rating List by User Token
 * @apiName GetRatingListByUserToken
 * @apiGroup Rating
 *
 * @apiHeader {String} Authorization Bearer token for authentication.
 *
 * @apiSuccess {Object[]} ratings List of Ratings.
 * @apiSuccess {Number} ratings.rating_id ID of the Rating.
 * @apiSuccess {Number} ratings.rating_value Value of the Rating.
 * @apiSuccess {Number} ratings.media_id ID of the Media.
 * @apiSuccess {Date} ratings.created_at Timestamp of when the Rating was created.
 * @apiSuccess {Number} ratings.user_id ID of the User who gave the Rating.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "rating_id": 1,
 *         "rating_value": 5,
 *         "media_id": 1,
 *         "created_at": "2022-01-01T00:00:00.000Z",
 *         "user_id": 1
 *       }
 *     ]
 *
 * @apiError NoRatingsFound No ratings found for the specified user.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "No ratings found"
 *     }
 */
/**
 * @api {get} /rating/average/:id Get Average Rating
 * @apiName GetAverageRating
 * @apiGroup Rating
 *
 * @apiParam {Number} id Media's unique ID
 *
 * @apiSuccess {Number} average Average rating value
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "average": 4.5
 *     }
 *
 * @apiError RatingsNotFound No ratings for this media
 */
/**
 * @api {delete} /ratings/:id Delete Rating
 * @apiName DeleteRating
 * @apiGroup Rating
 *
 * @apiHeader {String} Authorization Bearer token for authentication.
 *
 * @apiParam {Number} id Rating's unique ID.
 *
 * @apiSuccess {String} message Success message.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Rating deleted successfully"
 *     }
 *
 * @apiError RatingNotFound The id of the Rating was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "RatingNotFound"
 *     }
 */
/**
 * @api {post} /rating Post Rating
 * @apiName PostRating
 * @apiGroup Rating
 *
 * @apiHeader {String} Authorization Bearer token for authentication
 *
 * @apiParam {Number} rating_value Rating value (1-5)
 * @apiParam {Number} media_id Media's unique ID
 *
 * @apiSuccess {String} message Success message
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Rating added"
 *     }
 *
 * @apiError ValidationError Invalid rating value or media_id
 * @apiError Unauthorized Authentication required
 */
