import Image from "next/image";
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


export default function Attendance() {
  return (
    <div className="flex  bg-white text-black z-20 min-w-screen overflow-hidden min-h-screen font-sans ">
          <Sidebar />
          <div className="flex z-50 flex-col flex-1 min-w-0 w-full bg-gray-200  min-h-screen items-start justify-start  ">
          
            <Overheadbar/>
            <div className="flex flex-col font-bold text-6xl items-center justify-center min-h-screen inset-0  w-full">
            <p className="text-blue-900">Coming soon please wait</p>
            </div>
          </div>

         </div>
  );
}
  