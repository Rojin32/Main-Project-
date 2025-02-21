<template>
    <div class="post-page">
      <div class="header">
        <button class="back-button" @click="goBack">&#8592;</button>
        <h1 class="custom-heading">New Post</h1>
        <button class="post-button" @click="postImage" :disabled="!imagePreview">Post</button>
      </div>
  
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
  
      
      <div class="caption-input">
        <textarea
          v-model="caption"
          placeholder="Write a caption..."
          maxlength="250"
        ></textarea>
        <p class="character-count">{{ 250 - caption.length }} characters remaining</p>
      </div>
  

      <div class="footer">
        <button class="footer-button" @click="tagPeople">
          <span class="icon">&#128100;</span>
          <span class="text">Tag People</span>
        </button>
        <button class="footer-button" @click="addLocation">
          <span class="icon">&#128205;</span>
          <span class="text">Add Location</span>
        </button>
        <button class="footer-button" @click="schedulePost">
          <span class="icon">&#128197;</span>
          <span class="text">Schedule Post</span>
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        imagePreview: null,
        caption: "",
      };
    },
    methods: {
      goBack() {
        // Navigate back
        this.$router.go(-1);
      },
      triggerFileInput() {
        this.$refs.fileInput.click();
      },
      handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
          this.imagePreview = URL.createObjectURL(file);
        }
      },
      removeImage() {
        this.imagePreview = null;
      },
      postImage() {
        // Handle posting logic here
        console.log("Posting image with caption:", this.caption);
        // Reset form
        this.imagePreview = null;
        this.caption = "";
      },
      tagPeople() {
        // Handle tagging logic
        console.log("Tagging people...");
      },
      addLocation() {
        // Handle location logic
        console.log("Adding location...");
      },
      schedulePost() {
        // Handle scheduling logic
        console.log("Scheduling post...");
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
  </style>
