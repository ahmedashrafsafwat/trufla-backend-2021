var assert = require("assert");
const { expect } = require("chai");
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");

let should = chai.should();
chai.use(chaiHttp);
var chaiSubset = require('chai-subset');
chai.use(chaiSubset);
/**
 * Product Tests
 */
describe("Unit tests", function() {
  describe("Testing all the APIs concerned with articles", function() {
    it("Should be able to add article ", done => {
      // Get All espressso machines
      chai
        .request(server)
        .post("/article/add")
        .send({
          'title': 'this is a title',
          'body': 'This is a body',
          'author_id': '2b03b407-52a2-4ca9-8bea-18f5c17b35d5'
        })
        .set("Content-Type", "application/json")
        .end((err, res) => {


          // Check for returned result
          expect(res.body).to.have.all.keys('message','id');
          // console.log (result);
          done();
        });
    });
    it("Should be able to get an article by id", done => {
      // Get All Prodcuts
      chai
        .request(server)
        .get("/article/getbyid/ef220005-1330-4d4c-9f5d-6c2d087844f1")
        .set("Content-Type", "application/json")
        .end((err, res) => {
          var checkObj ={
            "data": [
                {
                    "article_id": "ef220005-1330-4d4c-9f5d-6c2d087844f1",
                    "title": "asd",
                    "body": "asdasd",
                    "author_id": "6595c637-37ed-42dc-8f79-4c1e594e0134"
                }
            ]
        };

          // Check for returned result
          expect(res.body.data[0]).to.have.all.keys('article_id','title','body','author_id','likes','name','job_title');
          expect(res.body.data[0]).to.have.property('article_id', 'ef220005-1330-4d4c-9f5d-6c2d087844f1');

          // console.log (result);
          done();
        });
    });
    it("Should be able to return all articles", done => {
      // Get All espressso machines
      chai
        .request(server)
        .get("/article/all")
        .set("Content-Type", "application/json")
        .end((err, res) => {
          var checkObj = {
            "data": [
                {
                    "article_id": "123",
                    "title": "123",
                    "body": "123",
                    "author_id": "123"
                },
                {
                    "article_id": "ef220005-1330-4d4c-9f5d-6c2d087844f1",
                    "title": "asd",
                    "body": "asdasd",
                    "author_id": "asdsad"
                }
            ]
        };

          // Check for returned result
          expect(res.body.data[0]).to.have.all.keys('article_id','title','body','author_id','likes','name','job_title')
          // console.log (result);
          done();
        });
    });
    it("Should be able to able to search for specific article", done => {
      // Get All espressso machines
      chai
        .request(server)
        .get("/article/search/this is body title")
        .set("Content-Type", "application/json")
        .end((err, res) => {
          var checkObj = {
            "data": [
                {
                    "article_id": "ef220005-1330-4d4c-9f5d-6c2d087844f1",
                    "title": "asd",
                    "body": "asdasd",
                    "author_id": "asdsad"
                }
            ]
        };

          // Check for returned result
          expect(res.body.data[0]).to.have.all.keys('article_id','title','body','author_id','likes','name','job_title','score')
          // expect(res.body.data[0]).to.have.property('article_id', 'ef220005-1330-4d4c-9f5d-6c2d087844f1');

          // console.log (result);
          done();
        });
    });
    it("Should be able to add comments to a given article", done => {
      // Get All espressso machines
      chai
        .request(server)
        .post("/comment/add")
        .send({
          'article_id': 'ef220005-1330-4d4c-9f5d-6c2d087844f1',
          'body': 'This is a body',
          'user_id': '2b03b407-52a2-4ca9-8bea-18f5c17b35d5'
        })
        .set("Content-Type", "application/json")
        .end((err, res) => {


          // Check for returned result
          expect(res.body).to.have.all.keys('message','id');
          // console.log (result);
          done();
        });
    });
    it("Should be able to thumbs up to a given article.", done => {
      // Get All espressso machines
      chai
        .request(server)
        .post("/article/like")
        .send({
          'article_id': 'ef220005-1330-4d4c-9f5d-6c2d087844f1',
          'user_id': '2b03b407-52a2-4ca9-8bea-18f5c17b35d5'
        })
        .set("Content-Type", "application/json")
        .end((err, res) => {

          // Check for returned result
          expect(res.body).to.have.all.keys('message','id');

          done();
        });
    });

  });

  describe("Testing all the APIs concerned with authors", function() {
    it("Should be able to create a new author ( name and job title ).", done => {
      chai
        .request(server)
        .post("/user/add")
        .send({
          "name":"ahmed",
          "job_title":"developer"
      })
        .set("Content-Type", "application/json")
        .end((err, res) => {


          // Check for returned result
          // Check for returned result
          expect(res.body).to.have.all.keys('message','id');

          done();
        });
    });

    it("Should be able to Read/retrieve given Author info by ID.", done => {
      // Get All Prodcuts
      chai
        .request(server)
        .get("/user/getbyid/2b03b407-52a2-4ca9-8bea-18f5c17b35d5")
        .set("Content-Type", "application/json")
        .end((err, res) => {
          var checkObj ={
            "data": [
                {
                    "author_id": "2b03b407-52a2-4ca9-8bea-18f5c17b35d5",
                    "name": "ahmed",
                    "job_title": "developer"
                }
            ]
        }

          // Check for returned result
          expect(res.body.data[0]).to.have.all.keys('author_id','name','job_title');

          done();
        });
    });

    it("Should be able to List all authors. ", done => {
      // Get All Prodcuts
      chai
        .request(server)
        .get("/user/all")
        .set("Content-Type", "application/json")
        .end((err, res) => {
          var checkObj ={
            "data": [
                {
                    "author_id": "2b03b407-52a2-4ca9-8bea-18f5c17b35d5",
                    "name": "ahmed",
                    "job_title": "developer"
                }
            ]
        }

          // Check for returned result
          expect(res.body.data[0]).to.have.all.keys('author_id','name','job_title');

          // console.log (result);
          done();
        });
    });
  })
});

