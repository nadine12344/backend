*you need to add the first hr member manually in the datbase

######################################## ROKAYA ########################################

//////////////////////////////////////////////////////////////////////////////////////////////////////////
Functionality: for academic member to view schedule
Route: /schedule/viewSchedule
Request type: GET
Response(the sccedule with replacements if available):
{
    "msg": "success",
    "schedule": [
        {
            "_id": "5fe5d2a217d1163ebc3b9580",
            "academicMember": "ac-2",
            "slots": [
                {
                    "academicMember": "ac-2",
                    "_id": "5fe5bdcb48f1f75a545457fe",
                    "startTime": 10,
                    "endTime": 12,
                    "day": "monday",
                    "course": "math",
                    "location": "l1",
                    "order": "3rd",
                    "__v": 0
                }
            ],
            "__v": 0
        }
    ],
    "replacements": [
        {
            "_id": "5fe5d6fdbabba923780a56b7",
            "academicMember": "ac-1",
            "slot": "5fe5b18aed6e1a200c8b0d7a",
            "__v": 0
        }
    ]
}
//////////////////////////////////////////////////////////////////////////////////////////////
Functionality: for academic member to send replacement request
Route: /request/sendReplacementRequest
Request type: POST
Request body(the slot id the id of one you want to replace with and optionally a reason):
{
  "slot":"5fe5b18aed6e1a200c8b0d7a",  
  "to":"ac-2",
  "reason":"urgent"
}
Response(the created request):
   {
    "msg": "request created successfully",
    "request": {
        "replacementMembers": [],
        "_id": "5fe5d38541b4950f942a47af",
        "from": "ac-1",
        "to": "ac-2",
        "type": "replacement",
        "reason": "urgent",
        "status": "pending",
        "slot": "5fe5b18aed6e1a200c8b0d7a",
        "dateSubmitted": "2020-12-25T11:56:53.253Z",
        "__v": 0
    }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Functionality: for academic member to view repalcement requests sent by him
Route: /request/viewSentReplacementRequest
Request type: GET
Response(list of requests):
   {
    "msg": " success",
    "requests": [
        {
            "replacementMembers": [],
            "_id": "5fe5d2b817d1163ebc3b9581",
            "from": "ac-1",
            "to": "ac-2",
            "type": "replacement",
            "reason": "urgent",
            "status": "pending",
            "slot": "5fe5b18aed6e1a200c8b0d7a",
            "dateSubmitted": "2020-12-25T11:53:28.076Z",
            "__v": 0
        },
        {
            "replacementMembers": [],
            "_id": "5fe5d320c8ffc80f94ff08dc",
            "from": "ac-1",
            "to": "ac-2",
            "type": "replacement",
            "reason": "urgent",
            "status": "pending",
            "slot": "5fe5b18aed6e1a200c8b0d7a",
            "dateSubmitted": "2020-12-25T11:55:12.188Z",
            "__v": 0
        },
        {
            "replacementMembers": [],
            "_id": "5fe5d34d7e24523e14005286",
            "from": "ac-1",
            "to": "ac-2",
            "type": "replacement",
            "reason": "urgent",
            "status": "accepted",
            "slot": "5fe5b18aed6e1a200c8b0d7a",
            "dateSubmitted": "2020-12-25T11:55:57.285Z",
            "__v": 0
        },
        {
            "replacementMembers": [],
            "_id": "5fe5d38541b4950f942a47af",
            "from": "ac-1",
            "to": "ac-2",
            "type": "replacement",
            "reason": "urgent",
            "status": "pending",
            "slot": "5fe5b18aed6e1a200c8b0d7a",
            "dateSubmitted": "2020-12-25T11:56:53.253Z",
            "__v": 0
        }
    ]
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

Functionality: for academic member to view repalcement requests sent to him
Route: /request/viewrecievedReplacementRequest
Request type: GET
Response(list of requests):
   {
    "msg": " success",
    "requests": [
        {
            "replacementMembers": [],
            "_id": "5fe5d780babba923780a56b9",
            "from": "ac-2",
            "to": "ac-1",
            "type": "slot linking",
            "status": "accepted",
            "slot": "5fe5bdcb48f1f75a545457fe",
            "dateSubmitted": "2020-12-25T12:13:52.708Z",
            "__v": 0
        }
    ]
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Functionality: for academic member to send slotlinking request request
Route: /request/sendSlotLinkingRequest
Request type: POST
Request body(the slot id):
{
"slot":"5fd8f8139f79a23eecf3d785"
}
Response(the created request):
   {
    "msg": "request created successfully",
    "request": {
        "replacementMembers": [],
        "_id": "5fe5c2ad3ed6802028e40d90",
        "from": "ac-1",
        "to": "ac-1",
        "type": "slot linking",
        "status": "pending",
        "slot": "5fe5b18aed6e1a200c8b0d7a",
        "dateSubmitted": "2020-12-25T10:45:01.588Z"
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Functionality: for academic member to send change day off request
Route: /request/sendChangeDayOffRequest
Request type: POST
Request body(the day and the optional reason ):
{
"day":"tuesday",
"reason":"traffic jam"

}
Response(the created request):
 {
    "msg": "request created successfully",
    "request": {
        "replacementMembers": [],
        "_id": "5fe5dbe344c6532810597324",
        "from": "ac-2",
        "to": "hagar",
        "type": "change day off",
        "status": "pending",
        "dayOff": "tuesday",
        "reason":"traffic jam"
        "dateSubmitted": "2020-12-25T12:32:35.594Z"
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Functionality: for academic member to send annual leave request
Route: /request/sendAnnualLeaveRequest
Request type: POST
Request body(the date of request and the optional reason  and replacement members if available):
{
"date":"2020-12-18T17:00:21.826Z",
"reason":"traffic jam",
"replacements":["ac-1","ac-2"]
"requests":["5fda4ddc86909332a44a56cc","5fda4ddc86909332a44a55ch"]
}

Response(the created request):
   {
    "msg": "request created successfully",
    "request": {
        "replacementMembers": [
            "ac-1",
            "ac-2"
        ],
        "_id": "5fda4ddc86909332a44a55cc",
        "from": "ac-3",
        "to": "ac-3",
        "type": "anual leave",
        "reason": "sick",
        "status": "pending",
        "dateOfRequest": "2020-12-18T17:00:21.826Z",
        "dateSubmitted": "2020-12-16T18:11:40.207Z"
    }
}
////////////////////////////////////////////////////////////////////////////////

Functionality: for academic member to send accidental leave request
Route: /request/sendAccidentalLeaveRequest
Request type: POST
Request body(the date of request and the optional reason  ):
{
"date":"2020-12-18T17:00:21.826Z",
"reason": "accident",
}

Response(the created request):
   {
    "msg": "request created successfully",
    "request": {
        "replacementMembers": [],
        "_id": "5fe5dd5144c6532810597327",
        "from": "ac-2",
        "to": "hagar",
        "type": "Accidental leave",
        "reason": "accident",
        "status": "pending",
        "dateOfRequest": "2020-12-18T17:00:21.826Z",
        "dateSubmitted": "2020-12-25T12:38:41.409Z"
    }
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Functionality: for academic member to send sick leave request
Route: /request/sendSickLeaveRequest
Request type: POST
Request body(the date of request and the optional reason  ):

{
"date":"2020-12-18T17:00:21.826Z",
"reason":"traffic jam",
"documents":"https://drive.google.com/file/d/1615Jon8tEK7qoRlcQjqOcVlk03L2BN-V/view?usp=sharing"
}

Response(the created request):
   {
    "msg": "request created successfully",
    "request": {
        "replacementMembers": [],
        "_id": "5fda57e16696ff164433cb96",
        "from": "ac-2",
        "to": "hagar",
        "type": "sick leave",
        "reason": "traffic jam",
        "status": "pending",
        "dateOfRequest": "2020-12-18T17:00:21.826Z",
        "dateSubmitted": "2020-12-16T18:54:25.944Z",
        "documentsDriveLink":"https://drive.google.com/file/d/1615Jon8tEK7qoRlcQjqOcVlk03L2BN-V/view?usp=sharing"
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////
Functionality: for academic member to send metrinity leave request
Route: /request/sendMaternityLeaveRequest
Request type: POST
Request body(the date of request and the optional reason  ):
{
"date":"2020-12-18T17:00:21.826Z",
"reason":"bawled",
"documents":"https://drive.google.com/file/d/1615Jon8tEK7qoRlcQjqOcVlk03L2BN-V/view?usp=sharing"
}


Response(the created request):
   {
    "msg": "request created successfully",
    "request": {
        "replacementMembers": [],
        "_id": "5fda5acc51847d5c5cf9d9dc",
        "from": "ac-2",
        "to": "hagar",
        "type": "maternity leave",
        "reason": "bawled",
        "status": "pending",
        "dateOfRequest": "2020-12-18T17:00:21.826Z",
        "dateSubmitted": "2020-12-16T19:06:52.043Z",
        "documentsDriveLink":"https://drive.google.com/file/d/1615Jon8tEK7qoRlcQjqOcVlk03L2BN-V/view?usp=sharing"
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Functionality: for academic member to send compensation leave request
Route: /request/sendCompensationLeaveRequest
Request type: POST
Request body(the date of request and the  reason  ):
{
 "date":"2020-09-28",
 "reason":"accident",
 "compensationDay":"2020-12-30"
}


Response(the created request):
   {
    "msg": "request created successfully",
    "request": {
        "replacementMembers": [],
        "_id": "5fe5e46b0a88230878a935fe",
        "from": "ac-2",
        "to": "hagar",
        "type": "compensation leave",
        "reason": "accident",
        "status": "pending",
        "compensationDay": "2020-12-30T00:00:00.000Z",
        "dateOfRequest": "2020-09-28T00:00:00.000Z",
        "dateSubmitted": "2020-12-25T13:08:59.308Z"
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Functionality: for academic member to view requests sent by him
Route: /request/viewAllSubmittedRequests
Request type: GET
}
Response(array of requests):
   {
    "msg": "success",
    "requests": [
        {
            "replacementMembers": [],
            "_id": "5fda5acc51847d5c5cf9d9dc",
            "from": "ac-1",
            "to": "hagar",
            "type": "maternity leave",
            "reason": "bawled",
            "status": "pending",
            "dateOfRequest": "2020-12-18T17:00:21.826Z",
            "dateSubmitted": "2020-12-16T19:06:52.043Z",
            "documentsDriveLink":"https://drive.google.com/file/d/1615Jon8tEK7qoRlcQjqOcVlk03L2BN-V/view?usp=sharing",
            "__v": 0
        },
        {
            "replacementMembers": [],
            "_id": "5fda5d0dc8e1db13c8397273",
            "from": "ac-2",
            "to": "hagar",
            "type": "sick leave",
            "reason": "sick",
            "status": "pending",
            "dateOfRequest": "2020-12-18T17:00:21.826Z",
            "dateSubmitted": "2020-12-16T19:16:29.606Z",
            "__v": 0
        }
    ]
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Functionality: for academic member to view requests sent by him where status is accepted
Route: /request/viewAllAcceptedRequests
Request type: GET
}
Response(array of requests):
   {
    "msg": "success",
    "requests": [
        {
            "replacementMembers": [],
            "_id": "5fda5acc51847d5c5cf9d9dc",
             "from": "ac-2",
            "to": "hagar",
            "type": "accidental leave",
            "reason": "traffic jam",
            "status": "accepted",
            "dateOfRequest": "2020-12-18T17:00:21.826Z",
            "dateSubmitted": "2020-12-16T19:06:52.043Z",
            "__v": 0
        },
        {
            "replacementMembers": [],
            "_id": "5fda5d0dc8e1db13c8397273",
             "from": "ac-2",
            "to": "hagar",
            "type": "accidental leave",
            "reason": "traffic jam",
            "status": "accepted",
            "dateOfRequest": "2020-12-18T17:00:21.826Z",
            "dateSubmitted": "2020-12-16T19:16:29.606Z",
            "__v": 0
        }
    ]
}

/////////////////////////////////////////////////////////////////////////////////////////////////

Functionality: for academic member to view requests sent by him where status is rejected
Route: /request/viewAllRejectedRequests
Request type: GET
}
Response(array of requests):
   {
    "msg": "success",
    "requests": [
        {
            "replacementMembers": [],
            "_id": "5fda5acc51847d5c5cf9d9dc",
             "from": "ac-2",
            "to": "hagar",
            "type": "accidental leave",
            "reason": "traffic jam",
            "status": "rejected",
            "dateOfRequest": "2020-12-18T17:00:21.826Z",
            "dateSubmitted": "2020-12-16T19:06:52.043Z",
            "__v": 0
        },
        {
            "replacementMembers": [],
            "_id": "5fda5d0dc8e1db13c8397273",
           "from": "ac-2",
            "to": "hagar",
            "type": "accidental leave",
            "reason": "traffic jam",
            "status": "rejected",
            "dateOfRequest": "2020-12-18T17:00:21.826Z",
            "dateSubmitted": "2020-12-16T19:16:29.606Z",
            "__v": 0
        }
    ]
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
Functionality: for academic member to view requests sent by him where status is pending
Route: /request/viewAllPendingRequests
Request type: GET
}
Response(array of requests):
   {
    "msg": "success",
    "requests": [
        {
            "replacementMembers": [],
            "_id": "5fda5acc51847d5c5cf9d9dc",
             "from": "ac-2",
            "to": "hagar",
            "type": "accidental leave",
            "reason": "traffic jam",
            "status": "pending",
            "dateOfRequest": "2020-12-18T17:00:21.826Z",
            "dateSubmitted": "2020-12-16T19:06:52.043Z",
            "__v": 0
        },
        {
            "replacementMembers": [],
            "_id": "5fda5d0dc8e1db13c8397273",
            "from": "ac-2",
            "to": "hagar",
            "type": "accidental leave",
            "reason": "traffic jam",
            "status": "pending",
            "dateOfRequest": "2020-12-18T17:00:21.826Z",
            "dateSubmitted": "2020-12-16T19:16:29.606Z",
            "__v": 0
        }
    ]
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Functionality: for academic member to cancel request
Route: /request/cancelRequest
Request type: PUT
Request body(the date of request and the  reason  ):
{

    "request":"5fda5d0dc8e1db13c8397273"
}
Response(the cancelled request):
   {
    "msg": "cancelled successfully",
    "request1": [
        {
            "replacementMembers": [],
            "_id": "5fe5dd5144c6532810597327",
            "from": "ac-2",
            "to": "hagar",
            "type": "Accidental leave",
            "reason": "accident",
            "status": "canceled",
            "dateOfRequest": "2020-12-12T00:00:00.000Z",
            "dateSubmitted": "2020-12-25T12:38:41.409Z",
            "__v": 0
        }
    ]
}
///////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Functionality: for coordinator view all slot linking requests
Route: /request/viewAllSlotLinkingRequests
Request type: GET
Response(array of requests):
   {
    "msg": "success",
    "requests": [
        {
            "replacementMembers": [],
            "_id": "5fe5c39e3ed6802028e40d91",
            "from": "ac-1",
            "to": "ac-1",
            "type": "slot linking",
            "status": "pending",
            "slot": "5fe5b18aed6e1a200c8b0d7a",
            "dateSubmitted": "2020-12-25T10:49:02.508Z",
            "__v": 0
        },
        {
            "replacementMembers": [],
            "_id": "5fe5c39f3ed6802028e40d92",
            "from": "ac-1",
            "to": "ac-1",
            "type": "slot linking",
            "status": "pending",
            "slot": "5fe5b18aed6e1a200c8b0d7a",
            "dateSubmitted": "2020-12-25T10:49:03.636Z",
            "__v": 0
        },
        {
            "replacementMembers": [],
            "_id": "5fe5c3a03ed6802028e40d93",
            "from": "ac-1",
            "to": "ac-1",
            "type": "slot linking",
            "status": "accepted",
            "slot": "5fe5b18aed6e1a200c8b0d7a",
            "dateSubmitted": "2020-12-25T10:49:04.628Z",
            "__v": 0
        },
    ]
}
///////////////////////////////////////////////////////////////////////////////////////////////
Functionality: to add a slot
Route: /request/addSlot
Request type: POST
Request body(slot details  ):
{

  "startTime":10,
  "endTime":12,
  "day":"sunday",
  "order":"1st",
  "location":"l1",
  "course":"math"

}
Response(the added slot):
   {
    "msg": "slot added successfully",
    "slot1": {
        "academicMember": "undefined",
        "_id": "5fe5b18aed6e1a200c8b0d7a",
        "startTime": 10,
        "endTime": 12,
        "day": "sunday",
        "course": "math",
        "location": "l1",
        "order": "1st"
    }
   }
/////////////////////////////////////////////////////////////////////////////////////////////////////
Functionality: to update a slot
Route: /request/updateSlot
Request type: PUT
Request body(  slot details):
{
  "startTime":10,
  "endTime":12,
  "day":"monday",
  "order":"3rd",
  "location":"l1",
  "slot":"5fe5b213ed6e1a200c8b0d7b"
}
Response(success message):
   {
    "msg": "slot updated successfully"
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
Functionality: to delete a slot
Route: /request/deleteSlot
Request type: DELETE
Request body(  slot id):
{
        "slot":"5fdc8a217431d5129491b56e"
}
Response(success message):
   {
    "msg": "slot deleted successfully"
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
Functionality: to reject a slotlinking request
Route: /request/rejectSlotLinkingRequest
Request type: POST
Request body(slot details  ):
{
    "request":"5fd8faa3f54f8e4c9ce05e65"
}
Response(success messg):
   {
    "msg": "succefully rejected request"
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Functionality: to accept a slotlinking request
Route: /request/acceptSlotLinkingRequest
Request type: POST
Request body(slot details  ):
{
    "request":"5fd8faa3f54f8e4c9ce05e65"
}
Response(success msg):
   {
    "msg": "succefully accepted request"
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Functionality: to reject a replacement request
Route: /request/rejectReplacementRequest
Request type: POST
Request body(request id  ):
{
    "request":"5fd8faa3f54f8e4c9ce05e65"
}
Response(success msg):
   {
    "msg": "succefully rejected request"
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Functionality: to accept a replacement request
Route: /request/acceptReplacementRequest
Request type: POST
Request body(request id  ):
{
    "request":"5fd8faa3f54f8e4c9ce05e65"
}
Response(success mssg):
   {
    "msg": "succefully accepted request"
}


######################################## HAGAR ########################################
Functionality: make an academic member Instructor Route: /HOD/makeInstructor Request type: POST Request body: { "academicID" : "ac-1", "courseName":"CSEN704"} Response: Messages describing the status of the request like "you are not HOD : NOT AUTHORIZED" "Academic Id doesn't exist" "Course Name doesn't exist" "Academic is not in your department" "Course is not under your department" "instructor added"

Functionality: delete INstructor Route:/HOD/deleteInstructor Request type:POST Request body: { "academicID" : "ac-1", "courseName":"CSEN704"} Response:"you are not HOD : NOT AUTHORIZED" "Academic Id doesn't exist" "Course Name doesn't exist" "Academic is not in your department" "Course is not under your department" "instructor removed"

Functionality:updates instructor Route:/HOD/updateInstructor Request type:POST Request body: { "academicID" : "ac-1", "courseOld":"CSEN704","courseNew":"CSEN201"} Response:"Academic Id doesn't exist" "Old Course Name doesn't exist" "New Course Name doesn't exist" "Old Course is not under your department" "New Course is not under your department" "instructor updated"

Functionality:view staff by department Route:/HOD/viewStaffByDepartment Request type:GET Request body: NOTHING Response: array of academics in department like {id:"ac-1",name:"fjhsfkh",department:"CSEN"}

Functionality:view staff by course name Route:/HOD/viewStaffByCourseName Request type:POST Request body: {"courseName":"CSEN7777"} Response: array of academics in department and giving course like {id:"ac-1",name:"fjhsfkh",department:"CSEN"}

Functionality:view days off in department Route:/HOD/viewDaysOffInDepartment Request type:GET Request body: NOTHING Response:array of days off in department like ["Saturday","Monday"]

Functionality:view Change DayOff Requests in department Route:/HOD/viewChangeDayOffRequests Request type:GET Request body: NOTHING Response:array of change day off requests like [{from:"ac-1",to:"ac-2",type:"change day off", status:"rejected"}]

Functionality:view Leave Requests in department Route:/HOD/viewLeaveRequests Request type:GET Request body: NOTHING Response:array of leave requests like [{from:"ac-1",to:"ac-2",type:"change day off", status:"maternal leave"}]

Functionality: reject request in department Route:/HOD/rejectRequest Request type:POST Request body: {"_id":"509835737829859028vjnbf"} Response:message like "academic is not in your department" "request rejected successfully"

Functionality: accept request in department Route:/HOD/acceptRequest Request type:POST Request body: {"_id":"509835737829859028vjnbf"} Response:message like "academic is not in your department" "Leave Request Accepted" "Change Day off request accepted"

Functionality:get course coverages of courses in department Route:/HOD/courseCoverage Request type:GET Request body: NOTHING Response:array like [{Course: "CSEN7000", Coverage: ""66.4%}]

Functionality:get all teaching slots assigned to course Route:/HOD/teachingAssignmentsOfCourse Request type:POST Request body: {"courseName":"CSEN909"} Response:[{day:" saturday",academicMember:"ac-1",course:"CSEn66",order:"FIRST",..}]

Functionality:get course coverages of courses I am instructor for Route:/courseInstructor/courseCoverage Request type:GET Request body: NOTHING Response:array like [{Course: "CSEN7000", Coverage: ""66.4%}]

Functionality:get all teaching slots assigned to courses I am instructor for Route:/courseInstructor/slotsAssignment Request type:GET Request body: NOTHING Response:[{day:" saturday",academicMember:"ac-1",course:"CSEn66",order:"FIRST",..}]

Functionality:view staff in my department Route:/courseInstructor/viewStaffByDep Request type:GET Request body: NOTHING Response: array of academics in department like {id:"ac-1",name:"fjhsfkh",department:"CSEN"}

Functionality:view staff teaching at least one course of those I am instructor for Route:/courseInstructor/viewStaffByCourse Request type:GET Request body: {"courseName":"CSEN7777"} Response: array of academics in department and giving course like {id:"ac-1",name:"fjhsfkh",department:"CSEN"}

Functionality:assign a slot of a course I am instructing to an academic member that teaches it Route:/courseInstructor/assignSlotToMember Request type:POST Request body: {"_id":"5789899259729b","academicID":"ac-1"} Response:Messages like "wrong academic id" "YOU or academic member don't teach the course" "slot assigned successfully"

Functionality:change the course given in a slot to another course Route:/courseInstructor/updateSlotAssignmentToMember Request type:POST Request body: {"_id":"59458","academicID":"ac-1","courseName":"CSEN797"} Response: Messages like "wrong slot _id" "you are not an instructor for the course given in this slot" "you are not an instructor for the New course" "academic doesn't teach the new course" "The slot is not Assigned to the academic member inserted" "Assigned same slot to same Member but with new course successfully"

Functionality:delete the assignment of certain slot from certian member Route:/courseInstructor/deleteSlotAssignmentFromMember Request type:POST Request body:{"_id":"59458","academicID":"ac-1"} Response: messages like "wrong slot _id" "you are not an instructor for the course given in this slot" "The slot is not Assigned to the academic member inserted" "slot assignment deleted successfully"

Functionality:make a certain member a coordinator for a course i'm instructor for and the member teaches Route:/courseInstructor/makeCoordinator Request type:POST Request body: {"academicID":"ac-1","courseName":"CSEN555"} Response: messages like "you are not instructor for this course" "the academic doesn't teach this course" "the academic is already a coordinator for the course" "Made coordinator successfullly"

Functionality:assign a course I am instructor for to a member Route:/courseInstructor/assignAcademicToCourse Request type:POST Request body: {"academicID":"ac-1","courseName":"CSEN555"} Response: messages like "you are not instructor for this course" "the academic already assigned to this course" "Academic member doesn't work under either departments that teach the course" "academic assigned Successfully"

Route:/courseInstructor/removeAcademicFromCourse Request type:POST Request body: {"academicID":"ac-1","courseName":"CSEN555"} Response: messages like "you are not instructor for this course" "the academic doesn't teach this course" "all Academic assignments to this Course are removed successfully"

######################################## NADINE 
########################################
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
1)add location: Functionality:adds a new location to the university
Route:/location


Request type:post


Request body:   { 
   "name":"l1",
   "type":"offices",
   "capacity":10  
     }


Response: the saved data or error in case of errors
{
    "officeOccupants": 0,
    "_id": "5fde5fe7ea5ccbc5bfe65295",
    "name": "l1",
    "type": "offices",
    "capacity": 10,
    "__v": 0
}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
2)delete location: Functionality:deletes a  location from the university


Route:/location/l1


Request type:delete


Request body:   { 
   
     }


Response: {
    "message": "done"
}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
3)update location: Functionality:updates a  location attribute(s) from the university


Route:/location/l1


Request type:put



Request body:      {  
   "name":"l2",
   "type":"tutorial room",
   "capacity":18
     }



Response: {
    "officeOccupants": 0,
    "_id": "5fde62fa2eafecc6d69fe8ca",
    "name": "l2",
    "type": "tutorial room",
    "capacity": 18,
    "__v": 0
}(updated location)
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
4)Add afaculty Functionality:adds a new faculty with unique name

Route:/faculties

Request type:post



Request body:  { 
    "name":"facullty1"
     }



Response:{
    "_id": "5fde65eaf3e8bfc7b120a91a",
    "name": "facullty1",
    "__v": 0
}(added faculty)


or error in case of duplicates for example
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
5)update afaculty Functionality:updates an existing faculty 

Route:/faculties/facullty1

Request type:put



Request body:  { 
    "name":"facullty2"
     }



Response:{
    "_id": "5fde65eaf3e8bfc7b120a91a",
    "name": "facullty2",
    "__v": 0
}(updated faculty)


or error in case of duplicates for example
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
6)delete afaculty Functionality:deletes an existing faculty 

Route:/faculties/facullty1

Request type:delete



Request body:  { 
  
     }



Response:{
    "message": "done"
} or error
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
7)add a department Functionality:adds a new  department

Route:/departments

Request type:post



Request body:    { 
    "name":"d1",
  "faculty": "fun1",
  "HOD":"blabla"
     }(choose attributes to add)



Response{
    "message": "HOD does not exist or not array"
} or{
    "message": "faculty does not exist or not array"
}or ...... or the added department if operation was successful
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
8)update a department Functionality:updates an existing  department

Route:/departments/d1

Request type:put



Request body:       { 
    "name":"d2",
  "faculty": "facullty1"
 
     }put parameters to update
    


Response{
    "courseNames": [],
    "staffIds": [],
    "_id": "5fdedb74763f67c873916421",
    "name": "d2",
    "faculty": "facullty1",
    "__v": 0
}or {
    "message": "HOD does not exist or not array"
} or{
    "message": "faculty does not exist or not array"
}or ......
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
9)delete a department Functionality:deletes an existing  department

Route:/departments/d2

Request type:delete



Request body:       { 
 
 
     }
    


Response{
    "message": "done"
}or or error incase of errors
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
10)add a course Functionality:adds a new  course

Route:/courses

Request type:post



Request body:       { 
    "name":"course1",
    "department":["d2","d3"]
    }



Response:{
    "message": "some departments do not exist or not array"
} or  the added course if success({
    "department": [
        "d2",
        "d3"
    ],
    "_id": "5fdede504ab0ceca33f1646d",
    "name": "course1",
    "__v": 0
})
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
11)update a course Functionality:updates an existing  course

Route:/courses/course3

Request type:put



Request body:      { 
    "name":"course8",
    "department":["d3"]
    }put parameters to update
    


Response{
    "department": [
        "d3"
    ],
    "_id": "5fdedebb4ab0ceca33f1646f",
    "name": "course8",
    "__v": 0
}or {
    message: "some departments do not exist or not array"
} 
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
12)delete a course Functionality:deletes an existing  course

Route:/courses/course3

Request type:delete



Request body:       { 
 
 
     }
    


Response{
    "message": "done"
}or or error incase of errors
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
13)add a new hr Functionality:adds a new  hr

Route:/hrStaff

Request type:post



Request body:   { 
    "name":"first",
  "email":"first@gy",
  "gender":"female",
"salary":1000,
"officeLocation":"l2",
 "extraInformation":"3 years experience"
  
     }


Response{
    "password": "$2b$10$f45V.BM5jM4oWFJlY3HIuO3rFnTYIyXP7WmOmR2qSlYplM8Zf.3M6",
    "dayOff": "Saturday",
    "changePassword": true,
    "_id": "5fdee52cc00cd1cbee4927bf",
    "name": "first",
    "email": "first@gy",
    "salary": 1000,
    "officeLocation": "l2",
    "extraInformation": "3 years experience",
    "id": "hr-2",
    "__v": 0
} the inserted staff or    message: "location does not exist" or office full or ...
})
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
department is handled from the department route not here



14)add an acadamic member Functionality:adds a new  acadamic member

Route:/acadamic

Request type:post



Request body:       { 
    "name":"first",
  "email":"first22@gy",
  "gender":"female",
"salary":2000,
"officeLocation":"l2",
 "extraInformation":"3 years experience"
  
     }



Response:
   {
    "courses": [],
    "password": "$2b$10$I.0VwuaAw6KKZWPP36X61.am0giDotxOAuHkFdk.849DeeBlgL8cK",
    "dayOff": "Saturday",
    "instructorFor": [],
    "coordinatorFor": [],
    "changePassword": true,
    "_id": "5fdee646c00cd1cbee4927c4",
    "name": "first",
    "email": "first22@gy",
    "salary": 2000,
    "officeLocation": "l2",
    "extraInformation": "3 years experience",
    "gender": "female",
    "id": "ac-1",
    "__v": 0
} or error in case there is an error
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
department is handled from the department route not here


15)update a hr member Functionality:updates an existing  hr member

Route:/hrStaff/hr-2

Request type:put



Request body:     { 
   
  "gender":"male",
"officeLocation":"l4",
 "extraInformation":"4 years experience"
  
     }(attributes you want to update)
    



Response:
 {
    "password": "$2b$10$f45V.BM5jM4oWFJlY3HIuO3rFnTYIyXP7WmOmR2qSlYplM8Zf.3M6",
    "dayOff": "Saturday",
    "changePassword": true,
    "_id": "5fdee52cc00cd1cbee4927bf",
    "name": "first",
    "email": "first@gy",
    "salary": 1000,
    "officeLocation": "l4",
    "extraInformation": "4 years experience",
    "id": "hr-2",
    "__v": 0
} or error in case there is an error or messages in case of mistakes
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
department is handled from the department route not here




16)update an acadamic member Functionality:updates an existing  acadamic member

