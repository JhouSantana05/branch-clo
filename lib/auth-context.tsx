"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface AddressData {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  role: "CUSTOMER";
  address?: AddressData;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN";
}

export interface LoginResult {
  success: boolean;
  role?: "ADMIN" | "CUSTOMER";
  message?: string;
}

interface AuthContextType {
  customer: CustomerUser | null;
  admin: AdminUser | null;
  isCustomerAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  unifiedLogin: (email: string, pass: string) => LoginResult;
  loginCustomer: (email: string, pass: string) => boolean;
  registerCustomer: (
    name: string,
    email: string,
    phone: string,
    cpf: string,
    pass: string,
    address?: AddressData
  ) => boolean;
  updateCustomerAddress: (address: AddressData) => void;
  logoutCustomer: () => void;
  loginAdmin: (email: string, pass: string) => boolean;
  logoutAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Clientes salvos em memória / storage com endereços reais
const INITIAL_CUSTOMERS: CustomerUser[] = [
  {
    id: "cust-1",
    name: "Mateus Ribeiro de Souza",
    email: "mateus.souza@gmail.com",
    phone: "(11) 98765-4321",
    cpf: "123.456.789-00",
    role: "CUSTOMER",
    address: {
      cep: "01310-100",
      street: "Avenida Paulista",
      number: "1000",
      complement: "Apto 42",
      neighborhood: "Bela Vista",
      city: "São Paulo",
      state: "SP",
    },
  },
  {
    id: "cust-2",
    name: "Priscila Albuquerque",
    email: "priscila.alb@outlook.com",
    phone: "(21) 99812-3456",
    cpf: "987.654.321-11",
    role: "CUSTOMER",
    address: {
      cep: "22041-001",
      street: "Avenida Atlântica",
      number: "2500",
      complement: "Bloco B",
      neighborhood: "Copacabana",
      city: "Rio de Janeiro",
      state: "RJ",
    },
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

  const loginAdmin = (email: string, pass: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    // Credenciais do lojista: admin@branchclo.com.br / branch2026 ou admin123 ou admin
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

  const loginCustomer = (email: string, _pass: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();

    // Se o dono tentar entrar pelo campo comum com as credenciais dele, loga como admin automaticamente
    if (
      (cleanEmail === "admin@branchclo.com.br" || cleanEmail === "admin") &&
      (_pass === "branch2026" || _pass === "admin123" || _pass === "admin")
    ) {
      return loginAdmin(email, _pass);
    }

    const found = customersList.find((c) => c.email.toLowerCase() === cleanEmail);

    if (found) {
      setCustomer(found);
      localStorage.setItem("branch_clo_customer", JSON.stringify(found));
      return true;
    }

    // Se for um novo e-mail no login rápido, gera conta automática com endereço padrão
    const fallbackCustomer: CustomerUser = {
      id: `cust-${Date.now()}`,
      name: email.split("@")[0].replace(/[._-]/g, " "),
      email: cleanEmail,
      phone: "(11) 99999-9999",
      cpf: "000.000.000-00",
      role: "CUSTOMER",
      address: {
        cep: "01310-100",
        street: "Avenida Paulista",
        number: "1000",
        neighborhood: "Bela Vista",
        city: "São Paulo",
        state: "SP",
      },
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

  // Login Unificado (Dono e Cliente no mesmo formulário)
  const unifiedLogin = (email: string, pass: string): LoginResult => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Verifica se são credenciais de Administrador / Dono da Loja
    if (
      (cleanEmail === "admin@branchclo.com.br" || cleanEmail === "admin") &&
      (pass === "branch2026" || pass === "admin123" || pass === "admin")
    ) {
      const ok = loginAdmin(email, pass);
      if (ok) {
        return { success: true, role: "ADMIN", message: "Acesso de Gestão Autorizado!" };
      }
    }

    // 2. Se não for dono, autentica como Cliente
    const ok = loginCustomer(email, pass);
    if (ok) {
      return { success: true, role: "CUSTOMER", message: "Login realizado com sucesso!" };
    }

    return { success: false, message: "Credenciais inválidas." };
  };

  const registerCustomer = (
    name: string,
    email: string,
    phone: string,
    cpf: string,
    _pass: string,
    address?: AddressData
  ): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const existing = customersList.find((c) => c.email.toLowerCase() === cleanEmail);

    if (existing) {
      const updatedExisting = {
        ...existing,
        address: address || existing.address,
      };
      setCustomer(updatedExisting);
      localStorage.setItem("branch_clo_customer", JSON.stringify(updatedExisting));
      return true;
    }

    const newCustomer: CustomerUser = {
      id: `cust-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      cpf: cpf.trim(),
      role: "CUSTOMER",
      address: address,
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

  const updateCustomerAddress = (address: AddressData) => {
    if (!customer) return;
    const updatedCustomer: CustomerUser = {
      ...customer,
      address,
    };
    setCustomer(updatedCustomer);
    localStorage.setItem("branch_clo_customer", JSON.stringify(updatedCustomer));

    setCustomersList((prev) => {
      const updated = prev.map((c) => (c.id === customer.id ? updatedCustomer : c));
      localStorage.setItem("branch_clo_customers_db", JSON.stringify(updated));
      return updated;
    });
  };

  const logoutCustomer = () => {
    setCustomer(null);
    localStorage.removeItem("branch_clo_customer");
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
        unifiedLogin,
        loginCustomer,
        registerCustomer,
        updateCustomerAddress,
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