describe("E2E test", function() {
  // author tests
  var user_id = ""
  var article_id = ""
  describe("Testing creating/retreving author", function() {
    it("Should be able to create a new author ( name and job title ).", done => {
      chai
        .request(server)
        .post("/user/add")
        .send({
          "name":"ahmed",
          "job_title":"developer"
      })
        .set("Content-Type", "application/json")
        .end((err, res) => {
          var checkObj ={
            "message": "Added successfully"
        }

          // Check for returned result
          expect(res.body).to.have.all.keys('message','id');
          
          user_id = res.body.id;

          // console.log (result);
          done();
        });
    });
    it("Should be able to add article ", done => {
      // Get All espressso machines
      chai
        .request(server)
        .post("/article/add")
        .send({
          'title': 'this is a title',
          'body': 'This is a body',
          'author_id': user_id
        })
        .set("Content-Type", "application/json")
        .end((err, res) => {


          // Check for returned result
          expect(res.body).to.have.all.keys('message','id');
          article_id = res.body.id
          // console.log (result);
          done();
        });
    });
    it("Should be able to thumbs up to a given article.", done => {
      // Get All espressso machines
      chai
        .request(server)
        .post("/article/like")
        .send({
          'article_id': article_id,
          'user_id': user_id
        })
        .set("Content-Type", "application/json")
        .end((err, res) => {

          // Check for returned result
          expect(res.body).to.have.all.keys('message','id');

          done();
        });
    });
    it("Should be able to add comments to a given article", done => {
      // Get All espressso machines
      chai
        .request(server)
        .post("/comment/add")
        .send({
          'article_id': article_id,
          'body': 'This is a body',
          'user_id': user_id
        })
        .set("Content-Type", "application/json")
        .end((err, res) => {


          // Check for returned result
          expect(res.body).to.have.all.keys('message','id');
          // console.log (result);
          done();
        });
    });
  })
})
