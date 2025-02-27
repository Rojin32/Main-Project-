<template>
  <div class="post-page">
    <!-- Header -->
    <div class="header">
      <button class="back-button" @click="goBack">&#8592;</button>
      <h1 class="custom-heading">New Post</h1>
      <button class="post-button" @click="postImage" :disabled="!imageFile">Post</button>
    </div>

    <!-- Image Upload Section -->
    <div class="image-upload" @click="triggerFileInput">
      <input
        type="file"
        ref="fileInput"
        @change="handleImageUpload"
        style="display: none;"
        accept="image/*"
      />
      <div v-if="!imagePreview" class="upload-placeholder">
        <span class="upload-icon">&#128247;</span>
        <p>Drag & Drop your image here</p>
        <p>or</p>
        <button class="upload-button">Upload Image</button>
      </div>
      <div v-else class="image-preview">
        <img :src="imagePreview" alt="Preview" />
        <button class="remove-button" @click="removeImage">&#10005;</button>
      </div>
    </div>

    <!-- Caption Input -->
    <div class="caption-input">
      <textarea v-model="caption" placeholder="Write a caption..." maxlength="250"></textarea>
      <p class="character-count">{{ 250 - caption.length }} characters remaining</p>
    </div>

    <!-- Location Input -->
    <div v-if="showLocationInput" class="location-input">
      <input type="text" v-model="location" placeholder="Enter location manually" />
      <button @click="saveLocation">Save</button>
    </div>

    <!-- Footer Buttons -->
    <div class="footer">
      <button class="footer-button" @click="tagPeople">
        <span class="icon">&#128100;</span>
        <span class="text">Tag People</span>
      </button>
      <button class="footer-button" @click="toggleLocationInput">
        <span class="icon">&#128205;</span>
        <span class="text">Add Location</span>
      </button>
      <button class="footer-button" @click="openScheduleModal">
        <span class="icon">&#128197;</span>
        <span class="text">Schedule Post</span>
      </button>
    </div>

    <!-- Schedule Post Modal -->
    <div v-if="isScheduleModalOpen" class="modal-overlay">
      <div class="modal-content">
        <h2>Schedule Post</h2>
        <input type="datetime-local" v-model="scheduledTime" />
        <button @click="schedulePost">Schedule</button>
        <button @click="closeScheduleModal">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default {
  data() {
    return {
      imageFile: null,
      imagePreview: null,
      caption: "",
      location: "",
      showLocationInput: false,
      isScheduleModalOpen: false,
      scheduledTime: "",
      scheduledPosts: [], // Store scheduled posts locally
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.imageFile = file;
        this.imagePreview = URL.createObjectURL(file);
      }
    },
    removeImage() {
      this.imageFile = null;
      this.imagePreview = null;
    },
    async postImage() {
      if (!this.imageFile) {
        alert("Please select an image to upload.");
        return;
      }

      try {
        const storage = getStorage();
        const fileRef = ref(storage, `post/${this.imageFile.name}`);
        await uploadBytesResumable(fileRef, this.imageFile);
        const imageUrl = await getDownloadURL(fileRef);
        await this.savePostToDatabase(imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    },
    async savePostToDatabase(imageUrl) {
      try {
        const db = getFirestore();
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          alert("You must be logged in to post.");
          return;
        }

        await addDoc(collection(db, "post"), {
          authorId: user.uid,
          description: this.caption,
          location: this.location,
          url: imageUrl,
          timestamp: new Date(),
        });

        alert("Post uploaded successfully!");
        this.resetForm();
      } catch (error) {
        console.error("Error saving post:", error);
      }
    },
    tagPeople() {
      console.log("Tagging people...");
    },
    toggleLocationInput() {
      this.showLocationInput = !this.showLocationInput;
    },
    saveLocation() {
      console.log("Location saved:", this.location);
      this.showLocationInput = false;
    },
    openScheduleModal() {
      this.isScheduleModalOpen = true;
    },
    closeScheduleModal() {
      this.isScheduleModalOpen = false;
    },
    async schedulePost() {
      if (!this.scheduledTime) {
        alert("Please select a date and time.");
        return;
      }

      if (!this.imageFile) {
        alert("Please select an image to upload.");
        return;
      }

      try {
        const storage = getStorage();
        const fileRef = ref(storage, `post/${this.imageFile.name}`);
        await uploadBytesResumable(fileRef, this.imageFile);
        const imageUrl = await getDownloadURL(fileRef);

        const scheduledTimestamp = new Date(this.scheduledTime).getTime();
        const currentTimestamp = new Date().getTime();
        const delay = scheduledTimestamp - currentTimestamp;

        if (delay < 0) {
          alert("Please select a future date and time.");
          return;
        }

        // Store the scheduled post locally
        const scheduledPost = {
          authorId: getAuth().currentUser.uid,
          description: this.caption,
          location: this.location,
          url: imageUrl,
          timestamp: new Date(this.scheduledTime).toISOString(),
        };

        // Add to local scheduledPosts array
        this.scheduledPosts.push(scheduledPost);

        // Set a timeout to publish the post at the scheduled time
        setTimeout(async () => {
          try {
            const db = getFirestore();
            await addDoc(collection(db, "post"), scheduledPost);
            alert("Scheduled post published successfully!");
          } catch (error) {
            console.error("Error publishing scheduled post:", error);
          }
        }, delay);

        alert("Post scheduled successfully!");
        this.resetForm();
        this.closeScheduleModal();
      } catch (error) {
        console.error("Error scheduling post:", error);
      }
    },
    resetForm() {
      this.imageFile = null;
      this.imagePreview = null;
      this.caption = "";
      this.location = "";
      this.scheduledTime = "";
    },
  },
};
</script>

<style scoped>
.post-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #f5f5f5;
    min-height: 100vh;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 20px;
  }
  
  .back-button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #007bff;
  }
  
  .post-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .post-button:disabled {
    background-color:#007bff;
    cursor: not-allowed;
  }
  
  .image-upload {
    width: 100%;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-bottom: 20px;
    background-color: white;
    border: 1px solid #ccc; 
    border-radius: 5px; 
    padding: 20px; 
  }
  
  .upload-placeholder {
    text-align: center;
  }
  
  .upload-icon {
    font-size: 48px;
    color: #007bff;
  }
  
  .upload-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .image-preview {
    position: relative;
    width: 100%;
    height: 100%;
  }
  
  .image-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
  }
  
  .remove-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .caption-input {
    width: 100%;
    margin-bottom: 20px;
  }
  
  .caption-input textarea {
    width: 100%;
    height: 100px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    resize: none;
    font-family: Arial, sans-serif;
  }
  
  .character-count {
    text-align: right;
    font-size: 12px;
    color: #666;
  }
  
  .footer {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 15px;
    background-color: white;
    border-top: 1px solid #eee;
    border-radius: 10px;
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .footer-button {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    color: #007bff;
    cursor: pointer;
    padding: 10px;
    border-radius: 5px;
    transition: background-color 0.3s;
  }
  
  .footer-button:hover {
    background-color: #e9f5ff;
  }
  
  .footer-button .icon {
    margin-right: 8px;
    font-size: 18px;
  }
  
  .footer-button .text {
    font-size: 14px;
  }
.location-input {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.location-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.location-input button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  }

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
}

.modal-content input[type="datetime-local"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.modal-content button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px;
}

.modal-content button:hover {
  background-color: #0056b3;
}
</style>