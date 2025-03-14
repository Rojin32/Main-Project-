<template>
    <div class="chat-container">
      <div class="header">
        <button @click="$router.go(-1)">⬅ Back</button>
        <h2>Chat with {{ chatUser.name }}</h2>
      </div>
  
      <div class="messages">
        <div v-for="(msg, index) in messages" :key="index" class="message">
          <p>{{ msg.text }}</p>
        </div>
      </div>
  
      <div class="message-input">
        <input v-model="newMessage" type="text" placeholder="Type a message..." />
        <button @click="sendMessage">Send</button>
      </div>
    </div>
  </template>
  
  <script>
  import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
  
  export default {
    props: ["id"], // Getting chat ID from the route
    data() {
      return {
        chatUser: {},
        messages: [],
        newMessage: "",
      };
    },
    methods: {
      async fetchMessages() {
        const db = getFirestore();
        const q = query(collection(db, "messages"), where("chatId", "==", this.id));
        const querySnapshot = await getDocs(q);
  
        this.messages = querySnapshot.docs.map(doc => doc.data());
      },
      async sendMessage() {
        if (!this.newMessage.trim()) return;
  
        const db = getFirestore();
        await addDoc(collection(db, "messages"), {
          chatId: this.id,
          text: this.newMessage,
        });
  
        this.newMessage = "";
        this.fetchMessages();
      }
    },
    mounted() {
      this.chatUser = { name: "User " + this.id }; // Dummy name, replace with real data
      this.fetchMessages();
    }
  };
  </script>
  
  <style scoped>
  .chat-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  .header {
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }
  .messages {
    flex: 1;
    padding: 10px;
    overflow-y: auto;
  }
  .message {
    margin-bottom: 10px;
  }
  .message-input {
    display: flex;
    padding: 10px;
    border-top: 1px solid #ddd;
  }
  .message-input input {
    flex: 1;
    padding: 5px;
  }
  </style>
  