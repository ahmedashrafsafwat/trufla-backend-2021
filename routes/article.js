const routes = require("express").Router();
const mysql = require('mysql2/promise');
const config = require('../config/dbconfig');
const bridge = require('../services/bridge')
const uuid = require('uuid')

/**
 * @swagger
 * article/all:
 *   get:
 *     summary: Get all articles
 *     description: Retrieve a list of articles with the number of likes on each article, as well as the author details, sorted by the number of likes.
 *     responses:
 *       404:
 *         description: An error occurs of not found when no article is found
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
 *                       article_id:
 *                         type: string
 *                         description: The article ID.
 *                         example: ef220005-1330-4d4c-9f5d-6c2d087844f1
 *                       title:
 *                         type: string
 *                         description: The article's title.
 *                         example: nodejs tutorial
 *                       body:
 *                         type: string
 *                         description: The article's body.
 *                         example: this an article body
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
 *                       likes:
 *                         type: integer
 *                         description: The number of likes on this article.
 *                         example: 10
*/
routes.get("/all", async (req, res) => {
  /**
   *   Get Articles, each article author , and the count of likes on each article
   */
    var sql = ` select A.article_id,A.title,A.body,A.author_id,Auth.name,Auth.job_title,COUNT(L.article_id) as likes
                from articles as A
                inner join likes as L on L.article_id = A.article_id
                join authors as Auth on Auth.author_id = A.author_id
                group by A.article_id
                order by likes DESC
              `

    // return the results
    let articles = await bridge.getMultiple(sql,1);
    articles.length > 0? res.json(articles):res.status(404).json(articles);
});

/**
 * @swagger
 * article/add:
 *   post:
 *     summary: add new article
 *     description: Adding new article with validation on feilds sent in the body paramters returns added successfully or an insert error or missing sent data error.
 *     parameters:
 *      - in: body
 *        name: title
 *        type: string
 *        required: true
 *        description: the title of the article it must be less than 50 chars
 *      - in: body
 *        name: body
 *        type: string
 *        required: true
 *        description: the body of the article it must be less than 8000 char
 *      - in: body
 *        name: author_id
 *        type: string
 *        required: true
 *        description: the author id who wrote the article
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
 *         description: success message or error message depending whether the article is added or not.
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
  req.assert("title", "Title  must be not empty").notEmpty();
  req.assert("title","title can't exceed 50 characters").isLength({max:50});
  req.assert("body", "body can't be not empty").notEmpty();
  req.assert("title","title can't exceed 8000 characters").isLength({max:8000});
  req.assert("author_id", "can't be empty").notEmpty();

  const errors = req.validationErrors();

  // return validation errors
  if (errors) {
    return res.status(401).json({ message: errors });
  }

  const article_id = uuid.v4()

  // save image uri if sent
  const sql = ` insert into articles(article_id,title,body,author_id)
            values(?,?,?,?)
        `
    const params = [
        article_id,
        req.body.title,
        req.body.body,
        req.body.author_id
    ];
  res.json(await bridge.insert(sql,params));

});


/**
 * @swagger
 * article/search/{searchquery}:
 *   get:
 *     summary: search using title name
 *     description: Searches for articles with title name of the search text that was sent in the path paramter.
 *     parameters:
 *      - in: path
 *        name: searchquery
 *        type: string
 *        required: true
 *        description: the string search of the article it can be sub string of the title
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
 *         description: An error occurs of not found when no article is found
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
 *         description: has list of articles found which contains the string that was sent in the path url
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
 *                       article_id:
 *                         type: string
 *                         description: The article ID.
 *                         example: ef220005-1330-4d4c-9f5d-6c2d087844f1
 *                       title:
 *                         type: string
 *                         description: The article's title.
 *                         example: nodejs tutorial
 *                       body:
 *                         type: string
 *                         description: The article's body.
 *                         example: this an article body
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
 *                       likes:
 *                         type: integer
 *                         description: The number of likes on this article.
 *                         example: 10
*/
routes.get("/search/:searchquery", async (req, res) => {

    // check for errors
    req.assert("searchquery", "Title search text  must be not empty").notEmpty();
  
    const errors = req.validationErrors();
  
    // return validation errors
    if (errors) {
      return res.status(401).json({ message: errors });
    }
  
    const article_id = uuid.v4()
  
    // match the sent query
    const sql = `
                select A.article_id,A.title,A.body,A.author_id,Auth.name,Auth.job_title,COUNT(L.article_id) as likes,MATCH (title,body) AGAINST ('${req.params.searchquery}') as score 
                from articles as A
                inner join likes as L on L.article_id = A.article_id
                join authors as Auth on Auth.author_id = A.author_id
                where  MATCH(A.title,A.body) AGAINST ('${req.params.searchquery}')
                group by A.article_id
                order by score DESC,likes DESC;
              `
              // for full test search
    // return the results
    let articles = await bridge.getMultiple(sql,1);
    articles.length > 0? res.json(articles):res.status(404).json(articles);
  
  });

