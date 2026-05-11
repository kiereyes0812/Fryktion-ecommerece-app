
<script>
  // To be able to add a component into another component, in the script block, import the component 
  // The name of the component is the name of the file by default.
  // Add export default {} to be able to add the imported component in the root component.
  // import BannerComponent from './components/BannerComponent.vue';
  import NavbarComponent from './components/NavbarComponent.vue';
  import FooterComponent from './components/FooterComponent.vue';
  import ProductComponent from './components/ProductComponent.vue';
  import { useGlobalStore } from "./stores/global"; // <<
  import { onBeforeMount } from "vue" // <<
  


  export default {
    components: {
      // BannerComponent,
      NavbarComponent,
      ProductComponent,
      FooterComponent
      /* ACTIVITY SOLUTION END */
    },
    setup() { // <<
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

<!-- Template: A block of HTML-like code that defines the structure of the component. -->
<template>
  <NavbarComponent />
  <!-- Banner component can be rendered in the page after import as its own html-like tag. -->
  <!-- <BannerComponent /> -->
  <!-- 
      <router-view> is a Vue router component that is used to display the component associated with the current route.

      when a user navigates to a different route, vue router displays the component associated with the route inside the <router-view> component.

   -->
  <router-view/>
  <FooterComponent/>

</template>

<!-- Style: A block of CSS code that defines the styling of the component. -->
<style scoped>
</style>