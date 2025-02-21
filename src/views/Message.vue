<template>
  <div class="app-container">
    <div class="app-header">
      <div class="logo">Snapshere</div>
    </div>

    <story></story>

    <!-- Message Section -->
    <div class="message-section">
      <div class="header">
        <div class="title">Chats</div>
      </div>

      <!-- Chat List -->
      <div class="chat-list">
        <div v-if="currentUser" class="chat-item">
          <div class="avatar">
            <img :src="currentUser.photoURL || 'https://via.placeholder.com/40'" alt="User Avatar" />
          </div>
          <div class="chat-details">
            <div class="chat-name">{{ currentUser.displayName || "Unknown User" }}</div>
            <div class="last-message">{{ currentUser.email }}</div>
          </div>
          <div class="chat-time">Now</div>
        </div>

        <!-- Display Other Users -->
        <div class="chat-item" v-for="(chat, index) in chats" :key="index">
          <div class="avatar">
            <img :src="chat.avatar" :alt="chat.name" />
          </div>
          <div class="chat-details">
            <div class="chat-name">{{ chat.name }}</div>
            <div class="last-message">{{ chat.lastMessage }}</div>
          </div>
          <div class="chat-time">{{ chat.time }}</div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-icon">
        <i class="fas fa-home"></i>
      </div>
      <div class="footer-icon">
        <i class="fas fa-user"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import story from "../components/story.vue";

export default {
  name: "message",
  components: {
    story,
  },
  data() {
    return {
      currentUser: null, 
      chats: [], 
    };
  },
  methods: {
    async fetchAuthUser() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.currentUser = {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          };
        } else {
          this.currentUser = null;
        }
      });
    },

    async fetchStudentData() {
      try {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, "post"));
        if (querySnapshot.empty) {
          console.log("No users found.");
        } else {
          this.chats = [];
          querySnapshot.forEach((doc) => {
            this.chats.push({
              id: doc.id,
              name: doc.data().name || "Unknown User",
              lastMessage: doc.data().lastMessage || "No messages yet",
              time: doc.data().time || "N/A",
              avatar: doc.data().avatar || "https://via.placeholder.com/40",
            });
          });
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
  },
  mounted() {
    this.fetchAuthUser(); 
    this.fetchStudentData(); 
  },
};
</script>

<style scoped>

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f8f8f8;
}

/* Header */
.app-header {
  padding: 10px;
  background-color: white;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #0095f6;
}

/* Message Section */
.message-section {
  flex: 1;
  width: 455px;
  background-color: white;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.title {
  font-size: 20px;
  font-weight: bold;
}

/* Chat List */
.chat-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.chat-item:hover {
  background-color: #f8f8f8;
}

.avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.chat-details {
  flex: 1;
}

.chat-name {
  font-size: 14px;
  font-weight: bold;
}

.last-message {
  font-size: 12px;
  color: #888;
}

.chat-time {
  font-size: 12px;
  color: #888;
}
</style>