Route:/acadamic/ac-1

Request type:put



Request body:     { 
   
  "gender":"male",
"officeLocation":"l4",
 "extraInformation":"4 years experience"
  
     }(attributes you want to update)
    
    



Response:
 {
    "courses": [],
    "password": "$2b$10$I.0VwuaAw6KKZWPP36X61.am0giDotxOAuHkFdk.849DeeBlgL8cK",
    "dayOff": "Saturday",
    "instructorFor": [],
    "coordinatorFor": [],
    "changePassword": true,
    "_id": "5fdee646c00cd1cbee4927c4",
    "name": "first",
    "email": "first22@gy",
    "salary": 2000,
    "officeLocation": "l4",
    "extraInformation": "4 years experience",
    "gender": "male",
    "id": "ac-1",
    "__v": 0
} or error in case there is an error or messages in case of mistakes
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
17)delete a hr member Functionality:deletes an existing  hr member

Route:/hrStaff/hr2

Request type:delete



Request body:     { 
  
     }
    
    



Response:
 {
    "message": "hrStaff deleted"
} or error in case there is an error 
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
18)delete an acadamic member Functionality:deletes an existing  acadamic member

Route:/acadamic/ac-1

Request type:delete



Request body:     { 
  
     }
    
    



Response:
 {
    "message": "academicMember deleted"
} or error in case there is an error 
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
19)add a missing signin/signout 

