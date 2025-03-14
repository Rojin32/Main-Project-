<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold text-center mb-6">Admin Login</h2>
  
        <form @submit.prevent="loginAdmin">
          <div class="mb-4">
            <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              v-model="username"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
  
          <div class="mb-4">
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              v-model="password"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
  
          <button
            type="submit"
            class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
  
        <p v-if="errorMessage" class="text-red-500 text-sm mt-4 text-center">{{ errorMessage }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "AdminLogin",
    data() {
      return {
        username: "",
        password: "",
        errorMessage: "",
        adminCredentials: {
          username: "admin", 
          password: "admin123",
        },
      };
    },
    methods: {
      loginAdmin() {
        if (
          this.username === this.adminCredentials.username &&
          this.password === this.adminCredentials.password
        ) {
          alert("Login successful!");
          this.$router.push("/AdminDashboard");
        } else {
          this.errorMessage = "Invalid username or password. Please try again.";
        }
      },
    },
  };
  </script>
  
 