const express = require('express')
const router = express.Router()
const requestsModel = require('../models/requests.model')
const academicMemberModel = require('../models/academicMember.model')
const  slotsModel = require('../models/slots.model')
const courseModel=require('../models/course.model')
const departementModel=require('../models/department.model')
const locationModel=require('../models/location.model')
const { requestStatus,requestType, days } = require('../api/enums')
const notificationModel = require('../models/notification.model')
const scheduleModel=require("../models/schedule.model")
const leavesModel=require("../models/leaves.model")
const replacementModel = require('../models/replacements.model')


const {
  validateAcceptReplacementRequest,
  validateAcceptSlotLinkingRequest,
  validateAddSlot,
  validateCancelRequest,
  validateDeleteSlot,
  validateRejectReplacementRequest,
  validateRejectSlotLinkingRequest,
  validateSendAccidentalLeaveRequest,
  validateSendAnnualLeaveRequest,
  validateSendChangeDayOffRequest,
  validateSendCompensationLeaveRequest,
  validateSendMaternityLeaveRequest,
  validateSendReplacementRequest,
  validateSendSickLeaveRequest,
  validateSendSlotLinkingRequest,
  validateUpdateSlot,


}
=require('../middleware/requests.validation')



router.get('/viewNotifications',
async (req, res) => {
    try {
       const notifications = await notificationModel.find({academicMember:req.user.id})
     
            return res.json({
              statusCode:0,
              msg:"success",
                notifications
                
            })
         
        

    } catch (exception) {
      return res.json({
        error: 'Something went wrong',
        exception
      })
    }
  }
   
  )

router.post('/sendReplacementRequest',validateSendReplacementRequest,
  async (req, res) => {
    try {
      const reciever = req.body.to;
      const slot = req.body.slot;
      const date=req.body.dateOfRequest
     

      if(!reciever ||reciever.length===0){
        return res.json({
          statusCode:1,
          error:'please enter the replacement member you want to replace with',
         })  
      }

      if(reciever===req.user.id){
        return res.json({
          statusCode:1,
          error:'you canot sent request to yourself',
         })  
      }

      if(!slot ||slot.length===0){
        return res.json({
          statusCode:1,
          error:'please enter the slot id',
         })  
      }

      reciever1 = await academicMemberModel.find({
        id: reciever
      })
      sender1 = await academicMemberModel.find({
        id: req.user.id
      })

      slot1 = await slotsModel.find({
        _id: slot
      })

      if(slot1.length===0){
        return res.json({
          statusCode:1,
          error:'this is not a valid slot id',
         })  
      }

      if(reciever1.length===0|| !reciever1){
        return res.json({
          statusCode:1,
          error:'you are not sending request to a valid member',
         })  
      }
        
      senderCourses = sender1[0].courses.filter((c) => {

        if (c === slot1[0].course) {
          return slot1[0].course
        }
      })

     if(slot1[0].academicMember!=req.user.id){
      return res.json({
        statusCode:1,
        error: 'you are not teaching this slot ',
      })
     }
      recieverCourses = reciever1[0].courses.filter((c) => {
        if (c === slot1[0].course) {
          return slot1[0].course
        }
      })
      

            if (recieverCourses.length === 0) {
            return res.json({
              statusCode:1,
              error: 'You should send request to someone teaching this course ',
            })
          }

      var recieverSlots=(await scheduleModel.find({academicMember:reciever}))[0].slots

      recieverSlots=recieverSlots.filter((s)=>{
        if (s.day === slot1[0].day && s.order===slot1[0].order) {
          return s
        }
      })

      console.log(recieverSlots)
             
      if(recieverSlots.length!=0){
        return res.json({
          statusCode:1,
          error: 'the member you are sending to have teaching in this slot,try another free member',
        })
      }
       
            const request = new requestsModel({
              from: req.user.id,
              to: reciever,
              type: requestType.REPLACEMENT,
              reason: req.body.reason,
              status: requestStatus.PENDING,
              slot: slot,
              dateOfRequest:date
            })
            request.save();

            const reqq= await requestsModel.find({from: req.user.id, to: reciever, type: requestType.REPLACEMENT,reason: req.body.reason,status: requestStatus.PENDING,slot: slot})

            var notification=new notificationModel({
              academicMember:reciever,
              request:reqq[0]._id,
              message:"you have a new replacement request open your requests to view details"
              
            })
            notification.save()
            return res.json({
              statusCode:0,
              msg: 'request created successfully',
              request
            })

    } catch (exception) {
      return res.json({
        error: 'Something went wrong',
        exception
      })
    }
  }

)

