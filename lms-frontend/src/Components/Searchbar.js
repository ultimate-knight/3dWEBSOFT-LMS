


export default function Searchbar({search,setSearch}){

    return (
        <input
         type="text"
         value={search}
         onChange={(e)=>setSearch(e.target.value)}
        placeholder="Search lms..."
        className="rounded-2xl p-2 text-black min-w-0 max-w-md flex-1 border border-gray-500 h-10"
      />
    )
}