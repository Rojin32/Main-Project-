<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Top Navbar -->
    <nav>
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="#" class="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="../../public/Logo1.png" class="h-13 w-10" alt="Logo" />
          <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"></span>
        </a>
        <div class="flex items-center space-x-6 ml-auto">
          <a href="https://www.profile.com">
            <img src="../../public/notification.png" alt="Notification Icon" class="h-5 w-5" />
          </a>
          <a href="https://www.settings.com">
            <img src="../../public/set.png" alt="Settings Icon" class="h-5 w-5" />
          </a>
        </div>
      </div>
    </nav>

    <!-- Story Section -->
    <div class="p-4">
      <story></story>
    </div>

    <!-- Posts Section -->
    <div class="flex-1 overflow-y-auto p-4">
      <template v-for="post in posts" :key="post.id">
        <Post :post="post" />

      </template>
    </div>

    <!-- Bottom Navigation Bar -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white shadow-md py-4 h-17 flex justify-between items-center px-10 rounded-t-xl">
      <div class="flex flex-col items-center cursor-pointer">
        <img src="../../public/home.png" alt="Profile" class="h-5 w-5 rectangle-full" />
        <span class="text-xs text-gray-1000"></span>
      </div>
      <a href="/feed">
        <div class="flex flex-col items-center cursor-pointer">
          <img src="../../public/search.png" alt="Profile" class="h-5 w-5 rectangle-full" />
          <span class="text-xs text-gray-1000"></span>
        </div>
      </a>
      <a href="/message">
        <div class="flex flex-col items-center cursor-pointer">
          <img src="../../public/chat.png" alt="Profile" class="h-5 w-5 rectangle-full" />
          <span class="text-xs text-gray-1000"></span>
        </div>
      </a>
      <a href ="/Profile">
      <div class="flex flex-col items-center cursor-pointer">
        <img src="../../public/user.png" alt="Profile" class="h-6 w-6 rounded-full" />
        <span class="text-xs text-gray-1000"></span>
      </div>
      </a>
    </nav>

    <!-- Floating Post Button -->
    <button class="fixed bottom-16 right-4 bg-blue-400 hover:bg-gray-700 text-white rounded-full p-4 shadow-lg" onclick="window.location.href='/PostPage'">
      <img src="../../public/post.png" alt="Post" class="w-6 h-6">
    </button>
  </div>
</template>

<script>
import { collection, getDocs } from "firebase/firestore";
import { db } from '../config';
import story from "../components/story.vue";
import Post from "../components/Postview.vue";

export default {
  name: "first",
  components: {
    story,
    Post,
  },
  data() {
    return {
      posts: [], 
    };
  },
  async created() {
    
    await this.fetchPosts();
  },
  methods: {
    async fetchPosts() {
      try {
        const querySnapshot = await getDocs(collection(db, "post"));
        this.posts = querySnapshot.docs.map((doc) => ({
          id: doc.authorId,
          ...doc.data(), 
        }));
        console.log(this.posts)
      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    },
  },
};
</script>