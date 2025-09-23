//A store is a container for managing the state of an app. 
//It is a reactive object and holds the application's data and has methods used for updating and accessing that data. 
//Stores are defined using the defineStore() function and can be registered globally or locally within a component.
import { defineStore } from 'pinia';
import { reactive } from 'vue';
import axios from 'axios'; // <<
//defineStore() creates a store. It has 2 arguments, the unique id of the store and the callback function that defines and returns the states and actions of the store.
//States and methods from a store can be accessed globally.
//export useGlobalStore to other files. When we need access to our global state and methods, we will be able to use the useGlobalStore method to create an instance of our global store.
export const useGlobalStore = defineStore('global',() => {
	//user will be our global reactive object/state that can be updated and used in different parts/components of our application.
	//this will contain the user's details which can be used by other components in the app.
	let user = reactive({
		token: localStorage.getItem('token'), // << 
		email: null,
		isAdmin: null,
		firstName: null,
	    lastName: null,
	    mobileNo: null,
	})

	async function getUserDetails(token){
        
        if(!token) {
			user.token = null;
		  	user.email = null;
        	user.isAdmin = null;
        	user.firstName = null;
			user.lastName = null;
    		user.mobileNo = null;
        	return;
    	}

        let {data} = await axios({
            method: 'get',
            url: 'http://localhost:4000/users/details',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });


        console.log(data);

		user.token = token;
        user.email = data.email;
        user.isAdmin = data.isAdmin;
        user.firstName = data.firstName;
	    user.lastName = data.lastName;
	    user.mobileNo = data.mobileNo;
        
    }


	//We can add a function/action that allows us to update the global state
	//This can be done in the components that uses the state. However, adding/defining the action within the store itself, makes our code more efficient, as we don't have to repeat this definition in the components.
	//getUserDetails() receives the user's email as an argument and updates our state's email property.
	// function getUserDetails(email){
	//   user.email = email;
	// }


	//when useGlobalStore() is used in our application, it will return an object that contains the global state and actions.
	return {
		user,
		getUserDetails
	}
})
