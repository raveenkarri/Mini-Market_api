const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcryptjs');

const areaRoutes = require('./routes/areas');

const app = express();
const PORT = 5003;


mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to same Database second collection'));


app.use(cors()); 
app.use(bodyParser.json());

const customerSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required:true
    }
});
const Customer = mongoose.model("Customer",customerSchema);
app.post("/customer", async (req, res) => {
    try {
     const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newCustomer = new Customer({
        username: req.body.username,
        password: hashedPassword
      })
      const savedCustomer = await newCustomer.save();
      res.status(201).json(savedCustomer);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  app.get("/customers", async (req, res) => {
    try {
     
      const savedCustomer = await Customer.find();
      res.status(201).json(savedCustomer);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  app.post("/login", async (req, res) => {
    try {
const customer = await Customer.findOne({ username: req.body.username });
if (customer) {
  const match = await bcrypt.compare(req.body.password, customer.password);
  if (match) {
    res.status(200).json({ message: 'Authentication successful', customer });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
} else {
  res.status(401).json({ message: 'Invalid username or password' });
}

    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  



app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
