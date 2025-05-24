import React, { useContext, useState, useCallback, useEffect } from "react";
import axios from "axios";

// const BASE_URL = "https://expense-backend-1-ygpv.onrender.com";
const BASE_URL = import.meta.env.VITE_API_URL;

const GlobalContext = React.createContext();

// Add interceptor to inject token to all requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const GlobalProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);

  const getIncomes = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}get-incomes`);
      setIncomes(response.data?.incomes || response.data || []);
    } catch (err) {
      console.error("Error fetching incomes:", err);
      setError(err.response?.data?.message || "Failed to fetch incomes");
    }
  }, []);

  const getExpenses = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}get-expenses`);
      setExpenses(response.data?.expenses || response.data || []);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError(err.response?.data?.message || "Failed to fetch expenses");
    }
  }, []);

  const addIncome = async (income) => {
    try {
      await axios.post(`${BASE_URL}add-income`, income);
      await getIncomes();
    } catch (err) {
      console.error("Error adding income:", err);
      setError(err.response?.data?.message || "Failed to add income");
      throw err;
    }
  };

  const deleteIncome = async (id) => {
    try {
      await axios.delete(`${BASE_URL}delete-income/${id}`);
      await getIncomes();
    } catch (err) {
      console.error("Error deleting income:", err);
      setError(err.response?.data?.message || "Failed to delete income");
      throw err;
    }
  };

  const addExpense = async (expense) => {
    try {
      await axios.post(`${BASE_URL}add-expense`, expense);
      await getExpenses();
    } catch (err) {
      console.error("Error adding expense:", err);
      setError(err.response?.data?.message || "Failed to add expense");
      throw err;
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${BASE_URL}delete-expense/${id}`);
      await getExpenses();
    } catch (err) {
      console.error("Error deleting expense:", err);
      setError(err.response?.data?.message || "Failed to delete expense");
      throw err;
    }
  };

  const totalIncome = useCallback(() => {
    return incomes.reduce((acc, income) => {
      const amount = Number(income.amount) || 0;
      return acc + amount;
    }, 0);
  }, [incomes]);

  const totalExpenses = useCallback(() => {
    return expenses.reduce((acc, expense) => {
      const amount = Number(expense.amount) || 0;
      return acc + amount;
    }, 0);
  }, [expenses]);

  const totalBalance = useCallback(() => {
    return totalIncome() - totalExpenses();
  }, [totalIncome, totalExpenses]);

  const transactionHistory = useCallback(() => {
    const history = [
      ...incomes.map((income) => ({ ...income, type: "income" })),
      ...expenses.map((expense) => ({ ...expense, type: "expense" })),
    ].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB - dateA;
    });

    return history.slice(0, 3);
  }, [incomes, expenses]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        await Promise.all([getIncomes(), getExpenses()]);
      } catch (err) {
        console.error("Error during initial data load:", err);
        setError("Failed to load initial data. Please check your connection.");
      }
    };

    fetchData();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        incomes,
        expenses,
        error,
        setError,
        totalIncome,
        totalExpenses,
        totalBalance,
        addIncome,
        getIncomes,
        deleteIncome,
        addExpense,
        getExpenses,
        deleteExpense,
        transactionHistory,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
