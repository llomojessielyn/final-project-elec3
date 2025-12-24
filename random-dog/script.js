const dogContainer = document.getElementById('dog-container');
const favoritesContainer = document.getElementById('favorites-container');
const loading = document.getElementById('loading');
const newDogBtn = document.getElementById('new-dog-btn');
const loadMoreBtn = document.getElementById('load-more-btn');
const errorMessage = document.getElementById('error-message');
const themeToggle = document.getElementById('theme-toggle');
const filterSelect = document.getElementById('filter-select');
const downloadFavoritesBtn = document.getElementById('download-favorites-btn');
const sortFavoritesSelect = document.getElementById('sort-favorites');

let dogs = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentTheme = localStorage.getItem('theme') || 'light';
document.body.setAttribute('data-theme', currentTheme);

// ---------------- Theme Toggle ----------------
themeToggle.textContent = `Switch Theme (${currentTheme})`;
themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : currentTheme === 'dark' ? 'purple' : 'light';
    document.body.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    themeToggle.textContent = `Switch Theme (${currentTheme})`;
});

// ---------------- Fetch Dogs ----------------
async function fetchDogs(count = 3) {
    loading.style.display = 'block';
    errorMessage.style.display = 'none';
    try {
        for (let i = 0; i < count; i++) {
            const res = await fetch('https://random.dog/woof.json');
            if (!res.ok) throw new Error('Failed fetch');
            const data = await res.json();
            dogs.push(data.url);
            displayDog(data.url);
        }
    } catch (err) {
        console.error(err);
        errorMessage.textContent = 'Failed to fetch dogs.';
        errorMessage.style.display = 'block';
    } finally {
        loading.style.display = 'none';
    }
}

// ---------------- Display Dog ----------------
function displayDog(url) {
    const extension = url.split('.').pop().toLowerCase();
    const videoExtensions = ['mp4', 'webm', 'mov'];
    const card = document.createElement('div');
    card.classList.add('dog-card');

    let media;
    if (videoExtensions.includes(extension)) {
        media = document.createElement('video');
        media.src = url;
        media.controls = true;
    } else {
        media = document.createElement('img');
        media.src = url;
    }
    media.onload = media.onloadeddata = () => card.classList.add('loaded');
    card.appendChild(media);

    const favBtn = document.createElement('button');
    favBtn.className = 'favorite-btn';
    updateFavoriteBtn(favBtn, url);
    favBtn.addEventListener('click', () => toggleFavorite(url, favBtn));
    card.appendChild(favBtn);

    dogContainer.appendChild(card);
}

// ---------------- Favorite Functions ----------------
function updateFavoriteBtn(btn, url) {
    btn.innerHTML = favorites.includes(url) ? '★' : '☆';
}

function toggleFavorite(url, btn) {
    if (favorites.includes(url)) favorites = favorites.filter(u => u !== url);
    else favorites.push(url);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteBtn(btn, url);
    renderFavorites();
}

function renderFavorites() {
    favoritesContainer.innerHTML = '';
    if (favorites.length === 0) {
        const noFav = document.createElement('p');
        noFav.className = 'hint';
        noFav.id = 'no-favorites';
        noFav.textContent = 'No favorites yet!';
        favoritesContainer.appendChild(noFav);
        return;
    }
    favorites.forEach(url => {
        const extension = url.split('.').pop().toLowerCase();
        const videoExtensions = ['mp4', 'webm', 'mov'];
        const card = document.createElement('div');
        card.classList.add('dog-card');
        let media;
        if (videoExtensions.includes(extension)) {
            media = document.createElement('video');
            media.src = url;
            media.controls = true;
        } else {
            media = document.createElement('img');
            media.src = url;
        }
        media.onload = media.onloadeddata = () => card.classList.add('loaded');
        card.appendChild(media);
        favoritesContainer.appendChild(card);
    });
}

// ---------------- Filter (Main + Favorites) ----------------
filterSelect.addEventListener('change', () => {
    const type = filterSelect.value;

    [dogContainer, favoritesContainer].forEach(container => {
        Array.from(container.children).forEach(card => {
            const media = card.querySelector('img, video');
            if (!media) return;
            if (type === 'all') card.style.display = '';
            else if (type === 'image') card.style.display = media.tagName === 'IMG' ? '' : 'none';
            else if (type === 'video') card.style.display = media.tagName === 'VIDEO' ? '' : 'none';
        });
    });
});

// ---------------- Download Favorites (Filtered) ----------------
downloadFavoritesBtn.addEventListener('click', async () => {
    if (favorites.length === 0) return alert("No favorites to download!");

    const type = sortFavoritesSelect.value; // current sort filter: all / image / video

    for (const url of favorites) {
        const extension = url.split('.').pop().toLowerCase();
        const isVideo = ['mp4', 'webm', 'mov'].includes(extension);
        const isImage = !isVideo;

        // Skip if it doesn't match current filter
        if ((type === 'image' && !isImage) || (type === 'video' && !isVideo)) continue;

        try {
            const res = await fetch(url);
            const blob = await res.blob();
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = url.split('/').pop() || 'dog.jpg';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
        } catch (err) {
            console.error("Download failed:", err);
        }
    }
});

// ---------------- Sort Favorites ----------------
sortFavoritesSelect.addEventListener('change', () => {
    const type = sortFavoritesSelect.value;
    Array.from(favoritesContainer.children).forEach(card => {
        const media = card.querySelector('img, video');
        if (!media) return;
        if (type === 'all') card.style.display = '';
        else if (type === 'image') card.style.display = media.tagName === 'IMG' ? '' : 'none';
        else if (type === 'video') card.style.display = media.tagName === 'VIDEO' ? '' : 'none';
    });
});

// ---------------- Buttons ----------------
newDogBtn.addEventListener('click', () => { dogContainer.innerHTML = ''; dogs = []; fetchDogs(); });
loadMoreBtn.addEventListener('click', () => fetchDogs());

// ---------------- Initialize ----------------
renderFavorites();
fetchDogs();
