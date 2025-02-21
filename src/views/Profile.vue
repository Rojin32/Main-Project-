<template>
    <div class="profile-page">
      
      <div class="profile-circle">
        <img :src="profilePicture" alt="Profile Picture" class="profile-picture" />
      </div>
  
      
      <div class="profile-header">
        <h1 class="username">{{ username }}</h1>
        <button class="edit-profile-button">Edit Profile</button>
      </div>
  
      <div class="stats">
        <div class="stat">
          <span class="count">{{ postsCount }}</span>
          <span class="label">Posts</span>
        </div>
        <div class="stat">
          <span class="count">{{ followersCount }}</span>
          <span class="label">Followers</span>
        </div>
        <div class="stat">
          <span class="count">{{ followingCount }}</span>
          <span class="label">Following</span>
        </div>
      </div>
  
      
      <div class="bio-section">
        <p class="bio">{{ bio }}</p>
        <a :href="website" class="website-link">{{ website }}</a>
      </div>
  
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab"
          :class="['tab-button', { active: activeTab === tab }]"
          @click="activeTab = tab"
        >
          {{ tab }}
        </button>
      </div>
  
      <!-- Add Post Section -->
      <div class="add-post-section">
        <input
          type="file"
          accept="image/*"
          @change="handleFileUpload"
          id="file-input"
          style="display: none"
        />
        
      </div>
  
      <!-- Content Grid -->
      <div class="content-grid">
        <div v-for="post in posts" :key="post.id" class="post">
          <img :src="post.image" alt="Post" class="post-image" />
        </div>
      </div>
  
      <!-- Footer -->
      <div class="footer">
        <p>&copy; 2025</p>
      </div>
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        profilePicture: "https://via.placeholder.com/150",
        username: "Stefy Sam",
        postsCount: 25,
        followersCount: 1200,
        followingCount: 350,
        bio: "Travel enthusiast and food lover. Exploring .",
        tabs: ["Posts", "Tagged"],
        activeTab: "Posts",
        posts: [
          { id: 1, image: "https://via.placeholder.com/300", version: "v3" },
          { id: 2, image: "https://via.placeholder.com/300", version: "v4" },
          { id: 3, image: "https://via.placeholder.com/300", version: "v3" },
          { id: 4, image: "https://via.placeholder.com/300", version: "v4" },
          { id: 5, image: "https://via.placeholder.com/300", version: "v3" },
          { id: 6, image: "https://via.placeholder.com/300", version: "v4" },
        ],
      };
    },
    methods: {
      handleFileUpload(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            // Add the new post to the posts array
            const newPost = {
              id: this.posts.length + 1, // Auto-generate ID
              image: e.target.result, // Use the uploaded image
              version: "v4", // Set the version (you can customize this)
            };
            this.posts.push(newPost);
            this.postsCount++; // Increment the posts count
          };
          reader.readAsDataURL(file); // Convert the file to a data URL
        } else {
          alert("Please upload a valid image file.");
        }
      },
    },
  };
  </script>
  <style scoped>
  .profile-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #f5f5f5;
    min-height: 100vh;
  }
  
  .profile-circle {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #007bff;
    margin-bottom: 20px;
  }
  
  .profile-picture {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .profile-header {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .username {
    font-size: 24px;
    margin: 10px 0;
  }
  
  .edit-profile-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
  }
  
  .stats {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .count {
    font-size: 18px;
    font-weight: bold;
  }
  
  .label {
    font-size: 14px;
    color: #666;
  }
  
  .bio-section {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .bio {
    font-size: 16px;
    color: #333;
    margin: 0 0 10px 0;
  }
  
  .website-link {
    color: #007bff;
    text-decoration: none;
  }
  
  .tabs {
    display: flex;
    justify-content: space-around;
    width: 100%;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;
  }
  
  .tab-button {
    background: none;
    border: none;
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
    color: #666;
  }
  
  .tab-button.active {
    color: #007bff;
    border-bottom: 2px solid #007bff;
  }
  
  .add-post-section {
    margin-bottom: 20px;
  }
  
  .add-post-button {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    display: inline-block;
  }
  
  .add-post-button:hover {
    background-color: #0056b3;
  }
  
  .content-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
    width: 100%;
    background-color: #ccc;
  }
  
  .post {
    width: 100%;
    aspect-ratio: 1;
    overflow: hidden;
    background-color: white;
  }
  
  .post-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .footer {
    width: 100%;
    text-align: center;
    padding: 20px;
    border-top: 1px solid #ccc;
    margin-top: auto;
  }
  </style>