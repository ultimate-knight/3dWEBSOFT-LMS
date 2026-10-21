"use client"
import { useState,useEffect,useRef } from "react";
import Image from "next/image";
import AdminSidebar from "@/Components/AdminSidebar";
import api from "@/lib/page";
import Overheadbar from "@/Components/Overheadbar";
import Link from "next/link";
import { useParams } from "next/navigation";

import student from "@/data/mock-certificate.json"

import {
  LayoutDashboard,
  Users,
  UserCog,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  BarChart3,
  TrendingUp,
  Brain,
  Bot,
  Target,
  Briefcase,
  Download
} from "lucide-react";


export default function Attendance() {
  const fileInputRef=useRef(null)
  const [data,setData]=useState([])
  const [ider,setIder]=useState(null)
  const [deleter,setDeleter]=useState("")
   {/* name,gender,parent,issue_date,joining_date,leaving_date,grade,exam_label,course_name */}
  const [attend,setAttend]=useState([])
  const [photopreview,setPhotopreview]=useState("")
  const [loading,setLoading]=useState(false)
  const [formdata,setFormdata]=useState({name:"",gender:"",parent:"",issue_date:"",joining_date:"",leaving_date:"",grade:"",exam_label:"",course_name:"",photo:null})
  const [editform,seteditForm]=useState({name:"",gender:"",parent:"",issue_date:"",joining_date:"",leaving_date:"",grade:"",exam_label:"",course_name:"",photo:null})


  function handleLogout() {
    clearAuthSession()
    router.replace("/Adminlogin")
  }

  // const id=useParams();
  const id=useParams();
  
    
    async function deleterg(id){
      const isConfirm=confirm("are u sure u want to delete this");

      if(!isConfirm){
        return;
      }

      const response=await api.delete(`/certificate/${id}`)

      console.log("response",response)

      setData(prev=>prev.filter(x=>x.id!==id));


    }
    
    
    function handleLogout() {
      clearAuthSession()
      router.replace("/Adminlogin")
    }
  

  
 
  

  


  useEffect(()=>{
    async function getter(){
      const response=await api.get("/certificate")
      setData(response.data.data)
    }
    getter()
  },[])

  
  
  const presenter=attend.filter(x=>x.status==="present").length
  const absenter=attend.filter(x=>x.status==="absent").length
  const attender=attend.length ? Math.floor((presenter/attend.length)*100) : 0;

  {/* name,gender,parent,issue_date,joining_date,leaving_date,grade,exam_label,course_name */}

  // const [editform,seteditForm]=useState({name:"",gender:"",parent:"",issue_date:"",joining_date:"",leaving_date:"",grade:"",exam_label:"",course_name:"",photo:null})
  async function Editer(cander){
    
    const response=await api.put(`/certificate/${cander.id}`,{
        name:cander.name,
        gender:cander.gender,
        parent:cander.parent,
        course_name:cander.course_name,
        issue_date:cander.issue_date,
        joining_date:cander.joining_date,
        leaving_date:cander.leaving_date,
        grade:cander.grade,
        exam_label:cander.exam_label,
        photo:cander.photo
    })

    console.log("response",response)
    setIder(null)


  }

  async function handleSubmit(e){
    e.preventDefault()
    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL)
    
    try {
      setLoading(true)
      const data=new FormData()
      

      data.append("name",formdata.name);
      data.append("gender",formdata.gender);
      data.append("parent",formdata.parent);
      data.append("issue_date",formdata.issue_date);
      data.append("joining_date",formdata.joining_date);
      data.append("leaving_date",formdata.leaving_date);
      data.append("grade",formdata.grade);
      data.append("exam_label",formdata.exam_label);
      data.append("course_name",formdata.course_name);
      data.append("photo",formdata.photo);


      console.log("URL:", `${process.env.NEXT_PUBLIC_API_URL}/certificate/`)
console.log("PHOTO:", formdata.photo)
console.log("FORMDATA:", [...data.entries()])
  
  
      const response=await api.post("/certificate/",data)
      console.log("response",response.data)
   
      
    } catch (error) {
      console.log("error",error.message)
      
    }finally{
      setTimeout(()=>{
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setLoading(false)
        setFormdata({name:"",gender:"",parent:"",issue_date:"",joining_date:"",leaving_date:"",grade:"",exam_label:"",course_name:"",photo:null})
        setPhotopreview("")
      },3000)
     

    }
    
    
  }

  {/* name,gender,parent,issue_date,joining_date,leaving_date,grade,exam_label,course_name */}
  
  return (
    <div className="flex  bg-white text-black z-20 min-w-screen overflow-hidden min-h-screen font-sans ">
        
          <AdminSidebar/>
          <div className="flex z-50 pt-10 flex-col flex-1 min-w-0 w-full bg-gray-200  min-h-screen items-start justify-start  ">
            <div className="ml-auto p-5">          
                <button
          type="button"
          onClick={handleLogout}
          className="p-2 w-full max-w-[100px] bg-blue-500 text-center rounded-xl font-bold text-white"
        >
          Logout
        </button>
        </div>

          
            {/* <Overheadbar/> */}
            <div className="flex flex-col w-full justify-start p-7 gap-7">

                <div className="flex w-full flex-col items-start justify-start">
                            {/* <p className="font-bold text-3xl">Student Certificate Zone</p> */}
                           
                </div>
                <div className="w-full flex flex-col relative p-5 border-1 border-black rounded-2xl">
                    <div className="absolute top-0 w-full h-15 flex items-start left-0 rounded-t-2xl p-4 bg-green-900 text-white font-bold">
                        <p className="font-bold text-white text-2xl">Student Certification Zone</p>
                    </div>
                <div className="w-full mt-20 rounded-2xl  flex flex-col gap-5 truncate border-2 p-5 border-gray-400 line-clamp-2">
                {/* name,gender,parent,issue_date,joining_date,leaving_date,grade,exam_label,course_name */}
                  <div className="w-full p-5 border-1 border-black rounded-lg">
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-5 gap-y-6 w-full">
                      <div className="flex flex-col gap-2">
                      <label>Name</label>
                      <input value={formdata.name} onChange={(e)=>setFormdata({...formdata,name:e.target.value})} placeholder="name" className="border-1 border-black p-1 rounded-lg" required/>
                      </div>
                      <div className="flex flex-col gap-2">
                      <label>Gender</label>
                      <select value={formdata.gender} onChange={(e)=>setFormdata({...formdata,gender:e.target.value})} className="border-1 border-black p-1 rounded-lg" required>
                        <option value="">Select gender</option>
                        <option value="male">male</option>
                        <option value="female">female</option>
                      </select>
                      </div>
                      <div className="flex flex-col gap-2">
                      <label>Parent</label>
                      <input value={formdata.parent} onChange={(e)=>setFormdata({...formdata,parent:e.target.value})} className="border-1 border-black p-1 rounded-lg" placeholder="parent" required/>
                      </div>
                      <div className="flex flex-col gap-2">
                      <label>Issue_date</label>
                      <input value={formdata.issue_date} onChange={(e)=>setFormdata({...formdata,issue_date:e.target.value})} className="border-1 border-black p-1 rounded-lg" type="date" required/>
                      </div>
                      <div className="flex flex-col gap-2">
                      <label>Joining_date</label>
                      <input value={formdata.joining_date} onChange={(e)=>setFormdata({...formdata,joining_date:e.target.value})} className="border-1 border-black p-1 rounded-lg" type="date" required/>
                      </div>
                      <div className="flex flex-col items-start justify-start gap-2">
                      <label>Leaving_date</label>
                      <input value={formdata.leaving_date} onChange={(e)=>setFormdata({...formdata,leaving_date:e.target.value})} className="border-1 w-full border-black p-1 rounded-lg" type="date" required/>
                      </div>
                      <div className="flex flex-col items-start justify-start gap-2">
                      <label>Grade</label>
                      <input value={formdata.grade} onChange={(e)=>setFormdata({...formdata,grade:e.target.value})} className="border-1 w-full border-black p-1 rounded-lg" type="text" placeholder="Grade" required/>
                      </div>
                      <div className="flex flex-col items-start justify-start gap-2">
                      <label>Course_name</label>
                      <input value={formdata.course_name} onChange={(e)=>setFormdata({...formdata,course_name:e.target.value})} className="border-1 w-full border-black p-1 rounded-lg" type="text" placeholder="course name" required/>
                      </div>
                      <div className="flex flex-col items-start justify-start gap-3">
                      <label>Exam</label>
                      <input value={formdata.exam_label} onChange={(e)=>setFormdata({...formdata,exam_label:e.target.value})} className="border-1 w-full border-black p-1 rounded-lg" type="text" placeholder="exam" required/>
                      <button type="submit" className="border-1 border-white bg-blue-800 p-2 max-w-[200px] text-white font-bold rounded-lg">Submit</button>
                      </div>
                      
                      <div className="flex flex-col gap-3">
                      <label>Choose photo</label>
                      {photopreview && <img src={photopreview} alt="no photo provided" className="h-32 w-32 rounded-lg"/>}
                      <input ref={fileInputRef} className="border-1 w-full border-black p-1 rounded-lg"  type="file" accept="image/*" onChange={(e) => {

const file = e.target.files[0]

setFormdata({
    ...formdata,
    photo: file
})

setPhotopreview(
    URL.createObjectURL(file)
)

}} required/>
{/* <button type="submit" className="border-1 border-white bg-blue-800 p-2 max-w-[200px] text-white font-bold rounded-lg">Submit</button> */}
</div>
                      <div className="flex items-center justify-center overflow-auto ">
                      
                      </div>
                    </form>
                  </div>
                                    <div className="overflow-x-auto flex flex-col justify-between gap-y-7">
                                 <div className="grid  grid-cols-[70px_180px_150px_150px_120px_140px_220px] gap-4">
                                    <p className="font-bold ">S.No.</p>
                                    <p className="font-bold ">Name</p>
                                    <p className="font-bold ">Roll Number</p>
                                    <p className="font-bold ">Course</p>
                                    <p className="font-bold ">Exam</p>
                                    <p className="font-bold ">Certificate</p>
                                    <p className="font-bold ">Actions</p>
                                 </div>
                                 {

                                    data.map(x=>(
                                      
                                     
                                        <div key={x.id} className="grid   grid-cols-[70px_180px_150px_150px_120px_140px_220px] gap-4  ">
                                        
                                        <p className="w-full max-w-[10vw]">{x.id}</p>
                                        {x.id===ider?<input type="text" className="border-1 border-black break-words p-1 rounded-lg  text-black" value={x.name} onChange={(e)=>{const newdata=data.map(row=>row.id===x.id?{...row,name:e.target.value}:row);setData(newdata)}}/>:<p className="break-all">{x.name}</p>}
                                        <p className="break-words">{x.roll_no}</p>
                                        {x.id===ider?<input type="text" className="border-1 border-black break-words p-1 rounded-lg  text-black" value={x.course_name} onChange={(e)=>{const newdata=data.map(row=>row.id===x.id?{...row,course_name:e.target.value}:row);setData(newdata)}}/>:<p className="break-words line-clamp-3">{x.course_name}</p>}
                                        {x.id===ider?<input className="border-1 border-black p-1 rounded-lg break-words  text-black" value={x.exam_label} onChange={(e)=>{const newdata=data.map(row=>row.id===x.id?{...row,exam_label:e.target.value}:row);setData(newdata)}}/>:<p className="break-words">{x.exam_label}</p>}
                                        <Link href={`/Certificator/${x.id}`} className="text-center   flex flex-col items-center justify-center text-white rounded-sm bg-blue-600  cursor-pointer p-1.5">
                                            <Download/>
                                        </Link>
                                        <div className="flex gap-3 w-[800px]">
                                            <button onClick={()=>deleterg(x.id)} className="w-full max-w-[100px] cursor-pointer p-1 text-center bg-red-600 rounded-lg text-white font-bold">Delete</button>
                                            {x.id===ider?<button onClick={()=>Editer(x)} className=" w-full max-w-[100px]  p-2 bg-blue-600 rounded-lg text-white cursor-pointer font-bold">Update</button>:<button onClick={()=>setIder(x.id)} className="max-w-[500px] h-auto p-2 bg-blue-600 rounded-lg text-white cursor-pointer font-bold">Edit</button>}
                                        </div>
                                     </div>

                                    ))
                                
}
</div>


                        </div>
                        </div>


                  
               

                          </div>
                
          </div>

         </div>
  );
}
  