Route:/attendance/hr-1

Request type:post



Request body:      { 
   
        "signIn":"2020-12-12T07:24:00",
        "signOut":"2020-12-12T08:24:00"
     
     }
    
    



Response:
{
    "message": "success"
}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
20)View any staff member attendance record.

Route:/attendance/hr-1

Request type:get



Request body:      { 
   
 
     }
    
    



Response:
{
    "signIn": [
        "2020-12-12T07:24:00.000Z"
    ],
    "signOut": [
        "2020-12-12T08:24:00.000Z"
    ],
    "_id": "5fdee12da03de7cb0671a7c0",
    "staffId": "hr-1",
    "__v": 0
}(the attendannce record)
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
21)View staff members with missing hours/days.

Route:/attendance

Request type:get



Request body:      { 
   
 
     }
    
    



Response:
[
    "hr-1",
    "hr-3",
    "ac-2"
](list of people with missing attendance)
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
22)Update the salary of a acadamic member.

Route:/acadamic/salary/ac-2

Request type:put



Request body:   { 
   
        "salary":1
     
     }
    
    



Response:
{
    "courses": [],
    "password": "$2b$10$Jr8YZr3MHl1eRJvtw42X1eUE1QhcqhgliEwIdYiogdBPymRx6Ao7a",
    "dayOff": "Saturday",
    "instructorFor": [],
    "coordinatorFor": [],
    "changePassword": true,
    "_id": "5fdeece1a91abccd926de3d4",
    "name": "first",
    "email": "first22@gy",
    "salary": 1,
    "officeLocation": "l2",
    "extraInformation": "3 years experience",
    "gender": "female",
    "id": "ac-2",
    "__v": 0
}(person with updated salary)
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
23)Update the salary of a hr member.

