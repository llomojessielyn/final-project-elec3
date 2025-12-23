const dogImage = document.getElementById('dog-image');
const dogVideo = document.getElementById('dog-video');
const loading = document.getElementById('loading');
const newDogBtn = document.getElementById('new-dog-btn');
const errorMessage = document.getElementById('error-message');
const themeToggle = document.getElementById('theme-toggle');
const downloadBtn = document.getElementById('download-btn');

let currentDogUrl = '';

// Theme management
const currentTheme = localStorage.getItem('theme') || 'light';
document.body.setAttribute('data-theme', currentTheme);
themeToggle.textContent = currentTheme === 'dark' ? 'Switch to Light' : 'Switch to Dark';

themeToggle.addEventListener('click', () => {
    const theme = document.body.getAttribute('data-theme');
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? 'Switch to Light' : 'Switch to Dark';
});

async function fetchRandomDog() {
    try {
        // Show loading, hide previous content
        loading.style.display = 'block';
        dogImage.style.display = 'none';
        dogVideo.style.display = 'none';
        errorMessage.style.display = 'none';
        newDogBtn.disabled = true;

        const response = await fetch('https://random.dog/woof.json');
        
        if (!response.ok) {
            throw new Error('Failed to fetch dog');
        }

        const data = await response.json();
        const fileUrl = data.url;
        currentDogUrl = fileUrl;
        
        // Determine if it's a video or image
        const extension = fileUrl.split('.').pop().toLowerCase();
        const videoExtensions = ['mp4', 'webm', 'mov'];
        
        if (videoExtensions.includes(extension)) {
            // Display video
            dogVideo.src = fileUrl;
            dogVideo.style.display = 'block';
            dogVideo.load();
            loading.style.display = 'none';
        } else {
            // Display image
            dogImage.src = fileUrl;
            dogImage.onload = () => {
                loading.style.display = 'none';
                dogImage.style.display = 'block';
            };
            dogImage.onerror = () => {
                throw new Error('Failed to load image');
            };
        }

        downloadBtn.style.display = 'block';
        newDogBtn.disabled = false;
    } catch (error) {
        console.error('Error fetching dog:', error);
        loading.style.display = 'none';
        errorMessage.textContent = 'Oops! Failed to fetch a dog. Try again?';
        errorMessage.style.display = 'block';
        newDogBtn.disabled = false;
    }
}

// Event listener for the button
newDogBtn.addEventListener('click', fetchRandomDog);

// Download button event listener
downloadBtn.addEventListener('click', async () => {
    if (!currentDogUrl) return;
    
    try {
        const response = await fetch(currentDogUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const filename = currentDogUrl.split('/').pop();
        a.download = filename || 'dog.jpg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Download failed:', error);
        errorMessage.textContent = 'Download failed. Try again?';
        errorMessage.style.display = 'block';
    }
});

// Load a dog on page load
fetchRandomDog();
