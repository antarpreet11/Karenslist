// api/proxy.js

const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const apiUrl = process.env.REACT_APP_BACKEND_URL;
    const apiPath = req.url;

    const axiosResponse = await axios({
      method: req.method,
      url: apiUrl + apiPath,
      headers: {
        'Content-Type': 'application/json',
      },
      data: req.method === 'POST' ? req.body : undefined,
    });

    res.status(axiosResponse.status).json(axiosResponse.data);
  } catch (error) {
    console.error('Error proxying request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
