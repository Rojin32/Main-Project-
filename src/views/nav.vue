<template>
    <div class="flex flex-col min-h-screen bg-gray-50"> 
      
      <div class="bg-white">
        <!-- Top Navbar -->
        <nav>
          <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <!-- Logo and Text -->
            <a href="#" class="flex items-center space-x-3 rtl:space-x-reverse">
              <img src="../../public/Logo1.png" class="h-13 w-10" alt="Logo" />
              <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"></span>
            </a>
  
            <!-- Icons on the Right -->
            <div class="flex items-center space-x-6 ml-auto">
              
              
  
              <!-- Icon 2 -->
              <a href="https://www.profile.com">
                <img src="../../public/notification.png" alt="Notification Icon" class="h-5 w-5" />
              </a>
  
              <!-- Icon 3 -->
              <a href="https://www.settings.com">
                <img src="../../public/set.png" alt="Settings Icon" class="h-5 w-5" />
              </a>
            </div>
          </div>
        </nav>
  
        <!-- Story Section -->
        <div class="p-4"> <!-- Add padding for spacing -->
          <story></story>
        </div>
      </div>
  
      <!-- Bottom Navigation Bar -->
      <nav class="fixed bottom-0 left-0 right-0 bg-white shadow-md py-4 h-17 flex justify-between items-center px-10 rounded-t-xl">
        <div class="flex flex-col items-center cursor-pointer">
          <img src="../../public/home.png" alt="Profile" class="h-5 w-5 rectangle-full" />
          <span class="text-xs text-gray-1000"></span>
        </div>
  
        <!-- Chats -->
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
  
        
        <div class="flex flex-col items-center cursor-pointer">
          <img src="../../public/set.png" alt="Profile" class="h-6 w-6 rounded-full" />
          <span class="text-xs text-gray-1000"></span>
        </div>
      </nav>
  
      
      <button class="fixed bottom-16 right-4 bg-blue-400 hover:bg-gray-700 text-white rounded-full p-4 shadow-lg" onclick="window.location.href='/PostPage'">
        <img src="../../public/post.png" alt="Post" class="w-6 h-6">
      </button>
    </div>
  </template>
  <script>
import story from "../components/story.vue"

export default{
    name:'first',
    components:{
        story
    }
}
</script>
