"use client"
import { useState, useEffect,useRef } from "react"
import { useParams } from "next/navigation"
import api from "@/lib/page"
import { fetchStudentStats } from "@/lib/stats"

export default function Certificator() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [photo,setPhoto]=useState(null)
  const [data,setData]=useState(null)


  const {id}=useParams();


useEffect(()=>{
  async function getdatabyid(id){
    const response=await api.get(`/certificate/${id}`)
    console.log("response",response)

    setData(response.data.data[0])
  }
  if (id) {
    getdatabyid(id);
  }
},[id])

useEffect(()=>{
  async function convertPhoto(){
    if(!data || !data.photo_url) return;

    
    const image=await imagetoDataURL(`${process.env.NEXT_PUBLIC_API_URL}${data.photo_url}`)

    setPhoto(image)
  }

  convertPhoto()
  
},[data])
  

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchStudentStats(api)
        setStats(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  

  const certificateref=useRef(null)



  async function imagetoDataURL(url){
    const response=await fetch(url)
    if(!response.ok){
      throw new Error(`Image fetch failed ${response.status} ${url}`)
    }

    const blob=await response.blob()

    return new Promise((resolve,reject)=>{
      const reader=new FileReader()

      reader.onloadend=()=>resolve(reader.result)

      reader.onerror=reject;

      reader.readAsDataURL(blob)
    })
  }


  async function downloadpdf() {
    const imageData = await imagetoDataURL(
      `${process.env.NEXT_PUBLIC_API_URL}${data.photo_url}`
    )
    if (!data || !certificateref.current) return
    try {
      const htmlpdf = (await import("html2pdf.js")).default
      const element = certificateref.current
      
      await htmlpdf()
        .set({
          margin: 0,
          filename: `${data.name}-certificate.pdf`,
          image: { type: "jpeg", quality: 4 },
          html2canvas: { scale: 1, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(element)
        .save()
    } catch (err) {
      console.error(err)
    }
  }
  


  return (
    <div className="flex flex-col gap-1 bg-white items-center  relative text-black p-10 min-w-screen overflow-hidden min-h-screen font-sans">
            <button onClick={downloadpdf} className=" cursor-pointer absolute right-10 bg-red-500 text-yellow-400 border-2 border-yellow-500  p-2 rounded-lg font-bold ">Download pdf</button>
              
               {data && (
                    <div key={data.id} ref={certificateref}  className="relative flex flex-col items-center border-2 border-black rounded-lg w-[210mm] text-black h-[297mm] p-[3mm] gap-[3mm] bg-white box-border overflow-hidden">
                        <div className="absolute inset-0 z-50 pointer-events-none z-0 pointer-events-none flex items-center   justify-center">
                <img src="/computer12.jpeg" className="w-[700px] h-auto rounded-2xl opacity-10 "/>
                </div>
                    <img src="/computer12.jpeg" className="w-[35mm] h-auto"/>
                    <p className="font-extrabold text-[20px]" style={{color:"green"}}>3DWEBSOFT FOUNDATION</p>
                    <div
  style={{
    // color: "yellow",
    // backgroundColor: "green",
    borderRadius: "30px",

    // Explicit alignment
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    verticalAlign: "middle",
    width:"90%",
    fontSize:"15px",


    // Stable dimensions and text rendering
    minHeight: "14mm",
    padding: "4px 16px",
    lineHeight: "1.4",
    boxSizing: "border-box",
    margin: "0 auto"
  }}
>
  <p className="relative z-10 font-bold">An ISO 9001:2015 Certified & Registered Under MCA,
  The Government of India</p>
</div>
                    <div className="w-fit  text-center text-[15px] flex items-center justify-center" style={{color:"yellow",backgroundColor:"blue",padding:"3mm",textAlign:"center",borderRadius:"20mm",fontWeight:"bold"}}>Head Office:- Plot No. 2-69/6 Near Gowtham Model School, Market Road, Narsingi Telangana - 500089 Head
                    Office(Hyderabad)</div>
                    {/* <p className=" w-fit max-w-full    text-[15px]   font-bold " style={{color:"yellow",backgroundColor:"green",padding:"3mm 6mm",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1.2,minHeight:"18mm",margin:0,textAlign:"center",boxSizing:"border-box",borderRadius:"20mm",fontWeight:"bold"}}>An ISO 9001:2015 Certified & Registered Under MCA, The Government of India</p> */}
                    {/* <div
  style={{
    color: "yellow",
    backgroundColor: "green",
    borderRadius: "30px",

    // Explicit alignment
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    verticalAlign: "middle",
    width:"90%",
    fontSize:"15px",


    // Stable dimensions and text rendering
    minHeight: "14mm",
    padding: "4px 16px",
    lineHeight: "1.4",
    boxSizing: "border-box",
    margin: "0 auto"
  }}
>
  <p className="relative z-10 font-bold">An ISO 9001:2015 Certified & Registered Under MCA,
  The Government of India</p>
</div> */}
                    <div className="flex flex-col items-start  gap-3 font-bold text-[15px]"><p>CNI REG NO: U85499TS2026NPL220500</p><p>DARPAN ID: TS/2026/1176375</p><p>TP-ID:TP202187</p></div>
                    {/* <p>Head Office:- Plot No. 2-69/6 Near Gowtham Model School, Market Road, Narsingi Telangana - 500089 Head
                    Office(Hyderabad)</p> */}
                    <p className="font-extrabold text-[25px] " style={{color:"indigo"}}>Certificate</p>
                    <p className="text-[20px] font-bold">({data.course_name})</p>
                    <p className="text-[20px]">This is to Certify that</p>
                    <p className="text-[25px] font-bold " style={{color:"green"}}>{data.name}</p>
                    <div className="flex w-full  items-center justify-center gap-[4mm] ">
                    {photo  && (
  <img
    src={photo}
    crossOrigin="anonymous"
    className="w-[27mm] rounded-lg border-1 border-black rounded-2xl h-auto"
  />
)}
                        <div className="flex min-w-0 text-[13px] flex-col  gap-[1mm]">
                        <p className=":w-[50vw]">{data.gender==="female"?"D/O":"S/O"} <span className="font-bold">{data.parent}</span>  has been awarded with <span className="font-bold">{data.course_name}</span> course after
completed the curriculum from our Institute 3DWEBSOFT FOUNDATION (IC :
<span className="font-bold">IID26036205</span>) During <span className="font-bold">{data.joining_date.slice(0,10)}</span> To <span className="font-bold">{data.leaving_date.slice(0,10)}</span> with grade <span className="font-bold">{data.grade}</span> and were given under
our regular supervision.</p>
<p className=":w-[50vw]">{data.gender==="female"?"She":"He"} has successfully completed the prescribed curriculum under the regular supervision and guidance of the institute and has demonstrated satisfactory performance throughout the course.</p>
<p className=":w-[50vw]">In recognition of {data.gender==="female"?"her":"his"} successful completion and performance, {data.gender==="female"?"She":"He"} has been awarded with grade <span className="font-bold">{data.grade}.</span></p>
</div>
                    </div>
                    <div className="flex w-full items-center   gap-[2mm]">
                        <img src="/qrcode23.png" className="w-[30mm] h-auto"/>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col text-[13px] gap-[0.5mm] font-bold">
                                <p>Enrollment Number :{data.enrollment_id}</p>
                                <p>Roll Number : {data.roll_no}</p>
                                <p>Certificate Number : {data.certificate_no}</p>
                                <p>Issue Date : {data.issue_date.slice(0,10)}</p>
                                <p>Course Name : {data.course_name}</p>                          
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center w-full  gap-[1mm]">
                        <p className="font-bold text-[20px] ">We are Recognised From :-</p>
                        <div className="flex gap-[3mm] items-center justify-center w-full">
                            <img className="w-[17mm] " src="/external.png"/>
                            <img className="w-[17mm] " src="/iso9001.jpeg"/>
                            <img className="w-[17mm] " src="/skillindia.png"/>
                            <img className="w-[17mm] " src="/iaf.png"/>
                            <img className="w-[17mm] " src="/msme.png"/>
                            <img className="w-[17mm] " src="/pmkyc.png"/>
                            <img className="w-[17mm] " src="/nitiayog.png"/>
                        </div>
                    </div>
                    <div className="flex flex-col items-center w-full   gap-[1mm]">
                        <p className="font-bold text-[20px] mt-[5mm]">Authority Sign :</p>
                        <div className="flex gap-[3mm] items-center -mt-[3mm] justify-center w-full">
                            <img className="w-[20mm] " src="/santosh34.png"/>
                            <img className="w-[20mm] " src="/Singature-Photoroom.png"/>
                            <img className="w-[28mm] " src="/sealsign.png"/>
                            
                            <img className="w-[20mm] " src="/anuradha23.png"/>
                            
                            
                        </div>
                    </div>
                </div>

)  
}

         </div>
         
  )
}
