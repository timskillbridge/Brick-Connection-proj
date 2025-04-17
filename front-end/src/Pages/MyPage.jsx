import React, { useState, useEffect } from "react";
import {api} from '../Utility/user_utilities'
import { useOutletContext } from 'react-router-dom'
import Set from '../Components/Set'
import { Button, NavItem } from 'react-bootstrap'
import axios from "axios";

export default function MyPage() {
  const brick = import.meta.env.VITE_BRICKABLE;
  const [groupName, setGroupName] = useState()
  const [set_Groups, setSet_Groups] = useState([])
  const[selectSet, setSelectSet] = useState()   //will create a container with press buttons for each set, selected group set will be what is added to when you add a set to a group.
  const headers = {
    Authorization: `key ${brick}`,
    'Content-Type': 'application/json',
  };

  useEffect(() => {
    const grabSets = async () => {
      try {
        const response = await api.get("collection/set_groups/");
        setSet_Groups(response.data.set_groups); // assuming the response has this structure
      } catch (error) {
        console.error("Error fetching set groups:", error);
      }
    };
  
    grabSets();
  }, []);


/** @type {AppContextType} */
const context = useOutletContext()

const uniqueMiniFigs = Array.from(
  new Map(context.manageMiniFigs.map(fig => [fig.set_num, fig])).values()
);
const uniqueSets = Array.from(
  new Map(context.manageSets.map(fig => [fig.set_num, fig])).values()
);

const handleSetGroupCreate = async (groupName) => {
  console.log(groupName)
  const {data} = await api.get("collection/set_groups/");
  console.log(data)
  const setGroup = data['set_groups']
  console.log(setGroup)
  const filtered = setGroup.filter((item) => groupName ==item.set_name)
  console.log(`does not exist, creating |${filtered}|`)
  if (filtered.length ==0) {
    
    await api.post('collection/set_groups/', {
      set_name: groupName
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const feedGroups = await api.get("collection/set_groups/")
    setSet_Groups(feedGroups.data.set_groups)
  } else {
    console.log('exists')
  }
}

const handleSelectGroup = (group) => {
  setSelectSet(group)
  console.log(group)
}

const handleDoubleClick = async () => {
  const deletegroup = window.confirm("Would you like to permentantly delete this set group?");
  if(deletegroup) {
    await api.delete(`collection/set_groups/${selectSet.id}/`);
    const newGroups = await api.get('collection/set_groups/');
    setSet_Groups(newGroups.data.set_groups)
  }
  
}

  return (
<>


<div className="min-h-screen bg-[#FFE400] py-10 px-4 flex flex-col items-center">
  
  {/* Header */}
  <h2 className="text-4xl font-extrabold text-[#DA291C] mb-6 drop-shadow-lg">
    Create a Set Group
  </h2>

  {/* Form to Create Group */}
  <form
    onSubmit={(event) => {
      event.preventDefault();
      handleSetGroupCreate(groupName);
    }}
    className="w-full max-w-xl bg-white p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4 border-4 border-yellow-400"
  >
    <input
      maxLength="50"
      type="text"
      placeholder="What should it be called?"
      className="w-full px-4 py-2 rounded-md border-2 border-gray-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg"
      onChange={(e) => setGroupName(e.target.value)}
    />
    <button
      type="submit"
      className="bg-[#DA291C] hover:bg-red-700 text-white font-bold py-2 px-6 rounded shadow-md transition duration-300"
    >
      Add Group
    </button>
  </form>

  {/* Set Group Selection */}
  <div className="mt-8 w-full max-w-5xl">
    <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
      Select a group to work with.  Double click a set to delete it
    </h3>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-center">
      {set_Groups.map((group) => (
        <button
          key={group.id}
          onClick={() => handleSelectGroup(group)}
          onDoubleClick={() => {
            handleDoubleClick()
          }}
          className={`px-4 py-2 rounded-md shadow-md font-semibold transition-all duration-200
            ${selectSet === group
              ? 'bg-red-600 text-white scale-95'
              : 'bg-white hover:bg-yellow-400 text-gray-900'
            }`}
        >
          {group.set_name}
        </button>
      ))}
    </div>
  </div>

  {/* Set Cards */}
  <div className="mt-10 w-full max-w-6xl">
    <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
      Available Sets
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      
      Component Cards
    </div>
  </div>
</div>


    <div>My Piece Pool</div>
    {Array.isArray(set_Groups) && set_Groups.map((set) => (
  <div key={set.set_name} className="flex flex-col h-full gap-3">
    {set.set_name}
  </div>
))}

    {uniqueMiniFigs.map((fig) => (
    <div key={fig.set_num} className="flex flex-col h-full gap-3">
    <Set setData = {fig} context={context}/>
    </div>
    ))}

    {uniqueSets.map((fig) => (
    <div key={fig.set_num} className="flex flex-col h-full gap-3">
    <Set setData = {fig} context={context}/>
    </div>
    ))}

    
    
</>
  )
}
