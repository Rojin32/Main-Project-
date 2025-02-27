<template>
    <div class="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-4">Edit Profile</h2>
  
      <div class="flex flex-col items-center mb-4">
        <img :src="userData.avatar || defaultImage" class="w-24 h-24 rounded-full object-cover mb-2" />
        <input type="file" @change="uploadImage" accept="image/*" class="mt-2" />
      </div>
  
      <form @submit.prevent="updateProfile">
        <div class="mb-4">
          <label class="block text-gray-700">Username</label>
          <input v-model="userData.username" type="text" class="w-full p-2 border rounded" required />
        </div>
  
        <div class="mb-4">
          <label class="block text-gray-700">Email</label>
          <input v-model="userData.email" type="email" class="w-full p-2 border rounded" disabled />
        </div>
  
        <div class="mb-4">
          <label class="block text-gray-700">Phone Number</label>
          <input v-model="userData.mobile" type="tel" class="w-full p-2 border rounded" required />
        </div>
  
        <div class="mb-4">
          <label class="block text-gray-700">Bio</label>
          <textarea v-model="userData.bio" class="w-full p-2 border rounded"></textarea>
        </div>
  
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import { db} from "../config"; 
  import { getAuth } from "firebase/auth";
  import { doc, getDoc, updateDoc } from "firebase/firestore";
  import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
  
  export default {
    setup() {
      const auth = getAuth();
      const userData = ref({
        username: "",
        email: "",
        mobile: "",
        bio: "",
        avatar: "",
      });
  
      const defaultImage = ref("https://via.placeholder.com/100"); 
      const selectedFile = ref(null); 
  
      // Fetch user data from Firestore
      const fetchUserData = async () => {
        const user = auth.currentUser;
        if (user) {
          try {
            const userDocRef = doc(db, "UserDetailes", user.uid); // Ensure correct collection name
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              userData.value = { ...userDoc.data() };
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }
      };
  
      // Handle Image Upload & Preview
      const uploadImage = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
  
        selectedFile.value = file;
        userData.value.avatar = URL.createObjectURL(file);
  
        try {
          const user = auth.currentUser;
          if (!user) return;
  
          const imgRef = storageRef(storage, `profileImages/${user.uid}`);
          await uploadBytes(imgRef, file);
  
          const imageUrl = await getDownloadURL(imgRef);
          userData.value.avatar = imageUrl;
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      };
  
      // Update Firestore with new user data
      const updateProfile = async () => {
        const user = auth.currentUser;
        if (user) {
          try {
            const userDocRef = doc(db, "UserDetailes", user.uid);
            await updateDoc(userDocRef, {
              username: userData.value.username,
              mobile: userData.value.mobile,
              bio: userData.value.bio,
              avatar: userData.value.avatar,
            });
            console.log("Profile updated successfully", userDocRef);
            alert("Profile updated successfully!");
          } catch (error) {
            console.error("Error updating profile:", error);
          }
        }
      };
  
      onMounted(fetchUserData);
  
      return { userData, updateProfile, uploadImage, defaultImage };
    },
  };
  </script>
  
  
