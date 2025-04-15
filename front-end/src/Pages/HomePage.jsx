import React, { useState, useEffect } from "react";
import { api } from "../utilities";

import axios from "axios";
import { Figure } from "react-bootstrap";
// import BRICKABLE_K from settings.BRICKABLE_K

export default function HomePage() {
  const brick = import.meta.env.VITE_BRICKABLE;
  const [mini,setMini] = useState()


  const grabImage = async () => {
    // const data = await api.get()
    try {
      // const selectFig = Math.floor(Math.random()*100)
      const response = await axios.get(
        "https://rebrickable.com/api/v3/lego/minifigs/",
        {
          params: {
            page: 1,
            page_size: 100,
            ordering: "random",
          },
          headers: {
            Authorization: `key ${brick}`,
          },
        }
      );

      let brick_img = response.data.results;
      const mixed = [];
      const doesExist = new Set();
      
      for (let i = brick_img.length; i > 95; i--) {
        let j = Math.floor(Math.random() * i);
        if (!doesExist.has(brick_img[j])) {
          mixed.push(brick_img[j]);
          doesExist.add(brick_img[j]);
        }
      }
      setMini(mixed);
      console.log(mixed);
      } catch (error) {
      console.error("failed to grab figs", error);
    }
  };

  useEffect(() => {
    const grabFig = async () => {
      await grabImage();
    };
    grabFig()
    // removeBG()
  }, []);

  return (
    <>
<div className="min-h-screen bg-yellow-100 bg-[url('/assets/lego-background.jpg')] bg-cover bg-fixed text-gray-900">

{/* <!-- Top Navbar (already handled, placed here just for structure) --> */}


{/* <!-- Minifigure Grid --> */}
<section className="py-8 px-6 max-w-6xl mx-auto">
  <h2 className="text-2xl font-bold text-center mb-4">Featured Minifigures</h2>
  <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
    {/* <!-- Repeat this block for 20 minifigs --> */}
    <>
    {/* <div> */}
    {mini?

    mini.map((fig) => (
      <div key={fig.set_num} className="bg-white p-2 rounded shadow hover:scale-105 transition">
      <img src={fig.set_img_url} alt={fig.name} className="w-xs h-auto rounded" />
      <p className="text-center mt-2 text-sm font-medium">{fig.name}</p>
      </div>
    ))
    
   
    :""}
    {/* </div> */}
    </>

  </div>
</section>

{/* <!-- About the Site --> */}
<section className="py-10 px-6 max-w-4xl mx-auto text-center bg-white bg-opacity-90 rounded-lg shadow-lg my-12">
  <h2 className="text-3xl font-bold mb-4 text-red-600">Welcome to Your LEGO Universe</h2>
  <p className="text-lg mb-4 leading-relaxed">
    This site is your personal LEGO set tracker and creative catalog. Whether you're collecting official sets or designing custom MOCs (My Own Creations), we make it easy to organize, visualize, and share your builds.
  </p>
  <p className="text-md text-gray-700">
    Get started by adding your sets, browsing minifigs, or showing off your custom designs!
  </p>
</section>

{/* <!-- Random LEGO Sets --> */}
<section className="py-8 px-6 max-w-6xl mx-auto">
  <h2 className="text-2xl font-bold text-center mb-6">Explore Random Sets</h2>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    {/* <!-- Repeat for each set --> */}
    <div className="bg-white rounded shadow p-3 hover:shadow-lg transition">
      <img src="https://cdn.rebrickable.com/media/sets/75252-1.jpg" alt="LEGO Set" className="rounded w-full" />
      <h3 className="mt-2 font-semibold text-center text-sm">Set Name</h3>
    </div>
    {/* <!-- ...more sets --> */}
  </div>
</section>

</div>
    </>
  );
}
