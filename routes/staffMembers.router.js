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

const {
  validateUpdateProfile,
  validateResetPassword,
  validateveiwAttendenceRecords,
  }
  =require('../middleware/requests.validation');
const { request } = require('express');
const locationModel = require('../models/location.model');




  router.get('/viewProfile',async (req, res) => {
    try {
      console.log("hdjjd")
      console.log(req.user.id)
      const userAcdemicMember= await academicMemberModel.findOne({id:req.user.id})
      console.log(userAcdemicMember)
       const userHrStaff=await hrStaff.findOne({id:req.user.id})
       console.log("e"+userHrStaff)
      if(userAcdemicMember){
        console.log("entered userAcdemicMember")
        return res.json({
          statusCode:1,
            userAcdemicMember
          })
      }

      if(userHrStaff){
       
        return res.json({
          statusCode:2,
            userHrStaff
          })
      }

    } catch (exception) {
     
      return res.json({
        error: 'Something went wrong',
        exception
      })
    }
  }

)
router.put('/UpdateProfile',validateUpdateProfile,
async (req, res) => {
    try {
      console.log("started")
     const userAcdemicMember= await academicMemberModel.findOne({id:req.user.id})
     const userHrStaff=await hrStaff.findOne({id:req.user.id})

      if(userAcdemicMember){
        var  email
        var gender
        var officeLocation
        var  extraInformation
         var password

        if(req.body.email)
        {  email=req.body.email;}
        else{
          email= userAcdemicMember.email
        }
        if(req.body.password) { 
          const salt= await bcrypt.genSalt(10)
          console.log("here")
          password=await bcrypt.hash(req.body.password,salt)
           }
        else{
          password= userAcdemicMember.password
        }
         if(req.body.gender){ 
         gender=req.body.gender;
         }
         else{
          gender=userAcdemicMember.gender;
         }
         if (req.body.officeLocation){
           officeLocation=req.body.officeLocation;
           const location=await locationModel.findOne({name : req.body.officeLocation});
           console.log(location+"llll")
           if(!location){
             res.send(
                 "location does not exist"
                 ); 
                 return;}
 if(location.type!=="offices"){
  res.send(
      "location is not an office"
      ); 
      return;
                     }
    if(location.capacity===location.officeOccupants){
      res.send(
         "office full"
          ); 
          return;          
       }
         }
         else{
          officeLocation=userAcdemicMember.officeLocation;
         }
         if(req.body.extraInformation){
          extraInformation=req.body.extraInformation;
         }
         else{
          extraInformation=userAcdemicMember.extraInformation;
         }
         const name=req.body.name
         const id=req.body.id
         const salary=req.body.salary
         const department=req.body.department
         const faculty=req.body.faculty
        
         if(id&& id.length>0){
            res.send("you can't update id");
         }
         if(name && name.length>0){
            res.send("you can't update name ");
         }
         if(salary && salary.length>0 ){
            res.send("you can't update your salary");
         }
         if(department &&department.length>0){
            res.send("you can't update your department");
         }
         if(faculty && faculty.length){
            res.send("you can't update your faculty");
         }
        
         await   academicMemberModel.findOneAndUpdate( { id:req.user.id},{gender:gender,email:email,extraInformation:extraInformation,officeLocation:officeLocation, password:password })
         res.send("updated successfully")
      }
      if(userHrStaff){
        var email
        var officeLocation
        var extraInformation
        var gender
        var password
        if(req.body.email){
          email=req.body.email;}
        else{
          email=userHrStaff.email;
        }
        if(req.body.gender){ 
          gender=req.body.gender;
          }
          else{
           gender=userHrStaff.gender;
          } 
          if (req.body.officeLocation){
            officeLocation=req.body.officeLocation;
            const location=await locationModel.findOne({name : req.body.officeLocation});
            console.log(location+"llll")
            if(!location){
              res.send(
                  "location does not exist"
                  ); 
                  return;}
  if(location.type!=="offices"){
   res.send(
       "location is not an office"
       ); 
       return;
                      }
     if(location.capacity===location.officeOccupants){
       res.send(
          "office full"
           ); 
           return;          
        }
          }
        else{
          officeLocation=userHrStaff.officeLocation;
        }
        
         if(req.body.extraInformation){
          extraInformation=req.body.extraInformation;
         }
        else{
          extraInformation=userHrStaff.extraInformation;
        }
         
         if(req.body.password){ 
          const salt= await bcrypt.genSalt(10)
          console.log("here")
          password=await bcrypt.hash(req.body.password,salt)
         }
        else{
          password=userHrStaff.password
        }
         
      
         
         const name=req.body.name
         const id=req.body.id
        
         if(id&& id.length>0){
            res.send("you can't update id");
         }
         if(name && name.length>0){
            res.send("you can't update name ");
         }
        


        
      await   hrmodel.findOneAndUpdate( { id:req.user.id},{gender:gender,email:email,extraInformation:extraInformation,officeLocation:officeLocation,  password: password})
      res.send("updated successfully") 
      }


      
    } catch(err){
      console.log(err);
      res.status(500).json({
        error: err
      });}
  }

)

