"use client"
import Image from "next/image";
import { useState,useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

export default function AdminSidebar() {
    const [clicker,setClicker]=useState(null)
    const [licker,setLicker]=useState(null)

    const pathname=usePathname()


    useEffect(()=>{
        if(pathname==="/Admin"){
            setClicker("Admin")
        }else if(pathname==="/Courses"){
          setClicker("Students")
        }else if(pathname==="/Attendance"){
          setClicker("Trainers")
        }else if(pathname==="/Exams"){
          setClicker("Courses")
        }else if(pathname==="/Results"){
           setClicker("Attendance")
        }else if(pathname==="/Ai"){
           setClicker("Exams")
        }else if(pathname==="/Skill"){
           setClicker("Skilled")
        }else if(pathname==="/Placement"){
           setClicker("Analytics")
        }else if(pathname==="/Profile"){
           setClicker("Aicenter")
        }else if(pathname==="/Admincertificate"){
           setClicker("Admincertificate")
        }
    },[])

  return (
    <div className="flex flex-col gap-10 p-5 z-20   items-center justify-start min-h-screen min-w-80 bg-blue-950 text-white font-sans ">
                        <div className="flex gap-6 items-center">
                            <img src="/3dwebsoft.jpeg" className="w-28 h-auto rounded-2xl"/>
                            <p className="text-xl font-bold">LMS-<span className="text-green-500">PORTAL</span></p>
                        </div>
                        <div className="flex flex-col justify-start w-full gap-5">
                                <p className="text-gray-500 uppercase">Main</p>
                                <Link   href="/Admin" className={`text-lg flex hover:bg-blue-500 rounded-2xl gap-5 p-2 ${clicker==="Admin"?"bg-blue-500  w-full  rounded-2xl":""}`}>
                                <LayoutDashboard size={25}/>
                                <p>Dashboard</p>
                                </Link>
                                 <Link   onClick={()=>setClicker("Students")} href="/Admin" className={`text-lg flex hover:bg-blue-500 rounded-2xl gap-5 p-2 ${clicker==="Students"?"bg-blue-500  w-full  rounded-2xl":""}`}>
                                <Users size={25}/>
                                <p>Add Student</p>
                                </Link>
                                 <Link  onClick={()=>setClicker("Trainers")} href="/Admin" className={`text-lg flex hover:bg-blue-500 rounded-2xl gap-5 p-2 ${clicker==="Trainers"?"bg-blue-500  w-full  rounded-2xl":""}`}>
                                <UserCog size={25}/>
                                <p>Add Student Attendance</p>
                                </Link>
                                 <Link onClick={()=>setClicker("Courses")} href="/Admin" className={`text-lg flex hover:bg-blue-500 rounded-2xl gap-5 p-2 ${clicker==="Courses"?"bg-blue-500  w-full  rounded-2xl":""}`}>
                                <BookOpen size={25}/>
                                <p>Add Exams</p>
                                </Link>
                                 <Link onClick={()=>setClicker("Attendance")} href="/Admin"className={`text-lg flex hover:bg-blue-500 rounded-2xl gap-5 p-2 ${clicker==="Attendance"?"bg-blue-500  w-full  rounded-2xl":""}`}>
                                <CalendarCheck size={25}/>
                                <p>Add Results</p>
                                </Link>
                        </div>
                          <div className="flex flex-col justify-start w-full gap-5">
                                <p className="text-gray-500 uppercase">Certificate section</p>
                                <Link onClick={()=>setClicker("Exams")} href="/Admincertificate" className={`text-lg flex hover:bg-blue-500 rounded-2xl gap-5 p-2 ${clicker==="Admincertificate"?"bg-blue-500  w-full  rounded-2xl":""}`}>
                                <ClipboardList size={25}/>
                                <p>Add Certificate</p>
                                </Link>
                               
                               
                        </div>
                          <div className="flex flex-col justify-start w-full gap-5">
                                <p className="text-gray-500 uppercase">Account</p>
                                <Link onClick={()=>setClicker("Aicenter")} href="/Profile" className={`text-lg hover:bg-blue-500 rounded-2xl flex gap-5 p-2 ${clicker==="Aicenter"?"bg-blue-500  w-full  rounded-2xl":""}`}>
                                <Brain size={25}/>
                                <p>My Profile</p>
                                </Link>
                                <iframe
  src="https://www.youtube.com/embed/Gp7R-8zHE_A"
  title="YouTube video"
  className="w-full aspect-video rounded-lg"
  allowFullScreen
/>
                                {/* <Link onClick={()=>setClicker("Admin")} href="/Admin" className={`text-lg hover:bg-blue-500 rounded-2xl flex gap-5 p-2 ${clicker==="Admin"?"bg-blue-500  w-full  rounded-2xl":""}`}>
                                <Target size={25}/>
                                <p>Admin</p>
                                </Link> */}
                        </div>
                        
         </div>
  );
}
