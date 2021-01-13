const express = require('express');
const router = express.Router();
const academicMemberModel = require('../models/academicMember.model');
const courseModel = require('../models/course.model');
const departmentModel = require('../models/department.model');
const requestsModel = require('../models/requests.model');
const slotsModel = require('../models/slots.model');
const notificationModel = require('../models/notification.model');
const {
    requestStatus,
    requestType
} = require('../api/enums');
const {
    validateMakeDeleteInstructor,
    validateUpdateInstructor,
    validateViewStaffByCourseName,
    validateRejectAcceptRequest,
    validateTeachingAssignmentsOfCourse
} = require("../api/middleware/HOD.validation");
const { request } = require('express');
router.post('/makeInstructor', validateMakeDeleteInstructor, async (req, res) => {
    const authorizationToken = await authorizeHOD(req);
    if (!authorizationToken.aurthorized) {
        res.json({error:"you are not HOD : NOT AUTHORIZED"})
        // res.send("you are not HOD : NOT AUTHORIZED");
        return;
    }

    const academicID = req.body.academicID;
    const courseName = req.body.courseName;

    let myAcademic = await academicMemberModel.find({
        id: academicID
    });

    let myCourse = await courseModel.find({
        name: courseName
    });
    if (myAcademic.length == 0) {
        res.send("Academic Id doesn't exist");
        return;
    }
    if (myCourse.length == 0) {
        res.send("Course Name doesn't exist");
        return;
    }
    if (myAcademic[0].department.localeCompare(authorizationToken.department) != 0) {
        res.send("Academic is not in your department");
        return;
    }
    if (myCourse[0].department.filter((depName) => {
            return depName.localeCompare(authorizationToken.department) == 0
        }).length == 0) {
        res.send("Course is not under your department");
        return;
    }
    let instructorForMe = myAcademic[0].instructorFor;
    instructorForMe.push(courseName);
    let courses = myAcademic[0].courses;
    courses.push(courseName);
    await academicMemberModel.updateOne({
        id: academicID
    }, {
        instructorFor: instructorForMe,
        courses: courses
    });
    res.send("instructor added")

})

router.post('/deleteInstructor', validateMakeDeleteInstructor, async (req, res) => {

    const authorizationToken = await authorizeHOD(req);
    if (!authorizationToken.aurthorized) {
        res.json({error:"you are not HOD : NOT AUTHORIZED"})
        // res.send("you are not HOD : NOT AUTHORIZED");
        return;
    }
    const academicID = req.body.academicID;
    const courseName = req.body.courseName;

    let myAcademic = await academicMemberModel.find({
        id: academicID
    });

    let myCourse = await courseModel.find({
        name: courseName
    });
    if (myAcademic.length == 0) {
        res.send("Academic Id doesn't exist");
        return;
    }
    if (myCourse.length == 0) {
        res.send("Course Name doesn't exist");
        return;
    }
    if (myAcademic[0].department.localeCompare(authorizationToken.department) != 0) {
        res.send("Academic is not in your department");
        return;
    }
    if (myCourse[0].department.filter((depName) => {
            return depName.localeCompare(authorizationToken.department) == 0
        }).length == 0) {
        res.send("Course is not under your department");
        return;
    }
    let instructorForMe = myAcademic[0].instructorFor;
    instructorForMe = instructorForMe.filter((course) => course.localeCompare(courseName) == 0);
    await academicMemberModel.updateOne({
        id: academicID
    }, {
        instructorFor: instructorForMe
    });
    res.send("instructor removed");

});

