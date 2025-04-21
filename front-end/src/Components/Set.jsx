
import React from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useOutletContext } from 'react-router-dom';

export default function Set({setData}) {
/** @type {AppContextType} */
const context = useOutletContext();
  return (
    <>
    {setData.set_num.slice(0,3) =='fig'? (
    <Card style={{ width: '12rem' }} className="flex flex-col h-[22rem] border border-gray-300 rounded-lg shadow-sm bg-white hover:scale-105 transition-transform duration-300">
    <Card.Img variant="top" src={setData.set_img_url} className="w-full h-40 object-contain"/>
    <Card.Body className="flex flex-col justify-between flex-grow">
    <Card.Title>
  <span className="text-sm font-semibold truncate overflow-hidden whitespace-nowrap block w-full">
    {setData.name.indexOf(",") === -1
      ? setData.name
      : setData.name.slice(0, setData.name.indexOf(","))}
  </span>
</Card.Title>
    <Card.Text className="text-sm overflow-hidden">
  <span className="block break-words">pieces: {setData.num_parts}</span>
  <span className="block break-words">set: {setData.set_num}</span>
  {context.user?<span className="block font-bold text-center">In Pool: {context.isManaged(setData)}</span>:""}
</Card.Text>
      {context.user?(
        <>
        <div>
      <Button 
      variant="primary"
      className="w-1/2 text-sm"
      onClick = { () => {
        // console.log(context.isManaged(setData))
        context.setManageMiniFigs(prevArray => [...prevArray,setData])  
      }}
      >
        <>
        {`+: ${context.isManaged(setData)}`}
        </>
      </Button>
      <Button
      variant ='danger'
      className={`w-1/2 text-sm ${context.isManaged(setData)==0? 'disabled':''}`}
      onClick = {() => {
        context.setManageMiniFigs(prevArray => {
          const index = prevArray.findIndex(item => item.set_num === setData.set_num);
          if (index === -1) return prevArray;
          return [...prevArray.slice(0,index), ...prevArray.slice(index+1)]
        })
      }}>
        -
      </Button>
      </div>
      </>
    )
      :""}
    </Card.Body>
  </Card>)
:
(
  <Card style={{ width: '30rem' }} className="flex flex-col h-full border border-gray-300 rounded-lg shadow-sm bg-white hover:scale-105">
  <Card.Img variant="top" src={setData.set_img_url} className="w-full h-52 object-contain"/>
  <Card.Body className="flex flex-col  h-full">
    <Card.Title>
      <span className="block text-3xl text-center">{setData.name.indexOf(",") == -1?setData.name:setData.name.slice(0, setData.name.indexOf(","))}</span></Card.Title>
<Card.Text className="text-sm overflow-hidden">
  <span className="block break-words">pieces: {setData.num_parts}</span>
  <span className="block break-words">set: {setData.set_num}</span>
  {context.user?<span className="block font-bold text-center">In Pool: {context.isManaged(setData)}</span>:""}
</Card.Text>
{context.user?(
<div>
    <Button
    variant="primary"
    className="w-1/2 text-2xl"
    onClick = { () => {
      context.setManageSets(prevArray => [...prevArray,setData])  
    }}
    >
      +
    </Button>
    <Button
      variant ='danger'
      className={`w-1/2 text-sm ${context.isManaged(setData)==0? 'disabled':''}`}
      onClick = {() => {
        context.setManageSets(prevArray => {
          const index = prevArray.findIndex(item => item.set_num === setData.set_num);
          if (index === -1) return prevArray;
          return [...prevArray.slice(0,index), ...prevArray.slice(index+1)]
        })
      }}>
        -
      </Button>
    </div>):""}
  </Card.Body>
</Card>)

}
  </>    
  )
}
