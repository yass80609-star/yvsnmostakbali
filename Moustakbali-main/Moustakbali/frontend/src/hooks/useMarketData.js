import { useState, useEffect } from 'react';
import axios from 'axios';

export const useMarketData = () => {
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiKey = import.meta.env.VITE_ALPHA_VANTAGE_KEY;
        
        // Mock data fallback if API key is missing or for demo purposes
        if (!apiKey || apiKey === 'YOUR_API_KEY') {
          console.warn("Pas de clé VITE_ALPHA_VANTAGE_KEY, utilisation de mock data");
          // Génération de données factices pour le MASI
          const mockData = Array.from({length: 30}).map((_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', {day: '2-digit', month: 'short'}),
            value: 12000 + Math.random() * 500 - 250,
            volume: Math.floor(Math.random() * 1000000)
          }));
          setMarketData(mockData);
          setLoading(false);
          return;
        }

        // Real API call (Note: Alpha Vantage free tier is very limited)
        const res = await axios.get(`https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=EUR&to_symbol=MAD&apikey=${apiKey}`);
        
        if (res.data["Time Series FX (Daily)"]) {
          const series = res.data["Time Series FX (Daily)"];
          const formattedData = Object.keys(series).slice(0, 30).reverse().map(date => ({
            date: date.substring(5),
            value: parseFloat(series[date]["4. close"]),
          }));
          setMarketData(formattedData);
        } else {
           throw new Error("Limite d'API atteinte ou données non disponibles");
        }
      } catch (err) {
        console.error("Erreur de chargement des données de marché", err);
        setError("Impossible de charger les données du marché.");
        
        // Provide mock data on error so UI still looks good
        const mockData = Array.from({length: 30}).map((_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', {day: '2-digit', month: 'short'}),
            value: 12000 + Math.random() * 500 - 250,
        }));
        setMarketData(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  return { marketData, loading, error };
};
