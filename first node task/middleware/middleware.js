// ROUTER-MIDDLEWARE

const routerMiddleWare = () => {
  return (req, res, next) => {
    console.log("Router Middleware is initiated");
    console.log(`Request Method: ${req.method}, URL: ${req.url}`);
    next();
  };
};

const checking = (validUrl) => {
  return (req, res, next) => {
    if (req.url === validUrl) {
      console.log(`${validUrl} Page accessed`);
      next();
    } else {
      console.log("Validation middleware is working");
      next();
    }
  };
};

module.exports = { routerMiddleWare, checking };
