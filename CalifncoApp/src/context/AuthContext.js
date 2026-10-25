import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { INITIAL_DEALERS } from '../data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Current role: 'customer' | 'dealer' | 'admin'
  const [role, setRole] = useState('customer');
  
  const [user, setUser] = useState({
    id: 'usr-cst-001',
    name: 'Karthik Raja',
    email: 'karthik.raja@example.com',
    phone: '+91 98401 23456',
    role: 'customer',
    referralCode: 'CALIFNCO-HERO',
    walletBalance: 750, // in INR
    savedAddresses: [
      {
        id: 'addr-1',
        tag: 'Home',
        isDefault: true,
        street: 'Flat 402, Green Valley Apartments, 100 Feet Road',
        area: 'Velachery',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600042',
        lat: 12.9759,
        lng: 80.2212
      },
      {
        id: 'addr-2',
        tag: 'Office',
        isDefault: false,
        street: 'Tidel Park, Module 4B, Rajiv Gandhi Salai',
        area: 'Taramani',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600113',
        lat: 12.9892,
        lng: 80.2483
      }
    ],
    // Dealer details if dealer
    businessName: '',
    gstin: '',
    dealerStatus: 'none', // 'none' | 'pending' | 'approved' | 'rejected'
    creditLimit: 0
  });

  const [dealersList, setDealersList] = useState(INITIAL_DEALERS);

  // Load saved session if exists
  useEffect(() => {
    AsyncStorage.getItem('@califnco_auth').then((data) => {
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (parsed.role) setRole(parsed.role);
          if (parsed.user) setUser(parsed.user);
        } catch (e) {
          console.error('Failed to parse saved auth', e);
        }
      }
    }).catch(() => {});
  }, []);

  // Save session when role or user changes
  const saveSession = (newRole, newUser) => {
    AsyncStorage.setItem('@califnco_auth', JSON.stringify({ role: newRole, user: newUser })).catch(() => {});
  };

  // Switch role directly (Convenient for testers & examiners)
  const switchRole = (newRole) => {
    setRole(newRole);
    let updatedUser = { ...user, role: newRole };

    if (newRole === 'dealer') {
      updatedUser = {
        ...updatedUser,
        name: 'Venkatesh Kumar (Dealer)',
        businessName: 'Apex Water Solutions Pvt Ltd',
        gstin: '33AABCA1234D1Z5',
        email: 'dealer.apex@watercare.in',
        phone: '+91 94440 98765',
        dealerStatus: 'approved',
        creditLimit: 250000
      };
    } else if (newRole === 'admin') {
      updatedUser = {
        ...updatedUser,
        name: 'Califnco Admin Ops',
        email: 'admin@califnco.com',
        phone: '+91 98840 00000',
        dealerStatus: 'approved'
      };
    } else {
      updatedUser = {
        ...updatedUser,
        name: 'Karthik Raja',
        email: 'karthik.raja@example.com',
        phone: '+91 98401 23456',
        dealerStatus: 'none'
      };
    }

    setUser(updatedUser);
    saveSession(newRole, updatedUser);
  };

  // Customer / Dealer regular login
  const login = (email, password, loginAsRole = 'customer') => {
    switchRole(loginAsRole);
    return { success: true };
  };

  // Submit new dealer application
  const applyForDealer = (applicationData) => {
    const newDealerRecord = {
      id: `DLR-${Date.now().toString().slice(-4)}`,
      businessName: applicationData.businessName,
      ownerName: applicationData.ownerName || user.name,
      email: applicationData.email || user.email,
      phone: applicationData.phone || user.phone,
      gstin: applicationData.gstin,
      city: applicationData.city || 'Chennai',
      state: applicationData.state || 'Tamil Nadu',
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0],
      creditLimit: 0,
      totalOrders: 0,
      totalVolume: '₹0'
    };

    setDealersList(prev => [newDealerRecord, ...prev]);

    const updatedUser = {
      ...user,
      role: 'dealer',
      businessName: applicationData.businessName,
      gstin: applicationData.gstin,
      dealerStatus: 'pending'
    };

    setUser(updatedUser);
    setRole('dealer');
    saveSession('dealer', updatedUser);

    return { success: true, message: 'Dealer application submitted! Waiting for Admin verification.' };
  };

  // Admin approves dealer
  const approveDealer = (dealerId) => {
    setDealersList(prev =>
      prev.map(d => d.id === dealerId ? { ...d, status: 'approved', creditLimit: 200000 } : d)
    );
    if (user.id === dealerId || user.role === 'dealer') {
      const updated = { ...user, dealerStatus: 'approved', creditLimit: 200000 };
      setUser(updated);
      saveSession('dealer', updated);
    }
  };

  // Admin rejects dealer
  const rejectDealer = (dealerId) => {
    setDealersList(prev =>
      prev.map(d => d.id === dealerId ? { ...d, status: 'rejected' } : d)
    );
    if (user.id === dealerId || user.role === 'dealer') {
      const updated = { ...user, dealerStatus: 'rejected' };
      setUser(updated);
      saveSession('dealer', updated);
    }
  };

  const addAddress = (newAddr) => {
    const item = {
      id: `addr-${Date.now()}`,
      isDefault: user.savedAddresses.length === 0,
      ...newAddr
    };
    const updatedAddresses = [...user.savedAddresses, item];
    const updated = { ...user, savedAddresses: updatedAddresses };
    setUser(updated);
    saveSession(role, updated);
  };

  const logout = () => {
    switchRole('customer');
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        user,
        dealersList,
        switchRole,
        login,
        logout,
        applyForDealer,
        approveDealer,
        rejectDealer,
        addAddress
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
