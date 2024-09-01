import axios from 'axios';


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const { name, email } = req.body;
  const mollieApiKey = process.env.MOLLIE_API_KEY;

  try {
    // Send a POST request to Mollie's API to create a new customer
    const response = await axios.post(
      'https://api.mollie.com/v2/customers',
      {
        name,
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${mollieApiKey}`,
          'Content-Type': 'application/json',      
        },
      }
    );

    // If successful, return the response data with a 200 status
    res.status(200).json(response.data);
  } catch (error) {
    // If an error occurs, return a 500 status and the error message
    res.status(500).json({ message: 'Failed to create customer', error: error.message });
  }
}
