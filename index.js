const express = require("express");
const app = express();
const server = require("http").Server(app);
const bodyParser = require('body-parser');
const serverless = require('serverless-http');
const io = require("socket.io")(server);
const UsersRouter = require('./users/routes.config');
const AuthorizationRouter = require('./authorization/routes.config');
const AnswerRouter = require('./answer/routes.config');
const QuestionRouter = require('./question/routes.config');
const EmailRouter = require('./emails/routes.config');
const { graphqlHTTP } = require('express-graphql');
const graphQlController = require('./graphql/controller/graphql.controller')
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
    // rootValue: graphQlController.root,
    graphiql: true,
}))

AuthorizationRouter.routesConfig(app);
UsersRouter.routesConfig(app);
AnswerRouter.routesConfig(app)
QuestionRouter.routesConfig(app)
EmailRouter.routesConfig(app);

io.on("connection", socket => {
    const { id } = socket.client;
    // console.log(`User connected: ${id}`);
    socket.on("isPlaying", ({prompterId, isPlaying}) => {
        // console.log(`${id}: prompterId ${prompterId} isPlaying: ${isPlaying}`);
        io.emit("isPlaying", { prompterId, isPlaying });
    });

    socket.on("incSpeed", prompterId => {
        // console.debug("incSpeed", prompterId)
        io.emit("incSpeed", prompterId);
    });

    socket.on("decSpeed", prompterId => {
        // console.debug("decSpeed", prompterId)
        io.emit("decSpeed", prompterId);
    });

    socket.on("jumpUp", prompterId => {
        // console.debug("jumpUp", prompterId)
        io.emit("jumpUp", prompterId);
    });

    socket.on("jumpDown", prompterId => {
        // console.debug("jumpDown", prompterId)
        io.emit("jumpDown", prompterId);
    });

    socket.on("updatePrompter", updatedPrompter => {
        // console.debug("updatedPrompter", updatedPrompter)
        io.emit("updatePrompter", updatedPrompter);
    });
});

io.sockets.on('connection', function(socket) {
    socket.on('room', function(room) {
      socket.join(room);
      // console.debug('room', room)
    });
  });

app.get('/', function (req, res) {
    res.send({
        isSuccess: true,
        mongoUrl: process.env.MONGOURL,
    })
})

server.listen(PORT, () => console.log(`Listen on *: ${PORT}`));

// module.exports.handler = serverless(app);