//done
const express = require('express')
const locationRouter = express.Router()
const locationModel = require('../models/location.model');
const slotModel = require('../models/slots.model');
 const hrModel=require('../models/hr.model');
const acadamicMemberModel=require('../models/academicMember.model');
const{
  validatePostlocation,
  validatePutlocation

 }=require('../middleware/location.validation');
const scheduleModel = require('../models/schedule.model');
locationRouter.route('/')
.post(validatePostlocation,
  async (req, res) => {
    console.log("here")
    const newLocation= new locationModel({
        name: req.body.name, 
        type: req.body.type,
        capacity: req.body.capacity,
    }) 
    try{if(!(req.user.id.includes("hr-"))){
      res.send("you are not an hr");
      return;
    } const find= await locationModel.findOne({name:req.body.name})
    if(find){
      res.status(200).json({
        message:"locatiion exists"
      });
      return;
    }
      const result= await newLocation.save()
        res.send(result)} 
        catch(err){
          console.log(err);
          res.status(500).json({
            error: err
          });
      }
    }
    );
//delete location and make slots there undefined
locationRouter.route('/:locationName')
.delete(async (req, res)=>{ 
  try{if(!(req.user.id.includes("hr-"))){
    res.send("you are not an hr");
    return;
  }
  const find= await locationModel.findOne({name:req.params.locationName})
 if(!find){
  res.send("location does not exist");
  return; 
 }
        const result= await locationModel.deleteOne({name : req.params.locationName})
        res.status(200).json({
          message: 'done',
      });
      const sch2=await scheduleModel.updateMany( {
        slots: { $elemMatch: { location:req.params.locationName } }
      },
      { $set: { "slots.$.location" : "undefined" } });
        const result2= await slotModel.updateMany({location: req.params.locationName},{location: "undefined"})
        const result3= await hrModel.updateMany({officeLocation: req.params.locationName},{officeLocation: "undefined"})
        const result4= await acadamicMemberModel.updateMany({officeLocation: req.params.locationName},{officeLocation: "undefined"})
  
     }
     
        catch(err){    console.log(err);
          res.status(500).json({
            error: err
          });}})
//update location
.put(  validatePutlocation,async(req, res)=>
{ try{ if(!(req.user.id.includes("hr-"))){
  res.send("you are not an hr");
  return;
}  const find= await locationModel.findOne({name:req.params.locationName})
if(!find){
 res.send("location does not exist");
 return; 
}
  const locationUpdated= await locationModel.findOne
  ({name : req.params.locationName} );  
  const result= await locationModel.findOneAndUpdate
            ({name : req.params.locationName}, req.body, {new: true});
            res.send(result);
            if(req.body.name){
              const sch2=await scheduleModel.updateMany( {
                slots: { $elemMatch: { location:req.params.locationName } }
              },
              { $set: { "slots.$.location" : req.body.name } });
                const result= await slotModel.updateMany({location: req.params.locationName},{location: req.body.name});
                const result3= await hrModel.updateMany({officeLocation: req.params.locationName},{officeLocation: req.body.name});
                const result4= await acadamicMemberModel.updateMany({officeLocation: req.params.locationName},{officeLocation: req.body.name});
              }
              //handles if an office is no longer an office
              if(req.body.type!="offices"&&locationUpdated.type=="offices"){
                const result5= await hrModel.updateMany({officeLocation: req.params.locationName},{officeLocation: "undefined"})
                const result6= await acadamicMemberModel.updateMany({officeLocation: req.params.locationName},{officeLocation: "undefined"})
              }
            }
            catch(err){
              console.log(err);
          res.status(500).json({
            error: err
          });
            }})

module.exports = locationRouter;
