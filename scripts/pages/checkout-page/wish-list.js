import { products } from '../../../data/home-page.js';
import { formatCurrency } from '../../shared/format-currency.js';
import {
    wishList,
    addProductToCart,
    calculateQuantityOfWishListItems,
    updateWishListInLocalStorage,
} from '../../../data/checkout-page.js';
import {
    updateCartItemsQuantityDisplay,
    updateCartVisibility,
    updateCartItemDeliveryDateOptions,
    addEventListenersToDeliveryDateOptions,
} from './cart.js';
import { updateOrderSummaryDisplay, updatePlaceOrderButtonVisibility } from './order-summary.js';

const wishListContainer = document.querySelector('.wish-list-container');

/**
 * Finds a product in the products array based on its ID.
 * @param {string} productId - The ID of the product to find.
 * @returns {Object | undefined} - The matching product or undefined if not found.
 */
function findProductById(productId) {
    return products.find((product) => product.id === productId);
}

function generateWishListHTML() {
    let wishListHTML = '';

    wishList.forEach((product) => {
        const matchingProduct = findProductById(product.productId);

        if (matchingProduct) {
            wishListHTML += `
                <div class="wish-list-product-container ${`wish-list-product-container-${matchingProduct.id}`}">
                    <div class="wish-list-product-container-grid">
                        <img class="product-image" src="${matchingProduct.image}">
    
                        <div class="wish-list-product-details-container">
                            <div>
                                <div class="product-name">
                                    ${matchingProduct.name}
                                </div>
                                <div class="product-price">
                                    ${formatCurrency(matchingProduct.priceInCents)}
                                </div>
                            </div>
                            <div>
                                <span class="add-wish-list-product-to-cart-button link-primary" data-product-id="${
                                    matchingProduct.id
                                }">
                                    Add to Cart
                                </span>
                                <span class="remove-wish-list-product-button link-primary" data-product-id="${
                                    matchingProduct.id
                                }">
                                    Remove
                                </span>
                            </div>
                        </div>
                    </div>
                </div>`;
        }
    });

    wishListContainer.innerHTML = wishListHTML;
}

function generateEmptyWishListHTML() {
    wishListContainer.innerHTML = `
        <div class="empty-wish-list-container">
            <div class="empty-wish-list-message-container">
                <div>
                    <span>Looks like it's empty!</span><br><br>
                    Why not add something?
                </div>
            </div>
            <img class="empty-wish-list-container-img" src="images/icons/save.png">
        </div>
    `;
}

/**
 * Updates the visibility of the wish list based on the quantity of wish list items.
 * If the wish list is not empty, it generates the wish list HTML; otherwise, it generates
 * HTML for an empty wish list.
 */
export function updateWishListVisibility() {
    const wishListQuantity = calculateQuantityOfWishListItems();
    wishListQuantity > 0 ? generateWishListHTML() : generateEmptyWishListHTML();
}

updateWishListVisibility();

/**
 * Adds a click event listener to the "Add Wish List Item To Cart" buttons container.
 * If the button is clicked, it adds the product to the cart and removes it from the wish list.
 */
document.querySelector('.wish-list-container').addEventListener('click', (event) => {
    const addButton = event.target.closest('.add-wish-list-product-to-cart-button');

    if (addButton) {
        const productId = addButton.dataset.productId;
        addProductToCart(productId, 1);
        removeWishListItem(productId);
        updateCartVisibility();
        updateCartItemDeliveryDateOptions();
        addEventListenersToDeliveryDateOptions();
        updateWishListVisibility();
        updateCartItemsQuantityDisplay();
        updateOrderSummaryDisplay();
        updatePlaceOrderButtonVisibility();
    }
});

/**
 * Removes a product from the 'wish list' array.
 * @param {string} productId - The unique identifier of the product to be removed.
 */
function removeWishListItem(productId) {
    const itemIndex = wishList.findIndex((product) => product.productId === productId);
    const productContainer = document.querySelector(`.wish-list-product-container-${productId}`);

    if (itemIndex !== -1) {
        wishList.splice(itemIndex, 1);
    }
    if (productContainer) {
        productContainer.remove();
    }

    updateWishListInLocalStorage();
}

/**
 * Adds a click event listener to the "Remove Wish List Item" buttons container.
 * If the button is clicked, it removes the item fro mthe wish list and updates displays.
 */
document.querySelector('.wish-list-container').addEventListener('click', (event) => {
    const removeButton = event.target.closest('.remove-wish-list-product-button');

    if (removeButton) {
        const productId = removeButton.dataset.productId;
        removeWishListItem(productId);
        updateWishListVisibility();
    }
});