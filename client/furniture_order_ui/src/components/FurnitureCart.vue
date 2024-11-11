<template>
  <div class="cart-container container mt-5">
    <h2 class="text-center">Your Cart</h2>
    <div v-if="!cartStore.isEmpty">
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Item Name</th>
            <th scope="col">Price</th>
            <th scope="col">Quantity</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in cartItems"
            :key="item.id"
            class="table-primary">
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ item.name }}</td>
            <td>${{ item.price }}</td>
            <td>{{ item.quantity }}</td>
            <td>
              <button
                @click="removeItem(item.id)"
                class="btn btn-danger btn-sm">
                Remove
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div
        class="cart-summary mt-4 d-flex align-items-center justify-content-center">
        <div class="text-center flex-grow-1">
          <p><strong>Total Items:</strong> {{ totalItems }}</p>
          <p><strong>Total Price:</strong> ${{ totalPrice }}</p>
        </div>
      </div>

      <div class="d-flex justify-content-between mt-4">
        <button @click="clearCart" class="btn btn-warning">Clear Cart</button>
        <button @click="checkout" class="btn btn-primary">Checkout</button>
      </div>
    </div>
    <div v-else>
      <p class="text-center">Your cart is empty.</p>
    </div>
  </div>
</template>

<script>
  import { useCartStore } from '../storage/cartStore';

  export default {
    name: 'CartComponent',
    setup() {
      const cartStore = useCartStore();
      const cartItems = cartStore.items;
      const totalItems = cartStore.totalItems;
      const totalPrice = cartStore.totalPrice;

      const removeItem = (itemId) => {
        cartStore.removeFromCart(itemId);
      };

      const clearCart = () => {
        cartStore.clearCart();
      };

      const checkout = () => {
        alert('Proceeding to checkout...');
      };

      return {
        cartStore,
        cartItems,
        totalItems,
        totalPrice,
        removeItem,
        clearCart,
        checkout,
      };
    },
  };
</script>
