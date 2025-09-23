<!-- ACTIVITY SOLUTION START -->
<script>
  import BannerComponent from '../components/BannerComponent.vue';
  import HighlightsComponent from '../components/HighlightsComponent.vue';

  export default {
    components: {
      BannerComponent,
      HighlightsComponent
    },
    data() {
      return {
         /* ACTIVITY SOLUTION START */
          bannerProps: {
            title: "Zuitt Course Booking System",
            tagline: "Opportunities for everyone, everywhere.",
            destination: "Courses",
            buttonLabel: "View Our Courses"
          }
          /* ACTIVITY SOLUTION END */
      };
    }


  }
</script>

<template>
  <div class="container-fluid">

    <!-- Values can be passed as props using HTML-like attributes. This custom attribute name must be the same as the name of the props defined in the child component -->
    <!-- :props-name=value - is called v-bind directive which will allow us to pass objects as props. -->
    <BannerComponent :bannerProps=bannerProps />
    <HighlightsComponent />
  </div>
</template>
<!-- ACTIVITY SOLUTION END -->