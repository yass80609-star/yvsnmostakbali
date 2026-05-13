import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const AlertBanner = ({ alerts, onClose }) => {
  return (
    <AnimatePresence>
      {alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-alert-red/10 border border-alert-red/30 rounded-lg p-4 mb-6 relative"
        >
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 text-alert-red hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
          
          <div className="flex items-start space-x-3">
            <AlertTriangle className="text-alert-red flex-shrink-0 mt-0.5" size={20} />
            <div className="flex flex-col space-y-1">
              <h4 className="text-alert-red font-bold text-sm">Alertes Budget</h4>
              <ul className="text-sm text-alert-red/90 space-y-1">
                {alerts.map((alert, idx) => (
                  <li key={idx}>⚠️ {alert.categorie} a dépassé son budget de {alert.depassement} DH</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertBanner;
