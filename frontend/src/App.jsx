import { useState } from "react"
import axios from "axios";
import * as XLSX from "xlsx"







function App(){

  const[msg,setmsg]=useState("")
  const[status,setstatus]=useState(false)
  const[email,setemail]=useState([])


  

  function handlemsg(evt){
    setmsg(evt.target.value)
  }

  function handlemail(event){
    const file=event.target.files[0]
    const reader=new FileReader()

    reader.onload=function(event){
        const data=event.target.result
        const workbook=XLSX.read(data,{type:"binary"})
        console.log(workbook)
        const sheetname=workbook.SheetNames[0]
        const sheetdata=workbook.Sheets[sheetname]
        const email=XLSX.utils.sheet_to_json(sheetdata,{header:"A"})
        const mail=email.map(function(item){
          return item.A
          
        })
        setemail(mail)
        
        console.log(mail)
    }


    reader.readAsBinaryString(file)

  }

  function send(){
    setstatus(true)
    axios.post("http://localhost:3000/sendmail",{msg:msg,email:email})
    .then(function(data){
         if(data.data==true){
          alert("Email sent succesfully")
          setstatus(false)
         }
         else{
          alert("Email failed")
         }
    })
   
  
    

    
  }
  return(

    <div className="bg-black h-screen" style={{backgroundImage:"url(http://emmamcintyrephotography.com/wp-content/uploads/2018/08/email-background-images-1.jpg)",backgroundRepeat:"no-repeat",backgroundSize:"cover"}}>
      <div className=" text-blue-950  font-bold text-center text-3xl">
        <h1 className=" font-medium px-5 py-3 text-3xl">
        
        Bulk mail</h1>
      </div>
      <div className=" text-blue-950 text-center text-3xl">
        <h1 className="font-medium px-5 py-3">We can help your business with sending email at once</h1>
      </div>
      
     

      <div className="flex flex-col  items-center text-center px-5 py-3">
        <textarea  onChange={handlemsg} value={msg}  className="h-32 w-[80%] px-2 py-2 outline-none border border-blue rounded-md
         bg-opacity-20 text-blue-950 placeholder:text-blue-950 text-3xl" placeholder="Enter your text..."
         ></textarea>
        <div className=" mt-15">
        <input onChange={handlemail} type="file" className="border border-blue rounded-md px-4 py-2 mb-6
        bg-opacity-20 text-blue file:text-black file:border-none file:px-3 file:py-1 file:cursor-pointer file:bg-cyan-600" 
        ></input>
        <p className="text-blue text-2xl">Total Emails in the file:{email.length}</p>
        <button onClick={send} className="px-5 py-2 text-black font-medium  text-3xl rounded-md w-fit bg-cyan-600 mt-4">
          {
          status?"Sending":"Send"
          }</button>
      </div>
      

      </div>
      <div className=" text-white text-center p-8">
        <h1 className="font-medium px-5 py-3"></h1>
      </div>
      <div className=" text-white text-center p-8">
        <h1 className="font-medium px-5 py-3"></h1>
      </div>
      
    </div>
  )
}
export default App