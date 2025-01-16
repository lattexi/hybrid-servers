/**
 * @api {get} /tag Get All Tags
 * @apiName GetAllTags
 * @apiGroup Tag
 *
 * @apiSuccess {Object[]} tags Array of tag objects
 * @apiSuccess {Number} tags.tag_id Tag's unique ID
 * @apiSuccess {String} tags.tag_name Name of the tag
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "tag_id": 1,
 *         "tag_name": "nature"
 *       }
 *     ]
 *
 * @apiError TagsNotFound No tags found
 */

/**
 * @api {post} /tag Create Tag
 * @apiName PostTag
 * @apiGroup Tag
 *
 * @apiHeader {String} Authorization Bearer token for authentication
 *
 * @apiParam {String} tag_name Name of the tag (2-50 characters)
 * @apiParam {Number} media_id ID of the media to tag (min: 1)
 *
 * @apiSuccess {String} message Success message
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Tag added"
 *     }
 *
 * @apiError ValidationError Invalid tag name or media_id
 * @apiError Unauthorized Authentication required
 */

/**
 * @api {get} /tag/bymedia/:id Get Tags by Media ID
 * @apiName GetTagsByMediaId
 * @apiGroup Tag
 *
 * @apiParam {Number} id Media's ID (min: 1)
 *
 * @apiSuccess {Object[]} tags Array of tags for the media
 * @apiSuccess {Number} tags.tag_id Tag's ID
 * @apiSuccess {String} tags.tag_name Tag's name
 * @apiSuccess {Number} tags.media_id Media's ID
 *
 * @apiError TagsNotFound No tags found for this media
 */

/**
 * @api {delete} /tag/bymedia/:media_id/:tag_id Delete Tag from Media
 * @apiName DeleteTagFromMedia
 * @apiGroup Tag
 *
 * @apiHeader {String} Authorization Bearer token for authentication
 *
 * @apiParam {Number} media_id Media's ID (min: 1)
 * @apiParam {Number} tag_id Tag's ID (min: 1)
 *
 * @apiSuccess {String} message Success message
 *
 * @apiError Unauthorized Not authorized to remove this tag
 * @apiError NotFound Media or tag not found
 */

/**
 * @api {get} /tag/bytag/:tag_id Get Media by Tag
 * @apiName GetMediaByTag
 * @apiGroup Tag
 *
 * @apiParam {Number} tag_id Tag's ID (min: 1)
 *
 * @apiSuccess {Object[]} media Array of media items with this tag
 *
 * @apiError MediaNotFound No media found with this tag
 */

/**
 * @api {delete} /tag/:id Delete Tag
 * @apiName DeleteTag
 * @apiGroup Tag
 *
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiHeader {String} level_name Must be "Admin" to delete tags
 *
 * @apiParam {Number} id Tag's ID (min: 1)
 *
 * @apiSuccess {String} message Success message
 *
 * @apiError Unauthorized Not authorized to delete tags
 * @apiError TagNotFound Tag not found
 */
