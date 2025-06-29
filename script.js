// Global variables
let currentUser = null;
let cart = [];
let orders = [];
let menuItems = [
  {
    id: 1,
    name: "Chicken Biryani",
    description: "Aromatic basmati rice with tender chicken and spices",
    price: 120,
    category: "main",
    available: true,
    image: "🍛",
  },
  {
    id: 2,
    name: "Veg Thali",
    description: "Complete vegetarian meal with dal, sabzi, rice, and roti",
    price: 80,
    category: "main",
    available: true,
    image: "🍽",
  },
  {
    id: 3,
    name: "Masala Dosa",
    description: "Crispy dosa filled with spiced potato curry",
    price: 60,
    category: "main",
    available: true,
    image: "🥞",
  },
  {
    id: 4,
    name: "Samosa",
    description: "Deep fried pastry with spiced potato filling",
    price: 20,
    category: "snacks",
    available: true,
    image: "🥟",
  },
  {
    id: 5,
    name: "Pav Bhaji",
    description: "Spiced vegetable curry served with buttered bread",
    price: 50,
    category: "snacks",
    available: true,
    image: "🍞",
  },
  {
    id: 6,
    name: "Cold Coffee",
    description: "Refreshing iced coffee with milk and sugar",
    price: 40,
    category: "beverages",
    available: true,
    image: "☕",
  },
  {
    id: 7,
    name: "Fresh Lime Water",
    description: "Refreshing lime water with mint",
    price: 25,
    category: "beverages",
    available: true,
    image: "🍋",
  },
  {
    id: 8,
    name: "Chocolate Cake",
    description: "Rich chocolate cake slice",
    price: 45,
    category: "snacks",
    available: true,
    image: "🍰",
  },
];

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  // Check which page we're on and initialize accordingly
  if (document.getElementById("studentLoginForm")) {
    initializeLandingPage();
  } else if (document.querySelector(".dashboard")) {
    if (document.getElementById("menuGrid")) {
      initializeStudentDashboard();
    } else {
      initializeAdminDashboard();
    }
  }
});

// Landing page initialization
function initializeLandingPage() {
  const studentLoginForm = document.getElementById("studentLoginForm");
  const adminLoginForm = document.getElementById("adminLoginForm");

  studentLoginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    // Simple validation - in real app, this would be API call
    const studentId = e.target[0].value;
    const password = e.target[1].value;

    if (studentId && password) {
      currentUser = { id: studentId, type: "student" };
      window.location.href = "student.html";
    } else {
      alert("Please enter valid credentials");
    }
  });

  adminLoginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    // Simple validation - in real app, this would be API call
    const adminId = e.target[0].value;
    const password = e.target[1].value;

    if (adminId && password) {
      currentUser = { id: adminId, type: "admin" };
      window.location.href = "admin.html";
    } else {
      alert("Please enter valid credentials");
    }
  });
}

// Student dashboard initialization
function initializeStudentDashboard() {
  loadCartFromStorage();
  renderMenu();
  renderCart();
  renderOrders();
  setupNavigation();
  setupCategoryFilters();
  setupMinimumPickupTime();

  // Place order functionality
  const placeOrderBtn = document.getElementById("placeOrderBtn");
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", placeOrder);
  }
}

// Admin dashboard initialization
function initializeAdminDashboard() {
  loadOrdersFromStorage();
  renderAdminOrders();
  renderMenuManagement();
  setupAdminNavigation();
  setupAdminTabs();
  setupAddItemModal();
}

// Navigation setup for student dashboard
function setupNavigation() {
  const navLinks = document.querySelectorAll(".nav-link[data-section]");
  const sections = document.querySelectorAll(".section");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetSection = this.getAttribute("data-section");

      // Remove active class from all nav links and sections
      navLinks.forEach((nl) => nl.classList.remove("active"));
      sections.forEach((section) => section.classList.remove("active"));

      // Add active class to clicked nav link and target section
      this.classList.add("active");
      document.getElementById(targetSection).classList.add("active");
    });
  });
}

// Navigation setup for admin dashboard
function setupAdminNavigation() {
  const navLinks = document.querySelectorAll(".nav-link[data-section]");
  const sections = document.querySelectorAll(".section");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetSection = this.getAttribute("data-section");

      // Remove active class from all nav links and sections
      navLinks.forEach((nl) => nl.classList.remove("active"));
      sections.forEach((section) => section.classList.remove("active"));

      // Add active class to clicked nav link and target section
      this.classList.add("active");
      document.getElementById(targetSection).classList.add("active");
    });
  });
}

