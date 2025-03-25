<template>
  <div class="feed-container">
    <!-- Search Section -->
    <div class="search-section">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search for posts or profiles..."
        class="search-input"
      />
      <div class="search-buttons">
        <button @click="setSearchMode('feed')" :class="{ active: searchMode === 'feed' }">Feed</button>
        <button @click="setSearchMode('profile')" :class="{ active: searchMode === 'profile' }">Profiles</button>
      </div>
    </div>

    <!-- Profile Search Results -->
    <div v-if="searchMode === 'profile' && showProfileResults" class="profile-results">
      <div
        v-for="profile in filteredProfiles"
        :key="profile.userId"
        class="profile-card"
        @click="navigateToProfile(profile.userId)"
      >
        <img :src="profile.profilePicture" alt="Profile Picture" class="profile-picture" />
        <div class="profile-info">
          <h3>{{ profile.name }}</h3>
          <p>@{{ profile.username }}</p>
        </div>
      </div>
    </div>

    <!-- Feed Section -->
    <div v-else-if="searchMode === 'feed'" class="grid">
      <div
        class="grid-item"
        v-for="(post, index) in filteredPosts"
        :key="index"
        :class="getImageClass(post.url)"
      >
        <img :src="post.url" :alt="`Feed Image ${index + 1}`" class="w-4 h-4"  />
      </div>
    </div>
  </div>
  <!-- Bottom Navigation Bar -->
  <nav class="fixed bottom-0 left-0 right-0 bg-white shadow-md py-4 h-17 flex justify-between items-center px-10 rounded-t-xl">
    <a href="/first">
      <div class="flex flex-col items-center cursor-pointer">
        <img src="../../public/home.png" alt="Profile" class="h-5 w-5 rectangle-full" />
        <span class="text-xs text-gray-1000"></span>
      </div>
      </a>
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
      <a href="/Profile">
        <div class="flex flex-col items-center cursor-pointer">
          <img src="../../public/user.png" alt="Profile" class="h-6 w-6 rounded-full" />
          <span class="text-xs text-gray-1000"></span>
        </div>
      </a>
    </nav>
</template>

<script>
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      searchQuery: "", 
      posts: [], 
      profiles: [], 
      showProfileResults: false, 
      searchMode: 'profile', // Default search mode
    };
  },
  computed: {
    filteredPosts() {
      if (!this.searchQuery || this.searchMode !== 'feed') {
        return this.posts; 
      }
      const query = this.searchQuery.toLowerCase();
      return this.posts.filter((post) => {
        const captionMatch = post.description?.toLowerCase().includes(query);
        const tagMatch = post.tags?.some((tag) =>
          tag.toLowerCase().includes(query)
        );
        return captionMatch || tagMatch;
      });
    },
    filteredProfiles() {
      if (!this.searchQuery || this.searchMode !== 'profile') {
        return []; // Return empty array if no search query or not in profile mode
      }
      const query = this.searchQuery.toLowerCase();
      return this.profiles.filter((profile) => {
        const usernameMatch = profile.username?.toLowerCase().includes(query);
        const nameMatch = profile.name?.toLowerCase().includes(query);
        return usernameMatch || nameMatch;
      });
    },
  },
  watch: {
    searchQuery(newQuery) {
      this.showProfileResults = newQuery.length > 0;
    },
  },
  methods: {
    navigateToProfile(userId) {
      console.log("Navigating to profile with ID:", userId); // Debugging log
      this.router.push(`/UserProfile/${userId}`);
    },
    getImageClass(imageUrl) {
      if (imageUrl.includes("portrait")) {
        return "portrait"; // Portrait images span 2 rows
      } else if (imageUrl.includes("landscape")) {
        return "landscape"; // Landscape images span 2 columns
      } else {
        return "square"; // Square images span 1 row and 1 column
      }
    },
    async fetchPosts() {
      try {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, "post"));
        this.posts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    },
    async fetchProfiles() {
      try {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, "UserDetailes"));
        this.profiles = querySnapshot.docs.map((doc) => ({
          userId: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    },
    setSearchMode(mode) {
      this.searchMode = mode;
    },
  },
  mounted() {
    this.fetchPosts();
    this.fetchProfiles();
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

.search-buttons {
  display: flex;
  gap: 10px;
}

.search-buttons button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #e0e0e0;
  transition: background-color 0.3s ease;
}

.search-buttons button.active {
  background-color:#6CB4EE;
  color: white;
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

/* Profile Results */
.profile-results {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.profile-card {
  display: flex;
  align-items: center;
  padding: 10px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, background-color 0.3s ease;
  cursor: pointer;
}

.profile-card:hover {
  transform: scale(1.02);
  background-color: #f5f5f5;
}

.profile-picture {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
}

.profile-info h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.profile-info p {
  margin: 0;
  font-size: 14px;
  color: #666;
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