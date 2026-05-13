import React, { createContext, useState, useEffect, useContext } from 'react';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { AuthContext } from './AuthContext';

export const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState({
    solde: 0,
    revenus: [{ id: 1, label: 'Salaire', montant: 0 }],
    depenses: {
      Logement: 0,
      Nourriture: 0,
      Transport: 0,
      Loisirs: 0,
      Epargne: 0,
      Autres: 0
    },
    objectifEpargne: 0,
    budgetMax: {
      Logement: 0,
      Nourriture: 0,
      Transport: 0,
      Loisirs: 0,
      Epargne: 0,
      Autres: 0
    },
    periode: { start: '', end: '' },
    objectifs: []
  });

  useEffect(() => {
    if (user) {
      const storedData = getStorageItem(`mb_budget_${user.id}`, null);
      if (storedData) {
        setData(storedData);
      }
    }
  }, [user]);

  const updateData = (newData) => {
    setData(newData);
  };

  const saveData = () => {
    if (user) {
      setStorageItem(`mb_budget_${user.id}`, data);
    }
  };

  return (
    <DashboardContext.Provider value={{ data, updateData, saveData }}>
      {children}
    </DashboardContext.Provider>
  );
};
