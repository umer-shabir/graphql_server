import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

// db
import db from './_db.js'

// types
import { typeDefs } from './schema.js'

const resolvers = {
  Query: {
    reviews: () => db.reviews,
    review: (root, args) => db.reviews.find(review => review.id === args.id),
    games: () => db.games,
    game: (root, args) => db.games.find(game => game.id === args.id),
    authors: () => db.authors,
    author: (root, args) => db.authors.find(author => author.id === args.id)
  },
  Game: {
    reviews: (root) => {
      return db.reviews.filter(review => review.game_id === root.id)
    }
  },
  Author: {
    reviews: (root) => {
      return db.reviews.filter(review => review.author_id === root.id)
    }
  },
  Review: {
    author: (root) => {
      return db.authors.find(author => author.id === root.author_id)
    },
    game: (root) => {
      return db.games.find(game => game.id === root.game_id)
    }
  },
  Mutation: {
    addGame: (root, args) => {
      let game = {...args.game, id: Math.floor(Math.random() * 10000).toString()}
      db.games.push(game)
      return game
    },
    updateGame: (root, args) => {
      db.games = db.games.map((game) => {
        if (game.id === args.id) {
          return {...game, ...args.edits}
        }

        return game
      })

      return db.games.find(game => game.id === args.id)
    },
    deleteGame: (root, args) => {
      db.games = db.games.filter(game => game.id !== args.id)
      return db.games
    }
  }
}

// server setup
const server = new ApolloServer({
  typeDefs,
  resolvers
})

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 }
})

console.log(`🚀 Server ready at: ${url}`)