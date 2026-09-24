"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import api from "@/lib/page"
import Searchbar from "./Searchbar"
import { getTrackLabel } from "@/lib/stats"

export default function Overheadbar({search,setSearch}) {
  const [bool, setBool] = useState(false)
  
  const [name, setName] = useState("")
  const [track, setTrack] = useState("Student")
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) router.push("/")
    setName(localStorage.getItem("studentname") || "")

    async function loadTrack() {
      try {
        const res = await api.get("/courses")
        setTrack(getTrackLabel(res.data.data || []))
      } catch {
        setTrack("Student")
      }
    }
    loadTrack()
  }, [])

  function handlelogout() {
    localStorage.removeItem("studentname")
    localStorage.removeItem("token")
    router.push("/")
  }

  

  return (
    <div className="w-full h-24 shadow-md z-10 p-5 shadow-gray-500 mt-10 flex justify-between items-center text-black bg-white">
      {/* <input
        placeholder="Search lms..."
        className="rounded-2xl p-2 text-black min-w-0 max-w-md flex-1 border border-gray-500 h-10"
      /> */}
      <Searchbar search={search} setSearch={setSearch}/>
      <div onClick={() => setBool(!bool)} className="flex gap-2 cursor-pointer items-center z-5">
        <div className="bg-blue-800 flex items-center justify-center text-white w-13 h-auto rounded-full aspect-square">
          <p className="text-xl font-bold uppercase">{name.slice(0, 1)}</p>
        </div>
        <div className="flex flex-col gap-0.5 min-w-0 text-left">
          <p className="font-extrabold truncate">{name}</p>
          {/* <p className="text-sm text-gray-600 truncate">{track}</p> */}
        </div>
      </div>
      {bool && (
        <div className="w-full max-w-[200px] flex flex-col gap-3 p-3 fixed right-4 top-28 bg-white border border-black rounded-2xl shadow-lg z-50">
          <Link href="/Profile" className="font-bold bg-blue-800 w-full rounded-2xl p-2 text-white text-center">
            Profile
          </Link>
          <button onClick={handlelogout} className="font-bold bg-blue-800 w-full rounded-2xl p-2 text-white">
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
