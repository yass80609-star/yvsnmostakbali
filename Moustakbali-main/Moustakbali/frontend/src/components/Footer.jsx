import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-bg-card border-t border-border py-8 px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-text-muted">
        <div className="mb-4 md:mb-0">
          <span className="font-syne font-bold text-lg text-white">MOUSTAKBALI</span>
          <p className="mt-1 opacity-70">L'éducation financière nouvelle génération.</p>
        </div>
        <div className="flex space-x-6">
          <Link to="/contact" className="hover:text-green-bright transition-colors">Contact</Link>
          <Link to="#" className="hover:text-green-bright transition-colors">Confidentialité</Link>
          <Link to="#" className="hover:text-green-bright transition-colors">Conditions</Link>
        </div>
        <div className="mt-4 md:mt-0 opacity-50">
          &copy; {new Date().getFullYear()} Moustakbali. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