Route:/hrStaff/salary/hr-1

Request type:put



Request body:   { 
   
        "salary":1
     
     }
    
    



Response:
{
    "password": "$2b$10$15s8ZzEoQO2A8fUETJosQeQMwicUco2rbWhjBb5ciFRFgjV67ta0u",
    "dayOff": "Saturday",
    "changePassword": true,
    "_id": "5fdee12da03de7cb0671a7be",
    "name": "samia",
    "email": "samy21@gy",
    "id": "hr-1",
    "__v": 0,
    "salary": 1
}}(person with updated salary)
########################################MARIAM########################################

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
1)Functionality: A staff member logging in and changing his password if first time to login.
Route: /logging/login
Request : POST
Request body(the email and the password of the staff member (logged in before) ):
{   "email":"hr2222@gmail.com",
   "password": "hrmember2"
}
Response(token): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImhyLTIiLCJpYXQiOjE2MDg4ODI3ODZ9.MwVHQM7pk431HraCx917FLcohchlK1NkbHP4lJUNHI4

Request body( the email , password and newpassword if first time to login ):
{  "email":"acdemicTest1@gmail.com",
   "password": "123456",
   "newpassword": "acdemicTest1Password"
}

Response(token):
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFjLTMiLCJyb2xlIjoiY3MgcHJvZmVzc29yIiwiaWF0IjoxNjA4ODkwMDg3fQ.gGqfhBats6CjayoMC-2fAJzS6sWYIfp9bTVu99dx9WI


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
2)  Functionality:  A staff member logging out 
Route:  /logging/logout
Request type: POST
Request body: no request body (just add the token in the header)

