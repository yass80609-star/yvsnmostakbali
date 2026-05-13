import React, { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NewsCard = ({ article }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReadMore = (e) => {
    e.preventDefault();
    if (article.url !== '#') {
      window.open(article.url, '_blank', 'noopener,noreferrer');
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <motion.div 
        whileHover={{ y: -5 }}
        className="bg-[#0f1f14] border border-border/50 hover:border-green-main/80 rounded-2xl overflow-hidden transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_40px_rgba(22,163,74,0.15)] flex flex-col h-full group relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-main/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="p-8 flex flex-col flex-grow z-20 relative">
          <div className="flex justify-between items-center mb-6">
            <span className="text-[12px] font-extrabold text-green-bright">
              {article.source.name}
            </span>
            <span className="text-xs font-medium text-text-muted">
              {new Date(article.publishedAt).toLocaleDateString('fr-FR')}
            </span>
          </div>
          <h3 className="text-xl font-syne font-bold mb-4 line-clamp-2 text-white group-hover:text-green-bright transition-colors duration-300">
            {article.title}
          </h3>
          <p className="text-[15px] text-text-muted/90 line-clamp-3 mb-8 flex-grow leading-relaxed">
            {article.description}
          </p>
          <button 
            onClick={handleReadMore}
            className="inline-flex items-center text-sm font-bold text-white group-hover:text-green-bright transition-colors mt-auto w-max relative"
          >
            <span className="relative z-10 flex items-center">
              Lire la suite 
              <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-bg-card border border-border rounded-2xl max-w-2xl w-full relative flex flex-col max-h-[85vh] shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-green-main hover:text-black transition-colors z-20"
              >
                <X size={24} />
              </button>
              
              <div className="overflow-y-auto w-full h-full">
                {article.urlToImage && (
                  <div className="w-full h-64 relative">
                    <img src={article.urlToImage} alt={article.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent" />
                  </div>
                )}
                
                <div className="p-8">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-green-bright bg-green-main/10 px-3 py-1 rounded-full">
                      {article.source.name}
                    </span>
                    <span className="text-sm text-text-muted">
                      {new Date(article.publishedAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-syne font-bold text-white mb-6 leading-tight">
                    {article.title}
                  </h2>
                  
                  <div className="prose prose-invert max-w-none">
                    <p className="text-lg text-gray-300 font-medium mb-6 italic border-l-4 border-green-main pl-4">
                      {article.description}
                    </p>
                    <div className="text-gray-400 space-y-4 leading-relaxed">
                      {article.content ? (
                        <p>{article.content}</p>
                      ) : (
                        <p>Contenu détaillé de l'article non disponible dans la version d'essai. Les données complètes proviennent du flux direct des marchés.</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-10 flex justify-end">
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-2 bg-bg-surface hover:bg-green-main/20 text-white rounded-lg border border-border hover:border-green-main transition-colors text-sm font-bold"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NewsCard;
