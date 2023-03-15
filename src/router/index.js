import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../components/HomePage.vue"),
  },
  {
    path: "/log-in",
    name: "logIn",

    component: () => import("../components/LogIn.vue"),
  },
  {
    path: "/create-account",
    name: "createAccount",

    component: () => import("../components/CreateAccount.vue"),
  },
  {
    path: "/policy-terms",
    name: "policyTerms",

    component: () => import("../components/PolicyTerms.vue"),
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
    path: "/chat-list/:isVistor",
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
  {
    path: "/location",
    name: "location",

    component: () => import("../components/LocationField.vue"),
  },
  {
    path: "/add-notice",
    name: "add-notice",

    component: () => import("../components/NoticeAdd.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
