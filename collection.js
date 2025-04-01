'use strict'

new Promise((resolve) => {
    collectionJSON("./index.json");
    resolve();
}).then(() => {
    collectionView();
});

async function collectionJSON(requestURL) {
    const request = new Request(requestURL);
    const response = await fetch(request);
    const jsonIndex = await response.text();
    const index = JSON.parse(jsonIndex);
    listAll(index);
};

function collectionView() {
    let activeChapterName = 'no-0';
    function setActiveChapter(id) {
        if (id === activeChapterName) return;
        const element = document.getElementById(id);
        map.flyTo({
            center: [element.dataset.lat, element.dataset.lng],
            bearing: getRandomInt(-360, 360),
            pitch: getRandomInt(55, 85),
            zoom: getRandomInt(18, 21),
            essential: true
        });

        element.classList.add('active');
        document.getElementById(activeChapterName).classList.remove('active');
        activeChapterName = id;
    };

    function isElementOnScreen(id) {
        const element = document.getElementById(id);
        const bounds = element.getBoundingClientRect();
        return bounds.top < window.innerHeight && bounds.bottom > 50;
    };

    document.querySelector("#listing").onscroll = () => {
        for (const eachID of document.querySelectorAll("#listing ul li")) {
            if (isElementOnScreen(eachID.id)) {
                setActiveChapter(eachID.id);
                break;
            };
        };
    };
};

// JSONファイルからマーカーを生成
function listAll(obj) {
    const list = document.querySelector('#listing ul'),
        directory = "./img/";

    for (let i = 0; i < obj.features.length; i++) {
        const item = document.createElement('li');
        if (i == 0) {
            item.className = "active";
        };
        item.id = "no-" + i;
        item.dataset.lat = obj.features[i].geometry.coordinates[0];
        item.dataset.lng = obj.features[i].geometry.coordinates[1];
        list.appendChild(item);
        const p = document.createElement('p');
        p.innerHTML = `
        <time>${obj.features[i].properties.description}</time><br/>
        <b>${obj.features[i].properties.title}</b>
        `;
        item.appendChild(p);
        for (const imgEach of obj.features[i].properties.img) {
            const img = document.createElement('img');
            img.src = directory + imgEach;
            p.appendChild(img);
        };
    };
};