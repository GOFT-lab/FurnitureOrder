<template>
  <div v-if="furniture" class="furniture-item container mt-5">
    <div class="row">
      <div class="col-md-6">
        <div class="image-gallery">
          <img
            :src="selectedImage || defaultImageUrl"
            class="main-image img-fluid"
            :alt="furniture.name" />
          <div class="thumbnail-gallery">
            <img
              v-for="(image, index) in furniture.images"
              :key="index"
              :src="image.image_url"
              class="thumbnail"
              :alt="image.alt_text || 'Thumbnail image'"
              @click="selectImage(image.image_url)" />
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <h2>{{ furniture.name }}</h2>
        <p class="price">Price: ${{ furniture.price }}</p>
        <p class="stock">Stock: {{ furniture.quantity }}</p>
        <p class="description">{{ furniture.description }}</p>
        <button class="btn btn-primary" @click="addToCart">Add to Cart</button>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Loading furniture details...</p>
  </div>
</template>

<script>
  import axios from 'axios';
  import { useCartStore } from '../storage/cartStore';

  export default {
    name: 'FurnitureItem',
    data() {
      return {
        furniture: null,
        selectedImage: '',
        defaultImageUrl: 'https://via.placeholder.com/500',
      };
    },
    mounted() {
      this.fetchFurnitureData();
    },
    methods: {
      async fetchFurnitureData() {
        try {
          const furnitureId = this.$route.params.id;

          const response = await axios.get(
            `http://localhost:3001/furniture/${furnitureId}`
          );

          console.log('Furniture data:', response.data.furniture);

          this.furniture = response.data.furniture;

          if (
            this.furniture &&
            this.furniture.images &&
            this.furniture.images.length > 0
          ) {
            this.selectedImage = this.furniture.images[0].image_url;
          } else {
            this.selectedImage = this.defaultImageUrl;
          }
        } catch (error) {
          console.error('Error fetching furniture data:', error);
          this.furniture = null;
        }
      },
      selectImage(imageUrl) {
        this.selectedImage = imageUrl;
      },
      addToCart() {
        const cartStore = useCartStore();
        const existingItem = cartStore.items.find(
          (item) => item.id === this.furniture.id
        );
        if (existingItem) {
          if (existingItem.quantity < this.furniture.quantity) {
            cartStore.addToCart({
              id: this.furniture.id,
              name: this.furniture.name,
              price: this.furniture.price,
              quantity: 1,
            });
          } else {
            alert('No more items available in stock.');
          }
        } else {
          cartStore.addToCart({
            id: this.furniture.id,
            name: this.furniture.name,
            price: this.furniture.price,
            quantity: 1,
          });
        }

        alert(`${this.furniture.name} added to cart!`);
        console.log(`${this.furniture.name} has been added to the cart.`);
      },
    },
  };
</script>

<style scoped>
  .furniture-item {
    margin-top: 50px;
  }

  .image-gallery {
    margin-bottom: 20px;
  }

  .thumbnail-gallery {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }

  .thumbnail {
    width: 50px;
    height: 50px;
    cursor: pointer;
  }

  .price,
  .stock,
  .description {
    font-size: 18px;
  }

  button {
    margin-top: 20px;
  }
</style>
