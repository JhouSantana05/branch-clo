"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  role: "CUSTOMER";
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN";
}

interface AuthContextType {
  customer: CustomerUser | null;
  admin: AdminUser | null;
  isCustomerAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  loginCustomer: (email: string, pass: string) => boolean;
  registerCustomer: (
    name: string,
    email: string,
    phone: string,
    cpf: string,
    pass: string
  ) => boolean;
  logoutCustomer: () => void;
  loginAdmin: (email: string, pass: string) => boolean;
  logoutAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Clientes salvos em memória / storage
const INITIAL_CUSTOMERS: CustomerUser[] = [
  {
    id: "cust-1",
    name: "Mateus Ribeiro de Souza",
    email: "mateus.souza@gmail.com",
    phone: "(11) 98765-4321",
    cpf: "123.456.789-00",
    role: "CUSTOMER",
  },
  {
    id: "cust-2",
    name: "Priscila Albuquerque",
    email: "priscila.alb@outlook.com",
    phone: "(21) 99812-3456",
    cpf: "987.654.321-11",
    role: "CUSTOMER",
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [customersList, setCustomersList] = useState<CustomerUser[]>(INITIAL_CUSTOMERS);

  // Carregar sessões persistidas do localStorage
  useEffect(() => {
    try {
      const savedCust = localStorage.getItem("branch_clo_customer");
      if (savedCust) setCustomer(JSON.parse(savedCust));

      const savedAdmin = localStorage.getItem("branch_clo_admin");
      if (savedAdmin) setAdmin(JSON.parse(savedAdmin));

      const savedCustList = localStorage.getItem("branch_clo_customers_db");
      if (savedCustList) setCustomersList(JSON.parse(savedCustList));
    } catch (e) {
      console.error("Erro ao carregar sessões de auth", e);
    }
  }, []);

  const loginCustomer = (email: string, _pass: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const found = customersList.find((c) => c.email.toLowerCase() === cleanEmail);

    if (found) {
      setCustomer(found);
      localStorage.setItem("branch_clo_customer", JSON.stringify(found));
      return true;
    }

    // Se for um novo e-mail no login rápido, gera conta automática
    const fallbackCustomer: CustomerUser = {
      id: `cust-${Date.now()}`,
      name: email.split("@")[0].replace(/[._-]/g, " "),
      email: cleanEmail,
      phone: "(11) 99999-9999",
      cpf: "000.000.000-00",
      role: "CUSTOMER",
    };

    setCustomer(fallbackCustomer);
    setCustomersList((prev) => {
      const updated = [...prev, fallbackCustomer];
      localStorage.setItem("branch_clo_customers_db", JSON.stringify(updated));
      return updated;
    });
    localStorage.setItem("branch_clo_customer", JSON.stringify(fallbackCustomer));
    return true;
  };

  const registerCustomer = (
    name: string,
    email: string,
    phone: string,
    cpf: string,
    _pass: string
  ): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const existing = customersList.find((c) => c.email.toLowerCase() === cleanEmail);

    if (existing) {
      setCustomer(existing);
      localStorage.setItem("branch_clo_customer", JSON.stringify(existing));
      return true;
    }

    const newCustomer: CustomerUser = {
      id: `cust-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      cpf: cpf.trim(),
      role: "CUSTOMER",
    };

    setCustomer(newCustomer);
    setCustomersList((prev) => {
      const updated = [...prev, newCustomer];
      localStorage.setItem("branch_clo_customers_db", JSON.stringify(updated));
      return updated;
    });
    localStorage.setItem("branch_clo_customer", JSON.stringify(newCustomer));
    return true;
  };

  const logoutCustomer = () => {
    setCustomer(null);
    localStorage.removeItem("branch_clo_customer");
  };

  const loginAdmin = (email: string, pass: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    // Credenciais do lojista: admin@branchclo.com.br / branch2026 ou admin123
    if (
      (cleanEmail === "admin@branchclo.com.br" || cleanEmail === "admin") &&
      (pass === "branch2026" || pass === "admin123" || pass === "admin")
    ) {
      const adminUser: AdminUser = {
        id: "admin-1",
        name: "Lojista Branch Clo",
        email: "admin@branchclo.com.br",
        role: "ADMIN",
      };
      setAdmin(adminUser);
      localStorage.setItem("branch_clo_admin", JSON.stringify(adminUser));
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem("branch_clo_admin");
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        admin,
        isCustomerAuthenticated: !!customer,
        isAdminAuthenticated: !!admin,
        loginCustomer,
        registerCustomer,
        logoutCustomer,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
