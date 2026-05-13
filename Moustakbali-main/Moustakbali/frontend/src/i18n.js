import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          nav: {
            home: "Home",
            dashboard: "Dashboard",
            analyses: "Analyses",
            academy: "Academy",
            gaming: "Gaming",
            gamification: "Challenges",
            about: "About",
            login: "Login",
            register: "Register",
            logout: "Logout"
          },
          home: {
            hero_title_1: "Smarter",
            hero_title_2: "Tools.",
            hero_desc: "Discover the next generation of financial management. Analyze trends with AI, manage your assets securely, and master the markets.",
            get_started: "Get Started",
            about_us: "About Us"
          }
        }
      },
      fr: {
        translation: {
          nav: {
            home: "Accueil",
            dashboard: "Tableau de Bord",
            analyses: "Analyses",
            academy: "Académie",
            gaming: "Jeux",
            gamification: "Défis",
            about: "À Propos",
            login: "Connexion",
            register: "S'inscrire",
            logout: "Déconnexion"
          },
          home: {
            hero_title_1: "Des outils plus",
            hero_title_2: "Intelligents.",
            hero_desc: "Découvrez la nouvelle génération de gestion financière. Analysez les tendances avec l'IA, gérez vos actifs en toute sécurité et maîtrisez les marchés.",
            get_started: "Commencer",
            about_us: "À Propos"
          }
        }
      }
    },
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
