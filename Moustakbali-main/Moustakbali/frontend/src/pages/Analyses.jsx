import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNews } from '../hooks/useNews';
import { useMarketData } from '../hooks/useMarketData';
import NewsCard from '../components/NewsCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { RefreshCw } from 'lucide-react';

const Analyses = () => {
  const [currentQuery, setCurrentQuery] = useState('bourse+casablanca');
  const { articles, loading: newsLoading, error: newsError } = useNews(currentQuery);
  const { marketData, loading: marketLoading } = useMarketData();

  const filters = [
    { id: 'bourse+casablanca', label: 'Bourse de Casablanca' },
    { id: 'finance+internationale+maroc', label: 'Facteurs Mondiaux' },
    { id: 'secteurs+investissement+maroc', label: 'Secteurs Porteurs' }
  ];

  return (
    <div className="min-h-screen pt-4 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
      
      {/* HEADER SECTION */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-syne font-extrabold text-white mb-4">
          Analyses du <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-bright to-green-main">Marché</span>
        </h1>
        <p className="text-text-muted text-lg max-w-2xl">
          Suivez l'évolution du marché financier marocain et restez informé des dernières tendances économiques grâce à notre flux de données en temps réel.
        </p>
      </div>

      {/* MARKET DATA SECTION */}
      <div className="mb-12">
        <h2 className="text-2xl font-syne font-bold mb-6 flex items-center">
          <span className="w-2 h-8 bg-green-main rounded mr-3"></span>
          Aperçu du MASI (Simulé)
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-bg-card border border-border p-6 rounded-xl shadow-lg h-[300px]">
            {marketLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <RefreshCw className="animate-spin text-green-main" size={32} />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marketData}>
                  <XAxis dataKey="date" stroke="#00C853" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={['auto', 'auto']} stroke="#00C853" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', borderColor: 'rgba(157,253,36,0.3)', color: '#fff' }}
                    itemStyle={{ color: '#00C853' }}
                  />
                  <Bar dataKey="value" fill="#00C853" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="bg-bg-card border border-border p-6 rounded-xl flex-1 flex flex-col justify-center">
              <span className="text-text-muted text-sm mb-1">MASI</span>
              <span className="text-3xl font-syne font-bold text-white">12,450.32</span>
              <span className="text-green-bright text-sm mt-2 flex items-center">+1.24% (Aujourd'hui)</span>
            </div>
            <div className="bg-bg-card border border-border p-6 rounded-xl flex-1 flex flex-col justify-center">
              <span className="text-text-muted text-sm mb-1">Volume d'échange</span>
              <span className="text-2xl font-syne font-bold text-white">45.2M DH</span>
            </div>
            <div className="bg-bg-card border border-border p-6 rounded-xl flex-1 flex flex-col justify-center">
              <span className="text-text-muted text-sm mb-1">Tendance</span>
              <span className="text-2xl font-syne font-bold text-green-bright">HAUSSIÈRE</span>
            </div>
          </div>
        </div>
      </div>

      {/* NEWS SECTION */}
      <div>
        <h2 className="text-2xl font-syne font-bold mb-6 flex items-center">
          <span className="w-2 h-8 bg-green-main rounded mr-3"></span>
          Actualités Financières
        </h2>

        <div className="flex flex-wrap gap-4 mb-8">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setCurrentQuery(filter.id)}
              className={`relative px-5 py-2.5 rounded-lg text-sm font-bold transition-all border ${
                currentQuery === filter.id 
                  ? 'bg-transparent border-green-main text-green-bright' 
                  : 'bg-[#0a1910] border-transparent text-text-muted hover:border-green-main/30 hover:text-white'
              }`}
            >
              {currentQuery === filter.id && (
                <motion.div 
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-green-main/5 border border-green-main rounded-lg pointer-events-none"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{filter.label}</span>
            </button>
          ))}
        </div>

        {newsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-bg-card border border-border rounded-xl h-[400px] animate-pulse"></div>
            ))}
          </div>
        ) : newsError ? (
          <div className="bg-alert-red/10 border border-alert-red/30 p-6 rounded-xl text-center">
            <p className="text-alert-red font-medium">{newsError}</p>
          </div>
        ) : articles.length > 0 ? (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {articles.map((article, idx) => (
                <NewsCard key={idx} article={article} />
              ))}
            </motion.div>
            <div className="mt-12 flex justify-center">
              <button className="px-8 py-3 bg-[#0f2415] hover:bg-[#15331d] text-white rounded-lg font-bold transition-colors">
                Charger plus
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-text-muted">Aucune actualité trouvée pour ce filtre.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Analyses;
