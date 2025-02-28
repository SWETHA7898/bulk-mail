


const fileInput=document.getElementById("filedocument")

fileInput.addEventListener("change",function(event){
    const file=event.target.files[0]
    const reader=new FileReader()

    reader.onload=function(event){
        const data=event.target.result
        const workbook=XLSX.read(data,{type:"binary"})
        console.log(workbook)
        const sheetname=workbook.SheetNames[0]
        const sheetdata=workbook.Sheets[sheetname]
        const email=XLSX.utils.sheet_to_json(sheetdata,{header:"A"})
        console.log(email)
    }


    reader.readAsBinaryString(file)
})