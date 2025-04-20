
import React from 'react'
import { useState, useRef, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useOutletContext } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { api } from '../Utility/user_utilities';
import LoadingSpinner from './Loading_Spinner';
import A_set from './A_set';


export default function CustomSet({show, setShow, type, formData, setFormData}) {
// console.log(`${type}`)
const context = useOutletContext()
const [preview,setPreview] = useState('/assets/placeholder.png');
const imageInputRef = useRef(null)
const [loading, setLoading] = useState(false)
const [customName,setCustomName] = useState("")
const [set_parts,setSet_parts] = useState(0)
const [setNum,setSetNum] = useState("default")
const [validForm, setValidForm] = useState(false)

const handleImageClick = () => {
    imageInputRef.current?.click();
}

useEffect(() => {
    if(type) {
        setPreview('/assets/placeholder.png')
    } else {
        setPreview('/assets/setplaceholder.png')
    }
},[type])

useEffect(() => {
    const pattern = /\/assets\/images\//
    const isValid = pattern.test(preview)
    const checkIfTrue = (preview !=='/assets/placeholder.png' && set_parts !== 0 && setNum !=="" && customName!=="" && isValid && loading == false)
    if (checkIfTrue) {setValidForm(true)} else setValidForm(false)
    // console.log(checkIfTrue)
},[preview, set_parts, setNum])

//    useEffect(() => {
//   if (formData.image instanceof File) {
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setPreview(reader.result);
//     };
//     reader.readAsDataURL(formData.image);
//   } else if (typeof formData.image === 'string') {
//     setPreview(formData.image); // it's a URL or base64 string
//   } else {
//     setPreview('/assets/placeholder.png');
//   }
// }, [formData.image]);

const cleanup = () => {
    setPreview('/assets/placeholder.png')
    setCustomName("")
    setSet_parts(0)
    setSetNum("")
    setValidForm(false)
    setLoading(false)
    
}

    const handleChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Image = reader.result;
                setPreview(base64Image)
                processImage(base64Image);
            };
            reader.readAsDataURL(file)
    };
};

    const processImage = async(base64Image) => {
        const body = {
            image: base64Image
        };
        try {
            setLoading(true)
            const response = await api.post('collection/process_image/', body);
            setLoading(false)
            const imageUrl = response.data.path;
            console.log(imageUrl)
            
            setFormData(prevState => ({
                ...prevState,
                image: imageUrl
            }));
            // setPreview(imageUrl)

        } catch (error) {
            console.error("Error uploading image: ", error)
        }
    };

// useEffect(() => {
// return () => {
//     if(preview && preview !=='/assets/placeholder.png') {
//         URL.revokeObjectURL(preview)
//     }
// };
// },[preview]);

  function randomAlphaNum(length = 3) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join('');
  }

const buildCustom = () => {
    const newSet = {
       'name': customName,
       'num_parts': set_parts,
       'set_img_url': preview,
       'set_num':setNum,
       'set_url': "Custom Build",
       'image_name':preview
    }
    if (type){
    context.setManageMiniFigs(prevArray => [...prevArray,newSet])  
    } else {
        context.setManageSets(prevArray => [...prevArray, newSet])
    }
}


