const express = require("express");
var cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const expressValidator = require("express-validator");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const MongoStore = require("connect-mongo")(session);
const path = require("path");
const os = require("os");
var swaggerJsdoc = require("swagger-jsdoc");
var swaggerUi = require("swagger-ui-express");
var swaggerJSON = require("./swagger.json");


// Get the OS
const osType = os.type();

// Load environment variables from .env file
dotenv.config({ path: ".env" });

// Load the router files
const articleRouter = require("./routes/article");
const commentRouter = require("./routes/comment");
const userRouter = require("./routes/user");

// Create express server
const app = express();


// Express Configurations
app.set("host", process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0");
app.set("port", process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

// swagger jsdoc
const specs = swaggerJsdoc(swaggerJSON);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

app.use(cors());

// Application Routes
app.use("/article", articleRouter);
app.use("/user", userRouter);
app.use("/comment", commentRouter);

// Error Handler
if (process.env.NODE_ENV === "development") {
  // only use in development
  app.use(errorHandler());
} else {
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("Server Error");
  });
}
//
app.listen(app.get("port"), () => {
  console.log(
    "App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env")
  );
  console.log("  Press CTRL-C to stop\n");
});

module.exports = app;
