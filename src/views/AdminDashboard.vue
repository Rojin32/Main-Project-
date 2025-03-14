<template>
    <div class="flex min-h-screen bg-gray-100">
      <!-- Sidebar -->
      <div class="w-64 bg-blue-900 text-white p-6 space-y-6">
        <h2 class="text-2xl font-bold">Admin Panel</h2>
        <ul class="space-y-4">
          <li class="cursor-pointer p-2 hover:bg-blue-700 rounded" @click="selectedTab = 'dashboard'">Dashboard</li>
          <li class="cursor-pointer p-2 hover:bg-blue-700 rounded" @click="selectedTab = 'users'">Users List</li>
          <li class="cursor-pointer p-2 hover:bg-blue-700 rounded" @click="selectedTab = 'banned'">Banned Accounts</li>
        </ul>
      </div>
  
      <!-- Main Content -->
      <div class="flex-1 p-6">
        <!-- Dashboard -->
        <div v-if="selectedTab === 'dashboard'">
          <h2 class="text-2xl font-bold mb-4">Admin Dashboard</h2>
  
          <!-- First Row: Total Users & Active Users -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="p-4 bg-blue-500 text-white rounded-lg text-center">
              <h3 class="text-lg font-semibold">Total Users</h3>
              <p class="text-2xl font-bold">{{ totalUsers }}</p>
            </div>
            <div class="p-4 bg-green-500 text-white rounded-lg text-center">
              <h3 class="text-lg font-semibold">Active Users</h3>
              <p class="text-2xl font-bold">{{ activeUsers }}</p>
            </div>
          </div>
  
          <!-- Second Row: Banned Accounts & Total Posts -->
          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 bg-red-500 text-white rounded-lg text-center">
              <h3 class="text-lg font-semibold">Banned Accounts</h3>
              <p class="text-2xl font-bold">{{ bannedUsers }}</p>
            </div>
            <div class="p-4 bg-purple-500 text-white rounded-lg text-center">
              <h3 class="text-lg font-semibold">Total Posts</h3>
              <p class="text-2xl font-bold">{{ totalPosts }}</p>
            </div>
          </div>
        </div>
  
        <!-- Users List -->
<div v-if="selectedTab === 'users'">
  <h3 class="text-xl font-semibold mb-3">Users List</h3>
  <table class="w-full border border-gray-300">
    <thead>
      <tr class="bg-gray-200">
        <th class="border p-2">Username</th>
        <th class="border p-2">Email</th>
        <th class="border p-2">Status</th>
        <th class="border p-2">Actions</th> <!-- Moved to the last column -->
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in users" :key="user.id">
        <td class="border p-2">{{ user.username }}</td>
        <td class="border p-2">{{ user.email }}</td>
        <td class="border p-2 text-green-500">Active</td>
        <td class="border p-2 text-center">
          <button
            v-if="!user.isBanned"
            class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
            @click="banUser(user.id)"
          >
            Ban
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
  <!-- Banned Accounts -->
<div v-if="selectedTab === 'banned'">
  <h3 class="text-xl font-semibold mb-3">Banned Accounts</h3>
  <table class="w-full border border-gray-300">
    <thead>
      <tr class="bg-gray-200">
        <th class="border p-2">Username</th>
        <th class="border p-2">Email</th>
        <th class="border p-2">Status</th>
        <th class="border p-2">Actions</th> <!-- Added Unban button column -->
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in bannedUsersList" :key="user.id">
        <td class="border p-2">{{ user.username }}</td>
        <td class="border p-2">{{ user.email }}</td>
        <td class="border p-2 text-red-500">Banned</td>
        <td class="border p-2 text-center">
          <button
            class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700"
            @click="unbanUser(user.id)"
          >
            Unban
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>

      </div>
    </div>
  </template>
  
  <script>
  import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
  import { db } from "../config"; // Firebase config
  
  export default {
    name: "AdminDashboard",
    data() {
      return {
        selectedTab: "dashboard",
        users: [],
        totalUsers: 0,
        activeUsers: 0,
        bannedUsers: 0,
        totalPosts: 0,
        bannedUsersList: [],
      };
    },
    async created() {
      await this.fetchUsers();
      await this.fetchTotalPosts();
    },
    methods: {
  async fetchUsers() {
    try {
      const querySnapshot = await getDocs(collection(db, "UserDetailes"));
      const userList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      this.totalUsers = userList.length;
      this.bannedUsersList = userList.filter((user) => user.isBanned);
      this.bannedUsers = this.bannedUsersList.length;
      this.activeUsers = this.totalUsers - this.bannedUsers;
      this.users = userList.filter((user) => !user.isBanned);
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  },

  async banUser(userId) {
    try {
      console.log("Banning user:", userId);
      const userRef = doc(db, "UserDetailes", userId);
      await updateDoc(userRef, { isBanned: true });

      await this.fetchUsers();
      console.log("User banned successfully");
    } catch (error) {
      console.error("Error banning user:", error);
    }
  },

  async unbanUser(userId) {
    try {
      console.log("Unbanning user:", userId);
      const userRef = doc(db, "UserDetailes", userId);
      await updateDoc(userRef, { isBanned: false });

      await this.fetchUsers(); 
      console.log("User unbanned successfully");
    } catch (error) {
      console.error("Error unbanning user:", error);
    }
  }
}
  }
</script>