import * as React from "react";
import { Map, Marker, Source, Layer } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { basestyle } from "./basestyle";

const powerLineLayer = {
  type: "line",
  "source-layer": "power_line",
  paint: {
    "line-color": "#FF5733",
    "line-width": 10,
  },
};

const powerPoleLayer = {
  type: "circle",
  "source-layer": "power_tower",
  paint: {
    "circle-color": "#0000FF",
    "circle-radius": 20,
  },
};

const lorain_oh_2024_source = {
  type: "raster",
  tiles: [
    `https://tiles.arcgis.com/tiles/vGBb7WYV10mOJRNM/arcgis/rest/services/2024_Spring_Aerials/MapServer/tile/{z}/{y}/{x}`,
  ],
  maxzoom: 21,
};

const lorain_oh_2024_layer = {
  id: "lorain-orthoimagery",
  type: "raster",
  source: "lorain",
  paint: {},
};

function App() {
  const mapRef = React.useRef();
  const [markers, setMarkers] = React.useState([]);

  const handleMapClick = (event) => {
    const { lng, lat } = event.lngLat;
    const newMarkers = [...markers, { longitude: lng, latitude: lat }];
    console.log("Markers:", newMarkers);
    setMarkers(newMarkers);

    const map = mapRef.current?.getMap();
    if (map) {
      map.flyTo({ center: [lng, lat] });
    }
  };

  const handleMarkerClick = (indexToRemove) => {
    setMarkers((prev) => prev.filter((_, index) => index !== indexToRemove));
    console.log("Markers:", markers);
  };

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        longitude: -82.17844,
        latitude: 41.310079,
        zoom: 14,
      }}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle={basestyle}
      onClick={handleMapClick}
      cursor="crosshair"
    >
      <Source id="lorain" {...lorain_oh_2024_source}>
        <Layer {...lorain_oh_2024_layer} />
      </Source>
      {markers.map((marker, index) => (
        <Marker
          key={index}
          longitude={marker.longitude}
          latitude={marker.latitude}
          // offset={[0, 128]}
          offset={[0, 256]}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            handleMarkerClick(index);
          }}
        >
          <img
            //src="https://cdn.iconscout.com/icon/free/png-256/free-crosshairs-icon-download-in-svg-png-gif-file-formats--ui-elements-pack-user-interface-icons-444638.png"
            src="https://cdn-icons-png.flaticon.com/512/4330/4330677.png"
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