// Setup category filters
function setupCategoryFilters() {
  const categoryBtns = document.querySelectorAll(".category-btn");

  categoryBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all buttons
      categoryBtns.forEach((b) => b.classList.remove("active"));
      // Add active class to clicked button
      this.classList.add("active");

      const category = this.getAttribute("data-category");
      renderMenu(category);
    });
  });
}

// Setup admin tabs
function setupAdminTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const targetTab = this.getAttribute("data-tab");

      // Remove active class from all tabs
      tabBtns.forEach((tb) => tb.classList.remove("active"));
      tabContents.forEach((tc) => tc.classList.remove("active"));

      // Add active class to clicked tab
      this.classList.add("active");
      document.getElementById(targetTab + "Orders").classList.add("active");
    });
  });
}

// Render menu items
function renderMenu(filterCategory = "all") {
  const menuGrid = document.getElementById("menuGrid");
  if (!menuGrid) return;

  const filteredItems =
    filterCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === filterCategory);

  menuGrid.innerHTML = filteredItems
    .map(
      (item) => `
        <div class="menu-item" data-category="${item.category}">
            <div class="menu-item-image">
                ${item.image}
            </div>
            <div class="menu-item-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="menu-item-footer">
                    <span class="price">₹${item.price}</span>
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="updateQuantity(${
                          item.id
                        }, -1)">-</button>
                        <span class="quantity-display" id="qty-${
                          item.id
                        }">${getItemQuantityInCart(item.id)}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${
                          item.id
                        }, 1)">+</button>
                    </div>
                </div>
            </div>
        </div>
    `
    )
    .join("");
}

// Get item quantity in cart
function getItemQuantityInCart(itemId) {
  const cartItem = cart.find((item) => item.id === itemId);
  return cartItem ? cartItem.quantity : 0;
}

// Update quantity in cart
function updateQuantity(itemId, change) {
  const item = menuItems.find((item) => item.id === itemId);
  if (!item) return;

  const existingCartItem = cart.find((cartItem) => cartItem.id === itemId);

  if (existingCartItem) {
    existingCartItem.quantity += change;
    if (existingCartItem.quantity <= 0) {
      cart = cart.filter((cartItem) => cartItem.id !== itemId);
    }
  } else if (change > 0) {
    cart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: change,
    });
  }

  // Update quantity display
  document.getElementById('qty-${itemId}').textContent =
    getItemQuantityInCart(itemId);

  // Update cart count and render cart
  updateCartCount();
  renderCart();
  saveCartToStorage();
}

// Update cart count in navigation
function updateCartCount() {
  const cartCount = document.getElementById("cartCount");
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
  }
}

// Render cart
function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartSummary = document.getElementById("cartSummary");

  if (!cartItems || !cartSummary) return;

  if (cart.length === 0) {
    cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add some delicious items from our menu!</p>
            </div>
        `;
    cartSummary.style.display = "none";
  } else {
    cartItems.innerHTML = cart
      .map(
        (item) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>₹${item.price} each</p>
                </div>
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity(${
                      item.id
                    }, -1)">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${
                      item.id
                    }, 1)">+</button>
                </div>
                <div class="cart-item-total">
                    <strong>₹${item.price * item.quantity}</strong>
                </div>
            </div>
        `
      )
      .join("");

    // Calculate totals
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;

    // Update summary
    document.getElementById("subtotal").textContent = '₹${subtotal}';
    document.getElementById("tax").textContent = '₹${tax}';
    document.getElementById("total").textContent = '₹${total}';

    cartSummary.style.display = "block";
  }

  updateCartCount();
}

// Setup minimum pickup time
function setupMinimumPickupTime() {
  const pickupTimeInput = document.getElementById("pickupTime");
  if (pickupTimeInput) {
    // Set minimum time to 15 minutes from now
    const now = new Date();
    now.setMinutes(now.getMinutes() + 15);
    const minTime = now.toTimeString().slice(0, 5);
    pickupTimeInput.min = minTime;

    // Set maximum time to 8 PM (20:00)
    pickupTimeInput.max = "20:00";
  }
}

