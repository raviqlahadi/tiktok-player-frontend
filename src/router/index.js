import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "@/views/Home.vue";

const routes = [
    {
        path: '/',
        name: 'Home', 
        component: HomeView
    }
]

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes,
});

export default router;