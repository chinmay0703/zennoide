// Array of the cart
let cart = [];
// globally declared to get the values from any function
let totalQuantity = 0;
let totalAmount = 0;

function addToCart(productName, price, quantity, giftWrap) {
    const existingItem = cart.find(item => item.name === productName);
    if (existingItem) {
        existingItem.quantity += parseInt(quantity);
    } else {
        cart.push({ name: productName, price: price, quantity: parseInt(quantity), giftWrap: giftWrap });
    }
    totalQuantity += parseInt(quantity);
    updateCart();
}

function submitQuantities() {
    // to get the quantity and gift wrap info from the user
    addToCart('Product A', 20, document.getElementById('quantityA').value, document.getElementById('giftWrapA').checked);
    addToCart('Product B', 40, document.getElementById('quantityB').value, document.getElementById('giftWrapB').checked);
    addToCart('Product C', 50, document.getElementById('quantityC').value, document.getElementById('giftWrapC').checked);
}

function updateCart() {
    // to print the necessary things
    const cartContent = document.getElementById('cart-content');
    const totalQuantityElement = document.getElementById('total-quantity');
    const totalAmountElement = document.getElementById('total-amount');

    cartContent.innerHTML = '';
    totalAmount = 0;

    if (cart.length === 0) {
        cartContent.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cart.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <p>Name: ${item.name} - Price: $${item.price} - Quantity: ${item.quantity} - Gift Wrap: ${item.giftWrap ? 'Yes' : 'No'}</p>
                <button onclick="increaseQuantity('${item.name}')">+</button>
                <button onclick="decreaseQuantity('${item.name}')">-</button>
            `;
            cartContent.appendChild(cartItemElement);
            totalAmount += item.price * item.quantity;
        });
    }

    totalQuantityElement.innerHTML = `<p>Total Quantity: ${totalQuantity}</p>`;
    totalAmountElement.innerHTML = `<p>Total Amount: $${totalAmount.toFixed(2)}</p>`;
    createOrder();
}

function increaseQuantity(productName) {
    const existingItem = cart.find(item => item.name === productName);
    if (existingItem) {
        existingItem.quantity++;
        totalQuantity++;
        // call update after every function call like increase or decrease
        updateCart();
    }
}

function decreaseQuantity(productName) {
    const existingItem = cart.find(item => item.name === productName);
    if (existingItem && existingItem.quantity > 1) {
        existingItem.quantity--;
        totalQuantity--;
        updateCart();
    }
}

function createOrder() {
    const orderDetails = document.getElementById('order-details');
    let discountedAmount = totalAmount;
    let mostBeneficialCoupon = '';
    let discountA = 0;
    let discountB = 0;
    let discountC = 0;
    let discountD = 0;

    if (totalAmount > 200) {
        discountA = 10;
    }

    console.log('Discount A:', discountA);

    // discountD calculation
    cart.forEach(item => {
        if (totalQuantity > 30 && item.quantity > 15) {
            discountD += (item.price * (item.quantity - 15) * 0.5);
        }
    });

    console.log('Discount D:', discountD);

    // discountB calculation
    cart.forEach(item => {
        if (item.quantity > 10) {
            discountB += item.price * item.quantity * 0.05;
        }
    });

    console.log('Discount B:', discountB);

    // discountC calculation
    if (totalQuantity > 20) {
        discountC = totalAmount * 0.1;
    }

    console.log('Discount C:', discountC);

    if (discountA === 0 && discountB === 0 && discountC === 0 && discountD === 0) {
        discountedAmount = totalAmount;
        mostBeneficialCoupon = '';
    }
    else {


        if (discountA > discountB && discountA > discountC && discountA > discountD) {
            discountedAmount -= discountA;
            mostBeneficialCoupon = 'flat_10_discount';
        } else if (discountB > discountC && discountB > discountD) {
            discountedAmount -= discountB;
            mostBeneficialCoupon = 'bulk_5_discount';
        } else if (discountC > discountD) {
            discountedAmount -= discountC;
            mostBeneficialCoupon = 'bulk_10_discount';

        }

        else {
            discountedAmount -= discountD;
            mostBeneficialCoupon = 'tiered_50_discount';
        }

    }

    // Calculate gift wrapping fee
    let giftWrapFee = 0;
    cart.forEach(item => {
        if (item.giftWrap) {
            giftWrapFee += item.quantity;
        }
    });
    giftWrapFee *= 1; // Gift wrap fee: $1 per unit

    // Calculate shipping fee
    let shippingFee = Math.ceil(totalQuantity / 10) * 5;
    console.log('Discounted Amount:', discountedAmount);
    let orderContent = '';

    if (discountedAmount == totalAmount) {
        orderContent += `<p>Coupon Applied: ${mostBeneficialCoupon}</p>`;
        orderContent += `<p>Total Savings: ${totalAmount - discountedAmount}</p>`;
        orderContent += `<p>Gift Wrap Fee: $${giftWrapFee.toFixed(2)}</p>`;
        orderContent += `<p>Shipping Fee: $${shippingFee.toFixed(2)}</p>`;
        orderContent += `<p>Total Amount to pay: $${(discountedAmount + giftWrapFee + shippingFee).toFixed(2)}</p>`;
    } else {
        orderContent += `<p>Coupon Applied: ${mostBeneficialCoupon}</p>`;
        orderContent += `<p>Total Savings: ${totalAmount - discountedAmount}</p>`;
        orderContent += `<p>Gift Wrap Fee: $${giftWrapFee.toFixed(2)}</p>`;
        orderContent += `<p>Shipping Fee: $${shippingFee.toFixed(2)}</p>`;
        orderContent += `<p>Total Amount to pay: $${(discountedAmount + giftWrapFee + shippingFee).toFixed(2)}</p>`;
    }

    orderDetails.innerHTML = orderContent;


}

