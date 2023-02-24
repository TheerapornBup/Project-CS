import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: import("../components/LogIn.vue"),
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../components/HomePage.vue"),
  },
  {
    path: "/create-account",
    name: "createAccount",

    component: () => import("../components/CreateAccount.vue"),
  },
  {
    path: "/edit-account",
    name: "editAccount",

    component: () => import("../components/EditAccount.vue"),
  },
  {
    path: "/chat",
    name: "chat",

    component: () => import("../components/NoticeChat.vue"),
  },
  {
    path: "/chat-list",
    name: "chatList",

    component: () => import("../components/ChatList.vue"),
  },
  {
    path: "/history",
    name: "history",

    component: () => import("../components/NoticeHistory.vue"),
  },
  {
    path: "/search",
    name: "search",

    component: () => import("../components/NoticeSearch.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
