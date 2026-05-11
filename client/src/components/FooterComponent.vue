<!-- src/components/AppFooter.vue -->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  companyName: { type: String, default: 'Fryktion Training Supply' },
  // Optional quick links (shown if provided)
  links: {
    type: Array,
    default: () => ([
      { name: 'Home', to: { name: 'Home' } },
      { name: 'Products', to: { name: 'Products' } },
      { name: 'Register', to: { name: 'Register' } },
      { name: 'Login', to: { name: 'Login' } },
    ])
  },
  // Optional social links (set only those you use)
  social: {
    type: Object,
    default: () => ({
      facebook: '',
      instagram: '',
      twitter: '',
      github: ''
    })
  }
})

const year = computed(() => new Date().getFullYear())
</script>

<template>
  <footer class="mt-auto bg-light border-top">
    <div class="container py-4">
      <!-- top row -->
      <div class="row g-3 align-items-start">
        <div class="col-12 col-md-4">
          <h6 class="mb-2 text-uppercase text-muted">About</h6>
          <p class="mb-0 text-muted small">
            {{ companyName }} provides training gear and supplies. Quality first,
            fast shipping, and friendly support.
          </p>
          <!-- Slot for anything extra (badges, payment icons, trust seals, etc.) -->
          <slot name="about-extra" />
        </div>

        <div class="col-6 col-md-4">
          <h6 class="mb-2 text-uppercase text-muted">Quick Links</h6>
          <nav aria-label="Footer">
            <ul class="nav flex-column gap-1">
              <li v-for="l in links" :key="l.name" class="nav-item">
                <router-link class="nav-link p-0 link-dark" :to="l.to">
                  {{ l.name }}
                </router-link>
              </li>
            </ul>
          </nav>
        </div>

        <div class="col-6 col-md-4">
          <h6 class="mb-2 text-uppercase text-muted">Follow</h6>
          <div class="d-flex gap-3">
            <a v-if="social.facebook" :href="social.facebook" target="_blank" rel="noopener" aria-label="Facebook" class="link-dark fs-5">
              <i class="bi bi-facebook"></i>
            </a>
            <a v-if="social.instagram" :href="social.instagram" target="_blank" rel="noopener" aria-label="Instagram" class="link-dark fs-5">
              <i class="bi bi-instagram"></i>
            </a>
            <a v-if="social.twitter" :href="social.twitter" target="_blank" rel="noopener" aria-label="Twitter / X" class="link-dark fs-5">
              <i class="bi bi-twitter-x"></i>
            </a>
            <a v-if="social.github" :href="social.github" target="_blank" rel="noopener" aria-label="GitHub" class="link-dark fs-5">
              <i class="bi bi-github"></i>
            </a>
          </div>
        </div>
      </div>

      <hr class="my-4">

      <!-- bottom row -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
        <span class="text-muted small">
          © {{ year }} {{ companyName }}. All rights reserved.
        </span>
        <div class="d-flex align-items-center gap-3 small">
          <router-link class="link-dark text-decoration-none" :to="{ name: 'Home' }">Terms</router-link>
          <router-link class="link-dark text-decoration-none" :to="{ name: 'Home' }">Privacy</router-link>
          <slot name="legal-extra" />
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Optional: make links show subtle underline on hover */
.link-dark:hover { text-decoration: underline; }
</style>
