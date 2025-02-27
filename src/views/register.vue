<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-2">
    <div class="w-full max-w-md bg-white shadow-md rounded-lg p-8">
      <h2 class="text-2xl font-bold text-center text-gray-700 mb-4">Create Account</h2>
      <form @submit.prevent="handleSubmit">

        <!-- First Name Section -->
        <div class="mb-4">
          <label for="firstName" class="block text-gray-700 font-medium mb-1">First Name</label>
          <input
            type="text"
            id="firstName"
            v-model="form.firstName"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter your first name"
            required
          />
          <p v-if="errors.firstName" class="text-red-500 text-sm mt-1">{{ errors.firstName }}</p>
        </div>

        <!-- Last Name Section -->
        <div class="mb-4">
          <label for="lastName" class="block text-gray-700 font-medium mb-1">Last Name</label>
          <input
            type="text"
            id="lastName"
            v-model="form.lastName"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter your last name"
            required
          />
          <p v-if="errors.lastName" class="text-red-500 text-sm mt-1">{{ errors.lastName }}</p>
        </div>

        <!-- Username Section -->
        <div class="mb-4">
          <label for="username" class="block text-gray-700 font-medium mb-1">Username</label>
          <input
            type="text"
            id="username"
            v-model="form.username"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter your username"
            required
          />
          <p v-if="errors.username" class="text-red-500 text-sm mt-1">{{ errors.username }}</p>
        </div>

        <!-- Email Section -->
        <div class="mb-4">
          <label for="email" class="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter your email"
            required
          />
          <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
        </div>

        <!-- Mobile Number Section -->
        <div class="mb-4">
          <label for="mobile" class="block text-gray-700 font-medium mb-1">Mobile Number</label>
          <input
            type="tel"
            id="mobile"
            v-model="form.mobile"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter your mobile number"
            required
          />
          <p v-if="errors.mobile" class="text-red-500 text-sm mt-1">{{ errors.mobile }}</p>
        </div>

        <!-- Password Section -->
        <div class="mb-4">
          <label for="password" class="block text-gray-700 font-medium mb-1">Password</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter your password"
            required
          />
          <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
        </div>

        <!-- Avatar Upload Section -->
        <div class="mb-4">
          <label for="avatar" class="block text-gray-700 font-medium mb-1">Upload Avatar</label>
          <input
            type="file"
            id="avatar"
            @change="handleFileUpload"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none"
          />
          <p v-if="errors.avatar" class="text-red-500 text-sm mt-1">{{ errors.avatar }}</p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-4 text-red-500 text-sm">
          {{ error }}
        </div>

        <!-- Submit Button -->
        <div class="mt-8">
          <button
            type="submit"
            class="w-full px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { auth, db } from '../config'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { addDoc, collection } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';

const router = useRouter();
const storage = getStorage(); 

const form = reactive({
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  password: '',
  bio: '',
  avatar: null
});

const errors = reactive({
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  password: '',
  bio: '',
  avatar: ''
});

const error = ref('');
const avatarFile = ref(null);

// Handle File Upload
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    avatarFile.value = file;
  }
};

const handleSubmit = async () => {
  error.value = ''; 
  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
    const userId = userCredential.user.uid;
    
    let avatarUrl = '';

    // Upload Avatar if provided
    if (avatarFile.value) {
      const avatarStorageRef = storageRef(storage, `avatars/${userId}.jpg`);
      await uploadBytes(avatarStorageRef, avatarFile.value);
      avatarUrl = await getDownloadURL(avatarStorageRef);
    }

    // Store user details in Firestore with userId as the document name
    await setDoc(doc(db, "UserDetailes", userId), {
      email: form.email,
      firstName: form.firstName,
      lastName: form.lastName,
      username: form.username,
      mobile: form.mobile,
      bio: form.bio,
      avatar: avatarUrl
    });

    console.log('Registration successful:', userCredential.user);
    
    localStorage.setItem('id', userId);
    router.push('/first'); 
  } catch (err) {
    console.error('Registration error:', err);
    error.value = 'Registration failed. ' + (err.message || '');
  }
};

</script>
