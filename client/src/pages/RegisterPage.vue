<script setup>

    //import both watch and ref hooks     
    import { computed, ref, onMounted } from 'vue';
    //import Notyf to allow the use of an alternative notification window.
    import { Notyf } from 'notyf';
    import { useRouter } from 'vue-router';
    import { useGlobalStore } from '../stores/global.js';
    import axios from 'axios';
    import api from "../api";

    //Create a reactive state for each user input
    //We will bind the input to our reactive state

    const firstName = ref("");
    const lastName = ref("");
    const mobileNum = ref("");
    const email = ref("");
    const password = ref("");
    const confirmPass = ref("");

    const notyf = new Notyf();

    const router = useRouter()

    const {user} = useGlobalStore();

    const isEnabled = computed(() => email.value !== "" && password.value !== "");

    async function handleSubmit(e){

        console.log("submitted");

        e.preventDefault();

        try{

            // await axios.post("http://localhost:4000/users/checkEmail", {
            //     email: email.value
            // })]
            console.log("trying...")

            let response = await api.post('/users/register', {
                firstName: firstName.value,
                lastName: lastName.value,
                email: email.value,
                mobileNo: mobileNum.value,
                password: password.value
            })

            console.log(response);

            if(response.status === 201){ // 201 - CREATED

                notyf.success(response.data.message);

                firstName.value = "";
                lastName.value = "";
                mobileNum.value = ""
                email.value = "";
                password.value = "";
                confirmPass.value = "";

                router.push({path: '/login'})
            }
            else {
                notyf.error("Registration failed. Please contact administrator.")
            }
        }
        catch(err){
                
            // Add a check to see if the error is a 404, 401, or 400 status code.
            // If it is, use the notyf.error() method and pass the error message to notify the user of the failed login.
            // These status codes are defined in the our backend API. Any other error code will be considered an unexpected error. 
            // if(err.response.status === 404 || err.response.status === 401 || err.response.status === 400){
            //     notyf.error(err.response.data.message);
            // } else {
                notyf.error("Register Failed. Please contact administrator.");
            // }


        }      
    }

     /* ACTIVITY SOLUTION START */
    onMounted(() => {
      if (user.value?.email) {
        router.push({ path: "/products" });
      }
    });
</script>


<template>
    <div class="container-fluid">
        <h1 class="my-5 pt-3 text-primary text-center">Register Page</h1> 
        <div class="row d-flex justify-content-center">
            <div class="col-md-5 border border rounded-3 mx-auto p-5">
                <form v-on:submit="handleSubmit">

                    <div class="mb-3">
                        <label for="fName" class="form-label">First Name</label>
                        <input type="text" class="form-control" id="fName" v-model="firstName" />
                    </div>
                    <div class="mb-3">
                        <label for="lName" class="form-label">Last Name</label>
                        <input type="text" class="form-control" id="lName" v-model="lastName" />
                    </div>
                    <div class="mb-3">
                        <label for="mobile" class="form-label">Mobile Number</label>
                        <input type="text" class="form-control" id="mobile" v-model="mobileNum" />
                    </div>

                    <div class="mb-3">
                        <label for="emailInput" class="form-label">Email Address</label>
                        <!-- v-bind:value = allows us to bind the value of this input to an exposed variable -->
                        <!-- v-on:input is an event listener directive that allow us to run a given function as the user types in an input. -->
                        <!-- 
                            $event - is the event object which contains information about "what happened" in the element. This event object can be passed into the event listener function for processing.

                            $event.target - is the element where the event happened.
                            $event.target.value - the value of the element where the event happened.

                            email = $event.target.value - update the value of the email state with the current value of the element.
                        -->
                        <!-- v-model is a directive which also allows for binding the value of an element to an exposed variable. However, v-model also automatically adds the current value of the element into the reactive state upon user input-->
                        <input type="email" class="form-control" id="emailInput"
                        v-model="email"
                        />
                    </div>
                    <div class="mb-3">
                        <label for="passwordInput" class="form-label">Password</label>
                        <input type="password" class="form-control" id="passwordInput" 
                        v-model="password"
                        />
                    </div>
                    <div class="mb-3">
                        <label for="cpasswordInput" class="form-label">Confirm Password</label>
                        <input type="password" class="form-control" id="cpasswordInput"  
                        v-model="confirmPass"
                        />
                    </div>
                    <div class="d-grid mt-5">
                        <button type="submit" class="btn btn-primary btn-block" v-if=isEnabled>Submit</button>
                        <button type="submit" class="btn btn-primary btn-block" disabled v-else>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>