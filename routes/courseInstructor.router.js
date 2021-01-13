//STUBS
const express = require('express');
const {
    func
} = require('joi');
const router = express.Router();
const academicMemberModel = require('../models/academicMember.model');
const courseModel = require('../models/course.model');
const departmentModel = require('../models/department.model');
const requestsModel = require('../models/requests.model');
const slotsModel = require('../models/slots.model');
const scheduleModel = require('../models/schedule.model');
const {
    requestStatus,
    requestType
} = require('../api/enums');
const { route } = require('./schedule.router');
const{
    validateAssignSlotToMember,
    validateUpdateSlotAssignmentToMember,
    validateDeleteSlotAssignmentFromMember,
    validateMakeCoordinator,
    validateAssignAcademicToCourse,
    validateRemoveAcademicFromCourse
}=require('../api/middleware/courseInstructor.validation');
router.get('/courseCoverage', async (req, res) => {
    let authorizationToken = await authorizeCourseInstructor(req);
    if (!authorizationToken.aurthorized) {
        res.json({ error: "You are not authorized for this request" });
        //res.send("You are not authorized for this request");
        return;
    }
    let coverageArray = [];    
    let slotsForCourses = await slotsModel.find({ course: { $in: authorizationToken.courseNames } });
     
    for (let i = 0; i < authorizationToken.courseNames.length; i++){
        let x = 0;
        let y = 0;
        let c = authorizationToken.courseNames[i];
       
        for (let j = 0; j < slotsForCourses.length; j++){
            if (slotsForCourses[j].course.toString().localeCompare(c) == 0) {
                y++;
                if (slotsForCourses[j].academicMember.toString().localeCompare("undefined")!=0)
                    x++;
            }
        }
        if (y == 0) {
            coverageArray.push({ Course: c, Coverage: "100%" });
        }
        else {
           
              coverageArray.push({
                  Course: c,
                  Coverage: x*100.0/y +"%"
              });
        }
    }
    res.send(coverageArray);
});

router.get('/slotsAssignment', async (req, res) => {
    let authorizationToken = await authorizeCourseInstructor(req);
    if (!authorizationToken.aurthorized) {
        res.json({ error: "You are not authorized for this request" });
        //res.send("You are not authorized for this request");
        return;
    }
    let slotsForCourse = await slotsModel.find({
        course: {
            $in: authorizationToken.courseNames
        }
    });
    
    res.send(slotsForCourse);
});

router.get('/viewStaffByDep', async (req, res) => {
    let authorizationToken = await authorizeCourseInstructor(req);
    if (!authorizationToken.aurthorized) {
        res.json({ error: "You are not authorized for this request" });
        //res.send("You are not authorized for this request");
        return;
    }

    let department = await academicMemberModel.find({
        id: authorizationToken.id
    })
    department = department[0].department;
    let acadmics = await academicMemberModel.find({ department: department });
    res.send(acadmics);
});

router.get('/viewStaffByCourse', async (req, res) => {
    let authorizationToken = await authorizeCourseInstructor(req);
    if (!authorizationToken.aurthorized) {
        res.json({ error: "You are not authorized for this request" });
        //res.send("You are not authorized for this request");
        return;
    }
    let acadmics = await academicMemberModel.find({
        courses: { $in: authorizationToken.courseNames }
    });
    res.send(acadmics);
});

