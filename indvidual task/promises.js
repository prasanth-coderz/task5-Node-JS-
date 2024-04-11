const getToy = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const error = false; 
      if (!error) {
        resolve("Yes, I got a new toy...");
      } else {
        reject("Oops! out of stock...");
      }
    }, 2000); 
  });
};

const buyToy = async () => {
  try {
    const toy = await getToy();
    console.log(toy); 
  } catch (error) {
    console.log(error); 
  }
};

buyToy();
