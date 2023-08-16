const mongoose = require('mongoose');
// const { STRING } = require('sequelize');

const userDetails = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
     type:String,
     require:true   
    },
    ispremium:{
        type:Boolean
    },
    totalExpenses:{
        type:Number,

    }




});

const User = mongoose.model("User",userDetails);
module.exports = User;































// const Sequelize = require('sequelize');
// const sequelize = require('./database');

// const User = sequelize.define('User',{
//    id:{
//              type:Sequelize.DataTypes.INTEGER,
//              autoIncrement:true,
             
//              primaryKey:true
//          },
//          name:{
//              type:Sequelize.DataTypes.STRING,
       
           
//          },
//          email:{
//              type:Sequelize.DataTypes.STRING,
//              unique:true
     
     
//          },
//          password:{
//             //  type:Sequelize.DataTypes.STRING,
   
//          },
//          ispremium:Sequelize.BOOLEAN,
//          totalExpenses:{
//             type:Sequelize.DataTypes.INTEGER,
//             defaultValue:0,
//          }
         
//      });
//  module.exports =User;