router.post('/updateInstructor', validateUpdateInstructor, async (req, res) => {

    const authorizationToken = await authorizeHOD(req);
    if (!authorizationToken.aurthorized) {
        res.json({error:"you are not HOD : NOT AUTHORIZED"})
        // res.send("you are not HOD : NOT AUTHORIZED");
        return;
    }
    const academicID = req.body.academicID;
    const courseOld = req.body.courseOld;
    const courseNew = req.body.courseNew;

    let myAcademic = await academicMemberModel.find({
        id: academicID
    });

    let myCourseOld = await courseModel.find({
        name: courseOld
    });

    let myCourseNew = await courseModel.find({
        name: courseNew
    });
    if (myAcademic.length == 0) {
        res.send("Academic Id doesn't exist");
        return;
    }
    if (myCourseOld.length == 0) {
        res.send("Old Course Name doesn't exist");
        return;
    }
    if (myCourseNew.length == 0) {
        res.send("New Course Name doesn't exist");
        return;
    }
    if (myAcademic[0].department.localeCompare(authorizationToken.department) != 0) {
        res.send("Academic is not in your department");
        return;
    }
    if (myCourseNew[0].department.filter((depName) => {
            return depName.localeCompare(authorizationToken.department) == 0
        }).length == 0) {
        res.send("New Course is not under your department");
        return;
    }
    if (myCourseOld[0].department.filter((depName) => {
            return depName.localeCompare(authorizationToken.department) == 0
        }).length == 0) {
        res.send("Old Course is not under your department");
        return;
    }

    let instructorForMe = myAcademic[0].instructorFor;
    instructorForMe = instructorForMe.filter((course) => course.localeCompare(courseOld) == 0);
    instructorForMe.push(courseNew);
    await academicMemberModel.updateOne({
        id: academicID
    }, {
        instructorFor: instructorForMe
    });
    res.send("instructor updated");

});

router.get('/viewStaffByDepartment', async (req, res) => {

    const authorizationToken = await authorizeHOD(req);
    if (!authorizationToken.aurthorized) {
        res.json({error:"you are not HOD : NOT AUTHORIZED"})
        // res.send("you are not HOD : NOT AUTHORIZED");
        return;
    }
    const departmentName = authorizationToken.department;
    //redundant check on department

    let myDepartment = await departmentModel.find({
        name: departmentName
    });
    if (myDepartment.length == 0) {
        res.send("No such department");
        return;
    }


    let academicsInDep = await academicMemberModel.find({
        department: departmentName
    });
    res.send(academicsInDep);
});

router.post('/viewStaffByCourseName', validateViewStaffByCourseName, async (req, res) => {

    const authorizationToken = await authorizeHOD(req);
    if (!authorizationToken.aurthorized) {
        res.json({error:"you are not HOD : NOT AUTHORIZED"})
       // res.send("you are not HOD : NOT AUTHORIZED");
        return;
    }
    const courseName = req.body.courseName;

    let myCourse = await courseModel.find({
        name: courseName
    });
    if (myCourse.length == 0) {
        res.send("No such course");
        return;
    }
    if (myCourse[0].department.filter((depName) => {
            return depName.localeCompare(authorizationToken.department) == 0
        }).length == 0) {
        res.send("Course is not under your department");
        return;
    }
    const departmentName = authorizationToken.department;

    let academicsInDepAndCourse = await academicMemberModel.find({
            department: departmentName,
            courses: courseName
        }

    );
    res.send(academicsInDepAndCourse);
});

router.get('/viewDaysOffInDepartment', async (req, res) => {
    const authorizationToken = await authorizeHOD(req);
    if (!authorizationToken.aurthorized) {
        res.json({error:"you are not HOD : NOT AUTHORIZED"})
        // res.send("you are not HOD : NOT AUTHORIZED");
        return;
    }
    const departmentName = authorizationToken.department;
    //redundant check on department

    let myDepartment = await departmentModel.find({
        name: departmentName
    });
    if (myDepartment.length == 0) {
        res.send("No such department");
        return;
    }


    let daysOffInDep = await academicMemberModel.find({
        department: departmentName
    });
    if (req.body.academicID) {
        daysOffInDep.filter((academicMember) => academicMember.id.localeCompare(req.body.academicID) == 0);

    }

    daysOffInDep = daysOffInDep.map((member) => {
        return {
            dayOff: member.dayOff,
            academicMember: member.id
        };
    });
    res.send(daysOffInDep);
});

