"use client";

import { useState, useEffect } from "react";

const useAuth = () => {
  // Función para obtener el usuario desde localStorage de forma segura
  const getStoredUser = () => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("usuario");
      if (storedUser) {
        // Verificar si el string parece ser JSON (empieza con "{" o "[")
        if (storedUser.trim().startsWith("{") || storedUser.trim().startsWith("[")) {
          try {
            return JSON.parse(storedUser);
          } catch (error) {
            console.error("Error al parsear usuario desde localStorage:", error);
            localStorage.removeItem("usuario"); // Elimina el valor inválido
            return null;
          }
        } else {
          // Si no es un JSON válido, lo eliminamos
          localStorage.removeItem("usuario");
          return null;
        }
      }
    }
    return null;
  };

  const [usuario, setUsuario] = useState<any>(() => getStoredUser());

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      if (storedUser.trim().startsWith("{") || storedUser.trim().startsWith("[")) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUsuario(parsedUser);
        } catch (error) {
          console.error("Error al parsear usuario desde localStorage:", error);
          setUsuario(null);
          localStorage.removeItem("usuario");
        }
      } else {
        // Si no es JSON, limpiamos el valor
        setUsuario(null);
        localStorage.removeItem("usuario");
      }
    }
  }, []);

  const setUsuarioData = (userData: any) => {
    setUsuario(userData);
    localStorage.setItem("usuario", JSON.stringify(userData));
  };

  const clearUsuario = () => {
    setUsuario(null);
    localStorage.removeItem("usuario");
  };

  const esSuperAdmin = () => usuario?.rol === "superadmin";

  return { usuario, setUsuarioData, clearUsuario, esSuperAdmin };
};

export default useAuth;
