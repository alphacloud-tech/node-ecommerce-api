

function errorHandler(err, req, res, next) {

    // if (err) {
    //     // res.status(500).json({message: 'error in the server'})
    //     res.status(500).json({message: err})
    // }

    // jwt authorization error
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({message: "the user is not authorized"})
    }

    // validation error
    if (err.name === 'validationError') {
        return res.status(401).json({message: err})
    }

    // default i.e server error
    return res.status(500).json(err)

}

module.exports = errorHandler