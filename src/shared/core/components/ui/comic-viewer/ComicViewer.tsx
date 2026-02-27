import React, { useEffect, useRef,useState } from 'react';

import { FullScreenAlert, /*FullScreenButton*/ } from '@/shared/core/components';

import './ComicViewer.css';

/**
 * Componente que renderiza una vista de cómic.
 *
 * Este componente recibe una lista de imagenes y permite al usuario
 * navegar entre ellas. La primera página se muestra al principio y
 * se puede cambiar de página con las flechas izquierda y derecha.
 *
 * El componente también ofrece la posibilidad de acercar y alejar
 * el cómic con el mouse wheel.
 *
 * El estado del componente se guarda en el local storage para que
 * se pueda recuperar la posición y el zoom en la que se encontraba
 * la última vez que se visitó.
 *
 * @param {string[]} pages Lista de rutas de las imágenes del cómic.
 */
interface ComicViewerProps {
  pages: string[];
}

export const ComicViewer: React.FC<ComicViewerProps> = ({ pages }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const startDragPos = useRef({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    resetZoomAndPosition();
  }, [currentPage]);


  if (!pages || pages.length === 0) {
    return <div className="comic-viewer-empty">No hay páginas de cómic para mostrar.</div>;
  }

  const totalPages = pages.length;

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const progressPercentage = ((currentPage + 1) / totalPages) * 100;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 0.2, 1);
    if (newZoom <= 1) setPosition({ x: 0, y: 0 });
    setZoom(newZoom);
  };
  const resetZoomAndPosition = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // Arrastre touch
  const handleDragStart = (clientX: number, clientY: number) => {
    if (zoom > 1) {
      setIsDragging(true);
      startDragPos.current = {
        x: clientX - position.x,
        y: clientY - position.y,
      };
    }
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (isDragging) {
      const newX = clientX - startDragPos.current.x;
      const newY = clientY - startDragPos.current.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Arrastre con mouse
  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    handleDragMove(e.clientX, e.clientY);
  };

  // Arrastre touch - mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLImageElement>) => {
    if (e.touches.length === 1) {
      handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLImageElement>) => {
    if (isDragging) {
      e.preventDefault();
    }
    if (e.touches.length === 1) {
      handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };


  return (
    <div className="comic-viewer" id="comic-viewer">
      <div className="comic-top-bar">
        <div className="comic-pagination">
          <span className="comic-page-counter">
            Página {currentPage + 1} de {totalPages}
          </span>
        </div>
        <div className="comic-zoom-controls">
          <button onClick={handleZoomOut} disabled={zoom <= 1} title="Alejar">-</button>
          <span className="comic-zoom-level">{Math.round(zoom * 100)}%</span>
          <button onClick={handleZoomIn} disabled={zoom >= 3} title="Acercar">+</button>
          <button onClick={resetZoomAndPosition} disabled={zoom === 1 && position.x === 0 && position.y === 0}>
            Restaurar
          </button>
        </div>
      </div>
      <FullScreenAlert />
      <div className="comic-page-display" ref={imageContainerRef}>
        <img
          src={pages[currentPage]}
          alt={`Página del cómic ${currentPage + 1}`}
          key={pages[currentPage]}
          className={`zoomable-image ${isDragging ? 'is-dragging' : ''} ${zoom > 1 ? 'is-zoomed' : ''}`}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
          }}
          // Mobile
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          // desktop
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleDragEnd}
          onTouchCancel={handleDragEnd}
        />
      </div>
      <div className="comic-navigation-controls">
        <button onClick={goToPreviousPage} disabled={currentPage === 0}>
          ← Anterior
        </button>
        {/* <FullScreenButton elementId="comic-viewer" /> */}
        <button onClick={goToNextPage} disabled={currentPage === totalPages - 1}>
          Siguiente →
        </button>
      </div>
      <div className="comic-progress-bar-container">
        <div className="comic-progress-bar" style={{ width: `${progressPercentage}%` }}></div>
      </div>
    </div>
  );
};
