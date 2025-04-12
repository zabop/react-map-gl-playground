import * as React from "react";
import { Map, Marker, Source, Layer } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { basestyle } from "./basestyle";
import maplibregl from "maplibre-gl";
import { cogProtocol } from "@geomatico/maplibre-cog-protocol";

maplibregl.addProtocol("cog", cogProtocol);

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

const rasterSource = {
  type: "raster",
  url: "cog://https://labs.geomatico.es/maplibre-cog-protocol/data/image.tif",
  tileSize: 256,
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
        longitude: 1.830571,
        latitude: 41.59475,
        zoom: 14,
      }}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle={basestyle}
      onClick={handleMapClick}
      cursor="crosshair"
    >
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
      <Source
        id="rasterSource"
        type="raster"
        url="cog://https://labs.geomatico.es/maplibre-cog-protocol/data/image.tif"
        tileSize={256}
      >
        <Layer {...rasterSource} />
      </Source>
    </Map>
  );
}

export default App;
