import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    // Retrieve environment variables
    const mollieApiKey = process.env.MOLLIE_API_KEY;
    const redirectURL = process.env.REDIRECT_URL;

    // Check if environment variables are set
    if (!mollieApiKey || !redirectURL) {
        return res.status(500).json({ message: 'Environment variables are not properly set.' });
    }

    try {
        // Send POST request to Mollie API to create a client link
        const response = await axios.post(
            'https://api.mollie.com/v2/client-links',
            {
                redirectUrl: redirectURL, 
            },
            {
                headers: {
                    Authorization: `Bearer ${mollieApiKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        // Send back the response from Mollie API
        res.status(200).json(response.data);
    } catch (error) {
        // Provide detailed error handling
        if (error.response) {
            // Errors from Mollie API
            res.status(error.response.status).json({
                message: 'Failed to create client link',
                error: error.response.data,
            });
        } else {

            res.status(500).json({
                message: 'Failed to create client link',
                error: error.message,
            });
        }
    }
}
