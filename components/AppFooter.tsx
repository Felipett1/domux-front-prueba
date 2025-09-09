"use client"; // Forzar la ejecución solo en el cliente

import React, { useContext, useEffect, useState } from "react";
import { LayoutContext } from "../context/layoutcontext";
import Link from "next/link";

const AppFooter = () => {
  const { layoutConfig } = useContext(LayoutContext);
  const [windowWidth, setWindowWidth] = useState<number | null>(null);
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(new Date().getFullYear().toString());

    // Detectar tamaño de ventana solo en el cliente
    const handleResize = () => setWindowWidth(window.innerWidth);
    setWindowWidth(window.innerWidth); // Inicializar

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <footer
      className={`fixed bottom-0 left-0 w-full py-1 px-6 text-center shadow-md ${
        layoutConfig.colorScheme === "light"
          ? "bg-gray-100 text-black"
          : "bg-gray-900 text-white"
      }`}
    >
      <div className="flex flex-col items-center gap-1 layout-footer">
        {/* Logo de Fénix */}
        {windowWidth !== null && (
          <img
            src={`/images/logo-${
              layoutConfig.colorScheme === "light" ? "dark" : "white"
            }.svg`}
            alt="Fénix Logo"
            height={windowWidth > 768 ? "20" : "15"} // Se asegura que se calcule solo en el cliente
            className="mr-2"
          />
        )}

        {/* Nombre de la plataforma */}
        <p className="text-sm font-semibold">Fénix - </p>

        {/* Enlace a Coboy */}
        {windowWidth !== null && windowWidth > 768 && (
          <p className="text-sm">
            Desarrollado por{" "}
            <Link
              href="https://coboy.com.co"
              target="_blank"
              className="text-blue-400 hover:underline"
            >
              Coboy S.A.S.
            </Link>
          </p>
        )}

        {/* Derechos de autor */}
        <p className="text-sm opacity-75">
          {year && `© ${year} Todos los derechos reservados.`}
        </p>
      </div>
    </footer>
  );
};

export default AppFooter;
