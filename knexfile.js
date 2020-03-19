// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/word_scramble',
    migrations: {
      directory: './server/db/migrations',
    },
    seeds: {
      directory: './server/db/seeds/dev',
    },
    useNullAsDefault: true,
  },

  test: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://localhost/word_scramble_test',
    migrations: {
      directory: './server/db/migrations',
    },
    seeds: {
      directory: './server/db/test/seeds',
    },
  },

  production: {
    client: 'pg',
    connection: `${process.env.DATABASE_URL}?ssl=true`,
    migrations: {
      directory: './server/db/migrations',
    },
    seeds: {
      directory: './server/db/seeds/prod',
    },
  },
}
