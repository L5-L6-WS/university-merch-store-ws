    const sizes = ['S', 'M', 'L', 'XL'];
    const container = document.getElementById('product-container');

    products.forEach((productInfo, index) => {
      const id = index + 1;
      const product = document.createElement('div');
      product.className = 'product';

      const img = document.createElement('img');
      img.src = imageSources[index];
      img.alt = productInfo.name;
      img.onclick = () => {
        const details = product.querySelector('.product-details');
        details.style.display = details.style.display === 'none' ? 'block' : 'none';
      };

      const title = document.createElement('h2');
      title.textContent = productInfo.name;

      const price = document.createElement('div');
      price.className = 'price';
      price.textContent = `₹${productInfo.price}`;

      const detailsDiv = document.createElement('div');
      detailsDiv.className = 'product-details';

      if (index < 6) {
        const sizeLabel = document.createElement('label');
        sizeLabel.textContent = 'Size: ';
        const sizeSelect = document.createElement('select');
        sizeSelect.id = `size${id}`;
        sizes.forEach(size => {
          const option = document.createElement('option');
          option.value = size;
          option.textContent = size;
          sizeSelect.appendChild(option);
        });
        detailsDiv.appendChild(sizeLabel);
        detailsDiv.appendChild(sizeSelect);
      }

      const qtyLabel = document.createElement('label');
      qtyLabel.textContent = 'Quantity: ';
      const qtyInput = document.createElement('input');
      qtyInput.type = 'number';
      qtyInput.id = `quantity${id}`;
      qtyInput.min = 1;
      qtyInput.value = 1;
      detailsDiv.appendChild(qtyLabel);
      detailsDiv.appendChild(qtyInput);

      const actions = document.createElement('div');
      actions.className = 'actions';

      const addToCartBtn = document.createElement('button');
      addToCartBtn.textContent = 'Add to Cart';
      addToCartBtn.onclick = () => handleAction('cart', id, productInfo.name, productInfo.price);

      const buyNowBtn = document.createElement('button');
      buyNowBtn.textContent = 'Buy Now';
      buyNowBtn.onclick = () => handleAction('buy', id, productInfo.name, productInfo.price);

      actions.appendChild(addToCartBtn);
      actions.appendChild(buyNowBtn);
      detailsDiv.appendChild(actions);

      product.appendChild(img);
      product.appendChild(title);
      product.appendChild(price);
      product.appendChild(detailsDiv);
      container.appendChild(product);
    });

    const customAlert = document.getElementById('customAlert');
    const alertMessage = document.getElementById('alertMessage');
    const alertOkBtn = document.getElementById('alertOkBtn');
    alertOkBtn.onclick = () => {
      customAlert.style.display = 'none';
    };

    function handleAction(type, id, name, price) {
      const qty = document.getElementById(`quantity${id}`).value;
      const sizeElement = document.getElementById(`size${id}`);
      const size = sizeElement ? sizeElement.value : null;

      const product = { id, name, price, qty: parseInt(qty), size };

      if (type === 'cart') {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItemIndex = cart.findIndex(item => item.id === id && item.size === size);

        if (existingItemIndex > -1) {
          cart[existingItemIndex].qty += product.qty;
        } else {
          cart.push(product);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`Added to Cart: ${name}, Quantity: ${qty}${size ? ", Size: " + size : ""}`);
      }

      if (type === 'buy') {
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(product);
        localStorage.setItem('orders', JSON.stringify(orders));

        alertMessage.textContent = `Order placed: ${name}, Quantity: ${qty}${size ? ", Size: " + size : ""}`;
        customAlert.style.display = 'flex';
      }
	       if (type === 'buy') {
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(product);
        localStorage.setItem('orders', JSON.stringify(orders));

        alertMessage.textContent = `Order placed: ${name}, Quantity: ${qty}${size ? ", Size: " + size : ""}`;
        customAlert.style.display = 'flex';
      }
	    ers.push(product);
        localStorage.setItem('orders', JSON.stringify(orders));

        alertMessage.textContent = `Order placed: ${name}, Quantity: ${qty}${size ? ", Size: " + size : ""}`;
        customAlert.style.display = 'flex';
      }


    }
