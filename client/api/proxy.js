// api/proxy.js

const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const apiUrl = process.env.REACT_APP_BACKEND_URL.replace(/\/$/, ''); // Remove trailing slash if present
    const apiPath = req.url ? req.url.replace(/^\/api\/proxy/, '') : '/'; // Remove leading /api/proxy if present

    const formattedApiPath = apiPath.startsWith('/') ? apiPath : `/${apiPath}`;

    console.log('API URL:', apiUrl);
    console.log('Formatted API Path:', formattedApiPath);

    const axiosResponse = await axios({
      method: req.method,
      url: apiUrl + formattedApiPath,
      headers: {
        'Content-Type': 'application/json',
      },
      data: req.method === 'POST' ? req.body : undefined,
    });

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
