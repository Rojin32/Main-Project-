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
    <div class="grid">
      <div
        class="grid-item"
        v-for="(post, index) in filteredPosts"
        :key="index"
        :class="getImageClass(post.url)"
      >
        <img :src="post.url" :alt="`Feed Image ${index + 1}`"  class="w-4 h-4"/>
        <!--  -->
      </div>
    </div>
  </div>
</template>

<script>
import { getFirestore, collection, getDocs } from "firebase/firestore";

export default {
  data() {
    return {
      searchQuery: "", // Search query for filtering
      posts: [], // Array to store fetched posts
    };
  },
  computed: {
    // Filter posts based on search query
    filteredPosts() {
      if (!this.searchQuery) {
        return this.posts; // Return all posts if no search query
      }
      const query = this.searchQuery.toLowerCase();
      return this.posts.filter((post) =>
        post.description.toLowerCase().includes(query) ||
        post.location.toLowerCase().includes(query)
      );
    },
  },
  methods: {
    // Determine the class for the image based on its URL
    getImageClass(imageUrl) {
      if (imageUrl.includes("portrait")) {
        return "portrait"; // Portrait images span 2 rows
      } else if (imageUrl.includes("landscape")) {
        return "landscape"; // Landscape images span 2 columns
      } else {
        return "square"; // Square images span 1 row and 1 column
      }
    },
    // Fetch posts from Firestore
    async fetchPosts() {
      try {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, "post"));
        this.posts = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Optional: Include document ID
          ...doc.data(), // Spread the document data (url, description, location, etc.)
        }));
        console.log(this.posts)
      } catch (error) {
        console.log("error")
        console.error("Error fetching posts:", error);
      }
    },
    // Format timestamp to a readable date
    formatTimestamp(timestamp) {
      if (!timestamp) return "Unknown Date";
      const date = timestamp.toDate(); // Convert Firestore timestamp to JavaScript Date
      return date.toLocaleString(); // Format as a readable string
    },
  },
  // Fetch posts when the component is mounted
  mounted() {
    this.fetchPosts();
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
  height: 50px;
}

/* Grid Layout */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  grid-auto-rows: minmax(150px, auto);
}

.grid-item {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.275);
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

/* Post Info */
.post-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  text-align: left;
}

.post-info p {
  margin: 5px 0;
}

.description {
  font-size: 14px;
  font-weight: bold;
}

.location,
.timestamp,
.author {
  font-size: 12px;
}

/* Image Classes */
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
}
</style>