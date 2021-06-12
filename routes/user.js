const routes = require("express").Router();
const mysql = require('mysql2/promise');
const config = require('../config/dbconfig');
const bridge = require('../services/bridge')
const uuid = require('uuid')

/**
 * @swagger
 * user/all:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of users
 *     responses:
 *       404:
 *         description: An error occurs of not found when no user is found
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
 *         description: A list of all articles.
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             data:
 *               type: array
 *               description: list of articles ordered descendingly 
 *               items:
 *                     type: object
 *                     properties:
 *                       author_id:
 *                         type: string
 *                         description: The author's id.
 *                         example: 4bc9fe96-324f-436f-b64e-9808e3d499ef
 *                       name:
 *                         type: string
 *                         description: The author's name.
 *                         example: Mike
 *                       job_title:
 *                         type: string
 *                         description: The author's job title.
 *                         example: Developer

*/
routes.get("/all", async (req, res) => {
    var sql = ` select * from authors`

    // return the results
    let users = await bridge.getMultiple(sql,1);
    users.length > 0? res.json(users):res.status(404).json(users);
});

/**
 * @swagger
 * user/add:
 *   post:
 *     summary: add new user
 *     description: Adding new user with validation on feilds sent in the body paramters returns added successfully or an insert error or missing sent data error.
 *     parameters:
 *      - in: body
 *        name: name
 *        type: string
 *        required: true
 *        description: the name of the user it must be less than 50 chars
 *      - in: body
 *        name: job_tile
 *        type: string
 *        required: true
 *        description: the job title of the user it must be less than 50 char
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
 *       200:
 *         description: success message or error message depending whether the user is added or not.
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
  req.assert("name", "name  must be not empty").notEmpty();
  req.assert("name","name can't exceed 50 characters").isLength({max:50});
  req.assert("job_title", "job_title can't be not empty").notEmpty();
  req.assert("job_title","job_title can't exceed 50 characters").isLength({max:50});

  const errors = req.validationErrors();

  // return validation errors
  if (errors) {
    return res.status(401).json({ message: errors });
  }

  const author_id = uuid.v4()

  // save image uri if sent
  const sql = ` insert into authors(author_id,name,job_title)
            values(?,?,?)
        `
    const params = [
        author_id,
        req.body.name,
        req.body.job_title,
    ];
  res.json(await bridge.insert(sql,params));

});



/**
 * @swagger
 * user/getbyid/{id}:
 *   get:
 *     summary: get user by id
 *     description: get user by id sent as query paramter.
 *     parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        required: true
 *        description: the id of the user sent as a query paramter
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
 *         description: An error occurs of not found when no user is found
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
 *         description: has list of found article which with id sent in the path url 
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             data:
 *               type: array
 *               description: the found user 
 *               items:
 *                     type: object
 *                     properties:
 *                       author_id:
 *                         type: string
 *                         description: The author's id.
 *                         example: 4bc9fe96-324f-436f-b64e-9808e3d499ef
 *                       name:
 *                         type: string
 *                         description: The author's name.
 *                         example: Mike
 *                       job_title:
 *                         type: string
 *                         description: The author's job title.
 *                         example: Developer
*/
routes.get("/getbyid/:id", async (req, res) => {

    // check for errors
    req.assert("id", "author id  must be not empty").notEmpty();
  
    const errors = req.validationErrors();
  
    // return validation errors
    if (errors) {
      return res.status(401).json({ message: errors });
    }
  
    // save image uri if sent
    const sql = ` select * from  authors where author_id = '${req.params.id}' `


      // return the results
      let users = await bridge.getMultiple(sql,1);
      users.length > 0? res.json(users):res.status(404).json(users);
  });




module.exports = routes;
