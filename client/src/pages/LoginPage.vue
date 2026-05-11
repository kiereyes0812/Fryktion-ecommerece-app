<script setup>
import { ref, computed, onBeforeMount } from "vue";
import { Notyf } from "notyf";
import { useRouter } from "vue-router";
import { useGlobalStore } from "../stores/global";
import { storeToRefs } from "pinia";
import api from "../api";

const router = useRouter();
const store = useGlobalStore();
const { user } = storeToRefs(store);
const { getUserDetails } = store;

const email = ref("");
const password = ref("");

// ✅ computed replaces watch
const isEnabled = computed(() => email.value !== "" && password.value !== "");

const notyf = new Notyf();

async function handleSubmit() {
  try {
    const res = await api.post("/users/login", {
      email: email.value,
      password: password.value,
    });

    if (res?.data?.access) {
      notyf.success("Login Successful");
      localStorage.setItem("token", res.data.access);

      await getUserDetails(res.data.access);

      email.value = "";
      password.value = "";

      router.push({ path: "/products" });
    }
  } catch (err) {
    console.error(err);
    const status = err?.response?.status;
    const message = err?.response?.data?.message;

    if ([400, 401, 404].includes(status)) {
      notyf.error(message || "Login failed.");
    } else {
      notyf.error("Login Failed. Please contact administrator.");
    }
  }
}

onBeforeMount(() => {
  if (user.email) {
    router.push({ path: "/products" });
  }
});
</script>

<template>
  <div class="container-fluid">
    <h1 class="my-5 pt-3 text-primary text-center">Login Page</h1>
    <div class="row d-flex justify-content-center">
      <div class="col-md-5 border border rounded-3 mx-auto p-5">
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label for="emailInput" class="form-label">Email Address</label>
            <input type="email" class="form-control" id="emailInput" v-model="email" />
          </div>
          <div class="mb-3">
            <label for="passwordInput" class="form-label">Password</label>
            <input type="password" class="form-control" id="passwordInput" v-model="password" />
          </div>
          <div class="d-grid mt-5">
            <button type="submit" class="btn btn-primary btn-block" v-if="isEnabled">
              Login
            </button>
            <button type="submit" class="btn btn-danger btn-block" disabled v-else>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>