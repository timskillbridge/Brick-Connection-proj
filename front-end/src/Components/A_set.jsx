
import React, {useState} from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useOutletContext } from 'react-router-dom';
import { api } from '../Utility/user_utilities';
const brick = import.meta.env.VITE_BRICKABLE;

export default function A_set({setData, selectSet, setSelectSet, setFlicker}) {
const isCustomSet = setData.set_img_url?.startsWith('/assets/');
const [posting, setPosting] = useState(false)

const handleCustomDelete = async (passedSet) => {
  // console.log(passedSet)
  if(passedSet.set_url == "Custom Build"){
    const fileName = passedSet.set_img_url?.split('/').pop()
        await api.delete('collection/delete_temp_image/', {
            data: {filename:fileName},
            headers: {
                'Content-Type': 'application/json'
            }
        });
}
}

    // console.log(setData)
/** @type {AppContextType} */
const context = useOutletContext();
const headers = {
    Authorization: `key ${brick}`,
    'Content-Type': 'application/json',
  };
// console.log(selectSet)

const handleSubmit = async(passedSet) => {
  if (posting) return
  setPosting(true)
  // console.log(passedSet)
    try {
        passedSet.custom = isCustomSet

        const fileName = passedSet.set_img_url?.split('/').pop()
        // console.log(fileName)
        // console.log(passedSet)
        // console.log(
        //   `name: ${passedSet.name} \n
        //   num_parts: ${passedSet.num_parts}\n
        //   set_num: ${passedSet.set_num}\n
        //   set_img_url: ${passedSet.set_img_url}\n
        //   instructions: ${passedSet.instructions}\n
        //   custom: ${passedSet.custom}\n
        //   image: ${passedSet.image}`
        // )
        await api.post(`collection/set_groups/${selectSet.id}/single_sets/`, {
            name: passedSet.name,
            num_parts: passedSet.num_parts,
            set_num:passedSet.set_num,
            set_img_url: isCustomSet ? fileName : passedSet.set_img_url,
            instructions: passedSet.set_url,
            custom: isCustomSet,
            image:passedSet.image_media_url            
        }, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          if (isCustomSet) {
            handleCustomDelete(passedSet)
          }
        //   alert(passedSet.set_num.slice(0,3))
          const isFig = passedSet.set_num.slice(0,3) == 'fig'
          const updateer = isFig? context.setManageMiniFigs : context.setManageSets
        //   alert(isFig)
          const pool = isFig? context.manageMiniFigs : context.manageSets;

          updateer(prevArray => {
            const index = prevArray.findIndex(item => item.set_num === passedSet.set_num);
            return index === -1 ? prevArray : [...prevArray.slice(0, index), ...prevArray.slice(index + 1)];
          });
    }
    catch (err) {
        console.log(err)
    }
    finally{
      setPosting(false)
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
            if (isCustomSet) {
                handleCustomDelete(setData)
              }
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
      className={`w-auto text-sm ${posting? 'disabled' : ''}`}
      onClick = { ( async() => {
        const selected = selectSet
        // console.log(selected)
        await handleSubmit(setData);
        setFlicker(prev => !prev);
        setSelectSet(selected)
        // console.log(setData)

      })}
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
            handleCustomDelete(setData)
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

      onClick ={ ( async() => {
        await handleSubmit(setData);

        setFlicker(prev => !prev);
      })}
      
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
