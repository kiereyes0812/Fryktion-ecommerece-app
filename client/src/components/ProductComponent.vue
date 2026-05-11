<template>
  <div class="row">
    <div
      v-for="product in products"
      :key="product._id"
      class="col-12 col-md-6 col-lg-4 my-3"
    >
      <div
        id="ProductCard"
        class="card p-2 cardHighlights shadow-sm"
        style="min-height: 100%"
      >
        <!-- Product image -->
        <img
          class="card-img-top"
          :src="product.image || `https://placehold.co/600x400/377399/ffffff?font=lora&text=${encodeURIComponent(product.name)}`"
          :alt="product.name"
      >

        <!-- Product details -->
      <div class="card-body d-flex flex-column gap-2">
          <h4 class="card-title fw-bold mb-2">
            {{ product.name }}
          </h4>
          <p class="card-text text-muted mb-2">
            {{ product.description.slice(0, 100) + (product.description.length > 100 ? "..." : "") }}
          </p>
          <p class="mb-1">
            <span class="fw-semibold">Price:</span> PHP {{ product.price }}
          </p>

          <!-- Button -->
          <div class="d-grid d-md-block mt-md-auto">
            <router-link
              class="btn btn-outline-primary d-block"
              :to="{ path: `/products/${product._id}` }"
            >
              View Product
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ProductCard",
  data() {
    return {
      products: [],
    };
  },
  async mounted() {
    try {
      const res = await axios.get("http://localhost:4000/products/active");
      this.products = res.data;
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  },
};
</script>