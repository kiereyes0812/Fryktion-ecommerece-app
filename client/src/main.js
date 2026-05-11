import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import 'notyf/notyf.min.css';
import './assets/main.css';

//"import" statement allows us to use the code/exported modules from other files similar to how we use the "require" function in Node JS.


import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import HomePage from './pages/HomePage.vue';
import ProductsPage from './pages/ProductsPage.vue';
import RegisterPage from './pages/RegisterPage.vue';
import LoginPage from './pages/LoginPage.vue'
// import LogoutPage from './pages/LogoutPage.vue';
// import NewsPage from './pages/NewsPage.vue';
// import ErrorPage from './pages/ErrorPage.vue';
// import ProfilePage from './pages/ProfilePage.vue';
// import EditCoursePage from './pages/EditCoursePage.vue';

// vue-router is a package
// import createRouter and createWebHistory hooks from vue-router
/*

	-createWebHistory() and createRouter() creates a history object based on HTML History API, which allows us to modify the browser URL without triggering a full page refresh. It creates a history object that is passed to the createRouter() function

	-createRouter() function returns a router instance that can be used to navigate between the different routes in the application

*/

import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
	history: createWebHistory(),
	routes: [
	{
		path: '/',
		name: 'Home',
		component: HomePage
	},
	{
		path: '/products',
		name: 'Products',
		component: ProductsPage
	},
	// { 
	// 	path: '/admin/courses/:id/edit', 
	// 	name: 'EditCourse', 
	// 	component: EditCoursePage 
	// },
	{
		path: '/register',
		name: 'Register',
		component: RegisterPage
	},
	{
		path:'/login',
		name: 'Login',
		component: LoginPage
	}
	// {
	//   path: '/logout',
	//   name: 'Logout',
	//   component: LogoutPage
	// },
	// {
	//   path: '/news',
	//   name: 'News',
	//   component: NewsPage
	// },
	// {
	//   path: '/profile',
	//   name: 'Profile',
	//   component: ProfilePage
	// },
	// {
    // path: '/:catchAll(.*)',
    // component: ErrorPage
  	// }   
              
	]
})

const app = createApp(App)

app.use(createPinia())

//app.use() will allow us to use global libraries to our vue application such as router
app.use(router)

//still mounting our vue instance in the specified element in our DOM but this time through a constant
app.mount('#app');

/*
	- Every vue application starts by creating a new application instance with createApp function.

	- The mount method is used to render/inject the root component into the selected element from the DOM by its id.

*/