if(!show) return null;



  return (

    <>
    {type?(
<div className="fixed inset-0 flex items-center justify-center bg-black/50">
 <Card style={{ width: '12rem' }} className="relative flex flex-col h-[22rem] border border-gray-300 rounded-lg shadow-sm bg-white  transition-transform duration-300">
        <button
        variant="danger"
        className={
            `${preview!=='/assets/placeholder.png'?'hidden':""} absolute right-1 top-0 bg-[#DA291C] hover:bg-red-700 hover:scale-110 text-white font-bold py-2 z-10 px-3 rounded shadow-md transition duration-300 `
        }
        onClick={() => [console.log(preview),cleanup(), setShow(false)]}
        >
             X 
             </button>
    <span className = "text-xs text-gray-600 border-0">Click to upload</span>
    <div className="relative w-full h-40">
    <Card.Img
    variant="top" src={preview}
    className="w-full h-40 object-contain hover:cursor-pointer"
    onClick={handleImageClick}
    />
    <div className="absolute top-2 right-1/2 flex items-center justify-center">
    {loading?<LoadingSpinner/>:""}
    </div>
    </div>
        <input
        type="file"
        accept="image/*"
        ref={imageInputRef}
        onChange={handleChange}
        className="hidden"
      />
    <Card.Body className="flex flex-col justify-between flex-grow">
    <Card.Title>
  <span className="text-sm font-semibold truncate overflow-hidden whitespace-nowrap block w-full">
  <span className="block break-words">Minifig's name:</span>

    <input
    type="text"
    className="border-2 border-black w-[95%]"
    value = {customName}
    onChange= {(e) => [setCustomName(e.target.value),
         setSetNum(`fig-${randomAlphaNum()}-${e.target.value}`)
        // console.log(setNum)
    ]
        }
         
    placeholder='This one needs a name'
    >
    </input>

    <span className="block break-words">Number of parts:</span>

    <input
    type="number"
    min='0'
    className="border-2 border-black w-[35%]"
    value = {set_parts}
    onChange= {(e) => setSet_parts(e.target.value)}
    maxLength={5}
    >
    </input>
  </span>
</Card.Title>
    <Card.Text className="text-sm overflow-hidden">

</Card.Text>

     
      <Button 
      variant="primary"
      className={`w-auto text-sm ${!validForm?'disabled':""}`}
      onClick = {(() => {
        buildCustom();
        setShow(false);
        cleanup();
        
      })}
      >

    {`${validForm?'Add to your pool!':'Incomplete info'}`}
    </Button>

    </Card.Body>
  </Card>
  </div>):  //-----------------SET BREAK

<div className="fixed inset-0 flex items-center justify-center bg-black/50">
<Card style={{ width: '30rem' }} className="relative flex flex-col h-[22rem] border border-gray-300 rounded-lg shadow-sm bg-white  transition-transform duration-300">
       <button
       variant="danger"
       className={
           `${preview!=='/assets/setplaceholder.png'?'hidden':""} absolute right-1 top-0 bg-[#DA291C] hover:bg-red-700 hover:scale-110 text-white font-bold py-2 z-10 px-3 rounded shadow-md transition duration-300 `
       }
       onClick={() => [console.log(preview),cleanup(), setShow(false)]}
       >
            X 
            </button>
   <span className = "text-xs text-gray-600 border-0">Click to upload</span>
   <div className="relative w-full h-40">
   <Card.Img
   variant="top" src={preview}
   className="w-full h-52 object-contain hover:cursor-pointer"
   onClick={handleImageClick}
   />
   <div className="absolute top-2 right-1/2 flex items-center justify-center">
   {loading?<LoadingSpinner/>:""}
   </div>
   </div>
       <input
       type="file"
       accept="image/*"
       ref={imageInputRef}
       onChange={handleChange}
       className="hidden"
     />
   <Card.Body className="flex flex-col justify-between flex-grow">
    <br />
   <Card.Title>
 <span className="text-sm font-semibold truncate overflow-hidden whitespace-nowrap block w-full">
 <span className="block break-words">Set's name:</span>

   <input
   type="text"
   className="border-2 border-black w-[95%]"
   value = {customName}
   onChange= {(e) => {
    setCustomName(e.target.value);
    setSetNum(`${randomAlphaNum()}-${e.target.value}`);
    // console.log(setNum)
    }}
        
   placeholder='Name of the custom set'
   >
   </input>

   <span className="block break-words">Number of parts:</span>

   <input
   type="number"
   min='0'
   className="border-2 border-black w-[35%]"
   value = {set_parts}
   onChange= {(e) => setSet_parts(e.target.value)}
   maxLength={5}
   >
   </input>
 </span>
</Card.Title>
   <Card.Text className="text-sm overflow-hidden">

</Card.Text>

    
     <Button 
     variant="primary"
     className={`w-auto text-sm ${!validForm?'disabled':""}`}
     onClick = {(() => {
       [buildCustom(), setShow(false), cleanup()]
       
     })}
     >

   {`${validForm?'Add to your pool!':'Incomplete info'}`}
   </Button>

   </Card.Body>
 </Card>
 </div>
}
    </>
  )
}
