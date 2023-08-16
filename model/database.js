// getting-started.js
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1/test');
   console.log("connected")
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}































// const Sequelize = require("sequelize");

// require('dotenv').config()

// const sequelize = new Sequelize(process.env.DB_NAME,process.env.DB_USERNAME,process.env.DB_PASSWORD,{
   
//     host:process.env.DB_HOST,
//     dialect:'mysql'
// });

// // try {
// //  sequelize.authenticate();
// //     console.log('Connection has been established successfully.');
// //   } catch (error) {
// //     console.error('Unable to connect to the database:', error);
// //   };
// module.exports = sequelize;