// Place order
function placeOrder() {
  const pickupTime = document.getElementById("pickupTime").value;

  if (!pickupTime) {
    alert("Please select a pickup time");
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty");
    return;
  }

  // Validate pickup time
  const now = new Date();
  const selectedTime = new Date();
  const [hours, minutes] = pickupTime.split(":");
  selectedTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

  if (selectedTime <= now) {
    alert("Pickup time must be in the future");
    return;
  }

  // Create order
  const order = {
    id: "ORD" + Date.now(),
    studentName: "John Doe", // In real app, get from logged-in user
    studentId: "ST12345",
    items: [...cart],
    total:
      cart.reduce((sum, item) => sum + item.price * item.quantity, 0) * 1.05, // Include tax
    pickupTime: pickupTime,
    status: "pending",
    timestamp: new Date().toISOString(),
  };

  // Add to orders array
  orders.push(order);
  saveOrdersToStorage();

  // Clear cart
  cart = [];
  saveCartToStorage();
  renderCart();

  // Show success message
  alert(
    'Order placed successfully! Order ID: ${order.id}\nPickup time: ${pickupTime}'
  );

  // Switch to orders tab
  document.querySelector('.nav-link[data-section="orders"]').click();
  renderOrders();
}

// Render student orders
function renderOrders() {
  const ordersList = document.getElementById("ordersList");
  if (!ordersList) return;

  if (orders.length === 0) {
    ordersList.innerHTML = `
            <div class="empty-cart">
                <div class="empty-icon">📋</div>
                <h3>No orders yet</h3>
                <p>Your order history will appear here</p>
            </div>
        `;
    return;
  }

  // Sort orders by timestamp (newest first)
  const sortedOrders = orders.sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  ordersList.innerHTML = sortedOrders
    .map(
      (order) => `
        <div class="order-card">
            <div class="order-header">
                <div class="order-id">Order #${order.id}</div>
                <div class="order-status status-${
                  order.status
                }">${order.status.toUpperCase()}</div>
            </div>
            <div class="order-items">
                ${order.items
                  .map(
                    (item) => `
                    <div class="order-item">
                        <span>${item.name} x ${item.quantity}</span>
                        <span>₹${item.price * item.quantity}</span>
                    </div>
                `
                  )
                  .join("")}
            </div>
            <div class="order-footer">
                <div class="pickup-time-info">
                    <strong>Pickup Time:</strong> ${order.pickupTime}
                </div>
                <div class="order-total">
                    <strong>Total: ₹${Math.round(order.total)}</strong>
                </div>
            </div>
        </div>
    `
    )
    .join("");
}

// Render admin orders
function renderAdminOrders() {
  const pendingOrders = document.getElementById("pendingOrders");
  const completedOrders = document.getElementById("completedOrders");

  if (!pendingOrders || !completedOrders) return;

  const pending = orders.filter((order) => order.status === "pending");
  const completed = orders.filter((order) => order.status === "completed");

  // Render pending orders
  if (pending.length === 0) {
    pendingOrders.innerHTML = `
            <div class="empty-cart">
                <div class="empty-icon">📋</div>
                <h3>No pending orders</h3>
                <p>New orders will appear here</p>
            </div>
        `;
  } else {
    pendingOrders.innerHTML = pending
      .map(
        (order) => `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-id">Order #${order.id}</div>
                    <div class="order-status status-${
                      order.status
                    }">${order.status.toUpperCase()}</div>
                </div>
                <div class="order-details">
                    <p><strong>Student:</strong> ${order.studentName} (${
          order.studentId
        })</p>
                    <p><strong>Pickup Time:</strong> ${order.pickupTime}</p>
                </div>
                <div class="order-items">
                    ${order.items
                      .map(
                        (item) => `
                        <div class="order-item">
                            <span>${item.name} x ${item.quantity}</span>
                            <span>₹${item.price * item.quantity}</span>
                        </div>
                    `
                      )
                      .join("")}
                </div>
                <div class="order-footer">
                    <div class="order-total">
                        <strong>Total: ₹${Math.round(order.total)}</strong>
                    </div>
                    <button class="btn btn-success" onclick="markOrderCompleted('${
                      order.id
                    }')">
                        Mark as Completed
                    </button>
                </div>
            </div>
        `
      )
      .join("");
  }

  // Render completed orders
  if (completed.length === 0) {
    completedOrders.innerHTML = `
            <div class="empty-cart">
                <div class="empty-icon">✅</div>
                <h3>No completed orders</h3>
                <p>Completed orders will appear here</p>
            </div>
        `;
  } else {
    completedOrders.innerHTML = completed
      .map(
        (order) => `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-id">Order #${order.id}</div>
                    <div class="order-status status-${
                      order.status
                    }">${order.status.toUpperCase()}</div>
                </div>
                <div class="order-details">
                    <p><strong>Student:</strong> ${order.studentName} (${
          order.studentId
        })</p>
                    <p><strong>Pickup Time:</strong> ${order.pickupTime}</p>
                </div>
                <div class="order-items">
                    ${order.items
                      .map(
                        (item) => `
                        <div class="order-item">
                            <span>${item.name} x ${item.quantity}</span>
                            <span>₹${item.price * item.quantity}</span>
                        </div>
                    `
                      )
                      .join("")}
                </div>
                <div class="order-footer">
                    <div class="order-total">
                        <strong>Total: ₹${Math.round(order.total)}</strong>
                    </div>
                </div>
            </div>
        `
      )
      .join("");
  }
}

