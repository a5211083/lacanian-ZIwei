const express = require('express');  
const axios = require('axios');  
const cors = require('cors');  
const app = express();  
const PORT = process.env.PORT || 8000;  
const GLM_API_KEY = process.env.GLM_API_KEY;  
const GLM_API_BACKEND_HOST = process.env.GLM_API_BACKEND_HOST || 'https://open.bigmodel.cn';  
app.use(cors());  
app.use(express.json());  
app.get('/health', (req, res) => {  
  res.json({ status: 'ok' });  
});  
app.post('/api/glm', async (req, res) => {  
  try {  
    const { messages, model = 'glm-4-flash' } = req.body;  
    if (!messages) {  
      return res.status(400).json({ error: 'messages field is required' });  
    }  
    if (!GLM_API_KEY) {  
      return res.status(500).json({ error: 'GLM_API_KEY not configured' });  
    }  
    const response = await axios.post(  
      GLM_API_BACKEND_HOST + '/api/paas/v4/chat/completions',  
      {  
        model,  
        messages,  
        temperature: 0.7,  
        top_p: 0.7,  
        max_tokens: 1024  
      },  
      {  
        headers: {  
          'Authorization': `Bearer ${GLM_API_KEY}`,  
          'Content-Type': 'application/json'  
        }  
      }  
    );  
    res.json(response.data);  
  } catch (error) {  
    console.error('Error calling GLM API:', error.message);  
    res.status(500).json({  
      error: 'Failed to call GLM API',  
      message: error.message  
    });  
  }  
});  
app.listen(PORT, () => {  
  console.log(`GLM API Backend running on port ${PORT}`);  
});  
