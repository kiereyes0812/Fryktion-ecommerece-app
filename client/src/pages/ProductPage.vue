<script>
  //import courses data from our file as a mock database.
  import coursesData from '../data/coursesData.js';

  //import axios instance for creating an HTTP request
  import api from '../api.js';
    
  //In Composition API, there are two ways of creating "reactive states".
  //We can use reactive() method to return a reactive state. The reactive() object is used better for objects.
  //ref() also creates a reactive, trackable data within the component but is preferably used for primitive data types.

  //import both ref and reactive methods from vue
  //onMounted() can be used to run a function when the component is mounted.
  import { ref, reactive, onMounted, onBeforeMount, watch } from 'vue';

  import CourseComponent from '../components/CourseComponent.vue';
  // import CourseComponent2 from '../components/CourseComponent2.vue';
  // import CourseComponent3 from '../components/CourseComponent3.vue';
  // import CourseComponent4 from '../components/CourseComponent4.vue';
  // import CourseComponent5 from '../components/CourseComponent5.vue';
  // import CourseComponent6 from '../components/CourseComponent6.vue';

  import UserView from '../components/UserView.vue';
  import AdminView from '../components/AdminView.vue';

  import { useGlobalStore } from '../stores/global.js';

  export default {
    components: {
      CourseComponent,
      UserView,
      AdminView,
          // CourseComponent2,
          // CourseComponent3,
        // CourseComponent4,
        // CourseComponent5,
        // CourseComponent6
    },
      /* 
        The setup() method was introduced in Vue 3 as part of the Composition API. It allows developers to create reusable logic in their components. It is called once, before the component is mounted and returns an object containing the data, methods and other reactive elements that the component needs. 
      */
      setup(){

      const { user } = useGlobalStore();

          //pass the imported coursesData into the reactive() method.
          //reactive will recognize the passed data as an array.
          //reactive() will only accept objects as argument.
          //This will allow us to easily chain a filter method to it.
          //Filter the array to remove courses no longer offered.
          // const courses = reactive(coursesData).filter(item => item.onOffer);

      //Update the courses reactive state to be able to update it.
      const courses = reactive({data:[]})

          //tracks the total number of students and updates when handleEnroll() is run.
          // const total = ref(0)

          //This function will run when the emit method is run in the child component and the custom event is triggered.
          //Adds the value passed from the emit() method in the child component.
          // function handleEnroll(enrollee){
          //  total.value += enrollee
          // }

          //Use onMounted to view the array of courses on the console when the component is mounted.
          onMounted(()=>console.log(courses));

      //Add an onBeforeMount() to retrieve courses before the page is displayed.
      //Add async to the callback function to be able to use await for our axios()
      // onBeforeMount(async () => {

      //  let { data } = await api.get('/courses');

      //  courses.data = data;

      // })

      function removeCourse(id) {
        courses.data = courses.data.filter(c => (c._id ?? c.id) !== id)
      }

      return {
        courses,
        user,
        removeCourse,
        // total,
        // handleEnroll
      }
      

      watch([user], async () => {
        if (!user.isLoading) {
          try {
            if (user.isAdmin) {
              let response = await api.get('/courses/all');
              console.log("Admin courses:", response.data);
              courses.data = response.data;
            } else {
              let response = await api.get('/courses');
              console.log("User courses:", response.data);
              courses.data = response.data;
            }
          } catch (err) {
            console.error("Error fetching courses:", err);
          }
        }
      }, { immediate: true });

          return {
            courses,
        user,
            // total,
            // handleEnroll
          }
      }
  }


</script>

<template>
  <div class="container">
    <!-- <div class="row"> -->
      <!-- <div class="col my-5"> -->
        <!-- <h1 class="text-center text-primary py-1">Courses Offered</h1>
        <p class="text-center">Select a course to enroll in!</p> -->
        <!-- Add double moustaches to render/display the value of the total reactive reference -->
          <!-- When the handleEnroll method is run, the total reactive ref will be updated. -->
          <!-- <h4 class="text-center text-danger pt-4" v-if="total === 60">
              All Classes Full
          </h4>
          <h4 class="text-center text-primary pt-4" v-else>
              Total Number of Students Enrolled:  {{total}}
          </h4> -->
      <!-- </div> -->
    <!-- </div> -->
    <!-- <div class="row g-4"> -->
      <!-- v-for is a vuejs directive that creates an element for each element in the exposed array given -->
          <!-- :courseData is a v-bind directive that allow us to pass each item in the array a prop. -->
          <!-- @<customEmitEvent> - "@enrollment" is a custom event from an emit() in the child component. -->
          <!-- @<event> - is a shortcut to v-on:<event> -->
          <!-- When the emit() method in the child component is run, the custom event here will be triggered. -->
          <!-- <CourseComponent v-for="course in courses" :courseData="course" @enrollment="handleEnroll"/> -->

          <!-- Update v-for, data property contains the array of courses. -->
          <!-- <CourseComponent v-for="course in courses.data" :courseData="course" /> -->

      <!-- 
      <div class="col-md-4">
        <CourseComponent />
      </div>
      <div class="col-md-4">
        <CourseComponent2 />
      </div>
      <div class="col-md-4">
        <CourseComponent3 />
      </div>
      <div class="col-md-4">
        <CourseComponent4 />
      </div>
      <div class="col-md-4">
        <CourseComponent5 />
      </div>
      <div class="col-md-4">
        <CourseComponent6 />
      </div> 
      -->
    <!-- </div> -->
    <p v-if="user.isLoading">Loading...</p>
    <AdminView v-if="user.isAdmin && !user.isLoading" :coursesData="courses.data" @archived="removeCourse"/>
    <UserView v-if="!user.isAdmin && !user.isLoading" :coursesData="courses.data" />
  </div>
</template>