router.put('/resetPassword',validateResetPassword,
async (req, res) => {
    try {
      
       const userAcdemicMember= await academicMemberModel.findOne({id:req.user.id})
       console.log(userAcdemicMember)
       const userHrStaff=await hrStaff.findOne({id:req.user.id})
       console.log( userHrStaff)
      if(userAcdemicMember){
        console.log("entered useracdemicmember")
          var password=req.body.password
         const salt= await bcrypt.genSalt(10)
          password=await bcrypt.hash(password,salt)
         console.log(password)
       await academicMemberModel.findOneAndUpdate( { id:req.user.id},{password:password,changePassword:false})
       return res.json({
        statusCode:0,
        msg: 'success',
      })
    }
      
      if(userHrStaff){
        var password=req.body.password
        const salt= await bcrypt.genSalt(10)
    password=await bcrypt.hash(password,salt)
       await hrmodel.findOneAndUpdate( { id:req.user.id},{password:password,changePassword:false})
       return res.json({
        statusCode:0,
        msg: 'success',
      })
      }
      if(!userAcdemicMember && !userHrStaff){
        return res.json({
          statusCode:1,
          msg: 'you need to login first',
        })
    }
    } catch (exception) {
      return res.json({
        error: 'Something went wrong',
        exception
      })
    }
  }

)

