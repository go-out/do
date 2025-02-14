'use strict'

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
};

mapboxgl.accessToken = 'pk.eyJ1IjoicGVodSIsImEiOiJja3R4Y3diNmIybTg5Mm9waWgwYTdsc3FyIn0.lVvnPZ3aa6332EaWJIxPaQ';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-streets-v11',
    center: [135.49373383081854, 34.634214346195165],
    zoom: 14,
    maxBounds: [
        [135.46054244264906, 34.61539235057275], // 南西座標
        [135.5141077481369, 34.65361764632249] // 北東座標
    ]
});
/*
map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        // デバイスの位置の変更に応じて位置情報を更新
        trackUserLocation: true,
        // デバイスが向いている方向を矢印で描画
        showUserHeading: true
    })
)
*/
map.addControl(new mapboxgl.NavigationControl())
map.addControl(new mapboxgl.FullscreenControl())

map.on('load', () => {
    for (const marker of jsonAll.features) {
        // create a HTML element for each feature
        const el = document.createElement('div');
        el.className = 'do';

        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);
        el.addEventListener('click', (e) => {
            map.flyTo({
                center: marker.geometry.coordinates,
                zoom: 17.5
            })
        })

        const list = document.querySelector('#listing ul');
        const item = document.createElement('li');
        item.innerHTML = `
        <img src="${marker.properties.url}" alt="${marker.properties.title}" width="100%">
        <time>${marker.properties.description}</time><br/>
        <b>${marker.properties.title}</b>
        `;
        list.appendChild(item);
        item.addEventListener('click', () => {
            map.flyTo({
                center: marker.geometry.coordinates,
                bearing: 0,
                pitch: getRandomInt(0, 85),
                zoom: 20,
                essential: true
            })
        })
    };
});