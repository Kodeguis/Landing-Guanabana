import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface InteractiveMapProps {
  lat: number;
  lng: number;
  mapsUrl: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ lat, lng, mapsUrl }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 16,
      scrollWheelZoom: false,
      zoomControl: false,
    });

    L.control
      .zoom({
        position: 'bottomright',
        zoomInTitle: 'Acercar mapa',
        zoomOutTitle: 'Alejar mapa',
      })
      .addTo(map);

    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const customIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="position: relative; transform: translate(-50%, -100%);">
          <div style="background: #FFFFFF; border: 3.5px solid #BC782E; border-radius: 9999px; width: 56px; height: 56px; box-shadow: 0 10px 25px rgba(0,0,0,0.35); overflow: hidden; display: flex; align-items: center; justify-content: center;">
            <img src="/guanabana-chef.jpg" style="width: 100%; height: 100%; object-fit: cover;" alt="Guanábana Horneada" />
          </div>
          <div style="width: 0; height: 0; border-left: 9px solid transparent; border-right: 9px solid transparent; border-top: 12px solid #BC782E; margin: 0 auto;"></div>
        </div>
      `,
      iconSize: [0, 0],
    });

    const popupHtml = `
      <div style="padding: 4px; font-family: system-ui, sans-serif; text-align: center; min-width: 170px;">
        <div style="font-size: 13px; font-weight: 800; color: #2C2621; margin-bottom: 2px;">Guanábana Horneada S.A.C.</div>
        <div style="font-size: 11px; color: #5C5248; margin-bottom: 8px;">Urb. Las Flores Mz. D Lote 3, Víctor Larco</div>
        <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: #BC782E; color: #FFFFFF; padding: 6px 14px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-decoration: none;">
          Cómo llegar (Google Maps) →
        </a>
      </div>
    `;

    L.marker([lat, lng], {
      icon: customIcon,
      alt: 'Guanábana Horneada, Urb. Las Flores Mz. D Lote 3',
      title: 'Guanábana Horneada',
    })
      .addTo(map)
      .bindPopup(popupHtml);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [lat, lng, mapsUrl]);

  return (
    <div
      ref={mapContainerRef}
      className="h-full min-h-[24rem] w-full"
      role="region"
      aria-label="Mapa de ubicación de Guanábana Horneada en Víctor Larco, Trujillo"
    />
  );
};
