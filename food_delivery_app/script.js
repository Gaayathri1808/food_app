const exchangeRate = 82; // Example exchange rate: 1 USD = 82 INR

const restaurants = [
    {
        name: "Cibo Fine Dine",
        cuisine: "italian",
        description: "Place known for ambience, good quality, food and value for money.",
        image: "cibo.jpeg",
        items: [
            { name: "Corn Matar Curry", price: 3.56, image: "cm.jpeg" },
            { name: "Veg Banjara", price: 3.34, image: "vb.jpeg" },
            { name: "Mushroom curry", price: 3.82, image: "mc.jpeg" }
        ]
    },
    {
        name: "Selvi Mess",
        cuisine: "indian",
        description: "Authentic Indian curries made by home cooks with a variety of spices.",
        image: "sm.jpeg",
        items: [
            { name: "Chicken Kothu Parotta", price: 1.43, image: "kp.jpeg" },
            { name: "Chicken Fry", price: 0.96, image: "cf.jpeg" },
            { name: "Full Meals", price: 0.84, image: "fm.jpeg" }
        ]
    },
    {
        name: "Chongqing",
        cuisine: "chinese",
        description: "Famous for its indulgence of realistic chinese taste.",
        image: "cq.jpeg",
        items: [
            { name: "Wonton soup", price: 2.15, image: "ws.jpeg" },
            { name: "Babycorn Chilli Garlic Sauce", price: 2.99, image: "bc.jpeg" },
            { name: "Schezwan Prawn Gravy", price: 4.06, image: "spg.jpeg" }
        ]
    },
    {
        name: "Melange Restaurant",
        cuisine: "mexican",
        description: "This place has a complex fusion of indogenious mexoamerican cooking.",
        image: "mer.jpeg",
        items: [
            { name: "Crispy White Bait", price: 3.58, image: "cwb.jpeg" },
            { name: "Grilled Taco Salad", price: 2.87, image: "gt.jpeg" },
            { name: "Cream of Chicken Soup", price: 2.39, image: "coc.jpeg" }
        ]
    }
];

const restaurantGrid = document.getElementById('restaurant-grid');
const cuisineFilter = document.getElementById('cuisine');

function displayRestaurants(filter = 'all') {
    restaurantGrid.innerHTML = '';
    restaurants.forEach(restaurant => {
        if (filter === 'all' || restaurant.cuisine === filter) {
            const card = document.createElement('div');
            card.className = 'restaurant-card';
            card.innerHTML = `
                <img src="${restaurant.image}" alt="${restaurant.name}">
                <h3>${restaurant.name}</h3>
                <p>${restaurant.description}</p>
                <div class="menu-items">
                    ${restaurant.items.map(item => `
                        <div>
                            <input type="checkbox" id="${item.name}" data-price="${item.price}">
                            <label for="${item.name}">${item.name} - ₹${(item.price * exchangeRate).toFixed(2)}
                                <img src="${item.image}" alt="${item.name}" style="width:50px; height:50px;">
                            </label>
                        </div>
                    `).join('')}
                </div>
                <button onclick="openOrderForm('${restaurant.name}')">Order Now</button>
            `;
            restaurantGrid.appendChild(card);
        }
    });
}

function openOrderForm(restaurantName) {
    document.getElementById('order-restaurant').innerText = restaurantName;
    const menuItems = document.querySelectorAll('.menu-items input[type="checkbox"]:checked');
    let total = 0;

    menuItems.forEach(item => {
        total += parseFloat(item.getAttribute('data-price')) * exchangeRate; // Convert total to INR
    });

    document.getElementById('order-total').innerText = `Total: ₹${total.toFixed(2)}`;
    document.getElementById('order-modal').style.display = 'block';

    const orderForm = document.getElementById('order-form');
    orderForm.onsubmit = function(event) {
        event.preventDefault();
        placeOrder(restaurantName, total);
    };
}

function placeOrder(restaurantName, total) {
    const items = Array.from(document.querySelectorAll('.menu-items input[type="checkbox"]:checked'))
        .map(item => item.id);
    
    const order = {
        restaurant: restaurantName,
        items: items,
        total: total
    };

    // Clear existing orders if you want to reset orders before adding a new one
    sessionStorage.removeItem('orders'); // This will delete the old orders
    
    // Now store the new order
    const existingOrders = []; // Start fresh since old orders are cleared
    existingOrders.push(order);
    sessionStorage.setItem('orders', JSON.stringify(existingOrders));

    alert(`Order placed successfully! Total: ₹${total.toFixed(2)}`);
    closeOrderForm();
}

function closeOrderForm() {
    document.getElementById('order-modal').style.display = 'none';
}

// Event listener for filter
cuisineFilter.addEventListener('change', (event) => {
    displayRestaurants(event.target.value);
});

// Initial display
displayRestaurants();
