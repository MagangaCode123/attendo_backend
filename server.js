const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); 

const app = express();
const port = process.env.PORT || 3000; 

const EmployeeModel = require('./models/employeeModel');
const EmployeeAttendance = require('./models/employeeAttendance');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

//Fetching employees data
app.get("/fetchemployee", async (req, res) => {
  try {
    const employees = await EmployeeModel.find();
    res.status(200).json({ message: "Employees fetched successfully", employees });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching employee data", error: err.message });
  }
});


// Authentication routes
app.post('/login', async(req, res) => {
   
  const {email, password} = req.body

  
  

  //data verification
  if(!email || !password){
    res.status(401).json({message:"Incomplete user credentials"})
  }

  //user exists
  const user = await EmployeeModel.findOne({email})

  if(!user){
    res.status(401).json({message:"User does not exist"})
  }

  //compare passwords
  const isMatch = await bcrypt.compare(password, user.password)

  if(!isMatch){
    res.status(401).json({message:"Invalid password"})
  }

      //create token
      const token = jwt.sign({email: email}, process.env.JWT_ACCESS_KEY, {expiresIn: '1h'})

      res.cookie('token',token,{
          httpOnly:true,
          maxAge: 900000,
          // secure:true
      } )

  // 5. Determine today's date (set time to 00:00:00)
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize time

  // 6. Check if an attendance record already exists for today
  const existingAttendance = await EmployeeAttendance.findOne({
    employeeId: user._id,
    date: today
  });

  // 7. If not, create attendance record
  if (!existingAttendance) {
    await EmployeeAttendance.create({
      employeeId: user._id,
      date: today,
      checkInTime: new Date() // Actual login time
    });
  }

  res.status(201).json({message:"User logged in successfully"})  
});

app.get( '/employeeattendance', async( req, res) =>{
 try{
  const attendance = await EmployeeAttendance.find();
  res.status(201).json({ message: "Employee attendance fetched succesfully", attendance});}
  catch(err) {
    console.error(err);
    res.status(501),json ({message: "Error fetching attendance model", Error: err.message});
  }

}
)

app.post('/register', async(req,res)=>{

  const fields = req.body
 
   //data verification
  if(!fields.fullName || !fields.email || !fields.password){
    res.status(401).json({message:"Incomplete user credentials"})
  }

  //user duplication 
  const user = await EmployeeModel.findOne({email: fields.email})
  //user exists
  if(user){
    res.status(401).json({message:"User already exists"})
  }

    //email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(fields.email)){
      res.status(401).json({message:"Invalid email"})
    }

    //password validation
    const passwordRegex = /^[a-zA-Z0-9]{8,}$/;
    if(!passwordRegex.test(fields.password)){
      res.status(401).json({message:"Invalid password"})
    }


    //password encryption
    const hashedPassword = await bcrypt.hash(fields.password, 10)

    //create token
    const token = jwt.sign({email: fields.email}, process.env.JWT_ACCESS_KEY, {expiresIn: '1h'})

    res.cookie('token',token,{
        httpOnly:true,
        maxAge: 900000,
        // secure:true
    } )


    //registering user
    try{
      await EmployeeModel.create({
        ...fields,
        password:hashedPassword
      })
      res.status(201).json({message:"User registered successfully"})
    }
    catch(err){
      res.status(401).json({message:"Error registering user", err})
      console.log(err)
    }
})




// Database connection and server startup
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(port, () => {
      console.log(`Server running on port ${port}`);
  });
})
.catch(err => {
  console.error('Database connection error:', err.message);
  process.exit(1);
});

// Error handling middleware (added for better error handling)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
    next()
});

