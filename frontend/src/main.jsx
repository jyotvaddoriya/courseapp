import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Initialize Stripe with the public key
const stripePromise = loadStripe('pk_test_51QjdcZG4OXePMlCThhP72WWnByvwmCftxHRXIGf7z2OdPmO7QNo5nFAOlbQhpNMu8HdSdWdwOpgkUBTPiBhj1l1j007yulp2wP');

createRoot(document.getElementById('root')).render(
  <Elements stripe={stripePromise}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Elements>
);
