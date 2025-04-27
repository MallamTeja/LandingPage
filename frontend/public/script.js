document.addEventListener('DOMContentLoaded', () => {
    const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3000';

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

    const signupForm = document.getElementById('signupForm');
    const submitBtn = document.getElementById('submitBtn');

    if (signupForm && submitBtn) {
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Disable the button to prevent multiple submissions
            submitBtn.disabled = true;

            // Collect form data
            const formData = {
                firstName: document.getElementById('firstName').value.trim(),
                lastName: document.getElementById('lastName').value.trim(),
                email: document.getElementById('email').value.trim(),
                password: document.getElementById('password').value,
            };

            try {
                // Send form data to backend (adjust URL and method as needed)
                const response = await fetch(`${BACKEND_BASE_URL}/api/signup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    // Change button text to show success message
                    submitBtn.textContent = 'Submitted Successfully';
                } else {
                    // Handle error response
                    submitBtn.disabled = false;
                    alert('Submission failed. Please try again.');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                submitBtn.disabled = false;
                alert('An error occurred. Please try again.');
            }
        });
    }

    // Landing page form submission handler
    const clarityForm = document.getElementById('clarityForm');
    const landingSubmitBtn = document.getElementById('landingSubmitBtn');

    if (clarityForm && landingSubmitBtn) {
        // Create an element to show error messages below the submit button
        let errorMessageElem = document.createElement('p');
        errorMessageElem.style.color = 'red';
        errorMessageElem.style.marginTop = '8px';
        errorMessageElem.style.fontWeight = 'bold';
        landingSubmitBtn.parentNode.insertBefore(errorMessageElem, landingSubmitBtn.nextSibling);

        clarityForm.addEventListener('submit', async (event) => {
            console.log("Landing form submitted");
            event.preventDefault();

            // Clear previous error message
            errorMessageElem.textContent = '';

            // Disable the button to prevent multiple submissions
            landingSubmitBtn.disabled = true;

            const name = document.getElementById('name').value.trim();
            const collegeLevel = document.getElementById('collegeLevel').value;
            const phone = document.getElementById('phone').value.trim();

            if (!name) {
                errorMessageElem.textContent = 'Please enter your name.';
                landingSubmitBtn.disabled = false;
                return;
            }
            if (!collegeLevel) {
                errorMessageElem.textContent = 'Please select your college level.';
                landingSubmitBtn.disabled = false;
                return;
            }
            if (!phone) {
                errorMessageElem.textContent = 'Please enter your phone number.';
                landingSubmitBtn.disabled = false;
                return;
            }

            try {
                const response = await fetch('/api/records', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, phone, category: collegeLevel })
                });

                if (response.ok) {
                    landingSubmitBtn.textContent = 'Submitted Successfully';
                    clarityForm.reset();
                    setTimeout(() => {
                        landingSubmitBtn.textContent = 'Submit';
                        landingSubmitBtn.disabled = false;
                    }, 3000);
                } else {
                    const errorData = await response.json();
                    errorMessageElem.textContent = 'Error submitting form: ' + errorData.message;
                    landingSubmitBtn.disabled = false;
                }
            } catch (error) {
                errorMessageElem.textContent = 'Error submitting form: ' + error.message;
                landingSubmitBtn.disabled = false;
            }
        });
    }

    // Initialize the application
    function init() {
        // console.log('Initializing application components...');
        // Add your initialization code here
    }

    init();
});
