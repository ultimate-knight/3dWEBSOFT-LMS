"use client"
import Image from "next/image";
import { useState,useEffect } from "react";
import Sidebar from "@/Components/Sidebar";
import Overheadbar from "@/Components/Overheadbar";
import Link from "next/link";
import api from "@/lib/page";
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


export default function Results() {
  const [state,setState]=useState([])

  useEffect(()=>{
      async function funcer(){
        const res=await api.get("/result")

        console.log("result data",res.data.data)

        setState(res.data.data)
      }

      funcer()
  },[])

  return (
    <div className="flex  bg-white text-black z-20 min-w-screen overflow-hidden min-h-screen font-sans ">
          <Sidebar />
          <div className="flex z-50 flex-col flex-1 min-w-0 w-full bg-gray-200  min-h-screen items-start justify-start  ">
          
            <Overheadbar/>
            <div className="flex flex-col w-full justify-start p-7 gap-7">

                <div className="flex flex-col gap-1">
                            <p className="font-bold text-3xl">My Results</p>
                            <p className="text-gray-600 text-lg">Your examination and quiz performance

</p>
                </div>
                  <div className="w-full border-1 shadow-md shadow-gray-600 rounded-2xl border-black bg-white p-7 grid grid-cols-1 truncate line-clamp-2  gap-4">
                                    <div className="flex flex-col gap-4 w-full">
                                      
                                        <div className="grid grid-cols-5 font-bold gap-10">
                                            <p>Assessment</p>
                                            <p>Course</p>
                                            <p>Score</p>
                                            <p>Grade</p>
                                            <p>Status</p>
                                        </div>

                                        <div className="w-full bg-gray-200 h-0.5">
                                              
                                        </div>
              {    
              state.map(x=>(
                  <div key={x.id}  className="grid grid-cols-5 gap-10">
                                               <p>{x.assesment}</p>
                                            <p>{x.name}</p>
                                            <p>{x.score}%</p>
                                            <p>{x.grade}</p>
                                            <p>{x.status}</p>
                                        </div>

              ))                    
                                      
}
                                        {/* <div className="w-full bg-gray-200 h-0.5">
                
                                        </div> */}

                                       {/* <div className="grid grid-cols-5 gap-10">
                                               <p>Python Mid-Term</p>
                                            <p>Python Programming</p>
                                            <p>86%</p>
                                            <p>A</p>
                                            <p>Pass</p>
                                        </div>
                                        <div className="w-full bg-gray-200 h-0.5"></div> */}
                                      {/* <div className="grid grid-cols-5 gap-10">
                                               <p>Python Mid-Term</p>
                                            <p>Python Programming</p>
                                            <p>86%</p>
                                            <p>A</p>
                                            <p>Pass</p>
                                        </div>
                                        <div className="w-full bg-gray-200 h-0.5"></div> */}
                                       {/* <div className="grid grid-cols-5 gap-10">
                                               <p>Python Mid-Term</p>
                                            <p>Python Programming</p>
                                            <p>86%</p>
                                            <p>A</p>
                                            <p>Pass</p>
                                        </div>
                                        <div className="w-full bg-gray-200 h-0.5"></div> */}
                                    </div>
                        </div>
              
                
                          </div>
          </div>

         </div>
  );
}
  