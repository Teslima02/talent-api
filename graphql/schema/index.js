const { buildSchema } = require("graphql");

module.exports = buildSchema(`
  type User {
    _id: ID!
    email: String!
    password: String
    photo: String
    name: String
    bio: String
    phone: String
    lastSignInDate: String
  }

  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
    lastSignInDate: String!
  }

  input UserInput {
    email: String!
    password: String!
  }

  input UpdateUserInput {
    email: String
    password: String
    photo: String
    name: String
    bio: String
    phone: String
  }


  type RootQuery {
    login(email: String!, password: String!): AuthData!
    getUser(userId: String!): User!
    me: User!
  }

  type RootMutation {
    createUser(userInput: UserInput): User
    updateUser(updateUserInput: UpdateUserInput): User
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
