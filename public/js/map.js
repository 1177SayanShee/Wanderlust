
// console.log(mapToken);
// console.log(process.env.MAP_TOKEN);
// console.log(process.env.CLOUD_NAME);

// console.log(JSON.parse(listing));



let parsedCoordinates = listing.geometry.coordinates;

if (!parsedCoordinates) {
    parsedCoordinates = [88.22967, 22.813335];
}

// console.log(parsedCoordinates);

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: parsedCoordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

// Popup instance
const popup = new mapboxgl.Popup({ offset: 25 })
    .setHTML(`<h4>${listing.title}</h4><p>Exact location will be provided after booking</p>`)
    .setMaxWidth("350px")


// Create a default Marker, colored black, rotated 45 degrees.
const marker2 = new mapboxgl.Marker({ color: 'red' })
    .setLngLat(parsedCoordinates)
    .setPopup(popup)
    .addTo(map)

// .setMaxWidth("300px")