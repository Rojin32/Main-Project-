<template>
  <div class="profile-page">
    <div class="profile-circle" @click="openImage(user.profilePicture)">
      <img :src="user.profilePicture" alt="Profile Picture" class="profile-picture" />
    </div>

    <a href="/editProfile">
      <div class="profile-header">
        <h1 class="username">{{ user.username }}</h1>
        <button class="edit-profile-button">Edit Profile</button>
      </div>
    </a>

    <div class="stats">
      <div class="stat">
        <span class="count">{{ user.postsCount }}</span>
        <span class="label">Posts</span>
      </div>
      <div class="stat">
        <span class="count">{{ user.followersCount }}</span>
        <span class="label">Followers</span>
      </div>
      <div class="stat">
        <span class="count">{{ user.followingCount }}</span>
        <span class="label">Following</span>
      </div>
    </div>

    <div class="bio-section">
      <p class="bio">{{ user.bio }}</p>
      <a :href="user.website" class="website-link" v-if="user.website">{{ user.website }}</a>
    </div>

    <div class="tabs">
      <button v-for="tab in tabs" :key="tab" :class="['tab-button', { active: activeTab === tab }]"
        @click="activeTab = tab">
        {{ tab }}
      </button>
    </div>

    <div class="content-grid">
      <div v-for="post in user.posts" :key="post.id" class="post" @click="openImage(post.image)">
        <img :src="post.image" alt="Post" class="post-image" />
      </div>
    </div>

    <div class="footer">
      <p>&copy; 2025</p>
    </div>

    <!-- Fullscreen Image Viewer -->
    <div v-if="showImageModal" class="image-modal" @click="showImageModal = false">
      <img :src="selectedImage" class="full-image" />
    </div>
  </div>
</template>

<script>
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../config';
import { getAuth } from "firebase/auth";

export default {
  data() {
    return {
      user: {
        profilePicture: "https://via.placeholder.com/150",
        username: "Unknown User",
        postsCount: 0,
        followersCount: 0,
        followingCount: 0,
        bio: "No bio available",
        website: "",
        posts: [],
      },
      tabs: ["Posts", "Tagged"],
      activeTab: "Posts",
      showImageModal: false,
      selectedImage: "",
    };
  },
  async created() {
    await this.fetchUserDetails();
  },
  methods: {
    async fetchUserDetails() {
      try {
        const userId = localStorage.getItem("id"); 
        if (!userId) return console.log("User ID not found");

        const docRef = doc(db, "UserDetailes", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          this.user = {
            profilePicture: data.profilePicture || "https://via.placeholder.com/150",
            username: data.username || "Unknown User",
            followersCount: data.followersCount || 0,
            followingCount: data.followingCount || 0,
            bio: data.bio || "No bio available",
            website: data.website || "",
            posts: [],
          };

          await this.fetchUserPosts(userId);
        } else {
          console.log("No such user document!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },

    async fetchUserPosts(userId) {
      try {
        console.log("Fetching posts for user:", userId);
        const auth = getAuth();
        const user = auth.currentUser;

        const postsQuery = query(collection(db, "post"), where("authorId", "==", user.uid));
        const querySnapshot = await getDocs(postsQuery);

        if (querySnapshot.empty) {
          console.log("No posts found for this user.");
          this.user.posts = [];
          this.user.postsCount = 0;
          return;
        }

        const userPosts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          image: doc.data().url,
        }));

        this.user.posts = userPosts;
        this.user.postsCount = userPosts.length;

        console.log("Fetched posts:", userPosts);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    },

    openImage(imageUrl) {
      this.selectedImage = imageUrl;
      this.showImageModal = true;
    }
  }
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
  cursor: pointer;
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
  cursor: pointer;
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:white;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.full-image {
  max-width: 90%;
  max-height: 90%;
}

.footer {
  width: 100%;
  text-align: center;
  padding: 20px;
  border-top: 1px solid #ccc;
  margin-top: auto;
}
</style>

