<template>
  <div class="container mt-5">
    <h1 class="text-center mb-4">Furniture Store</h1>

    <div class="row mb-4">
      <div class="col-md-4">
        <select v-model="sortBy" class="form-control">
          <option value="">Sort by</option>
          <option value="price">Price</option>
          <option value="quantity">Stock</option>
        </select>
      </div>

      <div class="col-md-4">
        <select v-model="filter" class="form-control">
          <option value="">Filter by Type</option>
          <option value="Desk">Desk</option>
          <option value="Chair">Chair</option>
          <option value="Sofa">Sofa</option>
          <option value="Wardrobe">Wardrobe</option>
          <option value="Armchair">Armchair</option>
        </select>
      </div>

      <div class="col-md-4">
        <input
          v-model="searchQuery"
          type="text"
          class="form-control"
          placeholder="Search for furniture..." />
      </div>
    </div>

    <div class="row">
      <div v-if="loading" class="col-12 text-center">
        <p>Loading furniture...</p>
      </div>

      <div v-if="filteredFurnitureList.length === 0" class="col-12 text-center">
        <p>No furniture available.</p>
      </div>

      <div
        v-for="furniture in filteredFurnitureList"
        :key="furniture.id"
        class="col-md-4 mb-4">
        <router-link
          :to="{ name: 'FurnitureItem', params: { id: furniture.id } }"
          class="card shadow-sm"
          style="text-decoration: none; color: inherit">
          <img
            :src="
              (furniture.images && furniture.images[0]?.image_url) ||
              'default_image_url.jpg'
            "
            class="card-img-top"
            :alt="
              (furniture.images && furniture.images[0]?.alt_text) ||
              'Furniture image'
            " />
          <div class="card-body">
            <h5 class="card-title">{{ furniture.name }}</h5>
            <p class="card-text">Price: ${{ furniture.price }}</p>
            <p class="card-text">Stock: {{ furniture.quantity }}</p>
          </div>
        </router-link>
        <button
          @click.stop="addToCart(furniture)"
          class="btn btn-primary w-100 mb-0 mt-2">
          Add to Cart
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import { useCartStore } from '../storage/cartStore';

  export default {
    name: 'MyHome',
    data() {
      return {
        furnitureList: [],
        searchQuery: '',
        filter: '',
        sortBy: '',
        loading: false,
      };
    },
    computed: {
      filteredFurnitureList() {
        let filteredList = this.furnitureList;
        if (this.filter) {
          filteredList = filteredList.filter((furniture) =>
            furniture.type.toLowerCase().includes(this.filter.toLowerCase())
          );
        }
        if (this.searchQuery) {
          filteredList = filteredList.filter((furniture) =>
            furniture.name
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase())
          );
        }
        if (this.sortBy) {
          filteredList = filteredList.sort((a, b) => {
            if (this.sortBy === 'price') {
              return parseFloat(a.price) - parseFloat(b.price);
            } else if (this.sortBy === 'quantity') {
              return a.quantity - b.quantity;
            }
            return 0;
          });
        }

        return filteredList;
      },
    },
    mounted() {
      this.fetchFurnitureData();
    },
    methods: {
      async fetchFurnitureData() {
        this.loading = true;
        try {
          const response = await axios.get('http://localhost:3001/furniture');
          if (response.data && response.data.furnitureItems) {
            this.furnitureList = response.data.furnitureItems;
          } else {
            console.error(
              'Error fetching furniture data:',
              response.data.message
            );
          }
        } catch (error) {
          console.error('Error fetching furniture data:', error);
        } finally {
          this.loading = false;
        }
      },

      addToCart(furniture) {
        const cartStore = useCartStore();
        const existingItem = cartStore.items.find(
          (item) => item.id === furniture.id
        );

        if (existingItem) {
          if (existingItem.quantity < furniture.quantity) {
            existingItem.quantity++;
          } else {
            alert('No more items available in stock.');
          }
        } else {
          cartStore.addToCart({
            id: furniture.id,
            name: furniture.name,
            price: furniture.price,
            quantity: 1,
          });
        }

        alert(`${furniture.name} added to cart!`);
        console.log(`${furniture.name} has been added to the cart.`);
      },
    },
  };
</script>

<style scoped>
  .card {
    cursor: pointer;
    transition: transform 0.2s ease-in-out;
  }

  .card:hover {
    transform: scale(1.05);
  }
  .loading {
    text-align: center;
  }
</style>
