<template>
  <div class="post-container">
    <!-- Post Header -->
    <div class="flex items-center space-x-3 p-4">
      <img :src="post.userProfileImage" alt="User Profile" class="h-8 w-8 rounded-full" />
      <span class="font-semibold">{{ post.userName }}</span>
    </div>

    
    <img :src="post.url" alt="Post Image" class="w-full cursor-pointer" @click="openModal" />
    <div class="p-4 cursor-pointer" @click="openModal">
      <p class="text-sm">{{ post.caption }}</p>
    </div>

    
    <div class="flex justify-between p-4">
      <div class="flex space-x-10">
        <button @click="toggleLike" :class="{ 'text-red-500': hasLiked }">
          <img :src="hasLiked ? '../../public/Likeed.png' : '../../public/like.png'" alt="Like" class="h-6 w-6" />
          <span class="text-xs ml-1">{{ likeCount }}</span>
        </button>
        <button @click="showCommentForm = !showCommentForm">
          <img src="../../public/chat-bubble.png" alt="Comment" class="h-6 w-6" />
          <span class="text-xs ml-1">{{ commentCount }}</span>
        </button>
      </div>
      <button>
        <img src="../../public/share.png" alt="Share" class="h-6 w-6" />
      </button>
    </div>

    <!-- Modal for Expanded View -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div class="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button @click="closeModal" class="absolute top-2 right-2 text-gray-600 hover:text-black">X</button>
        
        <div class="flex items-center space-x-3 mb-4">
          <img :src="post.userProfileImage" alt="User Profile" class="h-8 w-8 rounded-full" />
          <span class="font-semibold">{{ post.userName }}</span>
        </div>

        <img :src="post.url" alt="Post Image" class="w-full rounded" />

        <p class="text-sm mt-2">{{ post.caption }}</p>

        <!-- Likes and Comments in Modal -->
        <div class="flex justify-between my-4">
          <button @click="toggleLike" :class="{ 'text-red-500': hasLiked }">
            <img :src="hasLiked ? '../../public/Likeed.png' : '../../public/like.png'" alt="Like" class="h-6 w-6" />
            <span class="text-xs ml-1">{{ likeCount }}</span>
          </button>
          <button>
            <img src="../../public/share.png" alt="Share" class="h-6 w-6" />
          </button>
        </div>

        <!-- Comments Section -->
        <div class="bg-gray-100 p-2 rounded">
          <h3 class="font-semibold mb-2">Comments</h3>
          <div v-for="comment in comments" :key="comment.id" class="mb-2 p-2 bg-white rounded">
            <span class="font-semibold text-sm">{{ comment.userName }}</span>
            <p class="text-sm mt-1">{{ comment.text }}</p>
          </div>
        </div>

        <!-- Comment Form -->
        <form @submit.prevent="addComment" class="flex items-center mt-2">
          <input 
            v-model="commentText" 
            placeholder="Add a comment..." 
            class="flex-1 border rounded-lg px-3 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            :disabled="hasCommented"
          />
          <button 
            type="submit" 
            class="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            :disabled="!commentText.trim() || hasCommented"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  </div>
</template>


<script>
import { ref, onMounted } from 'vue';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from '../config';

export default {
  name: 'Post',
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const auth = getAuth();
    const commentText = ref('');
    const comments = ref([]);
    const likeCount = ref(props.post.likes?.length || 0);
    const commentCount = ref(props.post.comments?.length || 0);
    const hasLiked = ref(false);
    const hasCommented = ref(false);
    const isModalOpen = ref(false);  // State for Modal

    onMounted(async () => {
      await checkUserInteractions();
      await fetchComments();
    });

    const checkUserInteractions = async () => {
      if (!auth.currentUser) return;
      const userId = auth.currentUser.uid;

      // Check if user has liked the post
      if (props.post.likes && props.post.likes.includes(userId)) {
        hasLiked.value = true;
      }

      // Check if user has commented on the post
      const postDoc = doc(db, "post", props.post.id);
      const postSnapshot = await getDoc(postDoc);

      if (postSnapshot.exists()) {
        const postData = postSnapshot.data();
        if (postData.comments) {
          hasCommented.value = postData.comments.some(comment => comment.userId === userId);
          commentCount.value = postData.comments.length;
        }
      }
    };

    const fetchComments = async () => {
      if (!props.post.id) return;
      try {
        const postDoc = doc(db, "post", props.post.id);
        const postSnapshot = await getDoc(postDoc);
        if (postSnapshot.exists()) {
          const postData = postSnapshot.data();
          if (postData.comments) {
            comments.value = postData.comments;
          }
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    const toggleLike = async () => {
      if (!auth.currentUser) {
        alert("Please log in to like posts");
        return;
      }

      const userId = auth.currentUser.uid;
      const postDoc = doc(db, "post", props.post.id);

      try {
        if (hasLiked.value) {
          await updateDoc(postDoc, { likes: arrayRemove(userId) });
          hasLiked.value = false;
          likeCount.value--;
        } else {
          await updateDoc(postDoc, { likes: arrayUnion(userId) });
          hasLiked.value = true;
          likeCount.value++;
        }
      } catch (error) {
        console.error("Error updating like:", error);
      }
    };

    const addComment = async () => {
      if (!auth.currentUser) {
        alert("Please log in to comment");
        return;
      }

      if (!commentText.value.trim()) return;

      const userId = auth.currentUser.uid;
      const postDoc = doc(db, "post", props.post.id);

      try {
        const newComment = {
          userId: userId,
          userName: auth.currentUser.displayName || "User",
          text: commentText.value.trim(),
          timestamp: new Date().toISOString()
        };

        await updateDoc(postDoc, { comments: arrayUnion(newComment) });

        comments.value.push(newComment);
        commentText.value = '';
        hasCommented.value = true;
        commentCount.value++;
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    };

    const openModal = () => { isModalOpen.value = true; };
    const closeModal = () => { isModalOpen.value = false; };

    return { commentText, comments, likeCount, commentCount, hasLiked, hasCommented, toggleLike, addComment, isModalOpen, openModal, closeModal };
  }
};
</script>
