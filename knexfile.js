var dotenv = require('dotenv')
dotenv.config()

module.exports = {
    development: {
      client: 'mysql',
      connection: {
        database: 'infraengenharia',
        user:     'root',
        password: 'password'
      },
      pool: {
        min: 2,
        max: 10
      },
      migrations: {
        tableName: 'knex_migrations'
      }
      },
    
      staging: {
        client: 'mysql',
        connection: {
          database: 'my_db',
          user:     'username',
          password: 'password'
        },
        pool: {
          min: 2,
          max: 10
        },
        migrations: {
          tableName: 'knex_migrations'
        }
      },
    
      production: {
        client: 'pg',
        connection: {
          database: process.env.BD_INFRA_DATABASE,
          user:     process.env.BD_INFRA_USERNAME,
          password: process.env.BD_INFRA_PASSWORD,
          host: process.env.BD_INFRA_HOSTNAME,
          port: process.env.BD_INFRA_PORT,
          ssl: true
        },
        pool: {
          min: 2,
          max: 10
        },
        migrations: {
          tableName: 'knex_migrations'
        }
      }
}