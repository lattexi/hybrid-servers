/**
 * @api {get} /users Get User List
 * @apiName GetUserList
 * @apiGroup User
 *
 * @apiSuccess {Object[]} users List of users.
 * @apiSuccess {Number} users.user_id User's unique ID.
 * @apiSuccess {String} users.username User's username.
 * @apiSuccess {String} users.email User's email.
 * @apiSuccess {Date} users.created_at Timestamp when the user was created.
 * @apiSuccess {String} users.level_name User's level (Admin | User | Guest).
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "user_id": 1,
 *         "username": "DummyUser1",
 *         "email": "dummyuser1@example.com",
 *         "created_at": "2022-01-01T00:00:00.000Z",
 *         "level_name": "Admin"
 *       },
 *       {
 *         "user_id": 2,
 *         "username": "DummyUser2",
 *         "email": "dummyuser2@example.com",
 *         "created_at": "2022-02-02T00:00:00.000Z",
 *         "level_name": "User"
 *       }
 *     ]
 */

/**
 * @api {post} /users Create User
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiParam (Request body) {String} username Username of the User.
 * @apiParam (Request body) {String} password Password of the User.
 * @apiParam (Request body) {String} email Email of the User.
 *
 * @apiSuccess {String} message Success message.
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
 *       "message": "user created",
 *       "user": {
 *         "user_id": 1,
 *         "username": "DummyUser",
 *         "email": "dummyuser@example.com",
 *         "created_at": "2022-01-01T00:00:00.000Z",
 *         "level_name": "User"
 *       }
 *     }
 */

/**
 * @api {put} /users Update User
 * @apiName UpdateUser
 * @apiGroup User
 * @apiPermission Bearer Token
 *
 * @apiHeader {String} Authorization Users unique access-token (Bearer Token).
 *
 * @apiParam (Request body) {Object} user User's information.
 * @apiParam (Request body) {String} [user.username] Username of the User.
 * @apiParam (Request body) {String} [user.password] Password of the User.
 * @apiParam (Request body) {String} [user.email] Email of the User.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *         "username": "UpdatedUser",
 *         "password": "updatedPassword",
 *         "email": "updateduser@example.com"
 *     }
 *
 * @apiSuccess {String} message Success message.
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
 *       "message": "user updated",
 *       "user": {
 *         "user_id": 5,
 *         "username": "testuser",
 *         "email": "ile@mail.fi",
 *         "created_at": "2024-01-01T19:24:37.000Z",
 *         "level_name": "User"
 *       }
 *     }
 */
/**
 * @api {delete} /users Delete User
 * @apiName DeleteUser
 * @apiGroup User
 * @apiPermission Bearer Token
 *
 * @apiHeader {String} Authorization Users unique access-token (Bearer Token).
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Object} user User's information.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "user deleted",
 *       "user": {
 *         "id": 1
 *       }
 *     }
 */
/**
 * @api {get} /users/token Check Token / Get User Information
 * @apiName CheckToken
 * @apiGroup User
 * @apiPermission Bearer Token
 *
 * @apiHeader {String} Authorization Users unique access-token (Bearer Token).
 *
 * @apiSuccess {String} message Success message.
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
 *       "message": "Token is valid",
 *       "user": {
 *         "user_id": 1,
 *         "username": "DummyUser",
 *         "email": "dummyuser@example.com",
 *         "created_at": "2022-01-01T00:00:00.000Z",
 *         "level_name": "User"
 *       }
 *     }
 */

/**
 * @api {get} /users/:id Get User Information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id User's unique ID.
 *
 * @apiSuccess {Object} user User's information.
 * @apiSuccess {Number} user.user_id User's unique ID.
 * @apiSuccess {String} user.username User's username.
 * @apiSuccess {String} user.email User's email.
 * @apiSuccess {Date} user.created_at Timestamp when the user was created.
 * @apiSuccess {String} user.level_name User's level (Admin | User | Guest).
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *       {
 *         "user_id": 1,
 *         "username": "DummyUser1",
 *         "email": "dummyuser1@example.com",
 *         "created_at": "2022-01-01T00:00:00.000Z",
 *         "level_name": "Admin"
 *       }
 */
/**
 * @api {put} /users/:id Update User As Admin
 * @apiName UpdateUserAsAdmin
 * @apiGroup User
 * @apiPermission admin
 *
 * @apiHeader {String} Authorization Users unique access-token (Bearer Token).
 *
 * @apiParam {Number} id User's unique ID.
 *
 * @apiParam (Request body) {Object} user User's information.
 * @apiParam (Request body) {String} [user.username] Username of the User.
 * @apiParam (Request body) {String} [user.password] Password of the User.
 * @apiParam (Request body) {String} [user.email] Email of the User.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *         "username": "UpdatedUser",
 *         "password": "updatedPassword",
 *         "email": "updateduser@example.com"
 *     }
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Object} user User's information.
 * @apiSuccess {Number} user.user_id User's unique ID.
 * @apiSuccess {String} user.username User's username.
 * @apiSuccess {String} user.email User's email.
 * @apiSuccess {Date} user.created_at Timestamp when the user was created.
 * @apiSuccess {String} user.level_name User's level.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "user updated",
 *       "user": {
 *         "user_id": 5,
 *         "username": "testuser",
 *         "email": "ile@mail.fi",
 *         "created_at": "2024-01-01T19:24:37.000Z",
 *         "level_name": "User"
 *       }
 *     }
 */

/**
 * @api {delete} /users/:id Delete User as Admin
 * @apiName DeleteUserAsAdmin
 * @apiGroup User
 * @apiPermission admin
 *
 * @apiHeader {String} Authorization Users unique access-token (Bearer Token).
 * @apiParam {Number} id User's unique ID.
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Object} user User's information.
 * @apiSuccess {Number} user.id User's unique ID.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "user deleted",
 *       "user": {
 *         "id": 1
 *       }
 *     }
 */
/**
 * @api {get} /users/email/:email Check Email
 * @apiName CheckEmail
 * @apiGroup User
 *
 * @apiParam {String} email User's email.
 *
 * @apiSuccess {Boolean} exists True if email exists, false if not.
 *
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *   {
 *    "available": "true"
 *  }
 *
 */
/**
 * @api {get} /users/usename/:username Check Username
 * @apiName CheckUsername
 * @apiGroup User
 *
 * @apiParam {String} username User's username.
 *
 * @apiSuccess {Boolean} exists True if username exists, false if not.
 *
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *   {
 *    "available": "true"
 *  }
 *
 */
