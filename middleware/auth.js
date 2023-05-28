module.exports ={
     isAuthenticated:(req, res, next) => {
        if (req.session && req.session.user) {
          // User is authenticated
          next();
        } else {
          // User is not authenticated
          res.redirect('/')
        }
      }
      
}