"use client"
import { useState,useEffect } from "react";
import Image from "next/image";
import api from "@/lib/page";
import Sidebar from "@/Components/Sidebar";
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


export default function Courses() {
    const [course,setCourse]=useState([])

    useEffect(()=>{
        async function getdata(){
             let res=await api.get("/courses")
        console.log("data",res.data)
        
        setCourse(res.data.data)
        }

        getdata()
       
    },[])
  return (
    <div className="flex  bg-white text-black z-20 min-w-screen overflow-hidden min-h-screen font-sans ">
          <Sidebar />
          <div className="flex z-50 flex-col flex-1 min-w-0 w-full bg-gray-200  min-h-screen items-start justify-start  ">
          
            <Overheadbar/>
            <div className="flex flex-col w-full justify-start p-7 gap-7">

                <div className="flex flex-col gap-1">
                            <p className="font-bold text-3xl">My Courses</p>
                            <p className="text-gray-600 text-lg">Continue learning from where you left off

</p>
                </div>
                <div className="w-full grid grid-cols-3 gap-4">
                        {
                            course.map((x=>(
                                  <div key={x.id} className="bg-white flex flex-col line-clamp-2 truncate gap-3 border-1 min-w-0 border-black rounded-2xl p-6">
                            
                                <div className="w-full p-9 max-w-md bg-gradient-to-l from-indigo-500 via-indigo-700 to-indigo-900 rounded-2xl">
                                    <img src={x.icon} className="w-7 h-7"/>

                                </div>
                                <p className="font-bold text-2xl ">{x.name}</p>
                                <p className="line-clamp-4 truncate">{x.description}</p>
                                <p><span className="font-bold text-xl">Duration:</span> {x.duration} Days</p>
                                
                                <div className="w-full h-3 bg-gray-200 rounded-2xl">
                                    <div style={{width:`${x.pct}%`}} className=" h-full rounded-2xl bg-blue-600"></div>
                                    
                                </div>
                                <p>{x.pct}% Completed</p>
                                
                                <Link href={`/Courses/${x.id}`} className="w-full  p-2 max-w-[100px] text-center rounded-2xl bg-blue-600 text-white font-bold">Continue</Link>
                                
                        </div>

                            )))
                          
}
                </div>
                          </div>
          </div>

         </div>
  );
}
  