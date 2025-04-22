
import React, { useState, useEffect} from 'react'
import { useOutletContext } from 'react-router-dom'
import { api } from '../Utility/user_utilities'


export default function DisplaySet({group, setSelectedGroup, setFlicker, setSet_Groups, grabCollection}) {
const [manage, setManage] = useState(false)
const [type,setType] = useState(false)
// console.log(group)

useEffect(() => {
    if(group.set_num.slice(0,4) == "fig-") {
        setType(true)
    } else {
        setType(false)
    }
    
},[])

const handleDeleteSet = async() => {
    await api.delete(`collection/set_groups/${group.set_group}/single_sets/${group.id}/`);
    setFlicker(prev => !prev);
    const updatedGroups = await api.get("collection/set_groups/");
    setSet_Groups(updatedGroups.data.set_groups);
    const updatedGroup = updatedGroups.data.set_groups.find(g => g.id === group.set_group);
    setSelectedGroup(updatedGroup);
    
}

  return (
<div className="flex flex-wrap gap-6 justify-center p-6 bg-yellow-400 text-[#000000]">

<div className="w-full text-center mb-4">
  <h2 className="text-4xl font-extrabold lego-font text-[#DA291C] tracking-wider underline decoration-[#FFD700]">
    
    {group.name}
  </h2>
</div>

<div className="w-80 bg-[#FFD700] border-[6px] border-[#DA291C] rounded-md shadow-lg flex flex-col overflow-hidden lego-font">

  <div className="relative h-48 bg-white border-b-[4px] border-[#DA291C] flex items-center justify-center">

    {/* Circle containing the difficulty image with text, moved to the left */}
    <div className="absolute top-2 left-2 w-12 h-12 bg-[#FFD700] border-2 border-[#DA291C] rounded-full z-10 flex items-center justify-center">
      <img 
        src={group.difficulty_url} 
        alt={group.theme_id} 
        className="h-10 w-10 object-contain rounded-full"
      />
    </div>

    {/* Main Image of the Lego set */}
    <img 
      src={group.set_img_url[0] === "h" ? group.set_img_url : `http://localhost:8000${group.image}`} 
      alt={group.name} 
      className="object-contain w-full h-full max-w-full max-h-full" 
    />

    {/* Button to remove set, now placed at the top-right corner */}
    <button
      variant="danger"
      className="absolute right-1 top-0 bg-[#DA291C] hover:bg-red-700h hover:scale-110 text-white font-bold py-2 px-2 rounded shadow-md transition duration-300"
      onClick={() => {
        handleDeleteSet();
        // grabCollection();
      }}


    >
      X 
    </button>

  </div>

  {/* Card body */}
  <div className="flex flex-col gap-2 p-4 bg-[#FFD700] text-black">
    
    {/* Name */}
    
    
    <span className="text-md font-bold tracking-wide border-b-2 pb-1">
    {!type?"Build Set":"Mini Figure"}{!group.custom?" ID: "+group.set_num:" name:"}
    </span>
    <span className="text-xl font-bold tracking-wide border-b-2 pb-1">
    {group.name}
    <br />
    
    </span>


    {/* Piece Count */}
    <p className="text-lg font-semibold flex items-center gap-2">
      🧱 Invidual Pieces: <span className="text-[#DA291C] font-bold text-2xl">{group.num_parts.toLocaleString('en-US')}</span>
    </p>

    {/* Designator */}
    <p className={`inline-block px-3 py-1 ${group.custom ? "bg-blue-700" : "bg-[#DA291C]"} text-white text-sm font-bold rounded-full w-fit`}>
      {group.custom ? "Custom Build" : "Official Lego Design"}
    </p>

    {/* Instructions Link */}
    {!group.custom && (
      <a
        href={group.instructions+"/#parts"}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 bg-[#DA291C] !text-[#FFD700] px-4 py-2 rounded-md font-bold text-center shadow-md hover:scale-105 transition"
      >
        📘 Find parts, instructions, etc...
      </a>
    )}
  </div>
</div>

</div>

    


  )
}
