const info = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(...params)
    } else {
        console.log(...params)
    }
    
}

const error = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(...params)
    } else {
        console.log(...params)
    }
}

module.exports = { info, error }