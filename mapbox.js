'use strict'

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
};

mapboxgl.accessToken = 'pk.eyJ1IjoicGVodSIsImEiOiJja3R4Y3diNmIybTg5Mm9waWgwYTdsc3FyIn0.lVvnPZ3aa6332EaWJIxPaQ';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/standard-satellite',
    center: [135.49373383081854, 34.634214346195165],
    zoom: 14,
    maxBounds: [
        [135.46054244264906, 34.61539235057275], // 南西座標
        [135.5141077481369, 34.65361764632249] // 北東座標
    ],
    attributionControl: false
});
map.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');
map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

// https://docs.mapbox.com/mapbox-gl-js/ja/example/offset-vanishing-point-with-padding/
function toggleSidebar(id) {
    const elem = document.getElementById(id);
    const collapsed = elem.classList.toggle('collapsed');
    const padding = {};
    padding[id] = collapsed ? 0 : 550;
    map.easeTo({
        padding: { left: padding[id] },
        duration: 1000
    });
};

map.on('load', () => {
    map.addSource('collection', {
        type: 'geojson',
        data: './index.json'
    });

    map.addLayer({
        'id': 'collection',
        'type': 'symbol',
        'source': 'collection',
        'layout': {
            'text-field': [
                'format',
                '!!',
                {
                    'font-scale': 2
                }
            ]
        },
        'paint': {
            'text-color': '#B1302B',
            'text-halo-color': '#fff',
            'text-halo-width': 2
        }
    });

    map.on('mouseenter', 'collection', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'collection', () => {
        map.getCanvas().style.cursor = '';
    });

    map.on('click', 'collection', (e) => {
        map.flyTo({
            center: e.features[0].geometry.coordinates.slice(),
            bearing: 0,
            pitch: 0,
            zoom: getRandomInt(18, 21),
            essential: true
        })
    });
});

// https://docs.mapbox.com/help/ja/glossary/layout-paint-property/
// https://docs.mapbox.com/ja/style-spec/reference/layers/#symbol