<template>
    <div class="feed-container">
      <!-- Search Section -->
      <div class="search-section">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search"
          class="search-input"
        />
       
      </div>
  
      <!-- Feed Section -->
      <div class="grid ">
        <div
          class="grid-item"
          v-for="(item, index) in filteredFeedItems"
          :key="index"
          :class="getImageClass(item.image)"
        >
          <img :src="item.image" :alt="`Feed Image ${index + 1}`" />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        searchQuery: "", 
        feedItems: [
          { image: "portrait1.jpg", tags: ["nature", "portrait"] },
          { image: "landscape1.jpg", tags: ["landscape", "mountains"] },
          { image: "square1.jpg", tags: ["city", "square"] },
          { image: "portrait2.jpg", tags: ["portrait", "people"] },
          { image: "landscape2.jpg", tags: ["landscape", "beach"] },
          { image: "square2.jpg", tags: ["square", "architecture"] },
          { image: "portrait3.jpg", tags: ["portrait", "animals"] },
          { image: "landscape3.jpg", tags: ["landscape", "forest"] },
        ],
      };
    },
    computed: {
      filteredFeedItems() {
        
        if (!this.searchQuery) {
          return this.feedItems; 
        }
        const query = this.searchQuery.toLowerCase();
        return this.feedItems.filter((item) =>
          item.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      },
    },
    methods: {
      getImageClass(imageUrl) {
        
        if (imageUrl.includes("portrait")) {
          return "portrait"; 
        } else if (imageUrl.includes("landscape")) {
          return "landscape"; 
        } else {
          return "square";
        }
      },
      searchImages() {
        // Optional: Add additional logic for searching
        console.log("Searching for:", this.searchQuery);
      },
    },
  };
  </script>
  
  <style scoped>
  .feed-container {
    padding: 20px;
    background: #f0f0f0;
  }
  
  /* Search Section */
  .search-section {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    
  }
  
  .search-input {
    padding: 10px;
    width: 100px;
    border: 1px solid #ccc;
    border-radius: 14px;
    font-size: 16px;
    margin-right: 60px;
    margin-left: auto;
    height:50px
  }
  
  
  
  .grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); 
  
  grid-auto-rows: minmax(150px, auto); 
}



  .grid-item {
    position: relative;
    overflow: hidden;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
  }
  
  .grid-item:hover {
    transform: scale(1.05);
  }
  
  .grid-item img {
    width: 100%;
    height: 100%;
    object-fit: cover; 
  }
  
  
  .landscape {
  grid-column: span 2; /* Landscape images span 2 columns */
}

.portrait {
  grid-row: span 2; /* Portrait images span 2 rows */
}

.square {
  grid-row: span 1;
  grid-column: span 1;
}
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }
  
    .portrait {
      grid-row: span 1; /* Adjust for smaller screens */
    }
  
    .landscape {
      grid-column: span 1; /* Adjust for smaller screens */
    }
  
    .search-section {
      flex-direction: column;
      align-items: center;
    }
  
    .search-input {
      width: 100%;
      margin-right: 0;
      margin-bottom: 10px;
    }
  
    .search-button {
      width: 100%;
    }
  }
  </style>