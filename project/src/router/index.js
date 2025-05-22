import { createRouter, createWebHistory } from "vue-router"
import { checkAuth } from "../services/auth"

// Lazy load components for better performance
const Home = () => import("../views/HomePage.vue")
const Login = () => import("../views/LoginPage.vue")
const Register = () => import("../views/RegisterPage.vue")
const Profile = () => import("../views/ProfilePage.vue")
const Statistics = () => import("../views/StatisticsPage.vue")
const AiChat = () => import("../views/AiChatPage.vue")

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: "/statistics",
    name: "Statistics",
    component: Statistics,
    meta: { requiresAuth: true },
  },
  {
    path: "/ai-chat",
    name: "AiChat",
    component: AiChat,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const isAuthenticated = await checkAuth()

    if (!isAuthenticated) {
      next({ name: "Login" })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