router.get('/viewSentReplacementRequest',
  async (req, res) => {
    try {
      const requests =await requestsModel.find({to: req.user.id,type:requestType.REPLACEMENT})
      return res.json({
        statusCode:0,
        msg: ' success',
        requests
      })
    } catch (exception) {
      return res.json({
        error: 'Something went wrong',
        exception
      })
    }
  }

)


router.get('/viewRecievedReplacementRequest',
  async (req, res) => {
    try {
      const requests=await requestsModel.find({from: req.user.id ,type:requestType.REPLACEMENT})

      return res.json({
        statusCode:0,
        msg: ' success',
        requests
      })
    } catch (exception) {
      return res.json({
        error: 'Something went wrong',
        exception
      })
    }
  }
)



router.post('/sendSlotLinkingRequest',validateSendSlotLinkingRequest,

  async (req, res) => {
    try {
        const slot=req.body.slot;
        const slot1=await slotsModel.find({_id:slot});
        const sender1= await academicMemberModel.find({id:req.user.id})
      if (slot1.length === 0) {
        return res.json({
          statusCode:1,
          error: 'this slot does not exist',
        })
      }
      //console.log(sender1[0].courses)
      //console.log(slot1[0].course)

        senderCourses = sender1[0].courses.filter((c) => {
          if (c === slot1[0].course) {
            return c
          }
        })
       
        if (senderCourses.length === 0) {
          return res.json({
            statusCode:1,
            error: 'you donot teach this course',
          })

         
        }
        if(slot1[0].academicMember!='undefined'){
          return res.json({
            statusCode:1,
            error: 'this slot is already linked to another member',
          })       
        }
      var mySlots=((await scheduleModel.find({academicMember:req.user.id}))[0]).slots
      
      mySlots=mySlots.filter((s)=>{
        if (s.day === slot1[0].day && s.order===slot1[0].order) {
          return s
        }
      })

      if(mySlots.length!=0){
        return res.json({
          statusCode:1,
          error: 'you already have teaching in this time,you canot have two slots at the same time',
        })
      }


          const course = await courseModel.find({
            name: slot1[0].course
          })
          const request = new requestsModel({
            from: req.user.id,
            to: course[0].coordinator,
            type: requestType.SLOT_LINKING,
            status: requestStatus.PENDING,
            slot: slot,
            reason:req.body.reason
          })
          request.save();
          return res.json({
            statusCode:0,
            msg: 'request created successfully',
            request
          })
        

    } catch (exception) {
      return res.json({
        error: 'Something went wrong',
        exception
      })
    }
  }

)



