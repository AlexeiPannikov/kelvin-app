import {createMemoryHistory, createRouter, RouteRecordRaw} from "vue-router";
import {useCurrentUserStore} from "./store/CurrentUserStore";

const routes: RouteRecordRaw[] = [
    {
        path: "/login",
        name: "login",
        component: () => import("./view/pages/auth/login-page.vue"),
    },
    {
        path: "/",
        name: "app",
        component: () => import("./view/layouts/main-layout.vue"),
        redirect: "/capture",
        children: [
            {
                path: "/capture",
                name: "capture",
                component: () => import("./view/pages/capture/capture-page.vue"),
                meta: {requireAuth: true, title: "Capture"},
            },
            {
                path: "/style-guides",
                name: "style-guides",
                component: () => import("./view/pages/style-guides/style-guides-page.vue"),
                meta: {requireAuth: true, title: "Style Guides"},
            },
        ]
    },
];

const router = createRouter({
    history: createMemoryHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const store = useCurrentUserStore();
    try {
        if (to.meta?.requireAuth) {
            const res = await store.getCurrentUser();
            if (!res) {
                next({name: "login"});
            } else {
                next();
            }
        } else {
            next();
        }
    } catch {
        next({name: "login"});
    }
});

export default router;
