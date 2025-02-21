<template>
    <div class="flex flex-row space-x-4 p-4 bg-white">
      
      <div v-for="(story, index) in stories" :key="index" class="flex flex-col items-center">
        <div
          class="h-16 w-16 rounded-full border-4 p-1"
          :class="{
            'border-blue-400': index === 0, 
            'border-gray-300': index !== 0 
          }"
        >
          <img :src="story.image" :alt="story.name" class="h-full w-full rounded-full" />
        </div>
        <span class="text-sm text-gray-600 mt-1">{{ story.name }}</span>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Sec',
    data() {
      return {
        stories: [
          { name: '', image: 'https://via.placeholder.com/150' }, 
          { name: '', image: 'https://via.placeholder.com/150' },
          { name: '', image: 'https://via.placeholder.com/150' },
          { name: '', image: 'https://via.placeholder.com/150' },
        ],
      };
    },
  };
  </script>