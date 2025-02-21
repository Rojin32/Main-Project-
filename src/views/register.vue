<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-2">
    <div class="w-full max-w-md bg-white shadow-md rounded-lg p-8">
      <h2 class="text-2xl font-bold text-center text-gray-700 mb-4">Create Account</h2>
      <form @submit.prevent="handleSubmit">
        
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

      
        <div v-if="error" class="mb-4 text-red-500 text-sm">
          {{ error }}
        </div>

       
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

const router = useRouter();
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  password: '',
});
const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  password: '',
});
const error = ref('');


const validateFirstName = () => {
  if (!form.firstName.trim()) {
    errors.firstName = 'First name is required.';
    return false;
  } else if (!/^[A-Za-z]+$/.test(form.firstName)) {
    errors.firstName = 'First name should contain only letters.';
    return false;
  } else {
    errors.firstName = '';
    return true;
  }
};

const validateLastName = () => {
  if (!form.lastName.trim()) {
    errors.lastName = 'Last name is required.';
    return false;
  } else if (!/^[A-Za-z]+$/.test(form.lastName)) {
    errors.lastName = 'Last name should contain only letters.';
    return false;
  } else {
    errors.lastName = '';
    return true;
  }
};

const validateEmail = () => {
  if (!form.email.trim()) {
    errors.email = 'Email is required.';
    return false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address.';
    return false;
  } else {
    errors.email = '';
    return true;
  }
};

const validateMobile = () => {
  if (!form.mobile.trim()) {
    errors.mobile = 'Mobile number is required.';
    return false;
  } else if (!/^\d{10}$/.test(form.mobile)) {
    errors.mobile = 'Mobile number should be 10 digits.';
    return false;
  } else {
    errors.mobile = '';
    return true;
  }
};

const validatePassword = () => {
  if (!form.password.trim()) {
    errors.password = 'Password is required.';
    return false;
  } else if (form.password.length < 6) {
    errors.password = 'Password should be at least 6 characters.';
    return false;
  } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(form.password)) {
    errors.password = 'Password should contain at least one uppercase letter, one lowercase letter, and one number.';
    return false;
  } else {
    errors.password = '';
    return true;
  }
};

const handleSubmit = async () => {
  const isFirstNameValid = validateFirstName();
  const isLastNameValid = validateLastName();
  const isEmailValid = validateEmail();
  const isMobileValid = validateMobile();
  const isPasswordValid = validatePassword();

  if (!isFirstNameValid || !isLastNameValid || !isEmailValid || !isMobileValid || !isPasswordValid) {
    return; 
  }

  error.value = ''; 

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
    const userDetailes = await addDoc(collection(db, "UserDetailes"), {email: form.email,firstName:form.firstName,lastName:form.lastName,mobile:form.mobile});
    console.log('Registration successful:', userCredential.user);
    router.push('/'); 
  } catch (err) {
    console.error('Registration error:', err);
    switch (err.code) {
      case 'auth/email-already-in-use':
        error.value = 'Email already registered.';
        break;
      case 'auth/weak-password':
        error.value = 'Password should be at least 6 characters.';
        break;
      default:
        error.value = 'Registration error: ' + err.message;
    }
  }
};
</script>