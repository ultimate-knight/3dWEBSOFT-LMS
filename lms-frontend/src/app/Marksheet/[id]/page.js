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
    console.log("response",response)
    console.log("Full response:", response);
    console.log("Response data:", JSON.stringify(response.data.data[0].subjects, null, 2));
    console.log("Full API data:", data);
console.log("Subjects value:", data?.subjects);
console.log("Subjects type:", typeof data?.subjects);
console.log("Is array:", Array.isArray(data?.subjects));

    setData(response.data.data[0])
  }
  if (id) {
    getdatabyid(id);
  }
},[id])

function certificatePhotoUrl(photo_url) {
  if (!photo_url) return ""
  if (/^https?:\/\//i.test(photo_url)) return photo_url
  const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "")
  const path = photo_url.startsWith("/") ? photo_url : `/${photo_url}`
  return `${base}${path}`
}

const subjects = Array.isArray(data?.subjects) ? data.subjects : [];

const n = subjects.length;
const n1 = subjects.reduce(
  (total, subject) => total + Number(subject.theory_marks || 0),
  0
);
const n2 = subjects.reduce(
  (total, subject) => total + Number(subject.pratical_marks || 0),
  0
);
const n3 = n1 + n2;

useEffect(() => {
  async function convertPhoto() {
    if (!data || !data.photo_url) return
    const url = certificatePhotoUrl(data.photo_url)
    try {
      const image = await imagetoDataURL(url)
      setPhoto(image)
    } catch (err) {
      console.error(err)
      setPhoto(url)
    }
  }
  convertPhoto()
}, [data])


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


  // async function downloadpdf() {
  //   const imageData = await imagetoDataURL(
  //     `${process.env.NEXT_PUBLIC_API_URL}${data.photo_url}`
  //   )
  //   if (!data || !certificateref.current) return
  //   try {
  //     const htmlpdf = (await import("html2pdf.js")).default
  //     const element = certificateref.current
      
  //     await htmlpdf()
  //       .set({
  //         margin: 0,
  //         filename: `${data.name}-certificate.pdf`,
  //         image: { type: "jpeg", quality: 4 },
  //         html2canvas: { scale: 1, useCORS: true },
  //         jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  //       })
  //       .from(element)
  //       .save()
  //   } catch (err) {
  //     console.error(err)
  //   }
  // }


  async function downloadpdf() {
    if (!data || !certificateref.current) return;
  
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
      ]);
  
      const element = certificateref.current;
  
      // Convert the certificate HTML into a canvas image
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });
  
      const imageData = canvas.toDataURL("image/jpeg", 1);
  
      // Create an A3 portrait PDF
      const pdf = new jsPDF({
        unit: "mm",
        format: "a3",
        orientation: "portrait",
      });
  
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
  
      // Preserve the certificate's aspect ratio
      const ratio = Math.min(
        pageWidth / canvas.width,
        pageHeight / canvas.height
      );
  
      const imageWidth = canvas.width * ratio;
      const imageHeight = canvas.height * ratio;
  
      // Center the certificate on the PDF page
      const x = (pageWidth - imageWidth) / 2;
      const y = (pageHeight - imageHeight) / 2;
  
      pdf.addImage(
        imageData,
        "JPEG",
        x,
        y,
        imageWidth,
        imageHeight
      );
  
      // Download the PDF
      pdf.save(`${data.name}-certificate.pdf`);
  
    } catch (err) {
      console.error("PDF generation failed:", err);
    }
  }

  return (
    <div className="flex flex-col gap-1 bg-white items-center  relative text-black p-10 min-w-screen overflow-hidden min-h-screen font-sans">
            <button type="button" onClick={downloadpdf} className=" cursor-pointer absolute right-10 bg-red-500 text-yellow-400 border-2 border-yellow-500  p-2 rounded-lg font-bold ">Download pdf</button>
              
               {data && (
                    <div key={data.id} ref={certificateref}  className="relative flex flex-col items-center border-2 border-black relative rounded-lg w-[210mm] text-black min-h-[296.5mm] p-[3mm] gap-[3mm] bg-white box-border">
                       <div className="w-0 h-0 border-l-[160px] border-l-transparent border-r-[160px] absolute -left-[27.5mm]  -top-[6.5mm] border-r-transparent border-b-[160px] border-blue-900 rounded-b-[200px] rotate-[-45deg]"></div>
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
                    <div className="w-fit  text-center text-[15px] flex items-center justify-center" style={{color:"yellow",backgroundColor:"#4ABA80",padding:"3mm",textAlign:"center",borderRadius:"20mm",fontWeight:"bold"}}>Head Office:- Plot No. 2-69/6 Near Gowtham Model School, Market Road, Narsingi Telangana - 500089 Head
                    Office(Hyderabad)</div>
                    
                    <div className="flex flex-col items-start  gap-3 font-bold text-[15px]"><p>CNI REG NO: U85499TS2026NPL220500</p><p>DARPAN ID: TS/2026/1176375</p><p>TP-ID:TP202187</p></div>
                    <div className="flex flex-col gap-1 items-center">
                    <p className="font-extrabold text-[45px] " style={{color:"indigo"}}>Marksheet</p>
                    
                    <p className="font-bold text-2xl">(Session : 2026-2027)</p>
                    </div>
                    <div className="flex gap-5 w-full justify-center">
                        <div className="flex gap-5">
                        {(photo || certificatePhotoUrl(data.photo_url)) && (
  <img
    src={photo || certificatePhotoUrl(data.photo_url)}
    className="w-[27mm] rounded-lg border-1 border-black rounded-2xl h-auto"
    crossOrigin="anonymous"
    />)}
    <div className="flex flex-col gap-0.5">
        <p><span className="font-bold">Student</span> : {data.name}</p>
        <p><span className="font-bold">Father</span> : {data.parent}</p>
        <p><span className="font-bold">Mother</span> : {data.mother}</p>
        <p><span className="font-bold">DOB</span> : {data.DOB?.slice(0,10) || "N/A"}</p>
        <p><span className="font-bold">Roll No</span> : {data.roll_no}</p>
    </div>
    
    
                        </div>
                        <div className="flex gap-3 justify-center items-center">
    <div className="flex flex-col gap-0.5">
        <p><span className="font-bold">Marksheet No</span> : {data.Marksheet_no}</p>
        <p><span className="font-bold">Issue Date</span> :  {data.issue_date.slice(0,10)}</p>
        <p><span className="font-bold">Course</span> : {data.course_name}</p>
       
    </div>
    <img src="/qrcode23.png" className="w-[30mm] h-auto"/>
    
    
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 mt-10">
                    <p className="font-bold text-2xl">Marks details</p>
                    <div className="flex flex-col">
                    <div className="flex ">
                                <p className="border-1 flex flex-col items-center justify-center border-black w-[240px] p-2 font-bold text-center h-auto  bg-gray-400">SUBJECT-NAME</p>
                                <p className="border-1 flex flex-col items-center justify-center border-black w-[100px] text-center h-auto font-bold  bg-gray-400">THEORY</p>
                                <p className="border-1 flex flex-col items-center justify-center border-black w-[100px] text-center h-auto font-bold  bg-gray-400">PRACTICAL</p>
                                <p className="border-1 flex flex-col items-center justify-center border-black w-[100px] text-center h-auto font-bold  bg-gray-400">OBTAINED</p>
                                <p className="border-1 flex flex-col items-center justify-center border-black w-[100px] text-center h-auto font-bold  bg-gray-400">TOTAL</p>
                            </div>
                
{
subjects.map((x, index) => (
  <div key={index} className="w-full rounded-2xl">
    <div className="flex">
      <p className="border-1 flex items-center justify-center border-black w-[240px] p-2 text-center">
        {x.subject_name}
      </p>

      <p className="border-1 flex items-center justify-center border-black w-[100px] text-center">
        {x.theory_marks}
      </p>

      <p className="border-1 flex items-center justify-center border-black w-[100px] text-center">
        {x.pratical_marks}
      </p>

      <p className="border-1 flex items-center justify-center border-black w-[100px] text-center">
        {Number(x?.theory_marks || 0) + Number(x?.pratical_marks || 0)}
      </p>

      <p className="border-1 flex items-center justify-center border-black w-[100px] text-center">
        {40}
      </p>
    </div>
  </div>
))}
<div className="flex ">
                                <p className="border-1 flex flex-col items-center justify-center border-black w-[240px] p-2 text-center h-auto  0">TOTAL</p>
                                <p className="border-1 flex flex-col items-center justify-center border-black w-[100px] text-center h-auto ">{subjects.reduce((x,y)=>Number(x)+Number(y.theory_marks),0)}</p>
                                <p className="border-1 flex flex-col items-center justify-center border-black w-[100px] text-center h-auto ">{subjects.reduce((x,y)=>Number(x)+Number(y.pratical_marks),0)}</p>
                                <p className="border-1 flex flex-col items-center justify-center border-black w-[100px] text-center h-auto ">{n1+n2}</p>
                                <p className="border-1 flex flex-col items-center justify-center border-black w-[100px] text-center h-auto ">{40*n}</p>
                            </div>
                    </div>
                    </div>
                    <div className="flex gap-5 items-center  justify-center w-full font-bold">
                        <p>Total Obtained Marks : {n1+n2}</p>
                        <p>Total Percent : {(n1+n2).toFixed(2)*100/(40*n)}%</p>
                        <p>Grade : {(n3*100).toFixed(2)/(40*n)>=90?"A+":((n1+n2)*100/(40*n))>=80?"B+":((n1+n2)*100/(40*n))>=70?"C+":((n1+n2)*100/(40*n))>=60?"D+":((n1+n2)*100/(40*n))>=50?"E+":"F"}</p>
                        <p>Result : Pass</p>
                    </div>
                    <div className="flex flex-col items-center w-full  gap-[1mm]">
                        <p className="font-bold text-[20px] mt-[5mm]">We are Recognised From :-</p>
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
                    <div className="w-0 h-0 border-l-[160px] border-l-transparent border-r-[160px] absolute -right-[28mm]  -bottom-[6mm] border-r-transparent border-b-[160px] border-blue-900 rounded-b-[200px] rotate-[135deg]"></div>
                        <p className="font-bold text-[20px] ">Authority Sign :</p>
                        <div className="flex gap-[3mm] items-center -mt-[3mm] justify-center w-full">
                            <img className="w-[23mm] " src="/santosh34.png"/>
                            <img className="w-[23mm] " src="/Singature-Photoroom.png"/>
                            <img className="w-[23mm] " src="/sealsign.png"/>
                            
                            <img className="w-[22mm] " src="/anuradha23.png"/>
                            
                            
                        </div>
                    </div>
                </div>

)  
}

         </div>
         
  )
}
