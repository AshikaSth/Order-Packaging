const express = require('express');
const cors = require('cors');
const packageProcessor = require('./utils/packageProcessor');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/place-order', (req,res)=>{
  const selectedItems = req.body.items;
 console.log("Received items:", selectedItems); // DEBUG
  const result = packageProcessor(selectedItems);
  console.log("Sending response:", { packages: result }); // DEBUG
  res.json({ packages: result }); 
})

app.listen(3001, () => {
  console.log("Backend server running on http://localhost:3001");
});

app.get('/', (req, res) => {
  res.send('Server is up and running');
});
