"use client";

import { useState } from "react";
import api from "@/lib/page";
import { useRouter } from 'next/navigation';
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



export default function Home() {
  const [details,setDetails]=useState({email:"",password:""})
  const [error,setError]=useState("")
  const [loading,setLoading]=useState(false)
  const router=useRouter();


  async function handleLogin(e){
    
    e.preventDefault()
    setError("")
    setLoading(true)
   

    try {
       const email = details.email.trim()
       const res=await api.post("/adminlogin",{email,password:details.password})
      localStorage.setItem("token",res.data.jwtToken)
      localStorage.setItem("studentname",res.data.username)
      
       setDetails({email:"",password:""})
       setTimeout(()=>{
            router.push("/Admin")
       },4000)
     
      
    } catch (error) {
      setTimeout(()=>{

      },3000)
      setError(error?.response?.data?.message || "invalid login attempt")
      
    }finally{
      setTimeout(()=>{
        setError("")
        setLoading(false)
      },3000)
    }
  }

  
  return (
    <div className="flex  bg-white text-black z-20 min-w-screen overflow-hidden min-h-screen font-sans ">
         
          <div className="flex z-50 flex-col flex-1 min-w-0 bg-gray-200  min-h-screen items-center justify-center  ">

          
            <div className="flex flex-col p-18 max-w-[600px] rounded-2xl shadow-2xl shadow-gray-400 bg-blue-950 w-full gap-12">
             
                  <div className="flex gap-5 w-full">
                  <Link href="/" className="bg-blue-500 fixed top-5 right-20 text-white p-2 w-full max-w-[200px] bg-blue-950 font-bold rounded-2xl text-center">Student login</Link>
                    <img src="/3dwebsoft.jpeg" className="w-full max-w-[150px] rounded-2xl"/>
                    <div className="flex flex-col gap-1 justify-center">
                        <p className="text-3xl font-bold text-white"><span className="text-green-500">LMS</span>-Portal</p>
                        <p className="text-white font-bold">Admin login page</p>
                    </div>
                  </div>
                  <form onSubmit={handleLogin} className="flex flex-col gap-10">
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-white text-xl">Email</label>
                    <input value={details.email} onChange={(e)=>setDetails({...details,email:e.target.value})} type="email" placeholder="Type your email..." className="w-full border-1 border-white bg-white text-black p-2 rounded-2xl"/>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between ">
                    <label className="font-bold text-white text-xl">Password</label>
                    {/* <Link href="/" className="bg-blue-400 text-white font-bold rounded-2xl p-2 w-full text-center max-w-[160px]">Admin login</Link> */}
                    </div>
                    <input value={details.password} onChange={(e)=>setDetails({...details,password:e.target.value})} type="password" placeholder="Type your password..." className="w-full border-1 border-white bg-white text-black p-2 rounded-2xl"/>
                  </div>
                  <button type="submit" className="text-white font-bold bg-blue-500 hover:scale-105 cursor-pointer rounded-2xl p-2">{loading ? (
    <span className="flex items-center justify-center gap-2">
      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
        <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
      Logging in...
    </span>
  ) : "Log In"}</button>
                  {error && <p className="text-red-300 font-bold text-lg">{error}</p>}
                  </form>
            </div>
          </div>

         </div>
  );
}
 