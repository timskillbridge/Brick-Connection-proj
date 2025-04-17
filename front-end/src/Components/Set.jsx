
import React from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useOutletContext } from 'react-router-dom';

export default function Set({setData, user, isManaged}) {

// console.log(setData.name.indexOf(","))
  return (
    <>
    {setData.set_num.slice(0,3) =='fig'? (
    <Card style={{ width: '12rem' }} className="flex flex-col h-[22rem] border border-gray-300 rounded-lg shadow-sm bg-white hover:scale-105 transition-transform duration-300">
    <Card.Img variant="top" src={setData.set_img_url} className="w-full h-40 object-contain"/>
    <Card.Body className="flex flex-col justify-between flex-grow">
    <Card.Title><span className="text-sm font-semibold truncate">{setData.name.indexOf(",") == -1?setData.name:setData.name.slice(0, setData.name.indexOf(","))}</span></Card.Title>
      <Card.Text>
      <span className="text-1xl">pieces: {setData.num_parts}</span>
      <br />
      <span className="text-1xl">set: {setData.set_num}</span>
        
      </Card.Text>
      <Button variant="primary">
        {user?'add to piece pool':'Login to add to piece pool'}
      </Button>
    </Card.Body>
  </Card>)
:
(
  <Card style={{ width: '30rem' }} className="flex flex-col h-full border border-gray-300 rounded-lg shadow-sm bg-white hover:scale-105">
  <Card.Img variant="top" src={setData.set_img_url} className="w-full h-52 object-contain"/>
  <Card.Body className="flex flex-col  h-full">
    <Card.Title>
      <span className="block text-3xl text-center">{setData.name.indexOf(",") == -1?setData.name:setData.name.slice(0, setData.name.indexOf(","))}</span></Card.Title>
    <Card.Text>
      <span className="text-1xl">pieces: {setData.num_parts}</span>
      <br />
      <span className="text-1xl">set: {setData.set_num}</span>
      
    </Card.Text>
    <Button variant="primary">
      {user?'add to piece pool':'Login to add to piece pool'}
    </Button>
  </Card.Body>
</Card>)

}
  </>    
  )
}