router.post('/assignSlotToMember', validateAssignSlotToMember,async (req, res) => {
    let authorizationToken = await authorizeCourseInstructor(req);
    if (!authorizationToken.aurthorized) {
        res.json({ error: "You are not authorized for this request" });
        //res.send("You are not authorized for this request");
        return;
    }
    let slot_id = req.body._id;
    let myAcademic = req.body.academicID;
    let slot = await slotsModel.find({ _id: slot_id });
    if (slot.length == 0) {
        res.send("wrong slot _id");
        return;
    }
    if (slot[0].academicMember && slot[0].academicMember.toString().localeCompare("undefined")!=0) {
        res.send(" slot already assigned to someOne else");
        return;
    }
    let myCourse = slot[0].course;
    
    myAcademic = await academicMemberModel.find({ id: myAcademic });
    if (myAcademic.length == 0) {
        res.send("wrong academic id");
    }
    myAcademic = myAcademic[0];
    let x = 0;
    for (let i = 0; i < myAcademic.courses.length; i++) {

        if (myAcademic.courses[i].toString().localeCompare(myCourse) == 0)
            x++;
    }
    for (let i = 0; i < authorizationToken.courseNames.length; i++) {

        if (authorizationToken.courseNames[i].toString().localeCompare(myCourse) == 0)
            x++;
    }
    if (x < 2) {
        res.send("YOU or academic member don't teach the course");
        return;
    }
    //NOT tested
    let mySchedule = await scheduleModel.find({
        academicMember: myAcademic.id
    });
    mySchedule = mySchedule[0];
    if (mySchedule.slots.length != 0) {
        let slotOverlap = mySchedule.slots.filter((s) => {
            return s.day.localeCompare(slot[0].day) == 0 && s.order.localeCompare(slot[0].order) == 0
        });
        if (slotOverlap.length != 0) {
            res.send('Member Already has a slot at this time in the day');
            return;
        }
    }
    

    
    await slotsModel.updateOne({ _id: slot[0]._id }, { academicMember: myAcademic.id });
    let slot2 = await slotsModel.find({
        _id: slot_id
    });
    mySchedule.slots.push(slot2[0]);
    await scheduleModel.updateOne({
        academicMember: myAcademic.id
    }, {
        slots: mySchedule.slots
    });
    res.send("slot assigned successfully");
});
router.post('/updateSlotAssignmentToMember', validateUpdateSlotAssignmentToMember, async (req, res) => {
    let authorizationToken = await authorizeCourseInstructor(req);
    if (!authorizationToken.aurthorized) {
        res.json({ error: "You are not authorized for this request" });
        //res.send("You are not authorized for this request");
        return;
    }
    let slot_id = req.body._id;
    let myAcademic = req.body.academicID;
    let courseNew = req.body.courseName;

    let slot = await slotsModel.find({
        _id: slot_id
    });
    if (slot.length == 0) {
        res.send("wrong slot _id");
        return;
    }
    if (authorizationToken.courseNames.filter(
        (course) => course.toString().localeCompare(slot[0].course) == 0).length == 0) {
        res.send("you are not an instructor for the course given in this slot");
        return;
    }
    if (authorizationToken.courseNames.filter(
        (course) => course.toString().localeCompare(courseNew) == 0).length == 0) {
        res.send("you are not an instructor for the New course");
        return;
    }
    let academicFromModel = await academicMemberModel.find({ id: myAcademic });
    academicFromModel = academicFromModel[0];
    if (academicFromModel.courses.filter(
        (course) => course.toString().localeCompare(courseNew) == 0
    ).length == 0) {
        res.send("academic doesn't teach the new course");
        return;
    }
    if (!slot[0].academicMember || slot[0].academicMember.toString().localeCompare(myAcademic) != 0) {
        res.send("The slot is not Assigned to the academic member inserted");
        return;
    }
    await slotsModel.updateOne({ _id: slot_id }, { course: courseNew });
    let newSlot = await slotsModel.find({
        _id: slot_id
    });
    newSlot = newSlot[0];
    let mySchedule = await scheduleModel.find({ academicMember: myAcademic });
    mySchedule = mySchedule[0];
    let newSlots = mySchedule.slots.filter((s) => {
        return s._id.toString().localeCompare(slot_id) != 0
    });
    newSlots.push(newSlot);
    await scheduleModel.updateOne({
        academicMember: myAcademic
    }, {
        slots: newSlots
    })
    res.send("Assigned same slot to same Member but with new course successfully");
})
router.post('/deleteSlotAssignmentFromMember', validateDeleteSlotAssignmentFromMember,async (req, res) => {
    let authorizationToken = await authorizeCourseInstructor(req);
    if (!authorizationToken.aurthorized) {
        res.json({ error: "You are not authorized for this request" });
        //res.send("You are not authorized for this request");
        return;
    }
    let slot_id = req.body._id;
    let myAcademic = req.body.academicID;
    let slot = await slotsModel.find({
        _id: slot_id
    });
    if (slot.length == 0) {
        res.send("wrong slot _id");
        return;
    }
    if (authorizationToken.courseNames.filter(
        (course) => course.toString().localeCompare(slot[0].course) == 0).length == 0) {
        res.send("you are not an instructor for the course given in this slot");
        return;
        }
    if (!slot[0].academicMember || slot[0].academicMember.toString().localeCompare(myAcademic) != 0) {
        res.send("The slot is not Assigned to the academic member inserted");
        return;
    }
    let mySchedule = await scheduleModel.find({
        academicMember: myAcademic
    });
    mySchedule = mySchedule[0].slots;
    mySchedule = mySchedule.filter((s) => { return s._id.toString().localeCompare(slot_id) != 0 });
    await scheduleModel.updateOne({
        academicMember: myAcademic
    }, {
        slots:mySchedule
    })
    await slotsModel.updateOne({
                _id: slot_id
    }, {
       academicMember: 'undefined'
    });
    
    res.send("slot assignment deleted successfully")
});

