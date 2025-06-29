const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const sequelizeInstance = new Sequelize(process.env.DATABASE_URI, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});

// const sequelizeInstance = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASS,
//   {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT || 5432,
//     dialect: "postgres",
//     logging: false,
//     dialectOptions: {},
//   }
// );

module.exports = { sequelizeInstance };
