const express = require('express')
const courseRouter = express.Router()
const courseModel = require('../models/course.model');
const departmentModel = require('../models/department.model');
const acadamicMemberModel= require('../models/academicMember.model');
const academicMemberModel = require('../models/academicMember.model');
const requestsModel = require('../models/requests.model');
const slotsModel = require('../models/slots.model');
const {
  validateDeleteCourse,
  validatePostcourse,
  validatePutCourse,

 }=require('../middleware/course.validation');
const scheduleModel = require('../models/schedule.model');
courseRouter.route('/')
.post(
  validatePostcourse,  async (req, res) => {
 const newcourse= new courseModel({
        name: req.body.name, 
        department:req.body.department,
    });   
    try{ if(!(req.user.id.includes("hr-"))){
      res.send("you are not an hr");
      return;
    }
      if(!(req.user.id.includes("hr-"))){
        res.send("you are not an hr");
        return;
      }
        if(req.body.department){
            const departments=await departmentModel.find().where('name').in(req.body.department).exec();
            if(departments.length!=req.body.department.length)
            {res.status(500).json({
                                message: "some departments do not exist or not array"
                               }); 
                               return;
            }
            const department=await departmentModel.updateMany( { name: { $in: req.body.department } },{$push:{courseNames: req.body.name}});
    }
        const result= await newcourse.save();
        res.send(result)} 
        catch(err){
          console.log(err);
          res.status(500).json({
            error: err
          });
      }

    }
    );
courseRouter.route('/:courseName')
.get( async (req, res) => { 
  try{ 
    if(!(req.user.id.includes("hr-"))){
      res.send("you are not an hr");
      return;
    }   
 
    const course =await  courseModel.findOne({name : req.params.courseName})
    if(!course){
      res.send("course does not exist");
      return;
    }
    res.status(200).json({
      department: course.department,
  });
      
  } 
      catch(err){
        console.log(err);
        res.status(500).json({
          error: err
        });
    }

  }
  )
.delete(validateDeleteCourse,async (req, res)=>{ 
  try{
  
    if(!(req.user.id.includes("hr-"))){
      res.send("you are not an hr");
      return;
    }
    const courseExist=await courseModel.findOne({name:req.params.courseName})
    if(!courseExist){
      res.send("course does not exist");
      return;
    }
    const departmentName=req.body.department;
    console.log(departmentName);
    const acadamic=await acadamicMemberModel.updateMany({department:departmentName},{ $pullAll: {courses: [req.params.courseName] }});
    const acadamic2=await acadamicMemberModel.updateMany({department:departmentName},{ $pullAll: {instructorFor: [req.params.courseName] }});
    const acadamic3=await acadamicMemberModel.updateMany({department:departmentName},{ $pullAll: {coordinatorFor: [req.params.courseName] }});
    const department=await departmentModel.updateMany({name:departmentName},{ $pullAll: {courseNames: [req.params.courseName] }});
    const course2=await courseModel.updateMany({name:req.params.courseName},{ $pullAll: {department: [departmentName] }});
 
    res.status(200).json({
      message: 'done',
  });
     }
        catch(err){  
          console.log(err);
          res.status(500).json({
            error: err,
          });
        }
        })

//update course
.put(validatePutCourse, async(req, res)=>
{ 
    try{ 
      if(!(req.user.id.includes("hr-"))){
        res.send("you are not an hr");
        return;
      }
      const courseExist=await courseModel.findOne({name:req.params.courseName})
    if(!courseExist){
      res.send("course does not exist");
      return;
    }
      if(req.body.department){
        const departments=await departmentModel.find().where('name').in(req.body.department).exec();
        if(departments.length!=req.body.department.length)
        {res.status(200).json({
                            message: "some departments do not exist or not array"
                           }); 
                           return;
      
      }
    }
    let name=""
    if(req.body.name)
    name=req.body.name
    else
    name=req.params.courseName
           
    const result= await courseModel.findOneAndUpdate
    ({name : req.params.courseName}, req.body, {new: true});
    res.send(result);
    if(req.body.department){
    const department=await departmentModel.updateMany({courseNames: { $elemMatch: {$eq:req.params.courseName}}},{ $pullAll: {courseNames: [req.params.courseName] }});
    const department2=await departmentModel.updateMany({ name: { $in: req.body.department } },{$push:{courseNames: name}});}
    else if(req.body.name!==req.params.courseName){
      const department2=await departmentModel.updateMany({courseNames: { $elemMatch: {$eq:req.params.courseName}}},{ $push: {courseNames: name }});
      const department=await departmentModel.updateMany({courseNames: { $elemMatch: {$eq:req.params.courseName}}},{ $pullAll: {courseNames: [req.params.courseName] }});
      const acadamic=await academicMemberModel.updateMany({courses: { $elemMatch: {$eq:req.params.courseName}}},{ $push: {courses: name }});
      const acadamic2=await academicMemberModel.updateMany({courses: { $elemMatch: {$eq:req.params.courseName}}},{ $pullAll: {courses: [req.params.courseName] }});
      const acadamic3=await academicMemberModel.updateMany({instructorFor: { $elemMatch: {$eq:req.params.courseName}}},{ $push: {instructorFor: name }});
      const acadamic4=await academicMemberModel.updateMany({instructorFor: { $elemMatch: {$eq:req.params.courseName}}},{ $pullAll: {instructorFor: [req.params.courseName] }});
      const acadamic5=await academicMemberModel.updateMany({coordinatorFor: { $elemMatch: {$eq:req.params.courseName}}},{ $push: {coordinatorFor: name }});
      const acadamic6=await academicMemberModel.updateMany({coordinatorFor: { $elemMatch: {$eq:req.params.courseName}}},{ $pullAll: {coordinatorFor: [req.params.courseName] }});
      const acadamic7=await requestsModel.updateMany({course:req.params.courseName},{course:name});
      const sch2=await scheduleModel.updateMany( {
        slots: { $elemMatch: { course:req.params.courseName } }
      },
      { $set: { "slots.$.course" : name } });
      const acadamic8=await slotsModel.updateMany({course:req.params.courseName},{course:name});
     }
           }
            catch(err){
              console.log(err);
          res.status(500).json({
            error: err
          });
            }})

module.exports = courseRouter;








