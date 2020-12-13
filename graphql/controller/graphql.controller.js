const { buildSchema } = require('graphql');

exports.graphQlSchema = buildSchema(`
  type Query {
      message: String
  }
`);

exports.root = {
  message: () => 'Hello World!'
};