// Mark order as completed
function markOrderCompleted(orderId) {
  const order = orders.find((o) => o.id === orderId);
  if (order) {
    order.status = "completed";
    saveOrdersToStorage();
    renderAdminOrders();
  }
}

// Render menu management
function renderMenuManagement() {
  const menuManagementGrid = document.getElementById("menuManagementGrid");
  if (!menuManagementGrid) return;

  menuManagementGrid.innerHTML = menuItems
    .map(
      (item) => `
        <div class="management-item">
            <div class="management-item-header">
                <div>
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <div class="price">₹${item.price}</div>
                </div>
                <div class="item-actions">
                    <button class="btn btn-small btn-secondary" onclick="editItem(${
                      item.id
                    })">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="deleteItem(${
                      item.id
                    })">Delete</button>
                </div>
            </div>
            <div class="availability-toggle">
                <div class="toggle-switch ${
                  item.available ? "active" : ""
                }" onclick="toggleAvailability(${item.id})"></div>
                <span>${item.available ? "Available" : "Unavailable"}</span>
            </div>
        </div>
    `
    )
    .join("");
}

// Toggle item availability
function toggleAvailability(itemId) {
  const item = menuItems.find((i) => i.id === itemId);
  if (item) {
    item.available = !item.available;
    renderMenuManagement();
    // In a real app, you'd save this to the backend
  }
}

// Edit item (simplified for demo)
function editItem(itemId) {
  const item = menuItems.find((i) => i.id === itemId);
  if (item) {
    const newPrice = prompt('Edit price for ${item.name}:', item.price);
    if (newPrice && !isNaN(newPrice)) {
      item.price = parseFloat(newPrice);
      renderMenuManagement();
    }
  }
}

// Delete item
function deleteItem(itemId) {
  if (confirm("Are you sure you want to delete this item?")) {
    menuItems = menuItems.filter((item) => item.id !== itemId);
    renderMenuManagement();
  }
}

// Setup add item modal
function setupAddItemModal() {
  const addItemBtn = document.getElementById("addItemBtn");
  const modal = document.getElementById("addItemModal");
  const closeBtn = modal?.querySelector(".close");
  const addItemForm = document.getElementById("addItemForm");

  if (addItemBtn) {
    addItemBtn.addEventListener("click", () => {
      modal.style.display = "block";
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  if (addItemForm) {
    addItemForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(e.target);
      const newItem = {
        id: Date.now(),
        name: formData.get("name") || e.target[0].value,
        description: formData.get("description") || e.target[1].value,
        price: parseFloat(formData.get("price") || e.target[2].value),
        category: formData.get("category") || e.target[3].value,
        available: e.target[4].checked,
        image: getRandomEmoji(),
      };

      menuItems.push(newItem);
      renderMenuManagement();
      modal.style.display = "none";
      e.target.reset();
    });
  }

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
}

// Get random emoji for new items
function getRandomEmoji() {
  const emojis = [
    "🍛",
    "🍽",
    "🥞",
    "🥟",
    "🍞",
    "☕",
    "🍋",
    "🍰",
    "🍕",
    "🍝",
    "🥗",
    "🍲",
  ];
  return emojis[Math.floor(Math.random() * emojis.length)];
}

// Local storage functions
function saveCartToStorage() {
  localStorage.setItem("canteenCart", JSON.stringify(cart));
}

function loadCartFromStorage() {
  const savedCart = localStorage.getItem("canteenCart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
}

function saveOrdersToStorage() {
  localStorage.setItem("canteenOrders", JSON.stringify(orders));
}

function loadOrdersFromStorage() {
  const savedOrders = localStorage.getItem("canteenOrders");
  if (savedOrders) {
    orders = JSON.parse(savedOrders);
  }
}