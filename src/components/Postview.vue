
<template>
    <div class="post-container">
      
      <div class="flex items-center space-x-3 p-4">
        <img :src="post.userProfileImage" alt="User Profile" class="h-8 w-8 rounded-full" />
        <span class="font-semibold">{{ post.userName }}</span>
      </div>

      <img :src="post.url" alt="Post Image" class="w-full" />
  
    
      <div class="flex justify-between p-4">
        <div class="flex space-x-10">
          <button>
            <img src="../../public/like.png" alt="Like" class="h-6 w-6" />
          </button>
          <button>
            <img src="../../public/chat-bubble.png" alt="Comment" class="h-6 w-6" />
          </button>
        </div>
        <button>
          <img src="../../public/share.png" alt="Share" class="h-6 w-6" />
        </button>
      </div>
  
      <!-- Post Caption -->
      <div class="p-4">
        <p class="text-sm">{{ post.caption }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Post',
    props: {
      post: {
        type: Object,
        required: true
      }
    },
    method:{

    }
  }
  </script>
  
  <style scoped>
  .post-container {
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 16px;
  }
  </style>