const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");
require("dotenv").config();

const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");
const isAuth = require("./middleware/is-auth");

const app = express();

app.use(bodyParser.json());

app.use(isAuth);

app.use(
  "/graphql",
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
  })
);

mongoose
  .connect(
    // 'mongodb+srv://talent:Talent@123@cluster0.bpd0l.mongodb.net/talent?retryWrites=true&w=majority'
    `mongodb+srv://talent:${process.env.MONGO_PASSWORD}@cluster0.bpd0l.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    // "mongodb://127.0.0.1:27017/talent",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });
