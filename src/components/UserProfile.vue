<template>
    <div class="profile-container" v-if="userProfile">
      <!-- Profile Header -->
      <div class="profile-header">
        <div class="profile-cover">
          
        </div>
        
        <div class="profile-info-container">
          <div class="profile-picture-container">
            <img 
              :src="userProfile.profilePicture || '/default-avatar.jpg'" 
              alt="Profile Picture" 
              class="profile-picture" 
            />
          </div>
          
          <div class="profile-details">
            <div class="profile-name-section">
              <h1 class="profile-name">{{ userProfile.name }}</h1>
              <p class="profile-username">@{{ userProfile.username }}</p>
            </div>
            
            <div class="profile-stats">
              <div class="stat-item">
                <span class="stat-count">{{ userProfile.postCount || 0 }}</span>
                <span class="stat-label">Posts</span>
              </div>
              <div class="stat-item">
                <span class="stat-count">{{ userProfile.followers?.length || 0 }}</span>
                <span class="stat-label">Followers</span>
              </div>
              <div class="stat-item">
                <span class="stat-count">{{ userProfile.following?.length || 0 }}</span>
                <span class="stat-label">Following</span>
              </div>
            </div>
            
            <div class="profile-bio" v-if="userProfile.bio">
              <p>{{ userProfile.bio }}</p>
            </div>
            
            <div class="profile-actions">
              <button 
                v-if="!isCurrentUser" 
                @click="toggleFollow" 
                :class="['follow-button', isFollowing ? 'following' : '']"
              >
                {{ isFollowing ? 'Following' : 'Follow' }}
              </button>
              <button v-if="!isCurrentUser" class="message-button">
                Message
              </button>
              <button v-if="isCurrentUser" class="edit-profile-button">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Profile Content -->
      <div class="profile-content">
        <div class="content-tabs">
          <button 
            class="tab-button" 
            :class="{ active: activeTab === 'posts'}"
            @click="activeTab = 'posts'"
          >
            Posts
          </button>
          
        </div>
        
        <!-- Posts Grid -->
        <div v-if="activeTab === 'posts'" class="posts-grid">
          <div v-if="userPosts.length === 0" class="no-posts">
            <p>No posts yet</p>
          </div>
          <div 
            v-for="post in userPosts" 
            :key="post.id" 
            class="post-item"
            @click="viewPost(post.id)"
          >
            <img :src="post.url" :alt="post.description" class="post-image" />
          </div>
        </div>
        
        <!-- Saved Posts -->
        <div v-else-if="activeTab === 'saved'" class="posts-grid">
          <div v-if="savedPosts.length === 0" class="no-posts">
            <p>No saved posts</p>
          </div>
          <div 
            v-for="post in savedPosts" 
            :key="post.id" 
            class="post-item"
            @click="viewPost(post.id)"
          >
            <img :src="post.url" :alt="post.description" class="post-image" />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-else-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading profile...</p>
    </div>
    
    <!-- Error State -->
    <div v-else class="error-container">
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
    const activeTab = ref('posts');
    const currentUserId = ref('');
    const isFollowing = ref(false);
    
    // Computed properties
    const isCurrentUser = computed(() => {
      return userId.value === currentUserId.value;
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
    
    const goBack = () => {
      router.back();
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
      isCurrentUser,
      isFollowing,
      toggleFollow,
      viewPost,
      goBack
    };
  }
};
</script>
<style scoped>
.profile-container {
  max-width: 935px;
  margin: 0 auto;
  padding: 20px;
}

/* Profile Header */
.profile-header {
  margin-bottom: 44px;
  position: relative;
}

.profile-cover {
  height: 300px;
  overflow: hidden;
  border-radius: 12px;
  background-color: #f0f0f0;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info-container {
  display: flex;
  align-items: flex-start;
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-top: -80px;
  position: relative;
  z-index: 1;
}

.profile-picture-container {
  margin-right: 30px;
  margin-top: -60px;
}

.profile-picture {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 4px solid white;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.profile-details {
  flex: 1;
}

.profile-name-section {
  margin-bottom: 20px;
}

.profile-name {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  color: #333;
}

.profile-username {
  font-size: 16px;
  color: #666;
  margin: 5px 0 0;
}

.profile-stats {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
}

.stat-count {
  font-size: 20px;
  font-weight: 700;
  display: block;
  color: #333;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.profile-bio {
  margin-bottom: 20px;
  font-size: 16px;
  line-height: 1.6;
  color: #444;
}

.profile-actions {
  display: flex;
  gap: 10px;
}

.follow-button, .message-button, .edit-profile-button {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.follow-button {
  background-color: #0095f6;
  color: white;
  border: none;
}

.follow-button.following {
  background-color: #efefef;
  color: #333;
}

.follow-button:hover {
  background-color: #0081d6;
}

.follow-button.following:hover {
  background-color: #ff3b30;
  color: white;
}

.message-button {
  background-color: #efefef;
  color: #333;
  border: none;
}

.message-button:hover {
  background-color: #e0e0e0;
}

.edit-profile-button {
  background-color: #efefef;
  color: #333;
  border: none;
}

.edit-profile-button:hover {
  background-color: #e0e0e0;
}

/* Profile Content */
.profile-content {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-top: 20px;
}

.content-tabs {
  display: flex;
  border-bottom: 1px solid #dbdbdb;
}

.tab-button {
  flex: 1;
  padding: 16px;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-button.active {
  color: #0095f6;
  border-bottom: 2px solid #0095f6;
}

.tab-button:hover {
  color: #0095f6;
}

/* Posts Grid */
.posts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  padding: 4px;
}

.post-item {
  aspect-ratio: 1/1;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  border-radius: 8px;
  background-color: #f0f0f0;
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.post-item:hover .post-image {
  transform: scale(1.1);
}

.no-posts {
  text-align: center;
  padding: 40px;
  color: #666;
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
</style>