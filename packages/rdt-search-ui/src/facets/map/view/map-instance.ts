import OLMap from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/WebGLTile";
import Style from "ol/style/Style";
import CircleStyle from "ol/style/Circle";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import Text from "ol/style/Text";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import { transformExtent } from "ol/proj";

// export function getAnnotationCoordinate(annotation: Annotation) {
//     const [lat, lon] = annotation.value.coordinates
//     return fromLonLat([lon, lat])
// }

const style = new Style({
  image: new CircleStyle({
    radius: 0,
    stroke: new Stroke({
      color: "black",
      width: 0.5,
    }),
    fill: new Fill({
      // color: '#FF0000'
      // color: '#0b6aff'
      color: "#3382ff",
    }),
  }),
  text: new Text({
    fill: new Fill({
      color: "#fff",
    }),
    stroke: new Stroke({
      color: "white",
      width: 1,
    }),
  }),
});

export const markerStyle = (feature: Feature) => {
  let radius: number = feature.get("count") + 6;
  if (radius > 12) radius = 12;

  (style.getImage() as CircleStyle).setRadius(radius);
  style
    .getText()
    .setText(
      feature.get("count") > 1 ? feature.get("count").toString() : undefined,
    );

  return style;
};

// export const markerStyle = (feature: Feature) => {
// 	let radius = feature.get('count') + 6
// 	if (radius > 12) radius = 12

// 	return new Style({
// 		image: new CircleStyle({
// 			// radius: 8,
// 			radius,
// 			stroke: new Stroke({
// 				color: 'black',
// 				width: .5,
// 			}),
// 			fill: new Fill({
// 				// color: '#FF0000'
// 				// color: '#0b6aff'
// 				color: '#3382ff'
// 			}),
// 		}),
// 		text: new Text({
// 			text: feature.get('count') > 1 ? feature.get('count').toString() : undefined,
// 			fill: new Fill({
// 				color: '#fff',
// 			}),
// 			stroke: new Stroke({
// 				color: 'white',
// 				width: 1,
// 			}),
// 		}),
// 	})
// }

export function getMapInstance(target?: HTMLElement) {
  return new OLMap({
    controls: [],
    target,
    layers: [
      // new VectorTileLayer({
      // 	source: new VectorTile({
      // 		format: new MVT(),
      // 		url: `https://basemaps-api.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/tile/{z}/{y}/{x}.pbf` //?token=<ACCESS_TOKEN>
      // 	})
      // }),
      new TileLayer({
        // source: new Stamen({
        // 	layer: 'watercolor',
        // })
        // source: new XYZ({
        // 	url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        // })

        source: new OSM(),

        // source: new XYZ({
        // 	attributions:
        // 		'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
        // 		'rest/services/World_Topo_Map/VectorTileServer">ArcGIS</a>',
        // 	url:
        // 		'https://server.arcgisonline.com/ArcGIS/rest/services/' +
        // 		'World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        // }),
      }),
    ],
    // overlays: [popupOverlay],
    view: new View({
      center: [0, 0],
      zoom: 0,
      extent: transformExtent(
        [-180, -90, 180, 90],
        "EPSG:4326",
        "EPSG:3857",
      ) as [number, number, number, number],
    }),
  });
}