router.post('/sendChangeDayOffRequest',validateSendChangeDayOffRequest,
  async (req, res) => {
    try {
      const dayOff = req.body.day;
      const sender1 = await academicMemberModel.find({id: req.user.id})
      var mySlots=(await scheduleModel.find({academicMember:req.user.id}))[0].slots

      mySlots=mySlots.filter((s)=>{
        if (s.day===dayOff) {
          return s
        }
      })
     
        console.log(mySlots)
      if(mySlots.length!=0){
        return res.json({
          statusCode:1,
          error: 'you already have teaching in this day you canot change day off to a day where you have teaching in',
        })
      }
      
      const dep = await departementModel.find({
        name: sender1[0].department
      })

     
      const request = new requestsModel({
        from: req.user.id,
        to: dep[0].HOD,
        type: requestType.CHANGE_DAY_OFF,
        reason: req.body.reason,
        status: requestStatus.PENDING,
        dayOff: dayOff,
      })
      request.save()

      return res.json({
        statusCode:0,
        msg: 'request created successfully',
        request
      })

    } catch (exception) {
      return res.json({
        error: 'Something went wrong',
        exception
      })
    }
  }

)



  router.post('/sendAnnualLeaveRequest',validateSendAnnualLeaveRequest,
async (req, res) => {
    try {
        const reason=req.body.reason;
        const replacements=req.body.replacements
        const requestIds=req.body.requests
        const date=req.body.date;
        const sender1= await academicMemberModel.find({id:req.user.id})
        const dep=await departementModel.find({name:sender1[0].department})
        var replacements2=0;

        var datereq = new Date(date);  // dateStr you get from mongodb
            
       var d = datereq.getDate();
       var m = datereq.getMonth()+1;
       var y=datereq.getFullYear()

      

       var datetoday=new Date(Date.now())

       var d1 = datetoday.getDate();
       var m1 = datetoday.getMonth()+1;
       var y1=datetoday.getFullYear()

      // console.log("date of request" )
      // console.log(d)
      // console.log(m)
      // console.log(y)
      // console.log("date now" )
      // console.log(d1)
      // console.log(m1)
      // console.log(y1)


        if(y1>y||(y1===y && m<m1) || (y1===y && m===m1 &&d<d1)){
          return res.json({
            statusCode:1,
            error: 'annual leave should be submitted before targeted day',
          })
        }
               if( replacements && requestIds && replacements.length>requestIds.length){
                return res.json({
                  statusCode:1,
                  error: 'you should enter request Ids for all the members fro your request to be valid',
                })
               }

               if(  replacements && requestIds && replacements.length<requestIds.length){
                return res.json({
                  statusCode:1,
                  error: 'you should specify the member Id for every request you enter',
                })
               }


               if( replacements && !requestIds){
                return res.json({
                  statusCode:1,
                  error: 'you should enter request Ids for all the members fro your request to be valid',
                })
               }

               if(  !replacements && requestIds){
                return res.json({
                  statusCode:1,
                  error: 'you should specify the member Id for every request you enter',
                })
               }

               if((replacements!=null && replacements.length>0)){
                for(const x of replacements){
                  const rep=await academicMemberModel.find({id:x})
                  if(rep && rep.length>0){
                               replacements2++;
                  }
                }
               }
               if( replacements && replacements2!=replacements.length){
                 return res.json({
                   statusCode:1,
                   error: ' some Member IDs are  not a valid IDs',
                 })
               }


          if(requestIds!=null && requestIds.length>0){
           for(const x of requestIds)
          var requ=await requestsModel.find({_id:x})
             console.log(requ)
          if(!requ || requ.length===0){
            return res.json({
              statusCode:1,
              error:' some request IDs  are not valid request ID make sure then reSend Request ',
            })
          }
          else{
            if(await requ[0].from!=req.user.id){
              return res.json({
                statusCode:1,
                error: ' some request IDs does not belong to you (not sent by you)  ',
              })
            }
              if(await requ[0].type!=requestType.replacementRequests){
                return res.json({
                  statusCode:1,
                  error: ' some request IDs are not Ids of replacement requests ',
                })
              }
            if(await requ[0].status!=requestStatus.ACCEPTED){
              return res.json({
                statusCode:1,
                error: ' some requests  not a accepted yet ',
              })
            }
          }
      }
           
     

            const request=new requestsModel({
              from:req.user.id,
              to:dep[0].HOD,
              type:requestType.ANNUAL_LEAVE,
              reason:reason,
              status:requestStatus.PENDING,
              replacementMembers:replacements,
              replacementRequests:requestIds,
              dateOfRequest:date,
            })
              request.save();
                  return res.json({
                    statusCode:0,
                   msg:'request created successfully',
                         request
                  })  

    } catch (exception) {
      return res.json({
        error: 'Something went wrong',
        exception
      })
    }
  }
   
  )


  router.post('/sendAccidentalLeaveRequest',validateSendAccidentalLeaveRequest,
  async (req, res) => {
      try {
          const reason=req.body.reason;
          const date=req.body.date;
          const sender1= await academicMemberModel.find({id:req.user.id})
          const dep=await departementModel.find({name:sender1[0].department})
        //  const leaves=await leavesModel.find({academicMember:req.user.id})
           
          if(sender1[0].accidentalLeaves>=6){
            return res.json({
              statusCode:1,
              error:'you canot send accidental leaves any more you already consumed your annual accidental leave balance',
             })  
          }
          
              const request=new requestsModel({
                from:req.user.id,
                to:dep[0].HOD,
                type:requestType.ACCIDENTAL_LEAVE,
                reason:reason,
                status:requestStatus.PENDING,
                dateOfRequest:date,
              })
                request.save();
                    return res.json({
                      statusCode:0,
                     msg:'request created successfully',
                           request
                    })  
  
      } catch (exception) {
        return res.json({
          error: 'Something went wrong',
          exception
        })
      }
    }
     
    )

    router.post('/sendSickLeaveRequest',validateSendSickLeaveRequest,
async (req, res) => {
    try {
        const reason=req.body.reason;
        const date=req.body.date;
        const documents=req.body.documents;
        const sender1= await academicMemberModel.find({id:req.user.id})
        const dep=await departementModel.find({name:sender1[0].department})


        var datereq = new Date(date);  // dateStr you get from mongodb
            
       var d = datereq.getDate();
       var m = datereq.getMonth()+1;
       var y=datereq.getFullYear()

       if((d+3)>30){
         d=(d+3)%30
          if((m+1)>12){
            m=(m+1)%12
            y++;
          }
          else{
            m=m+1;
          }
       }
       else{
         d+=3
       }


       var datetoday=new Date(Date.now())

       var d1 = datetoday.getDate();
       var m1 = datetoday.getMonth()+1;
       var y1=datetoday.getFullYear()

        if(y1>y||(y1===y && m<m1) || (y1===y && m===m1 &&d<d1 )){
          return res.json({
            statusCode:1,
            error: 'sick leave should be sumbitted within 3 days  of the day you were sick',
          })
        }

        if(!documents || documents.length===0 ){
          return res.json({
            statusCode:1,
            error: 'you should submit necessary documents',
          })
        }

            const request=new requestsModel({
              from:req.user.id,
              to:dep[0].HOD,
              type:requestType.SICK_LEAVE,
              reason:reason,
              status:requestStatus.PENDING,
              dateOfRequest:date,
              documentsDriveLink:documents
            })
              request.save();
                  return res.json({
                    statusCode:0,
                   msg:'request created successfully',
                         request
                  })  

    } catch (exception) {
      return res.json({
        error: 'Something went wrong',
        exception
      })
    }
  }
   
  )


  router.post('/sendMaternityLeaveRequest',validateSendMaternityLeaveRequest,
async (req, res) => {
    try {
        const reason=req.body.reason;
        const date=req.body.date;
        const documents=req.body.documents;
        const sender1= await academicMemberModel.find({id:req.user.id})
        const dep=await departementModel.find({name:sender1[0].department})
        var datereq = new Date(date);
        var d = datereq.getDate();
        var m = datereq.getMonth()+1;
        var y=datereq.getFullYear()  
          if((m+3)>12){
            m=(m+3)%12
            y++;
          }
          else{
            m=m+3;
          }
       


       var datetoday=new Date(Date.now())

       var d1 = datetoday.getDate();
       var m1 = datetoday.getMonth()+1;
       var y1=datereq.getFullYear()

        if(y1>y||(y1===y && m<m1)||(y===y1&& m1<=m && d1>d) ){
          return res.json({
            statusCode:1,
            error: 'matrenity leave should be submitted within 3 month',
          })
        }

        if(!documents || documents.length===0 ){
          return res.json({
            statusCode:1,
            error: 'you should submit necessary documents to proove metrinity condition',
          })
        }

        if(sender1[0].gender!='female'){
          return res.json({
            statusCode:1,
            error: 'maternity leaves should only be submitted by female staff members',
          })
        }

            const request=new requestsModel({
              from:req.user.id,
              to:dep[0].HOD,
              type:requestType.MATERNITY_LEAVE,
              reason:reason,
              status:requestStatus.PENDING,
              dateOfRequest:date,
              documentsDriveLink:documents
            })
              request.save();
                  return res.json({
                    statusCode:0,
                   msg:'request created successfully',
                         request
                  })  

    } catch (exception) {
      return res.json({
        error: 'Something went wrong',
        exception
      })
    }
  }
   
  )

  router.post('/sendCompensationLeaveRequest',validateSendCompensationLeaveRequest,
async (req, res) => {
    try {
        const reason=req.body.reason;
        const date=req.body.date;
        const compensationDay=req.body.compensationDay
        const sender1= await academicMemberModel.find({id:req.user.id})
        const dep=await departementModel.find({name:sender1[0].department})

        if(!reason ||reason===''|| reason.length===0){
          return res.json({
            statusCode:1,
            error: 'you should submit a reason for you compensation leave',
          })
        }

            const request=new requestsModel({
              from:req.user.id,
              to:dep[0].HOD,
              type:requestType.COMPENSATION_LEAVE,
              reason:reason,
              status:requestStatus.PENDING,
              dateOfRequest:date,
              compensationDay:compensationDay
            })
              request.save();
                  return res.json({
                    statusCode:0,
                   msg:'request created successfully',
                         request
                  })  

    } catch (exception) {
      return res.json({
        error: 'Something went wrong',
        exception
      })
    }
  }

)

