const removeBG = async () => {
    const response = await api.post('collection/process_image/',
      {'image_address': "https://cdn.rebrickable.com/media/sets/fig-000004/60741.jpg"}
    )
    console.log(response.data.path)
  }