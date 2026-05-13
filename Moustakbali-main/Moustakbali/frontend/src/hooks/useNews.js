import { useState, useEffect } from 'react';
import axios from 'axios';

export const useNews = (query = 'finance+maroc') => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiKey = import.meta.env.VITE_NEWS_API_KEY;
        // Si pas de clé API, on met des données mockées pour l'exemple
        if (!apiKey || apiKey === 'YOUR_API_KEY') {
          console.warn("Pas de clé VITE_NEWS_API_KEY, utilisation de mock data");
          setArticles([
            {
              title: "La Bourse de Casablanca termine en hausse",
              description: "Le MASI a enregistré une progression significative aujourd'hui...",
              url: "#",
              source: { name: "Bourse News" },
              publishedAt: new Date().toISOString()
            },
            {
              title: "Nouvelles opportunités d'investissement au Maroc",
              description: "Les secteurs de l'énergie renouvelable attirent de nouveaux capitaux...",
              url: "#",
              source: { name: "Finance Hebdo" },
              publishedAt: new Date().toISOString()
            },
            {
              title: "Les startups fintech en pleine croissance",
              description: "Une nouvelle vague d'innovation touche le secteur financier marocain...",
              url: "#",
              source: { name: "Tech Africa" },
              publishedAt: new Date().toISOString()
            }
          ]);
          setLoading(false);
          return;
        }

        const res = await axios.get(`https://newsapi.org/v2/everything?q=${query}&language=fr&sortBy=publishedAt&pageSize=6&apiKey=${apiKey}`);
        setArticles(res.data.articles);
      } catch (err) {
        console.error("Erreur de chargement des actualités", err);
        setError("Impossible de charger les actualités pour le moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [query]);

  return { articles, loading, error };
};
