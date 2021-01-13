const express = require('express')
const bcrypt=require(('bcryptjs'));
const academicMemberRouter = express.Router()
const locationModel = require('../models/location.model');
const academicMember = require('../models/academicMember.model');
const counterModel = require('../models/counters.model');
const attendanceModel=require('../models/attendence.model');
const hrModel=require('../models/hr.model');
const academicMemberModel = require('../models/academicMember.model');
const scheduleModel = require('../models/schedule.model');
const courseModel = require('../models/course.model');
const departementModel = require('../models/department.model');
const requestsModel = require('../models/requests.model');
const slotsModel = require('../models/slots.model');
const replacementModel = require('../models/replacements.model');
const {
  validatePostacademic,
  validatePutacademic,
  validatePutSalaryacademic
 }=require('../middleware/academic.validation');
academicMemberRouter.route('/')
.post(
  validatePostacademic,async (req, res) => {
 const newacademicMember= new academicMember({
    name:req.body.name,
    email:req.body.email,
    salary:req.body.salary,
    officeLocation:req.body.officeLocation,
    extraInformation:req.body.extraInformation,
    gender:req.body.gender,
    role:req.body.role,
    dayOff:req.body.dayOff,
    department:req.body.department
    });   
        try{
          if(!(req.user.id.includes("hr-"))){
            res.send("you are not an hr");
            return;
          }
          const hr = await hrModel.find({email:req.body.email}); 
          const ar = await academicMemberModel.find({email:req.body.email}); 
          if(hr.length>0||ar.length>0){
            res.status(500).json({
              message: "emaill already exists"
             }); 
             return;
          }
  const salt = await bcrypt.genSalt(10);
req.body.password = await bcrypt.hash("123456", salt) ;
newacademicMember.password=req.body.password;
          const count= await counterModel.find();
          let newCount;
          if((count).length>0){
             newCount=count[0].academicCount+1
            newacademicMember.id="ac-"+newCount;
   }
          else{
            newCount=1;
            const newCounter=new counterModel({
              academicCount:1,
              Count:1,
            } );
            newCounter.save();
            newacademicMember.id="ac-"+1;
          }
        if(req.body.officeLocation){
            const location=await locationModel.findOne({name : req.body.officeLocation});
            if(!location){
              res.send({
                   message: "location does not exist"
                  }); 
                  return;}
  if(location.type!=="offices"){
    res.status(200).json({
        message: "location is not an office"
       }); 
       return;
                      }
     if(location.capacity===location.officeOccupants){
        res.status(500).json({
            message: "office full"
           }); 
           return;          
        }
        
       }
       const newAttendance=new attendanceModel({
        staffId:newacademicMember.id
      });
      console.log(newacademicMember.id)
      const schedule=new scheduleModel({
        academicMember:newacademicMember.id
      });
     
      if(req.body.department){
        const new4= await departementModel.findOne({name:req.body.department})
        if(!new4){
          res.status(200).json({
            message: "no such department"
           }); 
           return;}}
        const result= await newacademicMember.save()
        const result2= await newAttendance.save()
        const result3= await schedule.save()
       
        const count2=await counterModel.updateOne({academicCount:newCount-1},{academicCount:newCount});
        if(req.body.officeLocation){
        const new2= await locationModel.updateOne({name:req.body.officeLocation},{ $inc: {officeOccupants:1}})}
        if(req.body.department){
          const new4= await departementModel.findOne({name:req.body.department})
        
          }
        const new3= await departementModel.updateOne({name:req.body.department},{ $push: {staffIds:newacademicMember.id}})
        res.send(result)} 
        catch(err){
          console.log(err);
          res.status(500).json({
            error: err
          });
      }

    }
    );
