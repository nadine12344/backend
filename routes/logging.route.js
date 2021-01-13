const express = require('express')

const router= express.Router()
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const academicMemberModel = require('../models/academicMember.model')
const Vtokens= require('./verifyToken');
const hrStaff = require('../models/hr.model');
const attendenceModel= require('../models/attendence.model');
const hrmodel = require('../models/hr.model');
const requestsModel= require('../models/requests.model');
const logoutModel=require('../models/logout.model')

const {
  validateLogin 
  }
  =require('../middleware/requests.validation');




router.post('/logout',
  async (req, res) => {
      try{
         // console.log("lalal")
          console.log(req.headers.token)
        var x=new logoutModel({
            token:req.headers.token
        })
        x.save()
        return res.json({
          statusCode:0,
          error: 'logged out successfully',
        })
      }
    catch(err){
        console.log(err);
          res.status(500).json({error: err });
    }
  })

  router.get('/viewAcademic',
  async (req, res) => {
      try{
         var emsil=req.body.email
         const member=await academicMemberModel.find({email:email})
        return res.json({
          statusCode:0,
          msg: 'success',
          member
        })
      }
    catch(err){
        console.log(err);
          res.status(500).json({error: err });
    }
  })



  router.post('/login',validateLogin,
  async (req, res) => {
      try{
        console.log("LLLLLLLOOOOOOOOOOGGGGGGGGIIIIIIIIIIINNNNNNN  HHHHEEEEAAADDDDEEEEEEERRRRRRRRSSSSSS")
             console.log(req.headers)
        console.log(await bcrypt.compare("$2b$10$mueDTpkYYPB9YINCsVYPIuTiylI9jBfpf9J0Ybnvk0aQwmXmGJmTO","1234"))
      const email =req.body.email
      const password=req.body.password 
      var newpassword=req.body.newpassword
      if(!email){
        console.log("You must log in using email")
        return res.json({
          statusCode:1,
          error: 'You must log in using email',
        })
         
      }
      if(!password){
        console.log("You must log in using password")
        return res.json({
          statusCode:1,
          error: 'You must log in using password',
        })
       
    }
    const userAcdemicMember= await academicMemberModel.findOne({email:email})
    const userHrStaff=await hrStaff.findOne({email:email})
   
    if (!userAcdemicMember && ! userHrStaff){
        console.log("you must sign up first or you must be added by hr first")
        return res.json({
          statusCode:1,
          error: 'you must sign up first or you must be added by hr first',
        })
    }
    if (userAcdemicMember){ 
        console.log("entered useracdemic member")
        console.log("comparing password with bcrypted password")
        const correctPassword=await bcrypt.compare(password,userAcdemicMember.password)
console.log("pass"+correctPassword);
        if(!correctPassword){
            return res.json({
              statusCode:1,
              error: 'Invalid Password',
            })
        }
  if(userAcdemicMember.changePassword){
//                 if(newpassword){                               //error here when entering newpassword 
//                     const salt= await bcrypt.genSalt(10)
//                     console.log("here")
//                     newpassword=await bcrypt.hash(newpassword,salt)
//                     console.log(newpassword)
//                     await academicMemberModel.updateOne({ email:email}, { changePassword: false,password:newpassword})
//                     }
//                 else{
//                   return res.json({
//                     statusCode:1,
//                     error: 'enter new Password',
//                   })
//             }

                    const payload = {
                     id:userAcdemicMember.id,
                     role:userAcdemicMember.role
                    };
                    const token =await jwt.sign(payload,"HS256")
                    await logoutModel.findOneAndDelete({token:token})
                    res.header('token',token)
                    return res.json({
                      statusCode:5,
                      type:"ac",
                      token
                    })
 
                 }   
                const payload = {
                    id:userAcdemicMember.id,
                    role:userAcdemicMember.role
                };
             const token =await jwt.sign(payload,"HS256")
             await logoutModel.findOneAndDelete({token:token})
            res.header('token',token)
           
           // var decoded =await jwt.verify(token, 'HS256');
            return res.json({
              statusCode:0,
              type:"ac",
              msg: 'logged in Suucessfully',
              token:token
            })
            
            
        }
    
    if(userHrStaff){
        console.log("entered hr member")
        console.log("comparing password with bcrypted password")
        const correctPassword= await bcrypt.compare(password,userHrStaff.password)
        console.log(correctPassword)
        if(!correctPassword){
          console.log("lalalalal")
          return res.json({
            statusCode:1,
            error: 'Invalid Password',
          })
        }
  if(userHrStaff.changePassword){
//                 if(newpassword){                               //error here when entering newpassword 
//                     const salt= await bcrypt.genSalt(10)
//                     newpassword=await bcrypt.hash(newpassword,salt)
//                     await hrmodel.updateOne({ email:email}, { changePassword: false,password:newpassword})
//                     }
//                 else{
//                   return res.json({
//                     statusCode:1,
//                     error: 'enter new Password',
//                   })
//             }

                      const payload = {
                       id:userHrStaff.id,
                       role:userHrStaff.role
                      };
                     const token =await jwt.sign(payload,"HS256")
                     await logoutModel.findOneAndDelete({token:token})
                     res.header('token',token)
                      return res.json({
                      statusCode:5,
                      type:"hr",
                      token
                      })
                }   
                const payload = {
                    id:userHrStaff.id,role:userHrStaff.role
                };
       
                const token =await jwt.sign(payload,"HS256")
             await logoutModel.findOneAndDelete({token:token})
               res.header('token',token)

               return res.json({
                statusCode:0,
                type:"hr",
         msg: 'logged in Suucessfully',
                token
              })
              
               
            

    }}
    catch(err){
        console.log(err);
          res.status(500).json({error: err });
    }
  })
 


  module.exports=router