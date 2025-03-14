import { createWebHistory, createRouter } from 'vue-router'
import fir from '../views/second.vue'
import Login from '../views/first.vue'
//import AboutView from './AboutView.vue'
import thriu from '../views/register.vue'

import rhrh from '../views/Main.vue'
import first from '../views/nav.vue'
import Sec from '../components/story.vue'
import PostPage from '../views/post.vue'
import Profile from '../views/Profile.vue'
import feed from '../views/feed.vue'
import Message from '../views/Message.vue'
import Post from '../components/Postview.vue'
import editProfile from '../views/editProfile.vue'
import MessagePage from '../views/MessagePage.vue'
import AdminLogin from '../views/AdminLogin.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
const routes = [
  { path: '/login', name:"Login", component: Login },
 // { path: '/about', component: AboutView },

    { path: '/', name:"secinf", component: fir },
   // { path: '/about', component: AboutView },
   { path: '/thriu', name:"thriu", component: thriu },

   {path:'/main',name:'ekjfn',component:rhrh},
   {path:'/first',name:'',component:first},
   {path:'/Sec',name:'',component:Sec},
   {path:'/PostPage',name:'',component:PostPage},
   {path:'/Profile',name:'',component:Profile},
   {path:'/feed',name:'',component:feed},
   {path:'/Message',name:'',component:Message},
   {path:'/Post',name:'',component:Post},
   {path:'/editProfile',name:'',component:editProfile},
   {path:'/MessagePage',name:'',component:MessagePage},
   {path:'/AdminLogin',name:'',component:AdminLogin},
   {path:'/AdminDashboard',name:'',component:AdminDashboard}
]
  

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router