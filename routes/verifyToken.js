const jwt = require('jsonwebtoken')
const logoutModel = require('../models/logout.model')




const verify=async (req, res,next)=>{
 // console.log("lala")
    const token= req.headers.token
    console.log("tookkkkkeeen")
    console.log(token)
   
    const s=await logoutModel.find({token:token})
  //  console.log(s)
    if( token!=null&& s!=null && s.length>0){
      return res.status(401).send('Access deined, you are not loggod in') 
    }
    if(!token)  
    {
        return res.status(401).send('Access deined')
    }
   try{
   // console.log(token)
        const verified= await jwt.verify(token,"HS256")
         req.user=verified
     //    console.log(req.user)
        
        
         //return res.send("SUCCESS")
         next()
    }
    catch(err){
      res.status(400).send('Invalid Request')
        err
    }
}
module.exports = {verify}