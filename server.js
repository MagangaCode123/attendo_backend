const express = require('express')


const app = express()
const port = 3000
let cors = require('cors')

app.use(cors()) //enable 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get('/', (req, res) => {
    res.send('Hello World!')
  })



app.post('/login', (req,res)=>{
    
    console.log('req',req.body)

    const {email, password} = req.body

    if(!password || !email){
        return res.status(401).json({message: 'Unauthorized accesss, missing email/password'})
    }


    if(password === 'Admin@123' && email === 'admin@test.com'){
        return res.status(200).json({message: 'Login Successful'})
    }
    else{
        return res.status(401).json({message: 'Unauthorized accesss, invalid email/password'})
    }
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })