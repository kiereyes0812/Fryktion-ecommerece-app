<script setup>
import NavbarComponent from './components/NavbarComponent.vue';
import { useGlobalStore } from "./stores/global"; // <<
import { onBeforeMount } from "vue" // <<

export default {
  components: {
    NavbarComponent
  },
  setup() {
    // Access the global store and get the "getUserDetails" action
    const { getUserDetails } = useGlobalStore();

    // Lifecycle hook: runs before the component is mounted on the DOM
    // Here we call "getUserDetails" and pass in the saved email from localStorage
    // This ensures the global store has the user's email even after a page refresh
    onBeforeMount(() => getUserDetails(localStorage.getItem("token")));


    // Every time the app (or a page within it) refreshes or reloads, the components are created again → which means the setup() function is invoked again.
  }

}
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <main>
    <TheWelcome />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
