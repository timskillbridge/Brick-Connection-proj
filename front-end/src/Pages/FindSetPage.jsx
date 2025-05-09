
import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { Container, Row, Col, Tab, Tabs, FloatingLabel } from 'react-bootstrap';
import { searchFigs } from '../Utility/brickable_api';
import LoadingSpinner from '../Components/Loading_Spinner';
import Set from '../Components/Set'
import { useOutletContext } from 'react-router-dom';

export default function FindSet() {
const [fig,setFig] = useState("")
const [buildset,setBuildset] = useState("")
const [figdata,setFigdata] = useState([])
const [builddata,setBuilddata] = useState([])
const [loading, setLoading] = useState(false)
// const [prev, setPrev] = useState("")
// const [next, setNext] = useState("")
const context = useOutletContext();

const figsCall = async (term, type) => {
  setFigdata([])
  setBuilddata([])
  setLoading(true)
  try {
    let returnedFigs
    if (type == 'fig'){
    returnedFigs = await searchFigs(term,'fig');
} else {
    returnedFigs = await searchFigs(term, 'set')
}
    if (returnedFigs.length == 0) {context.setCurrentError('Oops, looks like there were no results for that search')
      return
    }
    // if(returnedFigs.next) {setNext(returnedFigs.next)}
    // console.log(returnedFigs)
    if (type == 'fig'){
    setFigdata(returnedFigs)
  } else if(type=='set') {
    setBuilddata(returnedFigs)
  }
  // console.log(builddata)
  }
  catch (error) {
    console.error(error)
  } finally {
    setLoading(false)
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
   
    <div className="flex flex-col bg-[#FFD700] text-gray-900 text-center font-bold"><h1>Find your bricks!</h1></div>

    <Tabs
      defaultActiveKey="profile"
      id="find-sets"
      className="bg-[#FFD700] text-gray-900 flex flex-row p-0 m-0"
      fill
    >
      <Tab eventKey="MiniFig"
      title={<span className="rounded-t-lg bg-white border-4 border-yellow-500 px-4 py-2 shadow-md flex flex-col p-0 m-0">Minifigs</span>}
      className="bg-[#FFACD] p-4">
       
        <h2 className="text-3xl font-bold text-red-600 mb-4">🧍‍♂️ Search for LEGO Minifigs</h2>
        <div className="flex justify-center mb-6">
        <form onSubmit={(event) => [event.preventDefault(), figsCall(fig,'fig'), setFig("")]}>
        <input
        value={fig}
        type="text"
        placeholder="Name, Job, color, etc..."
        className="w-full max-w-md px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
        onChange= {(e) => setFig(e.target.value)}
        />
        </form>
                
        </div>
        <div className="w-full min-w-full flex flex-wrap h-auto rounded gap-3 items-end">
        <p style={{color: 'red'}}>{context.currentError}</p>
        {loading? (
        <LoadingSpinner />
    )
    : ""}
    {
    figdata? (
    figdata.map((fig) => (
      <div key={fig.set_num} className="flex flex-col h-full">
      <Set setData = {fig} context={context}/>
      </div>
    ))
) : ""
    }
        </div>
      </Tab>
      <Tab
      eventKey="sets"
      title={<span className="rounded-t-lg bg-white border-4 border-yellow-500 px-4 py-2 shadow-md flex flex-col">Build Sets</span>}
      className="bg-[#FFFACD p-4">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">🧱 Discover LEGO Sets</h2>
        <div className="flex justify-center mb-6">
        <form onSubmit={(event) => [event.preventDefault(), figsCall(buildset,'set'), setBuildset("")]}>
        <input
        value = {buildset}
        type="text"
        placeholder="Search for a LEGO set..."
        className="w-full max-w-md px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
        onChange= {(e) => setBuildset(e.target.value)}
        />
        </form>
        </div>
        <div className="w-full min-w-full flex flex-wrap h-auto rounded gap-3 items-end">
        <p style={{color: 'red'}}>{context.currentError}</p>
        {loading? (
        <LoadingSpinner />
    )
    : ""}
    {
    builddata? (
      builddata.map((fig) => (
      <div key={fig.set_num} className="flex flex-col h-full">
      <Set setData = {fig} context={context}/>
      </div>
    ))
) : ""
    }
        </div>
      </Tab>
    </Tabs>
  

    
   
    
</> 

    



  )
}