router.get('/viewChangeDayOffRequests', async (req, res) => {
    const authorizationToken = await authorizeHOD(req);
    if (!authorizationToken.aurthorized) {
        res.json({error:"you are not HOD : NOT AUTHORIZED"})
        // res.send("you are not HOD : NOT AUTHORIZED");
        return;
    }


    let changeDayOffreq = await requestsModel.find({
        type: requestType.CHANGE_DAY_OFF
    });


    let result = [];
    for (let i = 0; i < changeDayOffreq.length; i++) {
        let dep = await getDepartment(changeDayOffreq[i].from);
        if (dep.toString().localeCompare(authorizationToken.department) == 0)
            result.push(changeDayOffreq[i]);
    }

    res.send(result);

});

router.get('/viewLeaveRequests', async (req, res) => {
    const authorizationToken = await authorizeHOD(req);
    if (!authorizationToken.aurthorized) {
        res.json({error:"you are not HOD : NOT AUTHORIZED"})
       // res.send("you are not HOD : NOT AUTHORIZED");
        return;
    }
    let leaveRequestTypes = [requestType.LEAVE, requestType.SICK_LEAVE, requestType.ANNUAL_LEAVE,
        requestType.MATERNITY_LEAVE, requestType.ACCIDENTAL_LEAVE, requestType.COMPENSATION_LEAVE
    ]
    let leaveReq = await requestsModel.find({
        type: {
            $in: leaveRequestTypes
        }
    });
    let result = [];
    for (let i = 0; i < leaveReq.length; i++) {
        let dep = await getDepartment(leaveReq[i].from);
        if (dep.localeCompare(authorizationToken.department) == 0)
            result.push(leaveReq[i]);
    }
    res.send(result);
});

