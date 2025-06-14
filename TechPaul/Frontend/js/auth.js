const inventory = {
    'g502': { name: 'G502 Hero', stock: 50 },
    'pro-x-superlight': { name: 'PRO X SUPERLIGHT', stock: 30 },
    'g903': { name: 'G903', stock: 20 },
    'g304': { name: 'G304', stock: 40 },
    'g402': { name: 'G402 Hyperion Fury', stock: 25 },
    'g703': { name: 'G703', stock: 15 }
};

function updateAuthUI() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const logoutBtn = document.querySelector('.logout-btn');
    const loginBtn = document.querySelector('.login-btn');
    console.log('updateAuthUI called:', { isLoggedIn, logoutBtn, loginBtn }); // Debug
    if (logoutBtn) {
        logoutBtn.style.display = isLoggedIn ? 'inline-block' : 'none';
    } else {
        console.warn('Logout button not found'); // Debug
    }
    if (loginBtn) {
        loginBtn.style.display = isLoggedIn ? 'none' : 'inline-block';
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('intendedAction');
    alert('Logged out successfully!');
    updateAuthUI();
    window.location.href = 'index.html';
}

function checkLoginAndProceed(event, action) {
    event.preventDefault();
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = action;
    } else {
        localStorage.setItem('intendedAction', action);
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
    }
}

function showOrderModal(productId) {
    if (!inventory[productId]) {
        alert('Invalid product selected!');
        return;
    }
    const product = inventory[productId];
    document.getElementById('orderProduct').value = product.name;
    document.getElementById('itemsLeft').value = product.stock;
    document.getElementById('orderQuantity').max = product.stock;
    document.getElementById('orderQuantity').value = 1;
    const orderModalElement = document.getElementById('orderModal');
    if (orderModalElement) {
        const orderModal = new bootstrap.Modal(orderModalElement);
        orderModal.show();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, calling updateAuthUI'); // Debug
    updateAuthUI();

    // Password toggle functionality
    const togglePasswordIcons = document.querySelectorAll('.toggle-password');
    togglePasswordIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const inputId = icon.getAttribute('data-target');
            const input = document.getElementById(inputId);
            if (input) {
                const isPassword = input.type === 'password';
                input.type = isPassword ? 'text' : 'password';
                icon.classList.toggle('fa-eye', isPassword);
                icon.classList.toggle('fa-eye-slash', !isPassword);
            }
        });
    });

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            localStorage.setItem('isLoggedIn', 'true');
            console.log('Login submitted, isLoggedIn set to true'); // Debug
            const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            modal.hide();
            alert('Login successful!');
            updateAuthUI();
            const intendedAction = localStorage.getItem('intendedAction');
            if (intendedAction) {
                localStorage.removeItem('intendedAction');
                console.log('Redirecting to intended action:', intendedAction); // Debug
                if (intendedAction.startsWith('order:')) {
                    const productId = intendedAction.split(':')[1];
                    showOrderModal(productId);
                } else {
                    window.location.href = intendedAction;
                }
            } else {
                console.log('No intended action, redirecting to index-loggedin.html'); // Debug
                window.location.href = 'index-loggedin.html';
            }
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            if (password === confirmPassword) {
                localStorage.setItem('isLoggedIn', 'true');
                console.log('Registration submitted, isLoggedIn set to true'); // Debug
                const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
                modal.hide();
                alert('Registration successful! You are now logged in.');
                updateAuthUI();
                const intendedAction = localStorage.getItem('intendedAction');
                if (intendedAction) {
                    localStorage.removeItem('intendedAction');
                    console.log('Redirecting to intended action:', intendedAction); // Debug
                    if (intendedAction.startsWith('order:')) {
                        const productId = intendedAction.split(':')[1];
                        showOrderModal(productId);
                    } else {
                        window.location.href = intendedAction;
                    }
                } else {
                    console.log('No intended action, redirecting to index-loggedin.html'); // Debug
                    window.location.href = 'index-loggedin.html';
                }
            } else {
                alert('Passwords do not match!');
            }
        });
    }

    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const productName = document.getElementById('orderProduct').value;
            const quantity = parseInt(document.getElementById('orderQuantity').value);
            const productId = Object.keys(inventory).find(key => inventory[key].name === productName);
            if (productId && quantity <= inventory[productId].stock) {
                inventory[productId].stock -= quantity;
                alert(`Order placed successfully for ${quantity} x ${productName}!`);
                bootstrap.Modal.getInstance(document.getElementById('orderModal')).hide();
            } else {
                alert('Invalid quantity or product not found!');
            }
        });
    }

    const actionLinks = document.querySelectorAll('[data-action]');
    actionLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const action = link.getAttribute('data-action');
            if (action === 'order') {
                event.preventDefault();
                const productId = link.getAttribute('data-product');
                if (localStorage.getItem('isLoggedIn') === 'true') {
                    showOrderModal(productId);
                } else {
                    localStorage.setItem('intendedAction', `order:${productId}`);
                    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
                    loginModal.show();
                }
            } else if (action !== 'products.html' && action !== 'gaming-product.html' && action !== 'office-product.html') {
                checkLoginAndProceed(event, action);
            }
        });
    });

    const modalSwitchLinks = document.querySelectorAll('[data-bs-toggle="modal"][data-bs-target]');
    modalSwitchLinks.forEach(link => {
        link.addEventListener('click', () => {
            const currentModal = bootstrap.Modal.getInstance(link.closest('.modal'));
            if (currentModal) {
                currentModal.hide();
            }
        });
    });

    // Fallback: Retry updateAuthUI after a short delay
    setTimeout(updateAuthUI, 100);
});