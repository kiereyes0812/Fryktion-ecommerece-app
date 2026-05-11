<template>
  <div class="container py-5">
    <h2 class="mb-4">Active Products</h2>
    <!-- Use ProductComponent here -->
    <ProductComponent />
  </div>
</template>

<script>
import ProductComponent from "../components/ProductComponent.vue"

export default {
  name: "ProductPage",
  components: {
    ProductComponent,
  },
}
</script>

<!-- <script setup>
import ProductComponent from "@/components/ProductComponent.vue"
</script> -->