//done
const express = require('express')
const facultyRouter = express.Router()
const facultyModel = require('../models/faculty.model');
const departmentModel = require('../models/department.model');
const {
  validatePostfaculty,
  validatePutfaculty

 }=require('../middleware/faculty.validation')
facultyRouter.route('/')
.post(validatePostfaculty,
  async (req, res) => {
    const newfaculty= new facultyModel({
        name: req.body.name, 
    }) 
    try{ if(!(req.user.id.includes("hr-"))){
      res.send("you are not an hr");
      return;
    }
        const result= await newfaculty.save()
        res.send(result)} 
        catch(err){
          console.log(err);
          res.status(500).json({
            error: err
          });
      }
    }
    );
facultyRouter.route('/:facultyName')
.delete(async (req, res)=>{ 
  try{if(!(req.user.id.includes("hr-"))){
    res.send("you are not an hr");
    return;
  }
  const fac=await facultyModel.findOne({name:req.params.facultyName})
  if(!fac){
    res.send("facuulty does not exist");
    return;
  }
        const result= await facultyModel.deleteOne({name : req.params.facultyName})
        res.status(200).json({
          message: 'done',
      });
      try{
        const result= await departmentModel.updateMany({faculty: req.params.facultyName},{faculty: "undefined"})
     
     }catch(err){    console.log(err);
      res.status(500).json({
        error: err
      });
  }
     }
        catch(err){    console.log(err);
          res.status(500).json({
            error: err
          });}})
//update faculty
.put(   validatePutfaculty,async(req, res)=>
{ try{if(!(req.user.id.includes("hr-"))){
  res.send("you are not an hr");
  return;
}
const fac=await facultyModel.findOne({name:req.params.facultyName})
if(!fac){
  res.send("facuulty does not exist");
  return;
}     const result= await facultyModel.findOneAndUpdate
            ({name : req.params.facultyName}, req.body, {new: true});
            res.send(result);
            if(req.body.name){
              try{
                const result= await departmentModel.updateMany({faculty: req.params.facultyName},{faculty: req.body.name})
             
             }catch(err){    console.log(err);
              res.status(500).json({
                error: err
              });}
            }
           }
            catch(err){
              console.log(err);
          res.status(500).json({
            error: err
          });
            }})

module.exports = facultyRouter;
