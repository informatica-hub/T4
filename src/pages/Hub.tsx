import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Hub.css';
import {  Shield, Star, Award, Medal,Network, Share2 } from "lucide-react";
import { NucleotideBackground } from "@/components/ui/NucleotideBackground";

interface HubCard {
  path: string;
  title: string;
  description: string;
  badge?: string;
  onClick?: () => void;
  pdfUrl?: string;
  download?: boolean;
}



const handleDownload = (pdfPath: string, fileName?: string) => {
  // Usar la ruta correcta del PDF
  const link = document.createElement('a');
  link.href = pdfPath; // Usar la ruta pasada como parámetro
  link.download = fileName || 'documento.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const cards: HubCard[] = [
  {
    path: '/calculadora',
    title: 'Calculadora',
    description: 'Resuspensión, dilución y estimador de reacciones.',
  },
  {
    path: '/certificados',
    title: 'Certificados',
    description: 'Consulta y descarga certificados de análisis.',
  },
  {
    path: '/Documentos',
    title: 'Instrucciones de Almacenamiento y Manipulación',
    description: 'Descarga Instrucciones de Almacenamiento y Manipulación.',
    pdfUrl: '/guiaalmacenamiento.pdf', // Ruta corregida (sin /public)
    download: true,
    onClick: () => handleDownload('/guiaalmacenamiento.pdf', 'Instrucciones_Almacenamiento_Manipulacion.pdf')
  },
];

const Hub: React.FC = () => {
  const navigate = useNavigate();

  const handleCardClick = (card: HubCard) => {
    if (card.onClick) {
      // Si tiene onClick, ejecutarlo (descarga PDF)
      card.onClick();
    } else {
      // Si no, navegar a la ruta
      navigate(card.path);
    }
  };

  return (
  <main className="hub-app relative min-h-screen">
    {/* Fondo en toda la página */}
    <div className="fixed inset-0 -z-10">
      <NucleotideBackground />
    </div>
    
    {/* Contenido encima del fondo */}
    <div className="relative z-10">
      {/* SECCIÓN DE GRACIAS */}
      <section className="quality-section">
        <div className="quality-container">
          <div className="quality-content">
            <div className="quality-icon">
              <Share2 className="h-16 w-16 text-primary" />
            </div>
            <h1 className="quality-title">
              ¡Gracias por tu compra!
            </h1>
            <p className="quality-description">
              Bienvenido al Hub de herramientas de <strong className="text-primary">T4</strong> Aquí podrás acceder a la documentación de tus productos, así como a una útil herramienta de cálculo que te puede ayudar en diferentes tareas dentro de tu laboratorio.
            </p>
          </div>
        </div>
      </section>
      
      {/* SECCIÓN DE TARJETAS */}
      <section className="hub-grid" aria-label="Tarjetas de herramientas">
        {cards.map((card) => (
          <div 
            key={card.path} 
            className="hub-card" 
            onClick={() => handleCardClick(card)}
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            aria-label={`Ir a ${card.title}`}
          >
            <div className="hub-card-content">
              <div className="hub-card-title-row">
                <h2>{card.title}</h2>
                {card.badge && <span className="hub-badge">{card.badge}</span>}
              </div>
              <p>{card.description}</p>
              {card.download && (
                <span className="download-indicator">Descargar PDF</span>
              )}
            </div>
            <span className="hub-card-arrow" aria-hidden="true">
              {card.download ? '' : '→'}
            </span>
          </div>
        ))}
      </section>
    </div>
  </main>
);
};

export default Hub;