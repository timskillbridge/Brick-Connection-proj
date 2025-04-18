
import React from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useOutletContext } from 'react-router-dom';
import { api } from '../Utility/user_utilities';
const brick = import.meta.env.VITE_BRICKABLE;

export default function A_set({setData, selectSet}) {
    console.log(setData)
/** @type {AppContextType} */
const context = useOutletContext();
const headers = {
    Authorization: `key ${brick}`,
    'Content-Type': 'application/json',
  };
console.log(selectSet)
const handleSubmit = async(passedSet) => {
    try {
        api.post(`collection/set_groups/${selectSet.id}/single_sets/`, {
            name : passedSet.name,
            num_parts:passedSet.num_parts,
            set_img_url:passedSet.set_img_url,
            instructions:passedSet.set_url,
        }, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
          if(passedSet.set_num.slice(0,3) =='fig') {
        context.setManageMiniFigs(prevArray => {
            const index = prevArray.findIndex(item => item.set_num === setData.set_num);
            if (index === -1) return prevArray;
            return [...prevArray.slice(0,index), ...prevArray.slice(index+1)]
          })} else {
            context.setManageSets(prevArray => {
                const index2 = prevArray.findIndex(item => item.set_num === setData.set_num);
                if (index2 === -1) return prevArray;
                return [...prevArray.slice(0,index2), ...prevArray.slice(index2+1)]
              })
          }
    }
    catch (err) {
        console.log(err)
    }
}

return (
<>

{setData.set_num.slice(0,3) =='fig'? (
    <Card style={{ width: '12rem' }} className="relative flex flex-col h-[22rem] border border-gray-300 rounded-lg shadow-sm bg-white hover:scale-105 transition-transform duration-300">
        <button
        variant="danger"
        className="absolute right-1 top-0 bg-[#DA291C] hover:bg-red-700 text-white font-bold py-2 px-2 rounded shadow-md transition duration-300 "
        onClick = {() => {
            context.setManageMiniFigs(prevArray => prevArray.filter(item => item.set_num !==setData.set_num))
        }}
        >
             X 
             </button>
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
  <span className="block font-bold text-center">In Pool: {context.isManaged(setData)}</span>
</Card.Text>

     {selectSet?.set_name? (
      <Button 
      variant="primary"
      className="w-auto text-sm"
      onClick = { () => {
        handleSubmit(setData)
      }}
      >
        {`Add to ${selectSet.set_name}`}
        {/* {selectSet.set_name?`Add to ${selectSet.set_name}`:"Select a set"} */}
    </Button>):""

     }   



    </Card.Body>
  </Card>)
:
(
  <Card style={{ width: '30rem' }} className="relative flex flex-col h-full border border-gray-300 rounded-lg shadow-sm bg-white hover:scale-105">
     <button
        variant="danger"
        className="absolute right-1 top-0 bg-[#DA291C] hover:bg-red-700 text-white font-bold py-2 px-2 rounded shadow-md transition duration-300 "
        onClick = {() => {
            context.setManageSets(prevArray => prevArray.filter(item => item.set_num !==setData.set_num))
        }}
        >
             X 
             </button>
  <Card.Img variant="top" src={setData.set_img_url} className="w-full h-52 object-contain"/>
  <Card.Body className="flex flex-col  h-full">
    <Card.Title>
      <span className="block text-3xl text-center">{setData.name.indexOf(",") == -1?setData.name:setData.name.slice(0, setData.name.indexOf(","))}</span></Card.Title>
<Card.Text className="text-sm overflow-hidden">
  <span className="block break-words">pieces: {setData.num_parts}</span>
  <span className="block break-words">set: {setData.set_num}</span>
  <span className="block font-bold text-center">In Pool: {context.isManaged(setData)}</span>
</Card.Text>

{selectSet?.set_name? (
      <Button 
      variant="primary"
      className="w-1/2 text-sm"
      onClick = { () => {
        handleSubmit(setData)
      }}
      >
        {`Add to ${selectSet.set_name}`}
        {/* {selectSet.set_name?`Add to ${selectSet.set_name}`:"Select a set"} */}
    </Button>):""

     } 

  </Card.Body>
</Card>)

}

  </>
  )
}
