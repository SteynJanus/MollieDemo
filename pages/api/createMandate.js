// pages/api/createMandate.js

import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    console.log('Invalid request method:', req.method);
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  console.log('Request body:', req.body);

  const { customerId, method, consumerName, consumerAccount, consumerBic, signatureDate } = req.body;
  const mollieApiKey = process.env.MOLLIE_API_KEY;

  // Generate a unique mandate reference
  const mandateReference = `REF-${new Date().getTime()}-${Math.random().toString(36).substr(2, 9)}`;

  try {
    console.log('Sending request to Mollie with data:', {
      method,
      consumerName,
      consumerAccount,
      consumerBic,
      signatureDate,
      mandateReference,  // Log the generated mandate reference
    });

    const response = await axios.post(
      `https://api.mollie.com/v2/customers/${customerId}/mandates`,
      {
        method,
        consumerName,
        consumerAccount,
        consumerBic,
        signatureDate,
        mandateReference,  // Include the unique mandate reference
      },
      {
        headers: {
          Authorization: `Bearer ${mollieApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Response from Mollie:', response.data);

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error response from Mollie:', error.response ? error.response.data : error.message);

    if (error.response && error.response.data) {
      console.error('Detailed error response from Mollie:', error.response.data);
    }

    res.status(500).json({ message: 'Failed to create mandate', error: error.response ? error.response.data : error.message });
  }
}
