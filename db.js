const { default: mongoose } = require("mongoose")
require('dotenv').config()

const connectDatabase = ()=>{

    const db = mongoose.connection;

    db.on('connection', ()=>{
        console.log('connected to MongoDB');
    })
   

    
}

module.exports = connectDatabase