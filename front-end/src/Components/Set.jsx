
import React from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export default function Set({setData}) {


  return (
    
    <Card style={{ width: '10rem' }} className="flex flex-col h-full border border-gray-300 rounded-lg shadow-sm bg-white">
    <Card.Img variant="top" src={setData.set_img_url} />
    <Card.Body className="flex flex-col justify-between h-full">
      <Card.Title>{setData.name.slice(0, setData.name.indexOf(","))}</Card.Title>
      <Card.Text>
        pieces: {setData.num_parts}
        
      </Card.Text>
      <Button variant="primary">Go somewhere</Button>
    </Card.Body>
  </Card>

    
  )
}
