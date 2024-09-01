import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST'){
        return res.status(405).json({message: 'Only POST requests are allowed'});
    }

    const mollieAPIkey = process.env.MOLLIE_API_KEY;
    const redirectURL = process.env.REDERICT_URL;

    try {
        const response = await axios.post(
        'https://api.mollie.com/v2/client-links',
        {
            redirectURL: rederictURL,
        },
        {
            headers: {
              Authorization: `Bearer ${mollieApiKey}`,
              'Content-Type': 'application/json',
            },
          }
        );
        res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create client link', error: error.message });
    }
  }