router.post('/rejectRequest', validateRejectAcceptRequest, async (req, res) => {
    const authorizationToken = await authorizeHOD(req);
    if (!authorizationToken.aurthorized) {
        res.json({error:"you are not HOD : NOT AUTHORIZED"})
        // res.send("you are not HOD : NOT AUTHORIZED");
        return;
    }
    let reqID = req.body._id;


    let myAcademic = await requestsModel.find({
        _id: reqID
    });
    if (myAcademic[0].status !== requestStatus.PENDING) {
        res.send("cannot reject a " + myAcademic[0].status + " request");
        return;
    }
    myAcademic = myAcademic[0].from;

    let dep = await academicMemberModel.find({
        id: myAcademic
    });
    dep = dep[0].department;
    if (dep.localeCompare(authorizationToken.department) !== 0) {
        res.send("academic is not in your department");
        return;
    }
    await requestsModel.updateMany({
        _id: reqID
    }, {
        status: requestStatus.REJECTED
    }, (err, docs) => {

    });
    await notificationModel.insertMany([{
        academicMember: myAcademic,
        request: reqID
    }])
    res.send("request rejected successfully")
});
router.post('/acceptRequest', validateRejectAcceptRequest, async (req, res) => {
    const authorizationToken = await authorizeHOD(req);
    if (!authorizationToken.aurthorized) {
        res.json({error:"you are not HOD : NOT AUTHORIZED"})
       // res.send("you are not HOD : NOT AUTHORIZED");
        return;
    }
    let reqID = req.body._id;
    let myAcademic;
    let myReq;
    let x = await requestsModel.find({
        _id: reqID
    });
    myReq = x[0];
    myAcademic = x[0].from;
    if (myReq.status !== requestStatus.PENDING) {
        res.send("cannot accept a " + myReq.status + " request");
        return;
    }
    let dep = await academicMemberModel.find({
        id: myAcademic
    });
    dep = dep[0].department;
    if (dep.localeCompare(authorizationToken.department) !== 0) {
        res.send("academic is not in your department");
        return;
    }


    let leaveRequestTypes = [requestType.LEAVE, requestType.SICK_LEAVE, requestType.ANNUAL_LEAVE,
        requestType.MATERNITY_LEAVE, requestType.ACCIDENTAL_LEAVE, requestType.COMPENSATION_LEAVE
    ]
    leaveRequestTypes = leaveRequestTypes.filter((type) => myReq.type == type);
    if (leaveRequestTypes.length == 0 && myReq.type != requestType.CHANGE_DAY_OFF) {
        res.send("A HOD cannot handle " + myReq.type + "leaves");
        return;
    }
    if (myReq.type != requestType.CHANGE_DAY_OFF) {
        //IF ANNUAL OR ACCIDENTAL
        if (myReq.type == requestType.ANNUAL_LEAVE || myReq.type == requestType.ACCIDENTAL_LEAVE) {
            updateAllMembersLeaves(authorizationToken.id);
            let academic = await academicMemberModel.find({
                id: myAcademic
            });
            academic = academic[0];
            //ANNUAL
            if (myReq.type == requestType.ANNUAL_LEAVE) {
                if (academic.annualLeaves >= 1) {
                    await requestsModel.updateMany({
                        _id: reqID
                    }, {
                        status: requestStatus.ACCEPTED
                    });
                    await academicMemberModel.updateMany({
                        id: myAcademic
                    }, {
                        annualLeaves: academic.annualLeaves - 1
                    });
                    await notificationModel.insertMany([{
                        academicMember: myAcademic,
                        request: reqID
                    }]);
                    res.send("ANNUAL LEAVE REQUEST ACCEPTED");
                    return;
                }
                res.send("cannot accept annual leave request there is no enough balance");
                return;
            }
            //ACCIDENTAL
            if (academic.annualLeaves >= 1 && academic.accidentalLeaves < 6) {
                await requestsModel.updateMany({
                    _id: reqID
                }, {
                    status: requestStatus.ACCEPTED
                });
                await academicMemberModel.updateMany({
                    id: myAcademic
                }, {
                    annualLeaves: academic.annualLeaves - 1,
                    accidentalLeaves: academic.accidentalLeaves + 1
                });
                await notificationModel.insertMany([{
                    academicMember: myAcademic,
                    request: reqID
                }]);
                res.send("ACCIDENTAL LEAVE REQUEST ACCEPTED");
                return;
            }
            res.send("cannot accept accidental leave request there is no enough balance")
            return;
        }
        //IF NORMAL LEAVE REQ ACCEPTED
        await requestsModel.updateMany({
            _id: reqID
        }, {
            status: requestStatus.ACCEPTED
        });
        await notificationModel.insertMany([{
            academicMember: myAcademic,
            request: reqID
        }]);
        res.send("Normal Leave Request Accepted");
        return;
    }
    //CHECK IF THE MEMBER HAS ANY SLOTS IN THE DAY IN THE REQ ENTERED
    let inValidSlots = await SlotsInDayOff(myAcademic, myReq.dayOff);
    //IF DAY OFF REQ NOT ACCEPTED
    if (inValidSlots.length != 0) {
        res.send("Cannot change day off while having a slot in that day");
        return;
    }
    //IF DAY OFF REQ ACCEPTED
    await requestsModel.updateMany({
        _id: reqID
    }, {
        status: requestStatus.ACCEPTED
    });
    await academicMemberModel.updateOne({
        id: myAcademic
    }, {
        dayOff: myReq.dayOff
    })
    await notificationModel.insertMany([{
        academicMember: myAcademic,
        request: reqID
    }]);
    res.send("Change Day off request accepted");

})

router.get('/courseCoverage', async (req, res) => {
    const authorizationToken = await authorizeHOD(req);
    if (!authorizationToken.aurthorized) {
        res.json({error:"you are not HOD : NOT AUTHORIZED"})
       // res.send("you are not HOD : NOT AUTHORIZED");
        return;
    }

    let coursesInDep = await courseModel.find({
        department: authorizationToken.department
    });
    coursesInDep = coursesInDep.map(element => element.name);

    let slotsInDep = await slotsModel.find({
        course: {
            $in: coursesInDep
        }
    });
    let coveredSlotsPerCourse = [];
    coursesInDep.forEach((course) => {
        let slotsIncourse = slotsInDep.filter((slot) => {
            return slot.course.localeCompare(course) == 0
        });

        let coveredSlots = slotsIncourse.filter((slot) => {

            if (slot.academicMember && slot.academicMember.toString().localeCompare("undefined") != 0)
                return true;
            return false;
        });
        if (slotsIncourse.length == 0)
            coveredSlotsPerCourse.push({
                Course: course,
                Coverage: "100%"
            });
        else {
            let cov = coveredSlots.length * 1.0 / slotsIncourse.length;
            cov *= 100;
            cov = "" + cov;
            coveredSlotsPerCourse.push({
                Course: course,
                Coverage: cov
            });
        }
    });
    res.send(coveredSlotsPerCourse);


});

