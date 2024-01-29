import { types as sdkTypes } from '../util/sdkLoader';

const { LatLng, LatLngBounds } = sdkTypes;

// An array of locations to show in the LocationAutocompleteInput when
// the input is in focus but the user hasn't typed in any search yet.
//
// Each item in the array should be an object with a unique `id` (String) and a
// `predictionPlace` (util.types.place) properties.
//
// NOTE: these are highly recommended, since they
//       1) help customers to find relevant locations, and
//       2) reduce the cost of using map providers geocoding API
const defaultLocations = [
  // {
  //   id: 'default-helsinki',
  //   predictionPlace: {
  //     address: 'Helsinki, Finland',
  //     bounds: new LatLngBounds(new LatLng(60.29783, 25.25448), new LatLng(59.92248, 24.78287)),
  //   },
  // },
  // {
  //   id: 'default-turku',
  //   predictionPlace: {
  //     address: 'Turku, Finland',
  //     bounds: new LatLngBounds(new LatLng(60.53045, 22.38197), new LatLng(60.33361, 22.06644)),
  //   },
  // },
  // {
  //   id: 'default-tampere',
  //   predictionPlace: {
  //     address: 'Tampere, Finland',
  //     bounds: new LatLngBounds(new LatLng(61.83657, 24.11838), new LatLng(61.42728, 23.5422)),
  //   },
  // },
  // {
  //   id: 'default-oulu',
  //   predictionPlace: {
  //     address: 'Oulu, Finland',
  //     bounds: new LatLngBounds(new LatLng(65.56434, 26.77069), new LatLng(64.8443, 24.11494)),
  //   },
  // },
  // {
  //   id: 'default-ruka',
  //   predictionPlace: {
  //     address: 'Ruka, Finland',
  //     bounds: new LatLngBounds(new LatLng(66.16997, 29.16773), new LatLng(66.16095, 29.13572)),
  //   },
  // },

  {
    id: "default-barcelona",
    predictionPlace: {
      address: "Barcelona, Spain",
      bounds: new LatLngBounds(new LatLng(42.323302, 2.8125), new LatLng(41.1206863, 1.360412))
    }
  },
  {
    id: "default-madrid",
    predictionPlace: {
      address: "Madrid, Spain",
      bounds: new LatLngBounds(new LatLng(41.165845, -3.052983), new LatLng(39.884719, -4.579076))
    }
  },
  {
    id: "default-sevilla",
    predictionPlace: {
      address: "Seville, Spain",
      bounds: new LatLngBounds(new LatLng(38.197417, -4.653345), new LatLng(36.842192, -6.538515))
    }
  },
  {
    id: "default-valencia",
    predictionPlace: {
      address: "Valencia, Spain",
      bounds: new LatLngBounds(new LatLng(40.211683, 0.0703898), new LatLng(38.686554, -1.528916))
    }
  },
  {
    id: "default-tarragona",
    predictionPlace: {
      address: "Tarragona, Spain",
      bounds: new LatLngBounds(new LatLng(41.582606, 1.6699219), new LatLng(40.4652872, 0.159181))
    }
  },
  {
    id: "default-girona",
    predictionPlace: {
      address: "Girona, Spain",
      bounds: new LatLngBounds(new LatLng(42.495217, 3.4298448), new LatLng(41.5798352, 1.724267))
    }
  },
  {
    id: "default-toledo",
    predictionPlace: {
      address: "Toledo, Spain",
      bounds: new LatLngBounds(new LatLng(40.318342, -2.908234), new LatLng(39.258417, -5.406184))
    }
  }
];
export default defaultLocations;
