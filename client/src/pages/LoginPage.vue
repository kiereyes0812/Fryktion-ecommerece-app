<script setup>

    import { watch, ref, onBeforeMount } from 'vue';
    import { Notyf } from 'notyf'; 
    import { useGlobalStore } from '../stores/global'; // <<
    import { useRouter } from 'vue-router'; // <<
    import axios from 'axios';
    import api from "../api";

    const router = useRouter() // <<
    const {getUserDetails, user} = useGlobalStore(); // <<
   
    const firstName = ref('')
    const lastName  = ref('')
    const mobileNo  = ref('')
    const email = ref("");
    const password = ref("");
    const isEnabled = ref(false);

    const notyf = new Notyf();

    watch([email,password], (currentValue, oldValue) => {

        if(currentValue.every(input => input !== "")){
            isEnabled.value = true
        } else {
            isEnabled.value = false
        }
    });

        async function handleSubmit(e){
            e.preventDefault();

            try {

                /*

                    let res = await axios({
                        method: 'post',
                        url: 'http://localhost:4000/users/login',
                        data: {
                            email: email.value,
                            password: password.value
                        }
                    });
                */

                    let res = await api.post('/users/login', {
                        email: email.value,
                        password: password.value
                    })


                    console.log(res);


                    if(res.data){
                        notyf.success("Login Successful");
                        localStorage.setItem("token", res.data.access);   

                    /*
                        localStorage.setItem("email", email.value);
                        update global store with token
                    */

                        getUserDetails(res.data.access);

                        email.value = "";
                        password.value = "";

                        router.push({ path: '/courses' });
                    }
                }
            catch(err){
                console.log(err);
                // Add a check to see if the error is a 404, 401, or 400 status code.
                // If it is, use the notyf.error() method and pass the error message to notify the user of the failed login.
                // These status codes are defined in the our backend API. Any other error code will be considered an unexpected error. 
                if(err.response.status === 404 || err.response.status === 401 || err.response.status === 400){
                    notyf.error(err.response.data.message);
                } else {
                    notyf.error("Login Failed. Please contact administrator.");
                }
                


            }

            
        }

    onBeforeMount(()=> {
        if(user.email){
            router.push({path: "/courses"})
        }
    })

    onMounted(async () => {
      // Ensure user details are loaded from token, if not yet loaded
      await store.getUserDetails(store.user.token)

      // Pre-fill form from store/user details if provided by backend
      // (fallbacks keep it robust if backend doesn’t return these yet)
      firstName.value = store.user.firstName || ''
      lastName.value  = store.user.lastName  || ''
      mobileNo.value  = store.user.mobileNo  || ''
      email.value     = store.user.email     || ''
    })
    
</script>

<template>
	<div class="container-fluid">
	    <h1 class="my-5 pt-3 text-primary text-center">Login Page</h1> 
	    <div class="row d-flex justify-content-center">
	        <div class="col-md-5 border border rounded-3 mx-auto p-5">
	            <form v-on:submit="handleSubmit">
	                <div class="mb-3">
	                    <label for="emailInput" class="form-label">Email Address</label>
	                    <input type="email" class="form-control" id="emailInput" v-model="email" />
	                </div>
	                <div class="mb-3">
	                    <label for="passwordInput" class="form-label">Password</label>
	                    <input type="password" class="form-control" id="passwordInput" v-model="password" />
	                </div>
	                <div class="d-grid mt-5">
	                	<button type="submit" class="btn btn-primary btn-block"  v-if="isEnabled">Login</button>
                		<button type="submit" class="btn btn-danger btn-block" disabled v-else>Login</button>
	                </div>
	            </form>
	        </div>
	    </div>
    </div>
</template>
<!-- ACTIVITY SOLUTION END -->