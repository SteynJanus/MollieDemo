
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    console.log('Invalid request method:', req.method);
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  console.log('Request body:', req.body);

  const { customerId, amount, interval, description, startDate, mandateId } = req.body;  // Removed 'times' for simplicity
  const mollieApiKey = process.env.MOLLIE_API_KEY;

  try {
    console.log('Sending request to Mollie with data:', {
      customerId,
      amount: { currency: 'EUR', value: parseFloat(amount).toFixed(2) },
      interval,
      description,
      startDate,
      mandateId
    });

    const response = await axios.post(
      `https://api.mollie.com/v2/customers/${customerId}/subscriptions`,
      {
        amount: {
          currency: 'EUR',
          value: parseFloat(amount).toFixed(2),
        },
        interval,
        description,
        startDate,
        mandateId
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

    res.status(500).json({ message: 'Failed to create subscription', error: error.response ? error.response.data : error.message });
  }
}
