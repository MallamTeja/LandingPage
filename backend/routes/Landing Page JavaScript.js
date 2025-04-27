
// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('To Clarity Landing Page initialized');
    
    // Initialize AOS (Animate on Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });
    
    // Initialize mobile menu functionality
    initializeMobileMenu();
    
    // Initialize smooth scrolling for anchor links
    initializeSmoothScrolling();
    
    // Initialize form handling
    initializeFormHandling();
});

/**
 * Initializes the mobile menu toggle functionality
 */
function initializeMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            // Toggle the 'hidden' class on the mobile menu
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close menu when clicking menu items
        const menuItems = mobileMenu.querySelectorAll('a');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }
}

/**
 * Initializes smooth scrolling for anchor links
 */
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Offset for fixed header
                const headerHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initializes form handling including validation and submission
 */
function initializeFormHandling() {
    const connectForm = document.getElementById('connect-form');
    const successNotification = document.getElementById('success-notification');
    const errorNotification = document.getElementById('error-notification');
    
    if (connectForm) {
        // Handle form submission
        connectForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            // Hide any existing notifications
            hideNotifications();
            
            // Validate form
            if (validateForm(connectForm)) {
                try {
                    // Get form data
                    const formData = new FormData(connectForm);
                    const formDataObject = Object.fromEntries(formData.entries());
                    
                    console.log('Submitting form data:', formDataObject);
                    
                    // Send data to the backend
                    const response = await submitFormData(formDataObject);
                    
                    console.log('Form submission response:', response);
                    
                    // Handle the response
                    if (response.success) {
                        // Show success notification
                        showNotification(successNotification);
                        
                        // Reset the form
                        connectForm.reset();
                        
                        // Scroll to notification
                        successNotification.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    } else {
                        // Show error notification
                        showNotification(errorNotification, response.message || 'Error submitting form');
                    }
                } catch (error) {
                    console.error('Error submitting form:', error);
                    showNotification(errorNotification, error.message || 'Error submitting form');
                }
            }
        });
    } else {
        console.error('Form element not found with ID "connect-form"');
    }
}

/**
 * Validates the form data
 * @param {HTMLFormElement} form - The form to validate
 * @returns {boolean} - Whether the form is valid
 */
function validateForm(form) {
    let isValid = true;
    
    // Get all required inputs
    const requiredInputs = form.querySelectorAll('[required]');
    
    // Check each required input
    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            highlightInvalidInput(input);
        } else {
            removeInvalidHighlight(input);
            
            // Additional validation for phone number
            if (input.id === 'phone') {
                const phoneRegex = /^[0-9]{10}$/;
                if (!phoneRegex.test(input.value.trim())) {
                    isValid = false;
                    highlightInvalidInput(input, 'Please enter a valid 10-digit phone number');
                }
            }
        }
    });
    
    // Validate email format if present and not empty
    const emailInput = form.querySelector('#email');
    if (emailInput && emailInput.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            isValid = false;
            highlightInvalidInput(emailInput, 'Please enter a valid email address');
        }
    }
    
    return isValid;
}

/**
 * Highlights an invalid input field
 * @param {HTMLElement} input - The input element to highlight
 * @param {string} message - Optional error message
 */
function highlightInvalidInput(input, message) {
    input.classList.add('border-red-500');
    input.classList.add('bg-red-50');
    
    // Add error message if it doesn't exist
    let errorElement = input.parentElement.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('p');
        errorElement.className = 'error-message text-red-500 text-sm mt-1';
        input.parentElement.appendChild(errorElement);
    }
    
    // Set error message
    errorElement.textContent = message || 'This field is required';
}

/**
 * Removes invalid highlight from an input field
 * @param {HTMLElement} input - The input element to remove highlight from
 */
function removeInvalidHighlight(input) {
    input.classList.remove('border-red-500');
    input.classList.remove('bg-red-50');
    
    // Remove