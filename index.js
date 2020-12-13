const express = require("express");
const app = express();
const server = require("http").Server(app);
const bodyParser = require('body-parser');
const serverless = require('serverless-http');
const io = require("socket.io")(server);
const UsersRouter = require('./users/routes.config');
const AuthorizationRouter = require('./authorization/routes.config');
const EmailRouter = require('./emails/routes.config');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql/schemas/schemas')

require('dotenv').config()

const PORT = process.env.PORT || 5000;

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.send(200);
    } else {
        return next();
    }
});

app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}))

AuthorizationRouter.routesConfig(app);
UsersRouter.routesConfig(app);
EmailRouter.routesConfig(app);


app.get('/', function (req, res) {
    res.send({
        isSuccess: true,
        mongoUrl: process.env.MONGOURL,
    })
})

server.listen(PORT, () => console.log(`Listen on *: ${PORT}`));

// module.exports.handler = serverless(app);