import React, { useState, useEffect } from "react";
import axios from "axios";

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const API_KEY = "74f588ea3c3d9bda7561b154";
  const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency}`;

  // Fetch currencies
  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        const currencyList = Object.keys(response.data.conversion_rates);
        setCurrencies(currencyList);
      })
      .catch((err) => {
        setError("Failed to fetch exchange rates");
        console.error(err);
      });
  }, [fromCurrency]);

  // Convert the currency
  useEffect(() => {
    if (fromCurrency === toCurrency) {
      setConvertedAmount(amount);
      return;
    }
    setLoading(true);
    axios
      .get(API_URL)
      .then((response) => {
        const rate = response.data.conversion_rates[toCurrency];
        if (rate) {
          setConvertedAmount((amount * rate).toFixed(2));
        } else {
          setError("Failed to get conversion rate.");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Error during conversion: " + err.message);
        setLoading(false);
      });
  }, [fromCurrency, toCurrency, amount]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 to-indigo-500">
      <div className="p-8 bg-white shadow-xl rounded-xl w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Currency Converter</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        
        <div className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-gray-600">Amount</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-4 text-xl border border-gray-300 rounded-lg mt-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="fromCurrency" className="block text-gray-600">From Currency</label>
            <select
              id="fromCurrency"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full p-4 text-xl border border-gray-300 rounded-lg mt-2 focus:ring-2 focus:ring-blue-500"
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="toCurrency" className="block text-gray-600">To Currency</label>
            <select
              id="toCurrency"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full p-4 text-xl border border-gray-300 rounded-lg mt-2 focus:ring-2 focus:ring-blue-500"
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>

          <div className="text-center">
            <button
              className="w-full p-4 bg-blue-500 text-white text-xl rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300"
              onClick={() => {}}
            >
              Convert
            </button>
          </div>

          {loading ? (
            <div className="text-center mt-6">
              <p className="text-lg text-blue-500">Loading...</p>
            </div>
          ) : (
            <div className="mt-6 text-center">
              <h2 className="text-2xl font-semibold text-gray-700">Converted Amount</h2>
              <p className="text-3xl font-bold text-gray-800">{convertedAmount} {toCurrency}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