router.route('/in').post(
  async (req, res) => {
try{  
 var date=new Date(Date.now());
date.setTime( date.getTime() - date.getTimezoneOffset()*60*1000 );

const result=await attendenceModel.updateOne({staffId:req.user.id},{$push:{signIn: date}});
const result2=await attendenceModel.findOne({staffId:req.user.id})
result2.signIn.sort(function (a, b) {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
});
const result3=await attendenceModel.updateOne({staffId:req.user.id},{signIn: result2.signIn });
res.status(200).json({
  message: 'success',
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
    router.route('/out')
.post(
  async (req, res) => {
try{  
  var date=new Date(Date.now());
  date.setTime( date.getTime() - date.getTimezoneOffset()*60*1000 );
    const result=await attendenceModel.updateOne({staffId:req.user.id},{$push:{signOut: date,}});
    const result2=await attendenceModel.findOne({staffId:req.user.id})
    result2.signOut.sort(function (a, b) {
      if (a > b) return 1;
      if (a < b) return -1;
      return 0;
    });
    const result3=await attendenceModel.updateOne({staffId:req.user.id},{signOut: result2.signOut });
res.status(200).json({
  message: 'success',
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
   
   
    router.route('/veiwAttendenceRecords')
    .put(validateveiwAttendenceRecords,
        async (req, res) => {
      try{
        console.log("hhere")
        console.log(req)
if(!req.body.month){
  console.log("hhere1")
  console.log(req.user.id)
  const result=await attendenceModel.findOne({staffId:req.user.id});
  console.log(result)
  res.send(result);
  return;
}
else{
  console.log("hhere2")
    const result=await attendenceModel.findOne({staffId:req.user.id});
       const res2=result.signIn.filter(element => element.getMonth() ==req.body.month);
      const res3=result.signOut.filter(element => element.getMonth() ==req.body.month);
      let attend={
        signIn:res2,
        signOut:res3
      }
     
       res.send(attend);
     }
   }
              catch(err){
                console.log(err);
                res.status(500).json({
                  error: err
                });
            }
          }
          );
router.route('/missingdays')
.get(
    async (req, res) => {
  try{ 
  console.log(req.user.id)
      const date=new Date(Date.now()) ;  
      var startDate=new Date();
      var endDate=new Date();
    if(date.getDate()<11){
      endDate=new Date(date);
      if(date.getMonth()==0){
        startDate.setFullYear(date.getFullYear()-1);
      startDate.setMonth(11);}
      else{
        startDate.setMonth(date.getMonth()-1);
        startDate.setFullYear(date.getFullYear());
      }
      startDate.setDate(11);
      startDate.setHours(7);
      startDate.setMinutes(0);
      startDate.setMilliseconds(0);
    }
    else{
      endDate=new Date(date); 
      startDate=new Date();
      startDate.setDate(11);
      startDate.setHours(7);
      startDate.setMonth(endDate.getMonth());
      startDate.setFullYear(endDate.getFullYear());
      startDate.setMinutes(0);
      startDate.setMilliseconds(0);
    }
  let absence=[];
    const result=await attendenceModel.findOne({staffId:req.user.id});
    let hrPeople=await hrmodel.findOne({id:req.user.id});
    let acPeople=await academicMemberModel.findOne({id:req.user.id});
   let requests=await requestsModel.find({from:req.user.id});
  
for(var i=new Date(startDate);i.getTime()<=endDate.getTime();i.setDate(i.getDate()+1)){
 
  if(!(i.getDay()=="5")){
  if(req.user.id.includes("hr-")){
  person=hrPeople;}
  else{
    person=acPeople;
  }
  

  let dayoff;
if(person){
   dayoff=getDay(person.dayOff);}
  
  if(!(i.getDay()==dayoff)){
  let temp=[];
  let temp2=[];
 for(var k=0;k<result.signIn.length;k++){
   elementTime=new Date(result.signIn[k]);
    elementTime.setTime( elementTime.getTime() +elementTime.getTimezoneOffset()*60*1000 );  

  if( elementTime.getMonth()==i.getMonth() && 
    elementTime.getFullYear()==i.getFullYear()&&
    elementTime.getDate()==i.getDate()&&
    elementTime.getHours()>=7&&
    elementTime.getHours()<=18 ){ 
temp.push(result.signIn[k]);}
     }

     for(var k=0;k<result.signOut.length;k++){
      elementTime=new Date(result.signOut[k]);
      let timeExist=false;
for(let l=0;l<temp.length;l++){
  if(((new Date(temp[l])).getTime()) < elementTime.getTime()){
timeExist=true;
}}
       elementTime.setTime( elementTime.getTime() +elementTime.getTimezoneOffset()*60*1000 );  
     if( elementTime.getMonth()==i.getMonth() && 
       elementTime.getFullYear()==i.getFullYear()&&
       elementTime.getDate()==i.getDate()&&
       elementTime.getHours()>=7&&
      timeExist){ 
   temp2.push(result.signIn[k]);}
        }
if(!temp||!temp2||temp.length==0||temp2.length==0){
 console.log("here")
  let accepted=false;
  console.log(requests+"requests")
  if(requests){
 let req2=requests
 console.log(req2+"req");
if(req2){
  console.log(("djss"))
  console.log(i+"i")
 for(let l=0;l<req2.length;l++){
   console.log("ddd")
   console.log(i+"i")
   if(new Date(req2[l].dateOfRequest).getDate()==i.getDate()&&new Date(req2[l].dateOfRequest).getFullYear()==i.getFullYear()&&new Date(req2[l].dateOfRequest).getMonth()==i.getMonth()&&req2[l].status=='accepted'&&(req2[l].type=='Accidental leave'||req2[l].type=='anual leave'||req2[l].type=='sick leave'||req2[l].type=='maternity leave'||req2[l].type=='leave')){
  console.log("yesss")
accepted=true;
break;
}
if(new Date(req2[l].compensationDay).getDate()==i.getDate()&&new Date(req2[l].dateOfRequest).getFullYear()==i.getFullYear()&&new Date(req2[l].dateOfRequest).getMonth()==i.getMonth()&&req2[l].status=='accepted'&&(req2[l].type=='compensation leave')){
  const attend=[]
   for(var k=0;k<result.signIn.length;k++){
    elementTime=new Date(result.signIn[k]);
     elementTime.setTime( elementTime.getTime() +elementTime.getTimezoneOffset()*60*1000 );  
 
   if( elementTime.getMonth()==req2[l].dateOfRequest.getMonth() && 
     elementTime.getFullYear()==req2[l].dateOfRequest.getFullYear()&&
     elementTime.getDate()==req2[l].dateOfRequest.getDate()&&
     elementTime.getHours()>=7&&
     elementTime.getHours()<=18 ){ 
attend.push(elementTime)}
      }
  
const attend2=[]
for(var k=0;k<result.signIn.length;k++){
 
  elementTime=new Date(result.signOut[k]);
   elementTime.setTime( elementTime.getTime() +elementTime.getTimezoneOffset()*60*1000 );  
   let timeExist=false;
   for(let l=0;l<attend.length;l++){
     if(((new Date(attend[l])).getTime()) < elementTime.getTime()){
   timeExist=true;
   }}
 if( elementTime.getMonth()==req2[l].dateOfRequest.getMonth() && 
   elementTime.getFullYear()==req2[l].dateOfRequest.getFullYear()&&
   elementTime.getDate()==req2[l].dateOfRequest.getDate()&&
   elementTime.getHours()>=7&&
   elementTime.getHours()<=18&&timeExist ){ 
attend2.push(result.signOut[k])}
    }
if(attend2.length>0){
  accepted=true;}
break;
}}
 }}
 
 if(!accepted){
  console.log("here2"
  
+i)
  absence.push(new Date(i));
  }
 }

     temp=[];
     temp2=[];
  }}}
   res.send(absence);}
          catch(err){
            console.log(err);
            res.status(500).json({
              error: err
            });
        }
      }
      );
      function daysInMonth (month, year) {
        return new Date(year, month, 0).getDate();
    }  
    router.route('/missingdays')
.get(
    async (req, res) => {
  try{ 
      const date=new Date(Date.now()) ;  
      var startDate=new Date();
      var endDate=new Date();
    if(date.getDate()<11){
      endDate=new Date(date);
      if(date.getMonth()==0){
        startDate.setFullYear(date.getFullYear()-1);
      startDate.setMonth(11);}
      else{
        startDate.setMonth(date.getMonth()-1);
        startDate.setFullYear(date.getFullYear());
      }
      startDate.setDate(11);
      startDate.setHours(7);
      startDate.setMinutes(0);
      startDate.setMilliseconds(0);
    }
    else{
      endDate=new Date(date); 
      startDate=new Date();
      startDate.setDate(11);
      startDate.setHours(7);
      startDate.setMonth(endDate.getMonth());
      startDate.setFullYear(endDate.getFullYear());
      startDate.setMinutes(0);
      startDate.setMilliseconds(0);
    }
  let absence=[];
    const result=await attendenceModel.findOne({staffId:req.user.id});
    let hrPeople=await hrmodel.findOne({id:req.user.id});
    let acPeople=await academicMemberModel.findOne({id:req.user.id});
   let requests=await requestsModel.findOne({id:req.user.id});
for(var i=new Date(startDate);i.getDate()<=endDate.getDate()&&i.getMonth()<=endDate.getMonth();i.setDate(i.getDate()+1)){
  if(!(i.getDay()=="5")){
  if(req.user.id.includes("hr-")){
  person=hrPeople;}
  else{
    person=acPeople;
  }

  let dayoff;
if(person){
   dayoff=getDay(person.dayOff);}
 
  if(!(i.getDay()==dayoff)){
  let temp=[];
  let temp2=[];
 for(var k=0;k<result.signIn.length;k++){
   elementTime=new Date(result.signIn[k]);
    elementTime.setTime( elementTime.getTime() +elementTime.getTimezoneOffset()*60*1000 );  

  if( elementTime.getMonth()==i.getMonth() && 
    elementTime.getFullYear()==i.getFullYear()&&
    elementTime.getDate()==i.getDate()&&
    elementTime.getHours()>=7&&
    elementTime.getHours()<=18 ){ 
temp.push(result.signIn[k]);}
     }

     for(var k=0;k<result.signOut.length;k++){
      elementTime=new Date(result.signOut[k]);
      let timeExist=false;
for(let l=0;l<temp.length;l++){
  if(((new Date(temp[l])).getTime()) < elementTime.getTime()){
timeExist=true;
}}
       elementTime.setTime( elementTime.getTime() +elementTime.getTimezoneOffset()*60*1000 );  
     if( elementTime.getMonth()==i.getMonth() && 
       elementTime.getFullYear()==i.getFullYear()&&
       elementTime.getDate()==i.getDate()&&
       elementTime.getHours()>=7&&
      timeExist){ 
   temp2.push(result.signIn[k]);}
        }
if(!temp||!temp2||temp.length==0||temp2.length==0){
 console.log("here")
  let accepted=false;
  if(requests){
 let req2=requests.filter(element=>element.from==req.user.id);
if(req2){
 for(let l=0;l<req2.length;l++){
if(new Date(req2[l].dateOfRequest).getDate()==i.getDate()&&new Date(req2[l].dateOfRequest).getFullYear()==i.getFullYear()&&new Date(req2[l].dateOfRequest).getMonth()==i.getMonth()&&req2[l].status=='accepted'&&(req2[l].type=='Accidental leave'||req2[l].type=='anual leave'||req2[l].type=='sick leave'||req2[l].type=='maternity leave'||req2[l].type=='compensation leave'||req2[l].type=='leave')){
accepted=true;
break;
}}
 }}
 console.log(accepted)
 if(!accepted){
  console.log("here2"
  
+i)
  absence.push(new Date(i));
  }
 }

     temp=[];
     temp2=[];
  }}}
   res.send(absence);}
          catch(err){
            console.log(err);
            res.status(500).json({
              error: err
            });
        }
      }
      );
      function daysInMonth (month, year) {
        return new Date(year, month, 0).getDate();
    }  
router.route('/missinghours')
.get(
    async (req, res) => {
  try{ 
      const date=new Date(Date.now()) ;  
      var startDate=new Date();
      var endDate=new Date();
    if(date.getDate()<11){
      endDate=new Date(date);
      if(date.getMonth()==0){
        startDate.setFullYear(date.getFullYear()-1);
      startDate.setMonth(11);}
      else{
        startDate.setMonth(date.getMonth()-1);
        startDate.setFullYear(date.getFullYear());
      }
      startDate.setDate(11);
      startDate.setHours(7);
      startDate.setMinutes(0);
      startDate.setMilliseconds(0);
    }
    else{
      endDate=new Date(date); 
      startDate=new Date();
      startDate.setDate(11);
      startDate.setHours(7);
      startDate.setMonth(endDate.getMonth());
      startDate.setFullYear(endDate.getFullYear());
      startDate.setMinutes(0);
      startDate.setMilliseconds(0);
    }
  let absence=[];
    const result=await attendenceModel.findOne({staffId:req.user.id});
    let hrPeople=await hrmodel.findOne({id:req.user.id});
    let acPeople=await academicMemberModel.findOne({id:req.user.id});
   let requests=await requestsModel.findOne({id:req.user.id});
   let person; 
   let dayoff   
     let remaining=0;
     if(result.staffId.includes("hr-")){
       person=hrPeople}
       else{
         person=acPeople
       }
       if (person&& person.dayOff){
         dayoff=getDay(person.dayOff);
       }
       let pointer1=0;
       let pointer2=0;
     // console.log(dayoff)
   
     let current=startDate;

     if(!((new Date(current)).getDay()=="5"||(new Date(current)).getDay()==dayoff )){
       
 remaining+=8.4;
     }
       while(pointer1<result.signIn.length&&pointer2<result.signOut.length){
        let point1=new Date(result.signIn[pointer1]);
        point1.setTime(  result.signIn[pointer1].getTime() + result.signIn[pointer1].getTimezoneOffset()*60*1000 );
        let point2=new Date(result.signOut[pointer2]);
        point2.setTime(  result.signOut[pointer2].getTime() + result.signOut[pointer2].getTimezoneOffset()*60*1000 );    
         
      
  if((new Date(point1)).getTime()>=startDate.getTime()&&(new Date(point1)).getTime()<=endDate.getTime()
        &&(new Date(point1)).getHours()>=7&&((new Date(point1)).getHours()<=18)){
         
         if(!((current.getDate()==(new Date(point1)).getDate()&&current.getMonth()==(new Date(point1)).getMonth()&&
         current.getFullYear()==(new Date(point1)).getFullYear()))){
           current=new Date(point1);
          
           if(!(current.getDay()=="5"||current.getDay()==dayoff )){
           
             remaining+=8.4;
           }}
          

 if((new Date(point2)).getTime()>=startDate.getTime()&&(new Date(point2)).getTime()<=endDate.getTime()&&
 (new Date(point2)).getTime()>(new Date(point1)).getTime() &&(new Date(point2)).getHours()>=7){

if( (new Date(point2)).getDate()>(new Date(point1)).getDate()||
(new Date(point2)).getMonth()>(new Date(point1)).getMonth()||
(new Date(point2)).getFullYear()>(new Date(point1)).getFullYear()){
 pointer1=pointer1+1;
}
else if((pointer1+1<result.signIn.length)&&(
 new Date(result.signIn[pointer1+1])).getTime()>=(new Date(point1)).getTime()&&
 (new Date(result.signIn[pointer1+1])).getTime()<=(new Date(point2)).getTime()){
   pointer1=pointer1+1;
}
else{

 let endHour;
 let endminutes;
 if((new Date(point2)).getHours()>=19){
   endHour=19;
   endminutes=0
 }
 else{
   endHour=(new Date(point2)).getHours();
   endminutes=(new Date(point2)).getMinutes();
 }

 let hourstoadd=endHour-(new Date(point1)).getHours();
 hourstoadd=hourstoadd+(endminutes-((new Date(point1)).getMinutes()))/60;

remaining=remaining-hourstoadd;
 pointer2=pointer2+1;
 pointer1=pointer1+1;



}

 }    
  else{
  pointer2=pointer2+1;  }   
       }
        else{

          pointer1=pointer1+1;}
  if((new Date(point1)).getTime()>endDate.getTime()
    ){
break;
       }
       if((new Date(point2)).getTime()>endDate.getTime()
        ){
   break;
           }
     }if(remaining>0){
   absence.push(result.staffId);}
    
      dayoff="bla";
      
      console.log(req.user.id+"id")
      
      const compensation=await requestsModel.find({ $and:[{from:req.user.id},{type:'compensation leave'},{status: 'accepted'}]});
      console.log(compensation+"comp")
      if(compensation){
        for(let i=0;i<compensation.length;i++){
        const attend=[]
   for(var k=0;k<result.signIn.length;k++){
    elementTime=new Date(result.signIn[k]);
     elementTime.setTime( elementTime.getTime() +elementTime.getTimezoneOffset()*60*1000 );  
 
   if( elementTime.getMonth()==compensation[i].dateOfRequest.getMonth() && 
     elementTime.getFullYear()==compensation[i].dateOfRequest.getFullYear()&&
     elementTime.getDate()==compensation[i].dateOfRequest.getDate()&&
     elementTime.getHours()>=7&&
     elementTime.getHours()<=18 ){ 
attend.push(elementTime)}
      }
  
const attend2=[]
for(var k=0;k<result.signIn.length;k++){
 
  elementTime=new Date(result.signOut[k]);
   elementTime.setTime( elementTime.getTime() +elementTime.getTimezoneOffset()*60*1000 );  
   let timeExist=false;
   for(let l=0;l<attend.length;l++){
     if(((new Date(attend[l])).getTime()) < elementTime.getTime()){
   timeExist=true;
   }}
 if( elementTime.getMonth()==compensation[i].dateOfRequest.getMonth() && 
   elementTime.getFullYear()==compensation[i].dateOfRequest.getFullYear()&&
   elementTime.getDate()==compensation[i].dateOfRequest.getDate()&&
   elementTime.getHours()>=7&&
   elementTime.getHours()<=18&&timeExist ){ 
attend2.push(result.signOut[k])}
    }
if(attend2.length>0){
console.log(attend2)
        remaining=remaining+8.4;}
      }}
      let remainderHours=remaining+"hours"
  res.send(remainderHours);}
         catch(err){
           console.log(err);
           res.status(500).json({
             error: err
           });
       }
     }
     );
    function getDay(day) {
    if(day=="Sunday")
    return "0";
    if(day=="Monday")
    return "1";
    if(day=="Tuesday")
    return "2";
    if(day=="Wednesday")
    return "3";
    if(day== "Thursday")
    return "4";
    if(day== "Saturday")
    return "6";


    
    }



    module.exports = router;