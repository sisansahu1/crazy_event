const express = require("express");
const bodyparser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");
const processs = require("./nodemon.json");
const graphqlSchema= require('./graphql/schema/index');
const graphiqlResolver=require('./graphql/resolver/index');
const isAuth = require('./middleware/is-auth') ;
const app = express();

const PORT = process.env.PORT;
app.use(bodyparser.json());



app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
  if(req.method==='OPTIONS'){
    return res.sendStatus(200);
    }
    next();

});

app.use(isAuth)


app.use(
  "/graphql",
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphiqlResolver,
    graphiql: true,
  })
);

app.get('/',(req,res)=>{
  res.json({
    message:"All good broooo"
  });
});



mongoose
  .connect(
    `mongodb+srv://${processs.env.MONGO_USER}:${processs.env.MONGO_PASSWORD}@cluster0-fabtf.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => app.listen(PORT,console.log(`Server is running at  ${PORT}`)))
  .catch((err) => {
    console.log(err);
  });
