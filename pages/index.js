// pages/index.js

import { useState } from 'react';

export default function Home() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [consumerAccount, setConsumerAccount] = useState('');
  const [consumerBic, setConsumerBic] = useState('');
  const [amount, setAmount] = useState('');
  const [interval, setInterval] = useState('1 month');
  const [description, setDescription] = useState('Monthly subscription');
  const [message, setMessage] = useState('');

  const handleCreateCustomerAndSubscription = async () => {
    try {
      // Step 1: Create a customer
      const customerResponse = await fetch('/api/createCustomer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      if (!customerResponse.ok) throw new Error('Failed to create customer');

      const customerData = await customerResponse.json();
      const customerId = customerData.id; // Extract customer ID

      // Step 2: Create a mandate using the customer ID and other details
      const signatureDate = new Date().toISOString().split('T')[0]; // Set today's date as signature date

      const mandateResponse = await fetch('/api/createMandate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          method: 'directdebit',
          consumerName: name, 
          consumerAccount,
          consumerBic,
          signatureDate,
        }),
      });

      if (!mandateResponse.ok) throw new Error('Failed to create mandate');

      const mandateData = await mandateResponse.json();
      const mandateId = mandateData.id; // Extract mandate ID

      // Step 3: Create a subscription using the customer ID and mandate ID
      const subscriptionResponse = await fetch('/api/createSubscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          amount,
          interval,
          description,
          startDate: new Date().toISOString().split('T')[0], // Start today
          mandateId,
        }),
      });

      if (!subscriptionResponse.ok) throw new Error('Failed to create subscription');

      setMessage('Customer, Mandate, and Subscription created successfully!');
    } catch (error) {
      setMessage(error.message);
    }
  };


  return (
    <div>
      <h1>Create Customer and Mandate</h1>
      <h4>NL55INGB0000000000     ,   INGBNL2A   </h4>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Consumer Account (IBAN)"
        value={consumerAccount}
        onChange={(e) => setConsumerAccount(e.target.value)}
      />
      <input
        type="text"
        placeholder="Consumer BIC"
        value={consumerBic}
        onChange={(e) => setConsumerBic(e.target.value)}
      />
      <input
        type ='number'
        placeholder= 'Recurring amount'
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleCreateCustomerAndSubscription}>Create</button>
      {message && <p>{message}</p>}
    </div>
  );
}
