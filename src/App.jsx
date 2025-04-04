import * as React from "react";
import { Map } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

function App() {
  const mapRef = React.useRef();

  const handleClick = (event) => {
    const { lng, lat } = event.lngLat;
    const map = mapRef.current?.getMap();
    if (map) {
      map.flyTo({ center: [lng, lat] });
    }
  };

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14,
      }}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle="https://api.maptiler.com/maps/hybrid/style.json?key=iG31hHzqPDdOfM8MmYsP"
      onClick={handleClick}
    />
  );
}

export default App;
