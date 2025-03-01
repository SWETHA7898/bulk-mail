const express=require("express")
const cors=require("cors")
const mongoose=require("mongoose")
const allowedOrigins = ['https://bulk-mail-frontend.onrender.com'];



const app=express()


app.use(cors({
  origin: allowedOrigins,
  credentials: true, // if using cookies/auth
}));


app.use(express.json())

const nodemailer=require("nodemailer")

mongoose.connect("mongodb+srv://swetha:123@cluster0.h8ebz.mongodb.net/mail?retryWrites=true&w=majority&appName=Cluster0").then(function(){
    console.log("Database connected")
}).catch(function(){
    console.log("not connected")
})

const credentials=mongoose.model("credential",{},"bulkmail")






app.post("/sendmail",function(req,res){
   
var message=req.body.msg
var email=req.body.email
credentials.find().then(function(data){
   
    const transporter=nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:data[0].toJSON().user,
            pass:data[0].toJSON().pass
        },
    })
    new Promise( async function(resolve,reject){
        try{
    
            for(i=0;i<email.length;i++){
                await transporter.sendMail(
                    {
                        from:"swethamurugesh1@gmail.com",
                        to:email[i],
                        subject:"A message from bulk mail",
                        text:message
                    },
            )
            console.log("email is sent"+email)
            
            
            }
            resolve("success")
           
        }
        catch(error){
          reject("failed")
            
        }
        
        
    }).then(function(message){
        res.send(true)
    }).catch(function(){
        res.send(false)
    })
    
    
}).catch(function(error){
    console.log(error)})


   
})

app.listen("3000",function(){
    console.log("server started...")
})