/**
 * @swagger
 * article/search/{id}:
 *   get:
 *     summary: get article by id
 *     description: get article by id sent as query paramter.
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
 *         description: An error occurs of not found when no article is found
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
 *               description: the found article 
 *               items:
 *                     type: object
 *                     properties:
 *                       article_id:
 *                         type: string
 *                         description: The article ID.
 *                         example: ef220005-1330-4d4c-9f5d-6c2d087844f1
 *                       title:
 *                         type: string
 *                         description: The article's title.
 *                         example: nodejs tutorial
 *                       body:
 *                         type: string
 *                         description: The article's body.
 *                         example: this an article body
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
 *                       likes:
 *                         type: integer
 *                         description: The number of likes on this article.
 *                         example: 10
*/
  routes.get("/getbyid/:id", async (req, res) => {

    // check for errors
    req.assert("id", "Title  must be not empty").notEmpty();
  
    const errors = req.validationErrors();
  
    // return validation errors
    if (errors) {
      return res.status(401).json({ message: errors });
    }
  
  
    // save image uri if sent
    const sql =  `
                  select A.article_id,A.title,A.body,A.author_id,Auth.name,Auth.job_title,COUNT(L.article_id) as likes
                  from articles as A
                  inner join likes as L on L.article_id = A.article_id
                  join authors as Auth on Auth.author_id = A.author_id
                  where A.article_id='${req.params.id}'
                  group by A.article_id
                `
    // return the results
    let articles = await bridge.getMultiple(sql,1);
    articles.length > 0? res.json(articles):res.status(404).json(articles);
  
  });
  
/**
 * @swagger
 * article/like:
 *   post:
 *     summary: add like to an article
 *     description: a user can add a like to an article
 *     parameters:
 *      - in: body
 *        name: aticle_id
 *        type: string
 *        required: true
 *        description: the id of the article 
 *      - in: body
 *        name: user_id
 *        type: string
 *        required: true
 *        description: the id of the user that wants to like the article 
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
 *         description: An error occurs if either the user or the article not found
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: the return message of the api
 *                  example: an error occured either user or article not found!
 *       200:
 *         description: has list of found article which with id sent in the path url 
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *               message:
 *                 type: string
 *                 description: The message of the api.
 *                 example: Added successfully
 *               id:
 *                 type: string
 *                 description: The id of the inserted object.
 *                 example: 836be72d-fcd4-467b-a5c4-e5a4e96dd94c
*/
  routes.post("/like",  (req, res) => {

    // check for errors
    req.assert("user_id", "can't be empty").notEmpty();
    req.assert("article_id", "can't be empty").notEmpty();
  
    const errors = req.validationErrors();
  
    // return validation errors
    if (errors) {
      return res.status(401).json({ message: errors });
    }
  
  const sqlArticle  = ` select * from articles where article_id = '${req.body.article_id}'`
  const sqlAuthor  = ` select * from authors where author_id = '${req.body.user_id}'`

  // check if both user and article do exist
   Promise.all([
      bridge.getMultiple(sqlArticle,1),
      bridge.getMultiple(sqlAuthor,1)
    ]).then(async (articleData)=>{
  
      let articles =  articleData[0].data, users = articleData[1].data;

      if(!articles.length || !users.length) {
        return res.status(404).json({message:"an error occured either user or article not found!"});
      }

      // save image uri if sent
      const sql = ` insert into likes(article_id,user_id) values(?,?) `
      const params = [req.body.article_id,req.body.user_id]
      res.json(await bridge.insert(sql,params));
  })
  
  });

 
module.exports = routes;
