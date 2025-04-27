// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // console.log('Application initialized');
    
    // Example function to fetch data from backend
    // Set the backend base URL here. Update this to your deployed backend URL.
    const BACKEND_BASE_URL = 'http://localhost:3000';

    async function fetchDataFromBackend() {
        try {
            const response = await fetch(`${BACKEND_BASE_URL}/api/data`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }

    // Example event listener
    const mainSection = document.querySelector('main');
    if (mainSection) {
        mainSection.addEventListener('click', (event) => {
            // console.log('Main section clicked:', event.target);
        });
    }

    // Initialize the application
    function init() {
        // console.log('Initializing application components...');
        // Add your initialization code here
    }

    init();
});
