<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="w-full max-w-sm bg-white shadow-xl rounded-lg p-5 m-2">
        <h2 class="text-2xl font-bold text-center text-gray-700 mb-6">Username</h2>
        <div class="mb-6">
          <label for="username" class="block text-gray-700 font-medium mb-2">UserName</label>
          <input
            type="text"
            id="username"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter your username"
          />
        </div>
        <div>
          <a href="/first">
          <button
            type="button"
            class="w-full px-4 py-3 text-white bg-blue-500 hover:bg-blue-500 rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
          >
            Create Account
          </button>
        </a>
          </div>
         </div>
         </div>
         </template>
  
  
  <style scoped>
 
  </style>
  
  
  <style scoped>
 
  </style>
<script>
export default{
    name:'user'
}
</script>