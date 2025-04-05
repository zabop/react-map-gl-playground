import * as React from "react";
import { Map, Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

function App() {
  const mapRef = React.useRef();
  const [markers, setMarkers] = React.useState([]);

  const handleMapClick = (event) => {
    const { lng, lat } = event.lngLat;

    setMarkers((prev) => [...prev, { longitude: lng, latitude: lat }]);

    const map = mapRef.current?.getMap();
    if (map) {
      map.flyTo({ center: [lng, lat] });
    }
  };

  const handleMarkerClick = (indexToRemove) => {
    setMarkers((prev) => prev.filter((_, index) => index !== indexToRemove));
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
      onClick={handleMapClick}
    >
      {markers.map((marker, index) => (
        <Marker
          key={index}
          longitude={marker.longitude}
          latitude={marker.latitude}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation(); // prevent triggering the map click
            handleMarkerClick(index);
          }}
        />
      ))}
    </Map>
  );
}

export default App;
