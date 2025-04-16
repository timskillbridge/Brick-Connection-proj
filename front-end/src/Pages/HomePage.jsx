import React, { useState, useEffect } from "react";
// import { api } from "../Utility/user_utilities";
import { grabImage } from "../Utility/brickable_api";
import LoadingSpinner from '../Components/Loading_Spinner'
// import axios from "axios";
import { Figure } from "react-bootstrap";


export default function HomePage() {
  const brick = import.meta.env.VITE_BRICKABLE;
  const [mini,setMini] = useState()
  const [sets,setSets] = useState()
  const [loading, setLoading] = useState(true);


  // const grabImage = async () => {
  //   // const data = await api.get()
  //   try {
  //     const headers = {
  //         Authorization: `key ${brick}`,
  //     };

  //     const [figResponse, setResponse] = await Promise.all([
  //       axios.get("https://rebrickable.com/api/v3/lego/minifigs/",{
       
  //         params: {
  //           page: 1,
  //           page_size: 100,
  //           ordering: "random",
  //         },
  //         headers,

       
  //     }),
  //     axios.get("https://rebrickable.com/api/v3/lego/sets/", {
  //       params: {
  //         page:1,
  //         page_size:100,
  //         ordering:'-num_parts'
  //       },
  //       headers,
  //     })

  //   ]);
    
  //   // console.log(`${setResponse.data.results[0]}
  //   //   ${figResponse.data.results[0]}`)

  //     let brick_img = figResponse.data.results;
  //     const mixed = [];
  //     const doesExist = new Set();
      
  //     for (let i = brick_img.length; i > 95; i--) {
  //       let j = Math.floor(Math.random() * i);
  //       if (!doesExist.has(brick_img[j])) {
  //         mixed.push(brick_img[j]);
  //         doesExist.add(brick_img[j]);
  //       }
  //     }

  //     let sets_img = setResponse.data.results;
  //     const setMixed = [];
  //     const setExist = new Set();
      
  //     for (let i = sets_img.length; i > 98; i--) {
  //       let j = Math.floor(Math.random() * i);
  //       if (!doesExist.has(sets_img[j])) {
  //         setMixed.push(sets_img[j]);
  //         setExist.add(sets_img[j]);
  //       }
  //     }

  //     setMini(mixed);
  //     // console.log(mixed);
  //     setSets(setMixed)
  //     // console.log(setMixed)
  //     } catch (error) {
  //     console.error("failed to grab figs", error);
  //   }
  // };
  const setImgs = async () => {
    const imgs = await grabImage()
    // console.log(imgs)
    setMini(imgs[0])
    setSets(imgs[1])
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // start loading
      try {
        const imgs = await grabImage();
        setMini(imgs[0]);
        setSets(imgs[1]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false); // stop loading
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {
console.log(mini)
  },[mini])

  return (
    <>
<div className="min-h-screen bg-[#FFD700]  text-gray-900">

<section className="py-10 px-6 max-w-4xl mx-auto text-center bg-white bg-opacity-90 rounded-lg shadow-lg ">
  <h2 className="text-3xl font-bold mb-4 text-[#DA291C]">Welcome to Your LEGO Universe</h2>
  <p className="text-lg mb-4 leading-relaxed">
    This site is your personal LEGO set tracker and creative catalog. Whether you're collecting official sets or designing custom MOCs (My Own Creations), we make it easy to organize, visualize, and share your builds.
  </p>
  <p className="text-md text-gray-700">
    Get started by adding your sets, browsing minifigs, or showing off your custom designs!
  </p>
</section>



<section className="py-8 px-6 max-w-6xl mx-auto">
  <h2 className="text-2xl font-bold text-center mb-4">Featured Minifigures</h2>
  <div className="grid grid-cols-5 md:grid-cols-10 gap-4">

    <>

    {loading? (
        <LoadingSpinner />
    )
    :
    (
    mini.map((fig) => (
      <div key={fig.set_num} className="bg-white p-2 rounded shadow hover:scale-105 transition flex flex-col justify-start">
      <img src={fig.set_img_url} alt={fig.name} className="w-xs h-auto rounded" />
      <p className="text-center mt-2 text-sm font-medium">{fig.name}
      <br /><br />{fig.num_parts} parts.
      </p>
      </div>
    ))
    )
   
    }

    </>

  </div>
</section>





<section className="py-8 px-6 max-w-6xl mx-auto">
  <h2 className="text-2xl font-bold text-center mb-6">Explore Random Sets</h2>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    

    <>

{loading? (
      <LoadingSpinner />
)
:
(
sets.map((set) => (
  <div key={set.set_num} className="bg-white p-2 rounded shadow hover:scale-105 transition flex flex-col justify-end">
  <img src={set.set_img_url} alt={set.name} className="w-xs h-auto rounded align-bottom" />
  <p className="text-center mt-2 text-sm font-medium">{set.name}
    <br /><br />Set number: {set.set_num} | {set.num_parts} parts.
  </p>
  </div>
))
)
}
</>
      
      


  </div>
</section>

</div>
    </>
  );
}
