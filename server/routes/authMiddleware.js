module.exports.isAuth = (req, res, next) => {
    console.log("Auth?:" + req.isAuthenticated())
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).json({ msg: 'You are not authorized to view this resource' });
    }
}
