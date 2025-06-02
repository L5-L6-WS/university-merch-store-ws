// Cart array to hold items
let cart = [];

// Sample products for simplicity
const products = [
  { name: "T-Shirt", description: "Amity branded cotton t-shirt", price: 499 },
  { name: "Mug", description: "Ceramic mug with university logo", price: 299 },
  { name: "Notebook", description: "A5 spiral notebook", price: 199 },
  { name: "Cap", description: "Cap with Amity logo", price: 399 },
];

// Initialize when DOM is loaded
window.onload = function () {
  setupButtons();
  renderCart();
};

// Attach event listeners to "Add to Cart" buttons
function setupButtons() {
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button, index) => {
    if (button.textContent === "Add to Cart") {
      button.addEventListener("click", () => addToCart(index));
    } else if (button.textContent === "Close") {
      button.addEventListener("click", closeModal);
    }
  });

  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", handleOrder);
  }
}

// Add item to cart
function addToCart(index) {
  const product = products[index];
  const existing = cart.find(item => item.name === product.name);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  showModal(`${product.name} added to cart.`);
  renderCart();
}

// Render cart in table
function renderCart() {
  const cartTable = document.querySelectorAll("table")[1];
  const totalItems = document.querySelector("p:nth-of-type(1)");
  const totalPrice = document.querySelector("p:nth-of-type(2)");

  // Clear previous cart rows
  const rows = cartTable.querySelectorAll("tr");
  for (let i = 1; i < rows.length; i++) {
    cartTable.deleteRow(1);
  }

  let total = 0;
  let items = 0;

  if (cart.length === 0) {
    const row = cartTable.insertRow();
    row.insertCell(0).textContent = "No items in cart.";
    row.insertCell(1).textContent = "—";
    row.insertCell(2).textContent = "—";
  } else {
    cart.forEach(item => {
      const row = cartTable.insertRow();
      row.insertCell(0).textContent = item.name;
      row.insertCell(1).textContent = item.quantity;
      row.insertCell(2).textContent = "₹" + (item.price * item.quantity);
      total += item.price * item.quantity;
      items += item.quantity;
    });
  }

  totalItems.textContent = `Total Items: ${items}`;
  totalPrice.textContent = `Total Price: ₹${total}`;
}

// Show modal message
function showModal(message) {
  const modal = document.querySelector("div > h3").parentElement;
  const text = modal.querySelector("p");
  text.textContent = message;
  modal.style.display = "block";
}

// Close modal
function closeModal() {
  const modal = document.querySelector("div > h3").parentElement;
  modal.style.display = "none";
}

// Handle form submission
function handleOrder(e) {
  e.preventDefault();

  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const address = document.querySelector("#address").value.trim();

  if (!name || !email || !address) {
    showModal("Please fill out all the fields.");
    return;
  }

  if (cart.length === 0) {
    showModal("Your cart is empty.");
    return;
  }
}

