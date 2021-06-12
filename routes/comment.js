const routes = require("express").Router();
const bridge = require('../services/bridge')
const uuid = require('uuid')


 /**
 * @swagger
 * article/addcomment:
 *   post:
 *     summary: add new comment on article
 *     description: Adding new comment on an article 
 *     parameters:
 *      - in: body
 *        name: user_id
 *        type: string
 *        required: true
 *        description: the id of the user who added the comment it must be less than 50 chars
 *      - in: body
 *        name: article_id
 *        type: string
 *        required: true
 *        description: the id of the article
 *      - in: body
 *        name: body
 *        type: string
 *        required: true
 *        description: the body of the comment
 *     responses:
 *       401:
 *         description: An error occurs when the sent paramters are not complete
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: array
 *                  description: list of missing paramters that is required to be sent to the api
 *                  items:
 *                     type: object
 *                     properties:
 *                       location:
 *                         type: string
 *                         description: the missing paramter location.
 *                         example: params
 *                       param:
 *                         type: string
 *                         description: The missing paramter key value.
 *                         example: body
 *                       msg:
 *                         type: string
 *                         description: The error message.
 *                         example: body can't be not empty
 *       200:
 *         description: success message or error message depending whether the comment is added or not.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                message:
 *                  type: string
 *                  description: The message of the api.
 *                  example: Added successfully
 *                id:
 *                  type: string
 *                  description: The id of the inserted object.
 *                  example: 836be72d-fcd4-467b-a5c4-e5a4e96dd94c
*/
routes.post("/add", async (req, res) => {

  // check for errors
  req.assert("user_id", "can't be empty").notEmpty();
  req.assert("article_id", "can't be empty").notEmpty();
  req.assert("body", "can't be empty").notEmpty();
req.assert("body","title can't exceed 200 characters").isLength({max:200});


  const errors = req.validationErrors();

  // return validation errors
  if (errors) {
    return res.status(401).json({ message: errors });
  }

  const comment_id = uuid.v4()

  // save image uri if sent
  const sql = ` insert into comments(comment_id,article_id,user_id,body) values(?,?,?,?) `;
  const params = [comment_id,req.body.article_id,req.body.user_id,req.body.body];

  res.json(await bridge.insert(sql,params));

});


/**
* @swagger
* comment/all/{id}:
*   get:
*     summary: get comments by sending the article id
*     description: get all the article comments by sending the article id sent as query paramter.
*     parameters:
*      - in: path
*        name: id
*        type: string
*        required: true
*        description: the id of the article sent as a query paramter
*     responses:
*       401:
*         description: An error occurs when the sent paramters are not complete
*         content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                message:
*                  type: array
*                  description: list of missing paramters that is required to be sent to the api
*                  items:
*                     type: object
*                     properties:
*                       location:
*                         type: string
*                         description: the missing paramter location.
*                         example: params
*                       param:
*                         type: string
*                         description: The missing paramter key value.
*                         example: title
*                       msg:
*                         type: string
*                         description: The error message.
*                         example: title can't be not empty
*       404:
*         description: An error occurs of not found when no comment is found on a certain article
*         content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                data:
*                  type: array
*                  description: empty array
*                  example: []
*       200:
*         description: has list of found comments on an article 
*         content:
*          application/json:
*           schema:
*            type: object
*            properties:
*             data:
*               type: array
*               description: the found comments 
*               items:
*                     type: object
*                     properties:
*                       comment_id:
*                         type: string
*                         description: The comment ID.
*                         example: 77feb183-88ec-4990-8ee7-e2f3ebee5034
*                       article_id:
*                         type: string
*                         description: The article's id.
*                         example: ef220005-1330-4d4c-9f5d-6c2d087844f1
*                       body:
*                         type: string
*                         description: The comment's body.
*                         example: this an comment body
*                       user_id:
*                         type: string
*                         description: The user's name.
*                         example: Mike
*/
routes.get("/all/:id", async (req, res) => {

  // check for errors
  req.assert("id", "can't be empty").notEmpty();


  const errors = req.validationErrors();

  // return validation errors
  if (errors) {
    return res.status(401).json({ message: errors });
  }


  // save image uri if sent
  const sql = ` select * from comments where article_id = '${req.params.id}'`;

   // return the results
   let comments = await bridge.getMultiple(sql,1);
   comments.length > 0? res.json(comments):res.status(404).json(comments);
});


module.exports = routes;
