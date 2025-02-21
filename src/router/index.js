import { createWebHistory, createRouter } from 'vue-router'
import fir from '../views/second.vue'
import Login from '../views/first.vue'
//import AboutView from './AboutView.vue'
import thriu from '../views/register.vue'
import user from '../views/Username.vue'
import rhrh from '../views/Main.vue'
import first from '../views/nav.vue'
import Sec from '../components/story.vue'
import PostPage from '../views/post.vue'
import Profile from '../views/Profile.vue'
import feed from '../views/feed.vue'
import Message from '../views/Message.vue'
const routes = [
  { path: '/login', name:"Login", component: Login },
 // { path: '/about', component: AboutView },

    { path: '/', name:"secinf", component: fir },
   // { path: '/about', component: AboutView },
   { path: '/thriu', name:"thriu", component: thriu },
   {path: '/user',name:"user",component:user},
   {path:'/main',name:'ekjfn',component:rhrh},
   {path:'/first',name:'',component:first},
   {path:'/Sec',name:'',component:Sec},
   {path:'/PostPage',name:'',component:PostPage},
   {path:'/Profile',name:'',component:Profile},
   {path:'/feed',name:'',component:feed},
   {path:'/Message',name:'',component:Message}
]
  

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router