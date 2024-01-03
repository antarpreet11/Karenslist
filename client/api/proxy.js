// api/proxy.js

const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const apiUrl = process.env.REACT_APP_BACKEND_URL.replace(/\/$/, ''); // Remove trailing slash if present
    const apiPath = req.url ? req.url.replace(/^\/api\/proxy/, '') : '/'; // Remove leading /api/proxy if present
    
    let formattedApiPath = apiPath.startsWith('/') ? apiPath : `/${apiPath}`;
    formattedApiPath = formattedApiPath.endsWith('/') ? formattedApiPath.slice(0, -1) : formattedApiPath; // Remove trailing slash

    console.log('API URL:', apiUrl);
    console.log('Formatted API Path:', formattedApiPath);

    // Handle OPTIONS preflight requests
    if (req.method === 'OPTIONS') {
      // Respond to preflight requests
      res.status(200).end();
      return;
    }

    const axiosResponse = await axios({
      method: req.method,
      url: apiUrl + formattedApiPath,
      headers: {
        'Content-Type': 'application/json',
      },
      data: ['POST', 'PUT'].includes(req.method) ? req.body : undefined,
    });

    console.log('Axios Response:', axiosResponse);

    res.status(axiosResponse.status).json(axiosResponse.data);
  } catch (error) {
    console.error('Error proxying request:', error);
    if (error.response) {
      console.error('Error Response:', error.response.data);
      console.error('Error Status:', error.response.status);
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