academicMemberRouter.route('/:id')
.delete(async (req, res)=>{ 
  try{   if(!(req.user.id.includes("hr-"))){
    res.send("you are not an hr");
    return;
  }
   
    const ac= await academicMember.findOne({id : req.params.id})
    if(ac){
      if(ac.officeLocation){
        const new1= await locationModel.updateOne({name:ac.officeLocation},   { $inc: {officeOccupants:-1}});
        }
    }else{
      res.send("staff does not exist"); 
      return;
    }
    const deleteSchedule=await scheduleModel.deleteOne({academicMember : req.params.id});
    const deleteAttendance=await attendanceModel.deleteOne({staffId : req.params.id});
    const updateCourseCooordinator=await courseModel.updateMany({coordinator : req.params.id},{coordinator : "undefined"});
    const updatedepartmentStaff=await departementModel.updateMany({staffIds: { $elemMatch: {$eq:req.params.id}}},{ $pullAll: {staffIds: [req.params.id] }});
    const updatedepartmentStaff2=await departementModel.updateMany({HOD:  req.params.id},{HOD:  "undefined"});
    const updaterequests=await replacementModel.deleteMany({academicMember : req.params.id});
    const updaterepacements=await requestsModel.updateMany({from : req.params.id},{from : "undefined"});
    const updateslots=await slotsModel.updateMany({academicMember : req.params.id},{academicMember : "undefined"});
  const result= await academicMember.deleteOne({id : req.params.id})
      res.status(200).json({
        message: 'academicMember deleted',
    });
     }
        catch(err){    console.log(err);
          res.status(500).json({
            error: err
          });}})
//update academicMember
.put( validatePutacademic,async(req, res)=>
{  
    try{    
      if(!(req.user.id.includes("hr-"))){
    res.send("you are not an hr");
    return;
  }
      const staff2= await academicMember.findOne({id : req.params.id});
if(!staff2){
  res.send("staff does not exist"); 
  return;
}
if(req.body.department){
  const new4= await departementModel.findOne({name:req.body.department})
  if(!new4){
    res.status(200).json({
      message: "no such department"
     }); 
     return;}}
if(req.body.email){
      const hr = await hrModel.find({email:req.body.email});
    if(hr.length>0){
      res.status(500).json({
        message: "emaill already exists"
       }); 
       return;
    }}   
       if(req.body.officeLocation){
          const location=await locationModel.findOne({name : req.body.officeLocation});
    if(!location){
        res.status(500).json({
           message: "location does not exist"
          }); 
          return;}
if(location.type!=="offices"){
res.status(500).json({
message: "location is not an office"
}); 
return;
              }
if(location.capacity===location.officeOccupants){
res.status(500).json({
    message: "office full"
   }); 
   return;          
}
const staff= await academicMember.findOne({id : req.params.id});
console.log(staff);
const result= await academicMember.findOneAndUpdate
({id : req.params.id}, req.body, {new: true});
if(staff.officeLocation){
const new1= await locationModel.updateOne({name:staff.officeLocation},   { $inc: {officeOccupants:-1}});

const new2= await locationModel.updateOne({name:req.body.officeLocation},{ $inc: {officeOccupants:1}})}

res.send(result);
}
else{
  const result= await academicMember.findOneAndUpdate
({id :req.params.id}, req.body, {new: true});
res.send(result);
}
           
           }
            catch(err){
              console.log(err);
          res.status(500).json({
            error: err
          });
            }})
 academicMemberRouter.route('/salary/:id')
 .put( validatePutSalaryacademic,async(req, res)=>
 {  
     try{    
    
      if(!(req.user.id.includes("hr-"))){
        res.send("you are not an hr");
        return;
      }
      const staff2= await academicMember.findOne({id : req.params.id});
      if(!staff2){
        res.send("staff does not exist"); 
        return;
      }
 const result= await academicMember.findOneAndUpdate({id :req.params.id}, {salary:req.body.salary}, {new: true});

 res.send(result);}
             catch(err){
               console.log(err);
           res.status(500).json({
             error: err
           });
             }})
module.exports = academicMemberRouter;