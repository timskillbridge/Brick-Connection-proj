
import React from 'react'
export default function LoadingSpinner() {
  const imagePool = import.meta.glob('/src/game_assets/*.png',{eager:true});

  const getRandBrick = () => {
    const imagePaths = Object.values(imagePool);
    const keys = Object.keys(imagePool);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return imagePool[randomKey].default;
  };

  const randBrick = getRandBrick()


  

  return (
    <div className="flex justify-center items-center py-12 ">
    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid">
      <img src={randBrick} alt="Loading" className="justify-center"/>
    </div>
  </div>
    
  )
}
