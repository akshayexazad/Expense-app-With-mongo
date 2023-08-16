const Expense = require('../model/expensetable');
const AWS = require('aws-sdk')

const User = require('../model/usertable');
const sequelize = require('../model/database');

const service =require('../service/userService')
const downloaddetail = require('../model/downloaddetail')

//Post controller

const postexpense = async(req,res,next)=>{

   try {

    if(!req.body.price){
        throw new Error('Price is Mandetory')
    }

    const {price,category,description} = req.body;
    
    if(price == undefined || price.length === 0 ){
      return res.status(400).json({success: false, message: 'Parameters missing'})
 }
    
    const data = await Expense.create({price,category,description,userId:req.user.id});
  

    // const totalExpense = Number(req.user.totalExpenses)+Number(price);

    //  await User.update({totalExpenses:totalExpense},{where:{id:req.user.id}});
     try {
    res.status(201).json({newuser:data});
     } catch (error) {
        return res.status(500).json({success: false, error: err})
     }
    

}catch(error){
    console.log('error in post request',JSON.stringify(error))
    res.status(500).json({err:error})};
};



const getexpense = async  (req,res,next)=>{

  try{
  const pagelimit=Number(req.query.param2);
  const pageNumber=Number(req.query.param1);
  const totalUserExpense = await Expense.find().count({userId:req.user.id});

    const users = await Expense.find({userId:req.user.id}).skip((pageNumber-1)*pagelimit).limit(pagelimit).exec();

    // console.log(users)
    
    if(users.length>0 && users!==null && users!==undefined){
      res.status(200).json({success:true,message:"Record fetch Successfully",users,ispremiumuser:req.user.ispremium,
      lastPage:Math.ceil(totalUserExpense/pagelimit)
    })
    }else{
      res.status(200).json({success:true,msg:"No Record Found",users,ispremiumuser:req.user.ispremium});
    }
  }
  catch(err){
    console.log(err)
  }

}

//Delete Controller

const deleteexpense=async(req,res)=>{
    try{
        if(req.params.id===undefined){
            console.log('ID missing')
        }
  const uid = req.params.id;
  console.log(uid)
  const DataTobeDeleted = await Expense.deleteOne({_id:req.params.id});

 
 
   
  res.status(200).json({msg : 'successful',deleteddata: DataTobeDeleted})
  

    }catch(err){
        console.log(err);
        res.status(500).json({error:err})
        
    }
};



const downloadexpense = async (req,res)=>{
    try {
        const Expensess = await Expense.findAll({where:{UserId:req.user.id}});
        const StrigifyfieldExpensess = JSON.stringify(Expensess);
        const userId =req.user.id;
        const filename = `Expense${userId}/${new Date()}.txt`;
        const fileURL = await service.uploadToS3(StrigifyfieldExpensess, filename);
        await downloaddetail.create({
          filename: fileURL,
          downloaddate:Date(),
          UserId: req.user.id
      });
         res.status(200).json({fileURL,success:true})
    } catch (error) {
        console.log(error);
        res.status(500).json({fileURL:'',success:false,err:error})
    }   
}

 
const downloadAllexpensedataFile = (async(req,res)=>{
  try {
    const downloadFileData = await downloaddetail.findAll({where:{UserId: req.user.id}});
    res.status(200).json({success:true,downloadFileData});
   } catch (error) {
    res.status(500).json({success:false,error:error});
}
})


module.exports={
    postexpense,
    getexpense,
    deleteexpense,
    downloadexpense,
    downloadAllexpensedataFile
}