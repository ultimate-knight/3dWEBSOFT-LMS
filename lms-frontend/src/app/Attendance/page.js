"use client"
import { useState,useEffect } from "react";
import Image from "next/image";
import Sidebar from "@/Components/Sidebar";
import api from "@/lib/page";
import Overheadbar from "@/Components/Overheadbar";
import Link from "next/link";
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


export default function Attendance() {
  const [attend,setAttend]=useState([])
  

  useEffect(()=>{
    async function attendfunc(){
      const res=await api.get("/attendance")
        console.log("rsult attendance",res.data.data)
      setAttend(res.data.data)
    }

    attendfunc()
  },[])
  
  const presenter=attend.filter(x=>x.status==="present").length
  const absenter=attend.filter(x=>x.status==="absent").length
  const attender=attend.length ? Math.floor((presenter/attend.length)*100) : 0
  return (
    <div className="flex  bg-white text-black z-20 min-w-screen overflow-hidden min-h-screen font-sans ">
          <Sidebar />
          <div className="flex z-50 flex-col flex-1 min-w-0 w-full bg-gray-200  min-h-screen items-start justify-start  ">
          
            <Overheadbar/>
            <div className="flex flex-col w-full justify-start p-7 gap-7">

                <div className="flex w-full flex-col gap-1">
                            <p className="font-bold text-3xl">My Attendance</p>
                            <p className="text-gray-600 text-lg">Track your personal attendance record</p>
                </div>
                <div className="w-full grid grid-cols-3 gap-4 truncate line-clamp-2">
                    <div className="p-4 border-1 flex shadow-md shadow-gray-600 flex-col gap-3 bg-white border-black rounded-2xl">
                            <p className="font-bold text-2xl">Overall Attendance</p>
                            <p className="font-bold text-2xl">{attender}%</p>
                            <div className="w-full h-3 bg-gray-200 rounded-2xl">
                                <div style={{width:`${attender}%`}} className="bg-blue-500 h-3  rounded-2xl"></div>
                            </div>
                    </div>
                    <div className="p-4 border-1 shadow-md shadow-gray-600 border-black bg-white flex flex-col gap-3 rounded-2xl">
                         <p className="font-bold text-2xl">Present Days</p>
                            <p className="font-bold text-2xl">{presenter} days</p>
                    </div>
                    <div className="p-4 border-1 shadow-md shadow-gray-600 border-black flex flex-col gap-3 bg-white rounded-2xl">
                         <p className="font-bold text-2xl">Absent Days</p>
                            <p className="font-bold text-2xl">{absenter} days</p>
                    </div>
                    
                </div>
               
                     <div className="w-full border-1 shadow-md shadow-gray-600 rounded-2xl border-black bg-white p-7 grid grid-cols-1 truncate line-clamp-2  gap-4">
                                    <div className="flex flex-col gap-4 w-full">
                                        <p>Recent Attendance</p>
                                        
                                        <div className="grid grid-cols-3 font-bold gap-10">
                                            <p>Date</p>
                                            <p>Course</p>
                                            <p>Status</p>
                                        </div>
                                         {
                                           attend.map((x)=>(
                                        <>
                                        <div key={x.id}  className="w-full bg-gray-200 h-1">
                                              
                                        </div>
                                        <div className="grid grid-cols-3 gap-10">
                                               <p>{x.Date.slice(0,10)}</p>
                                            <p>{x.name}</p>
                                            <p className={`${x.status==="absent"?"bg-red-300 font-bold text-red-700 w-full  rounded-2xl p-1 text-center max-w-[100px]":"bg-green-300 font-bold text-green-700 w-full  rounded-2xl p-1 text-center max-w-[100px]"}`}>{x.status}</p>
                                        </div>
                                        
                                        </>
                                           ))
                                  }
                                        
                                        <div className="w-full bg-gray-200 h-1"></div>
                                    </div>
                                    
                                    
                                 


                        </div>


                  
               

                          </div>
                
          </div>

         </div>
  );
}
  