const mongoose = require('mongoose');
const User = require('./usertable')

const Expenses = new mongoose.Schema({
    price:{
    type:Number,
    required:true

 },
    category:{
     type:String,
     required:true            
             
 },
 description:{
    type:String,
    required:true

 },
 userId:{
   type:mongoose.Schema.Types.ObjectId,
   ref:'User'
 }

});

const Expense = mongoose.model("Expense",Expenses);
module.exports = Expense;































// const Sequelize = require('sequelize');
// const sequelize = require('./database');

// const Expense = sequelize.define('Expense',{
//    id:{
//              type:Sequelize.DataTypes.INTEGER,
//              autoIncrement:true,
             
//              primaryKey:true
//          },
//          price:{
//              type:Sequelize.DataTypes.INTEGER,
             
       
           
//          },
//          category:{
//              type:Sequelize.DataTypes.STRING,
             
     
     
//          },
//          description:{
//              type:Sequelize.DataTypes.STRING,
   
//          }
//      });
//  module.exports =Expense;