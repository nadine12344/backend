const express = require('express')
const bodyParser = require('body-parser')
const {verify}= require('./routes/verifyToken')
const app = express();
//const http = require("http");

//const socketIO = require("socket.io");
//const server = http.createServer(app);
//const io = socketIO(server);
// io.on("connection", socket => {
//   cors: {
//     origin: "http://localhost:3001";
//     methods: ["GET", "POST","PUT","DELETE"]
//   }
//   console.log("io soket connected")
//   socket.on("notification", () => {
//     notificationModel.find({}).then(not=> {
//       io.sockets.emit("notification", not);
//     });
//   });
//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });
// });


const location=require('./routes/location.router');
const facultyRoute=require('./routes/faculty.router');
const { connectDB } = require('./config/dbConfig');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const hrRoute=require('./routes/hrStaff.router');
const acadamicRoute=require('./routes/acadamic.router');
const courseRoute=require('./routes/course.router');
const departmentRoute=require('./routes/department.router');
const attendance=require('./routes/attendance.router');
const schedule=require('./routes/schedule.router')
const staff=require('./routes/staffMembers.router')
const log=require('./routes/logging.route')
const HOD=require('./routes/HOD.router')
const courseInstructor=require('./routes/courseInstructor.router')
const locationModel = require('./models/location.model');
const requestsModel = require('./models/requests.model');
const academicMemberModel = require('./models/academicMember.model');
const scheduleModel = require('./models/schedule.model');
const courseModel = require('./models/course.model');
const departementModel = require('./models/department.model');
const request=require('./routes/requests.router');
const hrmodel = require('./models/hr.model');

const slotsModel = require('./models/slots.model');
const replacementModel = require('./models/replacements.model');
const notificationModel = require('./models/notification.model');

const path=require('path')



connectDB()
app.use('/',(req,res,next)=>{
  res.header('Access-Control-Allow-Credentials', 'true');
  next()
})

app.use('/',(req,res,next)=>{
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  next()
 
})


app.use(express.static(path.join(__dirname, "client", "build")))
//app.UseCors(options => options.AllowAnyOrigin());
app.use('/logging',log)

app.use('/',verify)
app.use('/hrStaff',hrRoute);
app.use('/acadamic',acadamicRoute);
app.use('/courses',courseRoute);
app.use('/location',location);
app.use('/faculties',facultyRoute);
app.use('/departments',departmentRoute);
app.use('/attendance',attendance);
app.use('/schedule',schedule)
app.use("/request",request)
app.use('/staff',staff)
app.use('/HOD', HOD);
app.use('/courseInstructor', courseInstructor);
app.use((req, res) => {
  res.status(404).send({ err: 'No such url' })
})


if(process.env.NODE_ENV==='production'){
  app.use(express.static('client/build'))


  app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'client','build','index.html'))
  })
}



const port =  process.env.PORT|| 5000;

console.log(process.env.PORT)

  app.listen(port, () => console.log(`Server up and running on ${port}`))






