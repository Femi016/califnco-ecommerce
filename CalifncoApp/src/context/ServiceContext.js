import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { INITIAL_SERVICES } from '../data/mockData';

const ServiceContext = createContext();

export const TECHNICIANS_LIST = [
  { id: 'tech-1', name: 'M. Ramesh', phone: '+91 98840 55112', rating: 4.9, experience: '6 Years Certified Califnco Specialist' },
  { id: 'tech-2', name: 'V. Prakash', phone: '+91 98400 99881', rating: 4.8, experience: '4 Years RO Membrane Expert' },
  { id: 'tech-3', name: 'S. Dinesh', phone: '+91 97911 22334', rating: 4.7, experience: '5 Years Commercial RO & Electrical' },
  { id: 'tech-4', name: 'K. Saravanan', phone: '+91 98410 77665', rating: 4.9, experience: '7 Years Master Technician' }
];

export const SERVICE_TYPES = [
  { id: 'periodic', name: 'Periodic RO Service & Filter Replacement', price: 699, duration: '45 mins' },
  { id: 'tds_check', name: 'TDS & Water Quality Health Inspection', price: 199, duration: '20 mins' },
  { id: 'leakage', name: 'Pump Noise / Water Leakage Rectification', price: 449, duration: '60 mins' },
  { id: 'membrane', name: 'RO Membrane Deep Chemical Descaling & Replacement', price: 1499, duration: '60 mins' },
  { id: 'installation', name: 'New Water Purifier Installation / Relocation', price: 499, duration: '45 mins' },
  { id: 'amc', name: 'Annual Maintenance Contract (AMC) Comprehensive Plan', price: 2999, duration: '1 Year (3 Free Services + Parts)' }
];

export const ServiceProvider = ({ children }) => {
  const [services, setServices] = useState(INITIAL_SERVICES);

  useEffect(() => {
    AsyncStorage.getItem('@califnco_services').then((data) => {
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setServices(parsed);
          }
        } catch (e) {}
      }
    }).catch(() => {});
  }, []);

  const saveServices = (list) => {
    setServices(list);
    AsyncStorage.setItem('@califnco_services', JSON.stringify(list)).catch(() => {});
  };

  const bookNewService = (data) => {
    const newService = {
      id: `SRV-2026-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Requested',
      technician: null,
      createdAt: new Date().toISOString().split('T')[0],
      ...data
    };
    const updated = [newService, ...services];
    saveServices(updated);
    return newService;
  };

  // Admin assigns technician
  const assignTechnician = (serviceId, technicianObj) => {
    const updated = services.map(s => {
      if (s.id === serviceId) {
        return {
          ...s,
          technician: technicianObj,
          status: 'Assigned'
        };
      }
      return s;
    });
    saveServices(updated);
  };

  // Admin marks service status
  const updateServiceStatus = (serviceId, newStatus) => {
    const updated = services.map(s => {
      if (s.id === serviceId) {
        return { ...s, status: newStatus };
      }
      return s;
    });
    saveServices(updated);
  };

  return (
    <ServiceContext.Provider
      value={{
        services,
        bookNewService,
        assignTechnician,
        updateServiceStatus,
        SERVICE_TYPES,
        TECHNICIANS_LIST
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export const useService = () => useContext(ServiceContext);
