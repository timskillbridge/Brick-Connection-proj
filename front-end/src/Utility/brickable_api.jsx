
const brick = import.meta.env.VITE_BRICKABLE;
import axios from 'axios'

const headers = {
  Authorization: `key ${brick}`,
  'Content-Type': 'application/json',
};

export const searchFigs = async(term) => {
  try {
    const response = await axios.get(`https://rebrickable.com/api/v3/lego/minifigs/?search=${term}`,
      {
      params: {
        page_size:100
      },
      headers
    }
    )
    const rawData= response.data.results

    const filteredResponse = rawData.filter(item => item.set_img_url != null);
    // console.log(filteredResponse)
    return filteredResponse

  }
  catch (error) {
    console.log(error)
  }
}


export const grabImage = async () => {
    // const data = await api.get()
    try {


      const [figResponse, setResponse] = await Promise.all([
        axios.get("https://rebrickable.com/api/v3/lego/minifigs/",{
       
          params: {
            page: 1,
            page_size: 100,
            ordering: "random",
          },
          headers,

       
      }),
      axios.get("https://rebrickable.com/api/v3/lego/sets/", {
        params: {
          page:1,
          page_size:100,
          ordering:'-num_parts'
        },
        headers,
      })

    ]);
    
    // console.log(`${setResponse.data.results[0]}
    //   ${figResponse.data.results[0]}`)

      let brick_img = figResponse.data.results;
      const mixed = [];
      const doesExist = new Set();
      
      for (let i = brick_img.length; i > 95; i--) {
        let j = Math.floor(Math.random() * i);
        if (!doesExist.has(brick_img[j])) {
          mixed.push(brick_img[j]);
          doesExist.add(brick_img[j]);
        }
      }

      let sets_img = setResponse.data.results;
      const setMixed = [];
      const setExist = new Set();
      
      for (let i = sets_img.length; i > 98; i--) {
        let j = Math.floor(Math.random() * i);
        if (!doesExist.has(sets_img[j])) {
          setMixed.push(sets_img[j]);
          setExist.add(sets_img[j]);
        }
      }
      // console.log([mixed,setMixed])
      return [mixed,setMixed]
    } catch (error) {
        console.error("failed to grab figs", error);
      }
    }