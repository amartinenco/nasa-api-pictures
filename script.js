const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

// NASA API
const COUNT = 10;
const API_KEY = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&count=${COUNT}`;

let resultsArray = [];
let favorites = {};

function createDOMNodes(page) {
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites);
    console.log('currentArray', page, currentArray);
    currentArray.forEach((result) => {
        // Card Container
        const card = document.createElement('div');
        card.classList.add('card');
        // Link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';
        // Image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA Picture of the Day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        // Card Body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        // Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        // Save Text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        saveText.textContent = 'Add to Favorites';
        saveText.setAttribute('onclick', `saveFavorite('${result.url}')`);
        // Card Text
        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;
        // Footer Container
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        // Date
        const date = document.createElement('strong');
        date.textContent = result.date;
        // Copyright
        const copyrightResult = result.copyright === undefined ? '' : result.copyright;
        const copyright = document.createElement('span');
        copyright.textContent = ` ${copyrightResult}`;
        // Append
        footer.append(date, copyright);
        cardBody.append(cardTitle, saveText, cardText, footer);
        link.appendChild(image);
        card.append(link, cardBody);
        imagesContainer.appendChild(card);
    });
}

function updateDOM(page) {
    // Get Favorites from localStorage
    if (localStorage.getItem('nasaFavorites')) {
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
        console.log('favorites from localSotrage', favorites);
    }
    createDOMNodes(page);
}

// Get 10 Images from NASA API
async function getNasaPictures() {
    try {
        // const response = await fetch(apiUrl);
        // resultsArray = await response.json();
        resultsArray.push({
            copyright: "Bray Falls",
            date: "2021-05-14",
            explanation: "A gorgeous spiral galaxy, M104 is famous for its nearly edge-on profile featuring a broad ring of obscuring dust lanes. Seen in silhouette against an extensive central bulge of stars, the swath of cosmic dust lends a broad brimmed hat-like appearance to the galaxy suggesting a more popular moniker, the Sombrero Galaxy. This sharp optical view of the well-known galaxy made from ground-based image data was processed to preserve details often lost in overwhelming glare of M104's bright central bulge. Also known as NGC 4594, the Sombrero galaxy can be seen across the spectrum, and is host to a central supermassive black hole. About 50,000 light-years across and 28 million light-years away, M104 is one of the largest galaxies at the southern edge of the Virgo Galaxy Cluster. Still the colorful spiky foreground stars in this field of view lie well within our own Milky Way galaxy.",
            hdurl: "https://apod.nasa.gov/apod/image/2105/m104apodsub.jpg",
            media_type: "image",
            service_version: "v1",
            title: "M104: The Sombrero Galaxy",
            url: "https://apod.nasa.gov/apod/image/2105/m104apodsub800c.jpg"
            });
        updateDOM('favorites');
    } catch (error) {
        // Catch error
        console.log(error);
    }
}

// Add result to Favorites
function saveFavorite(itemUrl) {
    // Loop through results array to select favorite
    resultsArray.forEach((item) => {
        if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
            favorites[itemUrl] = item;
            saveConfirmed.hidden = false;
            setTimeout(() =>  {
                saveConfirmed.hidden = true;
            }, 2000);
            // Set Favorites in localStorage
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        }
    });
}

// On load
getNasaPictures();