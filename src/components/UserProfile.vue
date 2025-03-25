<template>
  <div class="profile-page" v-if="userProfile">
    <div class="profile-circle" @click="openImage(userProfile.profilePicture || '/default-avatar.jpg')">
      <img :src="userProfile.profilePicture || '/default-avatar.jpg'" alt="Profile Picture" class="profile-picture" />
    </div>

    <div class="profile-header">
      <h1 class="username">{{ userProfile.username }}</h1>
      <button 
        v-if="!isCurrentUser" 
        @click="toggleFollow" 
        :class="['edit-profile-button', isFollowing ? 'following' : '']"
      >
        {{ isFollowing ? 'Following' : 'Follow' }}
      </button>
      <button v-if="isCurrentUser" class="edit-profile-button" @click="editProfile">
        Edit Profile
      </button>
    </div>

    <div class="stats">
      <div class="stat">
        <span class="count">{{ userProfile.postCount || 0 }}</span>
        <span class="label">Posts</span>
      </div>
      <div class="stat">
        <span class="count">{{ userProfile.followers?.length || 0 }}</span>
        <span class="label">Followers</span>
      </div>
      <div class="stat">
        <span class="count">{{ userProfile.following?.length || 0 }}</span>
        <span class="label">Following</span>
      </div>
    </div>

    <div class="bio-section">
      <p class="bio">{{ userProfile.bio || 'No bio available' }}</p>
      <a :href="userProfile.website" class="website-link" v-if="userProfile.website">{{ userProfile.website }}</a>
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

    <div class="content-grid">
      <div 
        v-for="post in activePosts" 
        :key="post.id" 
        class="post" 
        @click="viewPost(post.id)"
      >
        <img :src="post.url" :alt="post.description" class="post-image" />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading profile...</p>
    </div>

    <!-- Fullscreen Image Viewer -->
    <div v-if="showImageModal" class="image-modal" @click="showImageModal = false">
      <img :src="selectedImage" class="full-image" />
    </div>
  </div>

  <!-- Error State -->
  <div v-else-if="!loading" class="error-container">
    <p>User not found</p>
    <button @click="goBack" class="back-button">Go Back</button>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getFirestore, doc, getDoc, collection, query, where, getDocs, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const db = getFirestore();
    const auth = getAuth();
    
    // State variables
    const userId = ref(route.params.userId);
    const userProfile = ref(null);
    const userPosts = ref([]);
    const savedPosts = ref([]);
    const loading = ref(true);
    const activeTab = ref('Posts');
    const currentUserId = ref('');
    const isFollowing = ref(false);
    const showImageModal = ref(false);
    const selectedImage = ref('');
    const tabs = ref(['Posts', 'Saved']);

    // Computed properties
    const isCurrentUser = computed(() => {
      return userId.value === currentUserId.value;
    });

    const activePosts = computed(() => {
      return activeTab.value === 'Posts' ? userPosts.value : savedPosts.value;
    });

    // Methods
    const fetchUserProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, "UserDetailes", userId.value));
        
        if (userDoc.exists()) {
          userProfile.value = {
            userId: userDoc.id,
            ...userDoc.data()
          };
          
          // Check if current user is following this profile
          if (auth.currentUser) {
            currentUserId.value = auth.currentUser.uid;
            const currentUserDoc = await getDoc(doc(db, "UserDetailes", currentUserId.value));
            
            if (currentUserDoc.exists()) {
              const currentUserData = currentUserDoc.data();
              isFollowing.value = currentUserData.following?.includes(userId.value) || false;
            }
          }
          
          // Fetch post count if not available
          if (!userProfile.value.postCount) {
            const postsQuery = query(
              collection(db, "post"),
              where("authorId", "==", userId.value)
            );
            const postsSnapshot = await getDocs(postsQuery);
            userProfile.value.postCount = postsSnapshot.size;
          }
        }
        
        loading.value = false;
      } catch (error) {
        console.error("Error fetching user profile:", error);
        loading.value = false;
      }
    };
    
    const fetchUserPosts = async () => {
      try {
        const postsQuery = query(
          collection(db, "post"),
          where("authorId", "==", userId.value)
        );
        
        const postsSnapshot = await getDocs(postsQuery);
        userPosts.value = postsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };
    
    const fetchSavedPosts = async () => {
      try {
        if (auth.currentUser && isCurrentUser.value) {
          const userDoc = await getDoc(doc(db, "UserDetailes", currentUserId.value));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const savedPostIds = userData.savedPosts || [];
            
            if (savedPostIds.length > 0) {
              const savedPostsPromises = savedPostIds.map(postId => 
                getDoc(doc(db, "post", postId))
              );
              
              const savedPostsDocs = await Promise.all(savedPostsPromises);
              savedPosts.value = savedPostsDocs
                .filter(doc => doc.exists())
                .map(doc => ({
                  id: doc.id,
                  ...doc.data()
                }));
            }
          }
        }
      } catch (error) {
        console.error("Error fetching saved posts:", error);
      }
    };
    
    const toggleFollow = async () => {
      try {
        if (!auth.currentUser) {
          // Redirect to login or show login modal
          return;
        }
        
        const currentUserRef = doc(db, "UserDetailes", currentUserId.value);
        const targetUserRef = doc(db, "UserDetailes", userId.value);
        
        if (isFollowing.value) {
          // Unfollow
          await updateDoc(currentUserRef, {
            following: arrayRemove(userId.value)
          });
          
          await updateDoc(targetUserRef, {
            followers: arrayRemove(currentUserId.value)
          });
          
          isFollowing.value = false;
        } else {
          // Follow
          await updateDoc(currentUserRef, {
            following: arrayUnion(userId.value)
          });
          
          await updateDoc(targetUserRef, {
            followers: arrayUnion(currentUserId.value)
          });
          
          isFollowing.value = true;
        }
        
        // Update followers count in UI
        if (userProfile.value) {
          if (!userProfile.value.followers) {
            userProfile.value.followers = [];
          }
          
          if (isFollowing.value) {
            userProfile.value.followers.push(currentUserId.value);
          } else {
            userProfile.value.followers = userProfile.value.followers.filter(
              id => id !== currentUserId.value
            );
          }
        }
      } catch (error) {
        console.error("Error toggling follow:", error);
      }
    };
    
    const viewPost = (postId) => {
      router.push(`/post/${postId}`);
    };

    const openImage = (imageUrl) => {
      selectedImage.value = imageUrl;
      showImageModal.value = true;
    };
    
    const goBack = () => {
      router.back();
    };

    const editProfile = () => {
      router.push('/editProfile');
    };
    
    // Lifecycle hooks
    onMounted(async () => {
      if (auth.currentUser) {
        currentUserId.value = auth.currentUser.uid;
      }
      
      await fetchUserProfile();
      await fetchUserPosts();
      
      if (isCurrentUser.value) {
        await fetchSavedPosts();
      }
    });
    
    return {
      userId,
      userProfile,
      userPosts,
      savedPosts,
      loading,
      activeTab,
      tabs,
      activePosts,
      isCurrentUser,
      isFollowing,
      showImageModal,
      selectedImage,
      toggleFollow,
      viewPost,
      openImage,
      goBack,
      editProfile
    };
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

  align-items: center;
  gap: 10px;
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

.edit-profile-button.following {
  background-color: #efefef;
  color: #333;
}

.edit-profile-button.following:hover {
  background-color: #ff3b30;
  color: white;
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
  max-width: 400px;
}

.bio {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
}

.website-link {
  color: #007bff;
  text-decoration: none;
  font-size: 14px;
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

.content-grid{
  display:grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  width: 100%;
  

}

.post {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background-color: white;
  cursor: pointer;
  position: relative;
  border:2px solid gray;
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.post:hover .post-image {
  transform: scale(1.1);
}

/* Loading State */
.loading-container {
  text-align: center;
  padding: 40px;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0095f6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error State */
.error-container {
  text-align: center;
  padding: 40px;
}

.back-button {
  padding: 10px 20px;
  background-color: #0095f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.back-button:hover {
  background-color: #0081d6;
}

/* Image Modal */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.full-image {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
}
</style>