Response:
logged out successfully!

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
3) Functionality: A staff member can view his profile
Route: /staff/viewProfile
Request type: GET
Request body:  no request body (just add the token in the header)

Response:
{
    "courses": [],
    "password": "$2a$10$WDuKu3pZPdq8AMyVrcwtJO/25niQQC3tfiR5497oUtrPgHkOH5x9C",
    "dayOff": "Saturday",
    "instructorFor": [],
    "coordinatorFor": [],
    "changePassword": false,
    "annualLeaves": 2.5,
    "accidentalLeaves": 0,
    "_id": "5fe5b544f46980507c6144b0",
    "name": "acdemicTest1",
    "email": "acdemicTest1@gmail.com",
    "gender": "female",
    "role": "cs professor",
    "id": "ac-3",
    "__v": 0
}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
4) Functionality: A staff member can update his profile
Route:  /staff/UpdateProfile
Request type: PUT
Request body + (add token in header):
{
   
    "password": "newacdemicTest1PasswordUpdated",
    "email": "acdemicTest1Updated@gmail.com",
    "gender": "male",
    "extraInformation" : "i am testing the update profile for acdemicmember1"
 
  
}

Response:

updated successfully

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
5) Functionality:  A staff member can reset his password
Route: /staff/resetPassword
Request type: PUT
Request body+(token in header):
{
    "password": "newacdemicTest1PasswordUpdatedReset"
}

