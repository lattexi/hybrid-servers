/**
 * @api {post} /auth/login User Login
 * @apiName UserLogin
 * @apiGroup Authentication
 *
 * @apiParam {String} username Username of the User.
 * @apiParam {String} password Password of the User.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "username": "test_user",
 *       "password": "12345"
 *     }
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {String} token User's authentication token.
 * @apiSuccess {Object} user User's information.
 * @apiSuccess {Number} user.user_id User's unique ID.
 * @apiSuccess {String} user.username User's username.
 * @apiSuccess {String} user.email User's email.
 * @apiSuccess {Date} user.created_at Timestamp when the user was created.
 * @apiSuccess {String} user.level_name User's level (Admin | User | Guest).
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Login successful",
 *       "token": "dummy_token",
 *       "user": {
 *         "user_id": 1,
 *         "username": "dummy_user",
 *         "email": "dummy_user@example.com",
 *         "created_at": "2022-01-01T00:00:00.000Z",
 *         "level_name": "User"
 *       }
 *     }
 */
