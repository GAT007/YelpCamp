mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: campgroundGeometry.split(','), // starting position [lng, lat]
    zoom: 9 // starting zoom
});

let marker = new mapboxgl.Marker()
    .setLngLat(campgroundGeometry.split(','))
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h3>${campgroundTitle}</h3>`
        )
    )
    .addTo(map);