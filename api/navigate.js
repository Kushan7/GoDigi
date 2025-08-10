// This requires the 'axios' package.
// Run 'npm install axios' in your terminal.
const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const { digipin } = req.body;

  if (!digipin) {
    return res.status(400).json({ message: 'DIGIPIN is required' });
  }

  // The actual official API URL might be different, this is a placeholder.
  const officialApiUrl = `https://dac.indiapost.gov.in/ws/mydigipin/getCoordinates?reqid=${digipin}`;

  try {
    const apiResponse = await axios.get(officialApiUrl);

    // IMPORTANT: The structure of the actual response from the API must be inspected.
    // This is an assumption based on their website's behavior.
    const coordsString = apiResponse.data.coordinates; 
    const [lat, lon] = coordsString.split(', ');

    res.status(200).json({ lat, lon });

  } catch (error) {
    console.error('Error calling official API:', error.message);
    res.status(500).json({ message: 'Failed to fetch data from the DIGIPIN service.' });
  }
};