router.post('/teachingAssignmentsOfCourse', validateTeachingAssignmentsOfCourse, async (req, res) => {
    const authorizationToken = await authorizeHOD(req);
    if (!authorizationToken.aurthorized) {
        res.json({error:"you are not HOD : NOT AUTHORIZED"})
        // res.send("you are not HOD : NOT AUTHORIZED");
        return;
    }
    let courseName = req.body.courseName;
    if (!courseName) {
        res.send("you didn't provide a course name");
        return;
    }

    let slotsIncourse = await slotsModel.find({
        course: courseName
    });
    slotsIncourse = slotsIncourse.filter((slot) => slot.academicMember.toString().localeCompare("undefined")!=0);
    res.send(slotsIncourse);
})

//STUBS
async function updateAllMembersLeaves(MyID) {
    let Me = await academicMemberModel.find({
        id: MyID
    });
    Me = Me[0];
    let lastUpdated = Me.lastDayUpdated;
    today = new Date();
    if (today.getFullYear() == lastUpdated.getFullYear()) {
        if (today.getMonth() == lastUpdated.getMonth()) {
            return;
        } else {
            if (today.getDate() < 11) {
                let x = today.getMonth() - 1;
                if (x == -1)
                    x = 11;
                if (x == lastUpdated.getMonth())
                    return;
            }
        }
    }
    if (today.getFullYear() == lastUpdated.getFullYear() + 1) {
        if (today.getMonth == 0 && lastUpdated.getMonth == 11) {
            if (today.getDate() < 11)
                return;
        }
    }
    if (today.getDate() >= 11) {
        today.setDate(11);
    } else {
        today.setDate(11);
        let x = today.getMonth() - 1;
        if (x == -1)
            x = 11;
        today.setMonth(x);
    }
    if (today.getMonth() == 0) {
        await academicMemberModel.updateMany({}, {
            lastDayUpdated: today,
            accidentalLeaves: 0,
            //ASSUME THAT THE MEMBER HAS 0.5 LEFT FROM LAST DECEMBER
            annualLeaves: 3
        });
    } else {

        let monthsPassed = today.getMonth() - lastUpdated.getMonth();
        if (lastUpdated.getFullYear() < today.getFullYear()) {
            monthsPassed = today.getMonth() + 1;
            await academicMemberModel.updateMany({}, {
                lastDayUpdated: today,
                accidentalLeaves: 0,
                //ASSUME THAT THE MEMBER HAS 0.5 LEFT FROM LAST DECEMBER
                annualLeaves: 0.5 + monthsPassed * 2.5
            });
        } else {
            let allMembers = await academicMemberModel.find({});
            for (let i = 0; i < allMembers.length; i++) {
                let annualPassed = allMembers[i].annualLeaves;
                if (annualPassed) {
                    await academicMemberModel.updateMany({
                        id: allMembers[i].id
                    }, {
                        lastDayUpdated: today,
                        annualLeaves: annualPassed + 2.5 * monthsPassed
                    })
                }
            }

        }

    }

}
async function SlotsInDayOff(academicID, dayOff) {
    let res = await slotsModel.find({
        academicMember: academicID,
        day: dayOff
    });
    return res;
}
async function getDepartment(academicID) {

    let res = await academicMemberModel.find({
        id: academicID
    });
    return res[0].department;
}
// NOT TESTED FROM HERE
async function authorizeHOD(request) {
    // if (request.user.role == "HOD")
    //     return true;
    // return false;
    //GET THE HOD'S DEPARTMENT FROM HIS/HER ID

    let x = await isHOD(request.user.id);
    if (x.valid == 1) {
        let myID = request.user.id;
        let myDep = x.department;
        return {
            aurthorized: true,
            department: myDep,
            id: myID
        };
    } else
        return {
            aurthorized: false
        };

}
async function isHOD(id) {
    let myDep = await departmentModel.find({
        HOD: id
    });
    if (myDep.length == 0) {
        return {
            valid: -1
        };
    }
    myDep = myDep[0];
    return {
        valid: 1,
        department: myDep.name
    }
}
module.exports = router;