router.post('/makeCoordinator',validateMakeCoordinator, async (req, res) => {
    let authorizationToken = await authorizeCourseInstructor(req);
    if (!authorizationToken.aurthorized) {
        res.json({ error: "You are not authorized for this request" });
        //res.send("You are not authorized for this request");
        return;
    }
    let myAcademic = req.body.academicID;
    let myCourse = req.body.courseName;
    if ((authorizationToken.courseNames.filter((course) => course.toString().localeCompare(myCourse) == 0))
        .length == 0) {
        res.send("you are not instructor for this course");
        return;
    }
    myAcademic = await academicMemberModel.find({ id: myAcademic });
    myAcademic = myAcademic[0];
    if (myAcademic.courses.filter((course) => course.toString().localeCompare(myCourse) == 0)
        .length == 0) {
        res.send("the academic doesn't teach this course");
        return;
    }
    if (myAcademic.coordinatorFor.filter((course) => course.toString().localeCompare(myCourse)) == 0
        .length != 0) {
        res.send("the academic is already a coordinator for the course");
        return;
    }
    if (myAcademic.coordinatorFor.length != 0) {
        res.send("the academic is already a coordinator for another course");
        return;
    }
    let courseFromModel = await courseModel.find({ name: myCourse });
    courseFromModel = courseFromModel[0];
    if (courseFromModel.coordinator && courseFromModel.coordinator.length != 0) {
        res.send("The course already has another coordiator");
        return;
    }
    await courseModel.updateOne({
        name: myCourse
    }, {
        coordinator:myAcademic.id
    })
    myAcademic.coordinatorFor.push(myCourse);
    await academicMemberModel.updateOne({
        id: myAcademic.id
    }, {
            coordinatorFor: myAcademic.coordinatorFor,
        role: "coordinator"
    });
    req.user.role = "coordinator";
    res.send("Made coordinator successfullly")
        
});

