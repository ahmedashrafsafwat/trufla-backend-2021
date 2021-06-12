# SWEBSON backend Task

## Before running the project!!

please import the data from the `mongodb_exports/dumb/swenson` folder by running the following command

`mongorestore -d swenson --verbose mongodb_exports\dumb\swenson\`

### To run this project you have two ways

1. using Docker by running this commands:

   `docker-compose build`

   then

   `docker-compose up`

   then test by heading over to:

   `http://localhost:3000/signup`

   or

   `http://localhost:3000/login`

2. Run the following comands

run `npm install`

run `npm run start` or `nodemon start`

### To run the test file run

`npm run test`

### To have a look at the API documentation

1. please run the application first by running `npm run start`
2. then head over to `http://localhost:3000/api-docs/`

### Some query URL examples to test:

`http://localhost:3000/coffee/get/?product_type=COFFEE_MACHINE_LARGE`
`http://localhost:3000/coffee/get/?product_type=COFFEE_POD_LARGE&coffee_flavor=COFFEE_FLAVOR_VANILLA`
`http://localhost:3000/coffee/all/?product_type=POD&pack_size=84`