import * as React from "react";
import { Map, Marker, Source, Layer } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

const powerLineLayer = {
  type: "line",
  "source-layer": "power_line",
  paint: {
    "line-color": "#FF5733",
    "line-width": 2,
  },
};

const powerPoleLayer = {
  type: "circle",
  "source-layer": "power_tower",
  paint: {
    "circle-color": "#0000FF",
    "circle-radius": 5,
  },
};

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
          offset={[0, 128]}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            handleMarkerClick(index);
          }}
        >
          <img
            src="https://cdn.iconscout.com/icon/free/png-256/free-crosshairs-icon-download-in-svg-png-gif-file-formats--ui-elements-pack-user-interface-icons-444638.png"
            alt="marker"
          />
        </Marker>
      ))}

      <Source
        id="power_lines"
        type="vector"
        tiles={["https://openinframap.org/map/power/{z}/{x}/{y}.pbf"]}
        maxzoom={17}
        attribution="© OpenInfraMap contributors"
      >
        <Layer {...powerLineLayer} />
      </Source>
      <Source
        id="power_towers_and_poles"
        type="vector"
        tiles={["https://openinframap.org/map/power/{z}/{x}/{y}.pbf"]}
        maxzoom={17}
        attribution="© OpenInfraMap contributors"
      >
        <Layer {...powerPoleLayer} />
      </Source>
    </Map>
  );
}

export default App;
