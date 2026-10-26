"use client"
import { useState,useEffect,useRef } from "react";
import Image from "next/image";
import AdminSidebar from "@/Components/AdminSidebar";
import api from "@/lib/page";
import Overheadbar from "@/Components/Overheadbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

  const router=useRouter();

  const fileInputRef=useRef(null)
  const [data,setData]=useState([])
  const [ider,setIder]=useState(null)
   {/* name,gender,parent,issue_date,joining_date,leaving_date,grade,exam_label,course_name */}
  const [attend,setAttend]=useState([])
  const [photopreview,setPhotopreview]=useState("")
  const [loading,setLoading]=useState(false)
  const [formdata,setFormdata]=useState({name:"",gender:"",parent:"",issue_date:"",joining_date:"",leaving_date:"",grade:"",exam_label:"",course_name:"",photo:null,mother:"",DOB:"",subjects:[{subject_name:"",pratical_marks:"",theory_marks:""}]})


  //pagination
  const [currentpage,setCurrentpage]=useState(1)
  const itemsperpage=5


  const totalpages=Math.ceil(data.length/itemsperpage)

  const startIndex=(currentpage-1)*itemsperpage


  const dataslice=data.slice(startIndex,startIndex+itemsperpage);


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
        mother:cander.mother,
        DOB:cander.DOB,
        subjects:cander.subjects,
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
      data.append("mother",formdata.mother);
      data.append("DOB",formdata.DOB);
      data.append("subjects",JSON.stringify(formdata.subjects));
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
        setFormdata({name:"",gender:"",parent:"",issue_date:"",joining_date:"",leaving_date:"",grade:"",exam_label:"",course_name:"",photo:null,mother:"",DOB:"",subjects: [{ subject_name: "", theory_marks: "", pratical_marks: "" }]})
        setPhotopreview("")
      },3000)
     

    }
    
    
  }

  function addsubject(){
    setFormdata({
      ...formdata,
      subjects:[
        ...formdata.subjects,
        {
          subject_name:"",
          theory_marks:"",
          practical_marks:""
        }
      ]
    })
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
          className="px-3 py-3 cursor-pointer w-full max-w-[100px] bg-blue-500 text-center rounded-xl font-bold text-white"
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
                      <label>Father name</label>
                      <input value={formdata.parent} onChange={(e)=>setFormdata({...formdata,parent:e.target.value})} className="border-1 border-black p-1 rounded-lg" placeholder="Father name" required/>
                      </div>
                      <div className="flex flex-col gap-2">
                      <label>Mother name</label>
                      <input value={formdata.mother} onChange={(e)=>setFormdata({...formdata,mother:e.target.value})} className="border-1 border-black p-1 rounded-lg" placeholder="mother name" required/>
                      </div>
                      <div className="flex flex-col gap-2">
                      <label>Issue_date</label>
                      <input value={formdata.issue_date} onChange={(e)=>setFormdata({...formdata,issue_date:e.target.value})} className="border-1 border-black p-1 rounded-lg" type="date" required/>
                      </div>
                      <div className="flex flex-col gap-2">
                      <label>Date of Birth</label>
                      <input value={formdata.DOB} onChange={(e)=>setFormdata({...formdata,DOB:e.target.value})} className="border-1 border-black p-1 rounded-lg" type="date" required/>
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
                      <label>Role</label>
                      <input value={formdata.course_name} onChange={(e)=>setFormdata({...formdata,course_name:e.target.value})} className="border-1 w-full border-black p-1 rounded-lg" type="text" placeholder="course name" required/>
                      </div>
                      
                      <div className="flex flex-col items-start justify-start gap-3">
                      <label>Exam</label>
                      <input value={formdata.exam_label} onChange={(e)=>setFormdata({...formdata,exam_label:e.target.value})} className="border-1 w-full border-black p-1 rounded-lg" type="text" placeholder="exam" required/>
                      <div  className={`flex flex-col gap-6 w-full ${formdata.photo?"mt-40":""}`}>
                      {
                        formdata.subjects.map((x,index)=>(
                          
                            <div key={index} className="flex flex-col gap-5 border-1 border-black rounded-2xl p-4 w-[203%] rounded-lg">
                                <p className="font-bold">Subject:{index+1}</p>
                                <div className="flex flex-col gap-2">
                                  <input type="text" value={x.subject_name} onChange={(e)=>{const updatedsubjects=[...formdata.subjects];updatedsubjects[index].subject_name=e.target.value;setFormdata({...formdata,subjects:updatedsubjects})}} className="border-1 w-full border-black p-2 text-black rounded-lg" placeholder="write subject name"/>
                                  <div className="flex flex-col gap-2 w-full">
                                  <input type="text" value={x.pratical_marks} onChange={(e)=>{const updatedsubjects=[...formdata.subjects];updatedsubjects[index].pratical_marks=e.target.value;setFormdata({...formdata,subjects:updatedsubjects})}} className="border-1 w-full border-black p-2 text-black rounded-lg" placeholder="write practical marks"/>
                                  <input type="text" value={x.theory_marks} onChange={(e)=>{const updatedsubjects=[...formdata.subjects];updatedsubjects[index].theory_marks=e.target.value;setFormdata({...formdata,subjects:updatedsubjects})}} className="border-1 border-black w-full p-2 text-black rounded-lg" placeholder="write theory marks"/>
                                  </div>
                                </div>
                            </div>
                            
                        ))
                      }
                      </div>
                      <button type="button" onClick={addsubject} className="border-1 border-black p-2 rounded-lg text-white bg-green-600 cursor-pointer hover:bg-green-300 font-bold">Add Subject</button>
                      <button type="submit" className="border-1 border-white bg-blue-800 p-2 max-w-[200px] text-white font-bold rounded-lg">Submit</button>
                      </div>
                      
                      <div className="flex flex-col gap-3">
                      <label>Choose photo</label>
                      {photopreview &&  <img src={photopreview} alt="no photo provided" className="h-32 w-32 rounded-lg"/>}
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
                                    <div className="overflow-x-auto flex flex-col border-1 border-black  text-white bg-green-900 pb-6 w-[90vw]  justify-between gap-y-7">
                                 <div className="grid  grid-cols-[70px_180px_150px_150px_120px_170px_140px_220px] text-white p-2  bg-black min-w-screen   gap-4">
                                    <p className="font-extrabold ">S.No.</p>
                                    <p className="font-extrabold ">Name</p>
                                    <p className="font-extrabold">Roll Number</p>
                                    <p className="font-extrabold">Course</p>
                                    <p className="font-extrabold">Exam</p>
                                    <p className="font-extrabold">Marksheet</p>
                                    <p className="font-extrabold">Certificate</p>
                                    <p className="font-extrabold">Actions</p>
                                 </div>
                                 {

                                    dataslice.map(x=>(
                                      
                                     
                                        <div key={x.id} className="grid p-2 bg-green-600 min-w-screen font-medium flex flex-col items-center  grid-cols-[70px_180px_150px_150px_120px_140px_140px_220px] gap-4  ">
                                        
                                        <p className="w-full max-w-[10vw]">{x.id}</p>
                                        {x.id===ider?<input type="text" className="border-1 border-black break-words p-1 rounded-lg  text-black" value={x.name} onChange={(e)=>{const newdata=data.map(row=>row.id===x.id?{...row,name:e.target.value}:row);setData(newdata)}}/>:<p className="break-all">{x.name}</p>}
                                        <p className="break-words">{x.roll_no}</p>
                                        {x.id===ider?<input type="text" className="border-1 border-black break-words p-1 rounded-lg  text-black" value={x.course_name} onChange={(e)=>{const newdata=data.map(row=>row.id===x.id?{...row,course_name:e.target.value}:row);setData(newdata)}}/>:<p className="break-words line-clamp-3">{x.course_name}</p>}
                                        {x.id===ider?<input className="border-1 border-black p-1 rounded-lg break-words  text-black" value={x.exam_label} onChange={(e)=>{const newdata=data.map(row=>row.id===x.id?{...row,exam_label:e.target.value}:row);setData(newdata)}}/>:<p className="break-words">{x.exam_label}</p>}
                                        <Link href={`/Marksheet/${x.id}`} className="text-center   flex flex-col items-center justify-center text-white rounded-sm bg-blue-600  cursor-pointer p-1.5">
                                            <Download/>
                                        </Link>
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

<div className="flex gap-3 items-center justify-center">
  <button disabled={currentpage===1} onClick={()=>setCurrentpage(prev=>Math.max(prev-1,1))} className="text-gray-500 border-1 border-black p-2 font-bold cursor-pointer hover:bg-blue-500 hover:text-white rounded-lg">previous</button>
  {/* {
  Array.from({length:totalpages},(_,i)=>i+1).map((page)=>(
    <div className="flex gap-2" key={page} >
        <button className={`${currentpage===page?"bg-blue-600 px-5 py-2 rounded-lg text-white":"hover:bg-gray-400 px-5 py-2 border-1 border-black rounded-lg text-black"}`} onClick={()=>setCurrenpage(page)}>{page}</button>
    </div>
  )
  )
} */}

{
  Array.from({length:totalpages},(_,i)=>i+1).map((page)=>(
    <div key={page}>
      <button className={`${currentpage===page?"bg-blue-700 px-4 py-2 text-white rounded-lg":"border-1 border-black rounded-lg px-4 py-2 hover:bg-gray-400"}`} onClick={()=>setCurrentpage(page)}>{page}</button>
    </div>
  ))
}
<button disabled={currentpage===totalpages} onClick={()=>setCurrentpage(prev=>Math.min(prev+1,totalpages))} className="text-gray-500 border-1 border-black p-2 font-bold cursor-pointer hover:bg-blue-500 hover:text-white rounded-lg">next</button>

</div>


                        </div>
                        </div>


                  
               

                          </div>
                
          </div>

         </div>
  );
}
  