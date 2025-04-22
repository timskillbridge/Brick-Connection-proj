import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { api } from '../Utility/user_utilities';

import DisplaySet from '../Components/DisplaySet';

export default function About() {
const context = useOutletContext()
const [set_Groups, setSet_Groups] = useState([]);
const [selectedGroup, setSelectedGroup] = useState([]);
const [collectionDetails,setCollectionDetails] = useState({});
const [currentGroup, setCurrentGroup] = useState([]);
const [figs, setFigs] = useState([]);
const [sets, setSets] = useState([]);
const flicker = context.flicker




const grabCollection = async() => {
  try {
    const {data} = await api.get('collection/');
    // console.log(data)
    const details = {
      'pieces': data.Collection.total_pieces.toLocaleString('en-US'),
      'sets' : data.Collection.num_of_sets
    };
    setCollectionDetails(details);
    // console.log(`${details.pieces} and ${details.sets}`)
  }
  catch (error) {
    context.setCurrentError("Couldn't fetch collection details")
  }
};

useState(() => {
setCurrentGroup(selectedGroup)
},[selectedGroup])

useState(() => {
  grabCollection()
},[])

 const grabSets = async () => {
    try {
      const response = await api.get("collection/set_groups/");
      setSet_Groups(response.data.set_groups);
    } catch (error) {
      console.error("Error fetching set groups:", error);
    }
  };

  const handleSelectGroup = (group) => {
    setSelectedGroup(group)
    // console.log(selectedGroup)
  }

  const handleDoubleClick = async (group) => {
    const deletegroup = window.confirm("Would you like to permentantly delete this set group?");
    console.log(group.id)
    if(deletegroup) {
      await api.delete(`collection/set_groups/${group.id}/`);
      setSelectedGroup([])
      grabSets()
      grabCollection()
    }}

  useEffect(() => {
    if (!selectedGroup.id) return;
    // console.log(set_Groups)
    const main = selectedGroup.single_set;
    // console.log(main);
    const figs = main.filter(item => item.set_num.slice(0,4) === 'fig-');
    const sets = main.filter(item => item.set_num.slice(0,4) != 'fig-')
    // console.log(figs)
    // console.log(sets)
  }, [selectedGroup]);

const grabImg = async() => {
  img = await api.get()
}

useEffect(() => {
  grabSets()
},[])

useEffect(() => {
grabSets()

},[flicker])


  return (
<>
<div className="min-h-screen bg-[#FFE400] py-10 px-4 flex flex-col items-center mt-0 pt-0 mb-0 pb-2">

  <h2 className="text-4xl font-extrabold text-[#DA291C] mb-6 drop-shadow-lg">
    {`My collection: ${collectionDetails.sets} ${collectionDetails.sets>1?'sets':'set'}, ${collectionDetails.pieces} pieces`}
  </h2>

  <div className="relative w-screen h-14 pb-0 pt-0 mb-0 mt-0">
  <p  className={`absolute top-0 left-1/2 -translate-x-1/2 text-center text-[#DA291C] px-4 py-1 
    // ${context.currentError ? 'border-2 border-amber-500' : ''}`}>{context.currentError}</p>
  </div>

  <div className="w-full max-w-5xl mt-0 pt-0">
    <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
    </h3>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-center">
      {set_Groups.map((group) => (
        <button
          key={group.id}
          onClick={
            (() => {handleSelectGroup(group)
            })}
            onDoubleClick={async () => {
              await handleDoubleClick(group)
            }}
          className={`px-4 py-2 rounded-md shadow-md font-semibold transition-all duration-200
            ${selectedGroup.id == group.id
              ? 'bg-red-600 text-white scale-95'
              : 'bg-white hover:bg-yellow-400 text-gray-900'
            }`}
        >
          {`Name: ${group.set_name}: ${group.single_set.length} items`}
        </button>
      ))}
    </div>
  </div>
  <div className = "flex flex-col gap-10 text-amber-50">
{selectedGroup.id?(
  selectedGroup.single_set.map((group) =>(
    
    <>
      <DisplaySet group = {group} setSelectedGroup = {setSelectedGroup} setFlicker = {context.setFlicker} setSet_Groups = {setSet_Groups} grabCollection = {grabCollection()}
      />
    
      </>

  ))
)
:"asdf"

}
</div>
</div>


</>

    
  )
}
