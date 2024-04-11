const buyToyWithCallback = (callback) => {
  setTimeout(() => {
    const error = false;
    if (!error) {
      callback("Toy brought!");
    } else {
      callback("Error fetching toy!");
    }
  }, 2000);
};

// Using Callback
buyToyWithCallback((message) => {
  console.log("Callback:", message);
});