router.post('/assignAcademicToCourse', validateAssignAcademicToCourse,async (req, res) => {
    let authorizationToken = await authorizeCourseInstructor(req);
    if (!authorizationToken.aurthorized) {
        res.json({ error: "You are not authorized for this request" });
        //res.send("You are not authorized for this request");
        return;
    }
    let myAcademic = req.body.academicID;
    let myCourse = req.body.courseName;
    if ((authorizationToken.courseNames.filter((course) => course.toString().localeCompare(myCourse) == 0))
        .length == 0) {
        res.send("you are not instructor for this course");
        return;
    }
    myAcademic = await academicMemberModel.find({
        id: myAcademic
    });
    myAcademic = myAcademic[0];
   
    
    if (myAcademic.courses.filter((course) => course.toString().localeCompare(myCourse) == 0)
        .length != 0) {
        res.send("the academic already assigned to this course");
        return;
    }
    //NOT TESTED 
    let courseFromModel = await courseModel.find({ name: myCourse });
    courseFromModel = courseFromModel[0];
    console.log(courseFromModel.department);
    console.log(myAcademic.department);
    if (courseFromModel.department.filter(
        (dep)=>dep.toString().localeCompare(myAcademic.department)==0
    ).length == 0) {
        res.send("Academic member doesn't work under either departments that teach the course")
        return;
    }
    //TESTED
     myAcademic.courses.push(myCourse);
    await academicMemberModel.updateOne({ id: myAcademic.id }, { courses: myAcademic.courses })
    res.send("academic assigned Successfully");
})
router.post('/removeAcademicFromCourse', validateRemoveAcademicFromCourse,async (req, res) => {
    let authorizationToken = await authorizeCourseInstructor(req);
    if (!authorizationToken.aurthorized) {
        res.json({ error: "You are not authorized for this request" });
        //res.send("You are not authorized for this request");
        return;
    }
    let myAcademic = req.body.academicID;
    let myCourse = req.body.courseName;
    if ((authorizationToken.courseNames.filter((course) => course.toString().localeCompare(myCourse) == 0))
        .length == 0) {
        res.send("you are not instructor for this course");
        return;
    }
    myAcademic = await academicMemberModel.find({
        id: myAcademic
    });
    myAcademic = myAcademic[0];
    if (myAcademic.courses.filter((course) => course.toString().localeCompare(myCourse) == 0)
        .length == 0) {
        res.send("the academic doesn't teach this course");
        return;
    }
    //CHANGE ROLE TO TA AND REMOVE THIS COORDINATOR FROM COURSE 
    if (myAcademic.coordinatorFor.filter(
        (course) => course.toString().localeCompare(myCourse) == 0).length != 0) {
        req.user.role = "TA";
        await courseModel.updateOne({
            name: myCourse
        }, {
            $unset: {
                coordinator: 1
            }
        });

     }
    await academicMemberModel.updateOne({ id: myAcademic.id }, {
        courses: myAcademic.courses.filter(
            (course) => course.toString().localeCompare(myCourse) != 0
        ), instructorFor: myAcademic.instructorFor.filter(
            (course) => course.toString().localeCompare(myCourse) != 0
        ),
        coordinatorFor: myAcademic.coordinatorFor.filter(
            (course) => course.toString().localeCompare(myCourse) != 0
        ), role:"TA"
    });
    let mySchedule = await scheduleModel.find({
        academicMember: myAcademic.id
    });
    mySchedule = mySchedule[0];
    await scheduleModel.updateOne({
        academicMember: myAcademic.id
    }, {
        slots: mySchedule.slots.filter((s) => {
            return s.course.toString().localeCompare(myCourse)!=0
        })
    })
    await slotsModel.updateMany({
        academicMember: myAcademic.id,
        course: myCourse
    }, {
         academicMember: 'undefined'
    });
    
    res.send("all Academic assignments to this Course are removed successfully");
});

//STUBS
async function authorizeCourseInstructor(request) {
    // if (request.user.role === "Course Instructor")
    //     return true;
    // return false;
    let x = await isInstructor(request.user.id);
    if (!x.aurthorized)
        return { aurthorized: false };
    
    return {
        // id:req.user.id,
        id:request.user.id,
         aurthorized: true,
         courseNames:x.courseNames
     };
}
async function isInstructor(id) {
    let myMem = await academicMemberModel.find({ id: id });
    if (myMem.length == 0)
        return { aurthorized: false };
    myMem = myMem[0];
    if (!myMem.instructorFor)
        return { aurthorized: false };
    if (myMem.instructorFor.length == 0)
        return { aurthorized: false };
    return { aurthorized: true, courseNames: myMem.instructorFor };
}

module.exports = router;