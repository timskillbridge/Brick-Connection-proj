import React, { useState, useEffect } from "react";
import {api} from '../Utility/user_utilities'
import { useNavigate, useOutletContext, Link } from 'react-router-dom'
import Set from '../Components/Set'
import { Button, NavItem, Nav, Tab, Tabs } from 'react-bootstrap'
import A_set from "../Components/A_set";
import axios from "axios";
import CustomSet from "../Components/CustomSet";

export default function MyPage() {

  const brick = import.meta.env.VITE_BRICKABLE;
  const [groupName, setGroupName] = useState("");
  const [set_Groups, setSet_Groups] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData,setFormData] = useState({});
  const context = useOutletContext()
  const [type,setType] = useState(true)
  const[selectSet, setSelectSet] = useState("");   //will create a container with press buttons for each set, selected group set will be what is added to when you add a set to a group.
  
  const headers = {
    Authorization: `key ${brick}`,
    // 'Content-Type': 'application/json',
  };

  const handleCustom = async() => {
    console.log(`submitting :`, formData);
    const main = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      main.append(key,value);
    })
 
  try {
    await api.post(`collection/set_groups/${selectSet.id}/single_sets/`,main, headers,
    );
    alert('Created Custom set, it will be in your set pool!')
    setIsOpen(false);
    setFormData({})
   } catch (error) {
    console.log("There was an error",error)
   }
  }


const navigate = useNavigate()

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


const uniqueMiniFigs = Array.from(
  new Map(context.manageMiniFigs.map(fig => [fig.set_num, fig])).values()
);
const uniqueSets = Array.from(
  new Map(context.manageSets.map(fig => [fig.set_num, fig])).values()
);
// console.log(uniqueSets)

const handleSetGroupCreate = async (groupName) => {

  if(!groupName) {
    context.setCurrentError("Name cannot be blank")
    return
  }

  // console.log(groupName)
  const {data} = await api.get("collection/set_groups/");
  console.log(groupName)
  if(data.set_groups.filter(item => item.set_name === groupName).length > 0) {
    console.log(data.set_groups.filter(item => item.set_name === groupName))
    context.setCurrentError("That name already exists, choose a unique name")
    return
  }
  // console.log(data)
  const setGroup = data['set_groups']
  // console.log(setGroup)
  const filtered = setGroup.filter((item) => groupName ==item.set_name)
  // console.log(`does not exist, creating |${filtered}|`)
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
    // console.log('exists')
  }
}

const handleSelectGroup = (group) => {

  setSelectSet(group)
  // console.log(group)
}

const handleDoubleClick = async () => {
  const deletegroup = window.confirm("Would you like to permentantly delete this set group?");
  if(deletegroup) {
    await api.delete(`collection/set_groups/${selectSet.id}/`);
    const newGroups = await api.get('collection/set_groups/');
    setSet_Groups(newGroups.data.set_groups)
    setSelectSet("")
  }
  
}
  useEffect(() => {
    const timeout = setTimeout(() => {
      context.setCurrentError('');
    },2000);
    return () => clearTimeout(timeout);
  },[context.currentError])

  return (
    
<>


<div className="min-h-1/4 bg-[#FFE400] py-10 px-4 flex flex-col items-center mt-0 pt-0 mb-0 pb-2">
  
  {/* Header */}
  <h2 className="text-4xl font-extrabold text-[#DA291C] mb-6 drop-shadow-lg">
    Create a Set Group
  </h2>

  {/* Form to Create Group */}
  <form
    onSubmit={(event) => {
      event.preventDefault();
      handleSetGroupCreate(groupName);
      setGroupName("")

    }}
    className="w-full max-w-xl bg-white p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4 border-4 border-yellow-400"
  >
    <input
      value={groupName}
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
  <div className="relative w-screen h-14">
  <p  className={`absolute top-0 left-1/2 -translate-x-1/2 text-center text-[#DA291C] px-4 py-1 
    ${context.currentError ? 'border-2 border-amber-500' : ''}`}>{context.currentError}</p>
  </div>
  {/* Set Group Selection */}
  <div className="w-full max-w-5xl mt-0 pt-0">
    <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
      {set_Groups.length == 0? (
        'Create some groups to get started'
      ):""}
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

</div>



    <Tabs
      defaultActiveKey="profile"
      id="find-sets"
      className="bg-[#FFD700] text-gray-900 flex flex-row p-0 m-0"
      fill
    >
      <Tab eventKey="MiniFig"
      title={<span className="rounded-t-lg bg-white border-4 border-yellow-500 px-4 py-2 shadow-md flex flex-col p-0 m-0">Minifigs</span>}
      className="bg-[#FFACD] p-4"
      onClick ={ () => {setType(true)}}
      >
        <button 
        // variant = 'primary'
        className="relative left-[15%] w-1xl bg-[#FFD700] text-black font-bold uppercase tracking-wider border-4 border-yellow-500 rounded-md px-6 py-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 pb-2 mb-2 "
        onClick = {() => {[setType(true), setIsOpen(true)]}}
        >+ Custom Minifig</button>
       
        <h2 className="text-3xl font-bold ">
        🧍‍♂️Minifig Pool
        </h2>
        <div className="text-[#DA291C] underline">
         {
         uniqueMiniFigs.length == 0? 
         (<Nav.Link as={Link} to="/FindSetPage/">None in your pool, go find some!</Nav.Link>):""
         }
        
         </div>

        <div className="flex justify-center mb-6">
       {context.figData}
                
        </div>
        <div className="w-full min-w-full flex flex-wrap h-auto rounded gap-3 items-end">
       
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-center">
        {uniqueMiniFigs.map((fig) => (
    <div key={fig.set_num} className="flex flex-col h-full gap-3">
    <A_set setData = {fig} context={context} selectSet ={selectSet}/>
    </div>
    
    ))}
    </div>
      </Tab>
      <Tab
      eventKey="sets"
      title={<span className="rounded-t-lg bg-white border-4 border-yellow-500 px-4 py-2 shadow-md flex flex-col">Build Sets</span>}
      className="bg-[#FFFACD p-4"
      onClick ={ () => {setType(false)}}
      >
         <button 
        // variant = 'primary'
        className="relative left-[15%] w-1xl bg-[#FFD700] text-black font-bold uppercase tracking-wider border-4 border-yellow-500 rounded-md px-6 py-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 pb-2 mb-2 "
        onClick = {() => {[setType(false), setIsOpen(true)]}}
        >+ Custom Set</button>
        <h2 className="text-2xl font-bold text-blue-600 mb-4">🧱 Set Pool</h2>
        <div className="text-[#DA291C] underline">
         {
         uniqueSets.length == 0? 
         (<Nav.Link as={Link} to="/FindSetPage/">None in your pool, go find some!</Nav.Link>):""
         }
        
         </div>

        
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-10 justify-center">
        {uniqueSets.map((fig) => (
    <div key={fig.set_num} className="flex flex-col h-full gap-3">
    <A_set setData = {fig} context={context} selectSet ={selectSet}/>
    </div>
    ))}
    </div>
      </Tab>
    </Tabs>


<CustomSet
show={isOpen}
setShow = {setIsOpen}
type = {type}
submit={handleCustom}
formData={formData}
setFormData={setFormData}
/>
    

</>
  )
}
