# Trufla 2021 backend Task

## Before running the project you may need to:

please import the dummy data from the `/db_backup` folder:

the `trufla_blog_create_tables.sql` file has all the tables create sql statments, also the rest of the files insert statments to import some data

These data can be used for testing, it is not fully accurate and some articles may have some empty author_ids that doesn't exist but still it works fine.

you can also change in the environment variables `.env` file the `USE_HEROKU_CONFIG` key from 1 to 0 to use the local mysql database if you want to connect to the production heroku database then set the value at 1

### To run this project you can run:

1. the following comands

run `npm install`

run `npm run start` or `nodemon start` (if you have nodemon installed in your development enviornment)

2. the app is deployed on heroku server at link: `https://trufla2021backend.herokuapp.com`

so for example you can use it as follows on your favoriate browser for testing `https://trufla2021backend.herokuapp.com/article/all`

3. using Docker by running this commands:

   `docker-compose build`

   then

   `docker-compose up`

   then test by heading over to:

   `http://localhost:3000/signup`

   or

   `http://localhost:3000/login`

### To run the unit and e2e test cases

`npm run test`

### To have a look at the API documentation

1. please run the application first by running `npm run start`
2. then head over to `http://localhost:3000/api-docs/`


For any questions or issues when running the task please contact me at ahmedashrafsafwat@gmail.com

Looking forward to hear from you