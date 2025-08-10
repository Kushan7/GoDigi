// api/navigate.js
// This would be a serverless function.

const axios = require('axios');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const { digipin } = req.body;

  if (!digipin || digipin.length !== 12) {
    return res.status(400).json({ message: 'Invalid DIGIPIN format' });
  }

  try {
    // Our server calls the official API.
    const officialApiUrl = `https://dac.indiapost.gov.in/ws/mydigipin/getCoordinates?reqid=${digipin}`;
    const apiResponse = await axios.get(officialApiUrl);

    // Assuming the official API returns data in a specific format.
    // We need to parse it and find the coordinates.
    // Let's assume the response looks like: { data: { coordinates: "22.835, 86.227" } }
    const coordsString = apiResponse.data.coordinates; // Adjust this based on actual API response
    const [lat, lon] = coordsString.split(', ');

    // Send the clean coordinates back to our React frontend.
    res.status(200).json({ coordinates: { lat, lon } });

  } catch (error) {
    console.error('Error calling official API:', error);
    res.status(500).json({ message: 'Failed to fetch data from the official DIGIPIN service.' });
  }
}