router.get('/viewAllSubmittedRequests',
  async (req, res) => {
    try {
      const requests = await requestsModel.find({
        from: req.user.id
      })
      if (requests.length === 0) {
        return res.json({
          statusCode:1,
          error: 'you havenot submitted any requests',
        })

      } else {
        return res.json({
          statusCode:0,
          msg: 'success',
          requests
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


router.get('/viewAllAcceptedRequests',
  async (req, res) => {
    try {
      // if(req.user.role!="teachingAssistant" && req.user.role!="coordinator"){
      //   return res.json({
      //     error:'only a TA or an Academic coordinator can use this function',
      //    })  
      // }
        var requests= await requestsModel.find({from:req.user.id})
        //console.log(Date.now().getDate())
        requests=requests.filter((r)=>{
          if(r.status===requestStatus.ACCEPTED){
          return r;
        }
      })

      if (requests.length === 0) {
        return res.json({
          statusCode:1,
          error: 'you donot have accepted requests',
        })

      } else {
        return res.json({
          statusCode:0,
          msg: 'success',
          requests
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


router.get('/viewAllRejectedRequests',
  async (req, res) => {
    try {
      var requests = await requestsModel.find({
        from: req.user.id
      })

      requests = requests.filter((r) => {
        if (r.status === requestStatus.REJECTED) {
          return r;
        }
      })

      if (requests.length === 0) {
        return res.json({
          statusCode:1,
          error: 'you donot have rejected requests',
        })

      } else {
        return res.json({
          statusCode:0,
          msg: 'success',
          requests
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



router.get('/viewAllPendingRequests',
  async (req, res) => {
    try {
       var requests = await requestsModel.find({
        from: req.user.id
      })

      requests = requests.filter((r) => {
        if (r.status === requestStatus.PENDING) {
          return r;
        }
      })

      if (requests.length === 0) {
        return res.json({
          statusCode:1,
          error: 'you donot have pending requests',
        })

      } else {
        return res.json({
          statusCode:0,
          msg: 'success',
          requests
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

    router.put('/cancelRequest',validateCancelRequest,
    async (req, res) => {
      try {
              const request=req.body.request;
              const request1=await requestsModel.find({_id:request})
            
              if(request1.length===0){
                return res.json({
                  statusCode:1,
                  error: 'there is no request with this id',
                })
              }
              const reqSender=request1[0].from
              if(reqSender!=req.user.id){
                return res.json({
                  statusCode:1,
                  error: 'You Canot cancel a request not sent by you',
                })
              }


              if(request1[0].status===requestStatus.PENDING){
               request1[0].status=requestStatus.CANCELED
                await requestsModel.findByIdAndUpdate(request, {status:requestStatus.CANCELED})
                return res.json({
                  statusCode:0,
                  msg: 'cancelled successfully',
                  request1
                })
              }


              if(request1[0].status===requestStatus.PENDING){
               // console.log("pending")
               request1[0].status=requestStatus.CANCELED
                await requestsModel.findByIdAndUpdate(request, {status:requestStatus.CANCELED})
                return res.json({
                  statusCode:0,
                  msg: 'cancelled successfully',
                  request1
                })
              }

                if(request1[0].dateOfRequest> Date.now()){
                  request1[0].status=requestStatus.CANCELED
                  await requestsModel.findByIdAndUpdate(request, {status:requestStatus.CANCELED})
                return res.json({
                  statusCode:0,
                  msg: 'cancelled successfully',
                  request1
                })
              }
              return res.json({
                     statusCode:1,
                error: 'you can only cancel a request which is still pending or a request whose day is yet to come',
              })

    } catch (exception) {
          return res.json({
            error: 'Something went wrong',
            exception
          })
        }
      }
       
      )


      router.post('/rejectReplacementRequest',validateRejectReplacementRequest,
    async (req, res) => {
      try {
        const request=req.body.request

        const request1=await requestsModel.find({_id:request})

        if(!request1 || request1.length===0){
          return res.json({
            statusCode:1,
            error:'this is not a valid request id',
           })  
        }

        if( request1[0].to!=req.user.id){
          return res.json({
            statusCode:1,
            error:'you canot reject a request not sent to you',
           })  
        }

        await requestsModel.findByIdAndUpdate(request, {status:requestStatus.REJECTED})
        var notification=new notificationModel({
          academicMember:request1[0].from,
          request:request,
          message:"sorry this request is rejected ,open your request"
        })
        notification.save()
        
                  return res.json({
                    statusCode:0,
                   msg:'succefully rejected request',
                  })  

                
  
    } catch (exception) {
          return res.json({
            error: 'Something went wrong',
            exception
          })
        }
      }
       
      )


      router.post('/acceptReplacementRequest',validateAcceptReplacementRequest,
      async (req, res) => {
        try {
          const request=req.body.request
  
          const request1=await requestsModel.find({_id:request})
  
          if(!request1 || request1.length===0){
            return res.json({
              statusCode:1,
              error:'this is not a valid request id',
             })  
          }
  
          if( request1[0].to!=req.user.id){
            return res.json({
              statusCode:1,
              error:'you canot accept a request not sent to you',
             })  
          }
          var x=new replacementModel({
            academicMember:request1[0].to,
            slot:request1[0].slot
          }) 
          x.save()

          await requestsModel.findByIdAndUpdate(request, {status:requestStatus.ACCEPTED})
          var notification=new notificationModel({
            academicMember:request1[0].from,
            request:request,
            message:"this request is accepted successfully"
          })
          notification.save()
          
                    return res.json({
                      statusCode:0,
                     msg:'succefully accepted request',
                    })  
  
                  
    
      } catch (exception) {
            return res.json({
              error: 'Something went wrong',
              exception
            })
          }
        }
         
        )



////////////////////////////////////////////////////////////////COORDINATOR ROLES/////////////////////////////////////////////////////////////



router.get('/viewAllSlotLinkingRequests',
  async (req, res) => {
    try {
      const sender1=await academicMemberModel.find({id:req.user.id})

      const member=await academicMemberModel.find({id:req.user.id})
      if(member[0].role!='coordinator'){
        return res.json({
          statusCode:1,
          error:'only coordinators are allowed to add slots',
         }) 
      }
      
      if( sender1.length===0||req.user.role!='coordinator'){
        return res.json({
          statusCode:1,
          error:'you cannot view slot linking request as you are not a coordinator',
         })  
      }
      console.log("taraarara")
      var requests= await requestsModel.find({to:req.user.id,type:requestType.SLOT_LINKING})
                return res.json({
                  statusCode:0,
                 msg:'success',
                       requests
                })  

  } catch (exception) {
        return res.json({
          error: 'Something went wrong',
          exception
        })
      }
    }
     
    )




  router.post('/addSlot',validateAddSlot,
  async (req, res) => {
    try {
      const startTime=req.body.startTime
      const endTime=req.body.endTime
      const day=req.body.day
      const location=req.body.location
      const order=req.body.order
      const course=req.body.course

      const member=await academicMemberModel.find({id:req.user.id})
      if(member[0].role!='coordinator'){
        return res.json({
          statusCode:1,
          error:'only coordinators are allowed to add slots',
         }) 
      }

      const loc=await  locationModel.find({name:location})
      if(!loc || loc.length===0){
        return res.json({
          statusCode:1,
          error:'this is not a valid location in the university',
         })  
      }

      const sender1=await  academicMemberModel.find({id:req.user.id,role:"coordinator"})

    
     // console.log("alalal")
     
      const course1=await courseModel.find({coordinator:req.user.id})
      if(course1.length===0){
        return res.json({
          statusCode:1,
          error:'there is no courses that you are currently coordinating ',
         })  
      }
      if(course1[0].name!=course){
        return res.json({
          statusCode:1,
          error:'you could not add a slot in a course you are not coordinating',
         })  
      }
             console.log("tatatat")
      if(day==='friday'){
        return res.json({
          statusCode:1,
          error:'you could not add a slot on friday it should be vacation',
         })  
      }
      const courseN=course1[0].name

      const slot=await  slotsModel.find({day:day,location:location,order:order})
      if(slot.length!=0){
        return res.json({
          statusCode:1,
          error:'there is a slot in this time in this location please choose valid location or different time ',
         })  
      }

      var slot1=new slotsModel({
        startTime:startTime,
        endTime:endTime,
        day:day,
        course:courseN,
        location:location,
        order:order,
      })
      slot1.save();
  
                return res.json({
                  statusCode:0,
                 msg:'slot added successfully',
                       slot1
                })  

  } catch (exception) {
        return res.json({
          error: 'Something went wrong',
          exception
        })
      }
    }
     
    )





  router.put('/updateSlot',validateUpdateSlot,
  async (req, res) => {
    try {
      var startTime=req.body.startTime
      var endTime=req.body.endTime
      var day=req.body.day
      var location=req.body.location
      var order=req.body.order
      var slotId=req.body.slot
      var academicMember=req.body.academicMember

      const member=await academicMemberModel.find({id:req.user.id})
      if(member[0].role!='coordinator'){
        return res.json({
          statusCode:1,
          error:'only coordinators are allowed to update slots',
         }) 
      }

      const slot=await slotsModel.find({_id:slotId})

      if(!startTime||startTime=='undefined'){
        startTime=slot[0].startTime
      }
      if( !endTime|| endTime===''){
        endTime=slot[0].endTime
      }
      if(!day ||day===''){
        day=slot[0].day
      }
      if( !location ||location===''){
        location=slot[0].location
      }
      console.log("yaya")
      if(!order ||order===''){
        order=slot[0].order
      }
      if(!academicMember|| academicMember===''){
        academicMember=slot[0].academicMember
      }
      console.log("beeeeb")

      const loc=await  locationModel.find({name:location})
      if(!loc || loc.length===0){
        return res.json({
          statusCode:1,
          error:'this is not a valid location in the university',
         })  
      }

      const sender1=await  academicMemberModel.find({id:req.user.id,role:"coordinator"})
      console.log(sender1)
      console.log(sender1.length===0)

      if(sender1.length===0||sender1[0].role!='coordinator'){
        return res.json({
          statusCode:1,
          error:'you cannot update slots as you are not a coordinator',
         })  
      }
     
      const course=await  courseModel.find({coordinator:req.user.id})
      if(course.length===0){
        return res.json({
          statusCode:1,
          error:'there is no courses that you are currently coordinating ',
         })  
      }

      if(course[0].name!=slot[0].course){
        return res.json({
          statusCode:1,
          error:'you could not update a slot in a course you are not coordinating',
         })  
      }


      if(day==='friday'){
        return res.json({
          statusCode:1,
          error:'you could not add a slot on friday it should be vacation',
         })  
      }

      const courseN=course[0].name
     // console.log("nannananna")

      const slot1=await slotsModel.find({day:day,location:location,order:order})
     // console.log(slot)
      if(slot1.length!=0){
        return res.json({
          statusCode:1,
          error:'there is a slot in this time in this location please choose valid location or different day ',
         })  
      }
      
     
     await slotsModel.findByIdAndUpdate(slotId, {startTime:startTime,endTime:endTime,day:day,location:location,order:order,academicMember:academicMember})
      //console.log(slot1[0])
     if(slot[0].academicMember!='undefined'){
        // console.log("an agwa")
     var myUpdatedSlot=await slotsModel.find({_id:slotId})
      var allSchedules =await scheduleModel.find()   
      allSchedules=allSchedules.filter( async(s)=>{
      var sl=s.slots
      sl=sl.filter((x)=>{
        if(x._id==slotId){
        }
        else{
          return x
        }
      })
      sl.push(myUpdatedSlot[0])
     // console.log(sl)
        await scheduleModel.findOneAndUpdate({academicMember:s.academicMember},{slots:sl})
      })
    }
 
     
                return res.json({
                  statusCode:0,
                 msg:'slot updated successfully',
                }) 
                
            

  } catch (exception) {
        return res.json({
          error: 'Something went wrong',
          exception
        })
      }
    }
     
    )


    router.delete('/deleteSlot',validateDeleteSlot,
  async (req, res) => {
    try {
      const slotId=req.body.slot
      const sender1=await  academicMemberModel.find({id:req.user.id,role:"coordinator"})

      const member=await academicMemberModel.find({id:req.user.id})
      if(member[0].role!='coordinator'){
        return res.json({
          statusCode:1,
          error:'only coordinators are allowed to delete slots',
         }) 
      }

      if(sender1.length===0||sender1[0].role!='coordinator'){
        return res.json({
          statusCode:1,
          error:'you cannot delete slots as you are not a coordinator',
         })  
      }
     
      const course=await  courseModel.find({coordinator:req.user.id})
      if(course.length===0){
        return res.json({
          statusCode:1,
          error:'there is no courses that you are currently coordinating ',
         })  
      }
      const slot=await slotsModel.find({_id:slotId})

      if(course[0].name!=slot[0].course){
        return res.json({
          statusCode:1,
          error:'you could not delete a slot in a course you are not coordinating',
         })  
      }
      if(slot[0].academicMember!='undefined'){
         var allSchedules =await scheduleModel.find()   
         allSchedules=allSchedules.filter( async(s)=>{
         var sl=s.slots
         sl=sl.filter((x)=>{
           if(x._id==slotId){
           }
           else{
             return x
           }
         })
           await scheduleModel.findOneAndUpdate({academicMember:s.academicMember},{slots:sl})
         })
       }

      await slotsModel.findByIdAndDelete(slotId)
                return res.json({
                  statusCode:0,
                 msg:'slot deleted successfully',
                })  

  } catch (exception) {
        return res.json({
          error: 'Something went wrong',
          exception
        })
      }
    }
     
    )

    router.post('/acceptSlotLinkingRequest',validateAcceptSlotLinkingRequest,
    async (req, res) => {
      try {
        const request=req.body.request

        const request1=await requestsModel.find({_id:request})
        const sender1=await academicMemberModel.find({id:req.user.id,role:"coordinator"})

        const member=await academicMemberModel.find({id:req.user.id})
        if(member[0].role!='coordinator'){
          return res.json({
            statusCode:1,
            error:'only coordinators are allowed to accept slotlinking requests',
           }) 
        }

        if(!request1 || request1.length===0){
          return res.json({
            statusCode:1,
            error:'this is not a valid request id',
           })  
        }

        if( request1[0].type!=requestType.SLOT_LINKING){
          return res.json({
            statusCode:1,
            error:'this is not a slotLinking request',
           })  
        }
        //
  
        if(sender1.length===0||sender1[0].role!='coordinator'){
          return res.json({
            statusCode:1,
            error:'you cannot accept slotlinking requests as you are not a coordinator',
           })  
        }
       
        const course=await  courseModel.find({coordinator:req.user.id})
        if(course.length===0){
          return res.json({
            statusCode:1,
            error:'there is no courses that you are currently coordinating ',
           })  
        }

       // console.log(request1[0].slot)

        var slot=await slotsModel.find({_id:request1[0].slot})
        //console.log(slot)
        if(slot[0].course!=course[0].name){
          return res.json({
            statusCode:1,
            error:'you canot accept this request because it is related to a course that you are not coordinating ',
           })  
        }

        await requestsModel.findByIdAndUpdate(request, {status:requestStatus.ACCEPTED})
        slot[0].academicMember=request1[0].from
        console.log(request1[0].from)
        await scheduleModel.findOneAndUpdate({academicMember:request1[0].from},{$push:{slots:slot[0]}})
        //await slotsModel.findByIdAndUpdate(slot[0]._id,{academicMember:request1[0].from})
        //console.log("tata")

        var notification=new notificationModel({
          academicMember:request1[0].from,
          request:request,
          message:"this request is accepted "

        })
        notification.save()
        
                  return res.json({
                    statusCode:0,
                   msg:'succefully accepted request',
                  })  

                
  
    } catch (exception) {
          return res.json({
            error: 'Something went wrong',
            exception
          })
        }
      }
       
      )


    router.post('/rejectSlotLinkingRequest',validateRejectSlotLinkingRequest,
    async (req, res) => {
      try {
        const request=req.body.request

        const request1=await requestsModel.find({_id:request})
        const sender1=await academicMemberModel.find({id:req.user.id,role:"coordinator"})

        const member=await academicMemberModel.find({id:req.user.id})
        if(member[0].role!='coordinator'){
          return res.json({
            statusCode:1,
            error:'only coordinators are allowed to reject slot linking requests',
           }) 
        }

        if(!request1 || request1.length===0){
          return res.json({
            statusCode:1,
            error:'this is not a valid request id',
           })  
        }

        if( request1[0].type!=requestType.SLOT_LINKING){
          return res.json({
            statusCode:1,
            error:'this is not a slotLinking request',
           })  
        }
        //
  
        if(sender1.length===0||sender1[0].role!='coordinator'){
          return res.json({
            statusCode:1,
            error:'you cannot reject slotlinking requests as you are not a coordinator',
           })  
        }
       
        const course=await  courseModel.find({coordinator:req.user.id})
        if(course.length===0){
          return res.json({
            statusCode:1,
            error:'there is no courses that you are currently coordinating ',
           })  
        }

       // console.log(request1[0].slot)

        const slot=await slotsModel.find({_id:request1[0].slot})
        console.log(slot)
        if(slot[0].course!=course[0].name){
          return res.json({
            statusCode:1,
            error:'you canot reject this request because it is related to a course that you are not coordinating ',
           })  
        }
      //  console.log("alalla")

        await requestsModel.findByIdAndUpdate(request, {status:requestStatus.REJECTED})
        var notification=new notificationModel({
          academicMember:request1[0].from,
          request:request,
          message:"sorry this request is rejected open your request"
        })
        notification.save()
        
                  return res.json({
                    statusCode:0,
                   msg:'succefully rejected request',
                  })  

                
  
    } catch (exception) {
          return res.json({
            error: 'Something went wrong',
            exception
          })
        }
      }
       
      )








module.exports = router