Response:

successfully updated

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
6) Functionality: staff member  signing in (simulating entering campus)
Route: /staff/in
Request type: POST
Request body: no request body (just token in header)

Response:

{
    "message": "success"
}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
7) Functionality:  staff member  signing out (simulating leaving campus)
Route: /staff/out
Request type: POST
Request body: no request body (just token in header)

Response :

{
    "message": "success"
}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

8) Functionality: staff member view all there attendence records or filter it by month
Route: /staff/veiwAttendenceRecords
Request type: GET
Request body:  no request body (just add the token in the header)

Response:

{
    "signIn": [
        "2020-12-25T13:52:47.680Z"
    ],
    "signOut": [
        "2020-12-25T13:55:53.707Z"
    ],
    "_id": "5fe5b546f46980507c6144b1",
    "staffId": "ac-3",
    "__v": 0
}
//case month with  no enteries in attendence
Request body:
  {
     
    "month":10
     
}
Response: 
{
    "signin": [],
    "signout": []
}
//case filtering by month that has enteries in attendence

Request body:
{
     
    "month":11
     
}
Response: 
{
    "signin": [
        "2020-12-25T17:02:34.908Z",
        "2020-12-25T17:05:10.612Z",
        "2020-12-25T17:06:57.123Z",
        "2020-12-25T17:07:00.875Z"
    ],
    "signout": [
        "2020-12-25T17:03:57.207Z",
        "2020-12-25T17:06:00.871Z",
        "2020-12-25T17:06:39.067Z"
    ]
}




%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

9) Functionality:  view missing days
Route: /staff/missingdays
Request type: GET
Request body: no request body (just add the token in the header)

Response:

[
    "2020-12-12T05:00:32.000Z",
    "2020-12-13T05:00:32.000Z",
    "2020-12-14T05:00:32.000Z",
    "2020-12-15T05:00:32.000Z",
    "2020-12-16T05:00:32.000Z",
    "2020-12-17T05:00:32.000Z",
    "2020-12-19T05:00:32.000Z",
    "2020-12-20T05:00:32.000Z",
    "2020-12-21T05:00:32.000Z",
    "2020-12-22T05:00:32.000Z",
    "2020-12-23T05:00:32.000Z",
    "2020-12-24T05:00:32.000Z"
]

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
10) Functionality:  view missing hours or extra hours
Route: /staff/missinghours
Request type: GET
Request body: no request body (just add the token in the header)

Response: -0.05hours


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
