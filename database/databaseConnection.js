const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const poolConfig = {
  max: 10,
  min: 2,
  acquire: 30000,
  idle: 10000,
};

let sequelizeInstance;
const isDevelopment = process.env.NODE_ENV !== "production";

if (isDevelopment) {
  sequelizeInstance = new Sequelize(process.env.DATABASE_URI, {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
    pool: poolConfig,
  });
} else {
  sequelizeInstance = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      dialect: "postgres",
      logging: false,
      dialectOptions: {},
      pool: poolConfig,
    }
  );
}

module.exports = { sequelizeInstance };
