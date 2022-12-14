import {createMemoryHistory, createRouter, RouteRecordRaw} from "vue-router";
import {useCurrentUserStore} from "./store/CurrentUserStore";

const routes: RouteRecordRaw[] = [
    {
        path: "/login",
        name: "login",
        component: () => import("./view/pages/auth/login-page.vue"),
    },
    {
        path: "/primary-settings",
        name: "primary-settings",
        component: () => import("./view/pages/auth/primary-settings.vue"),
    },
    {
        path: "/",
        name: "app",
        component: () => import("./view/layouts/main-layout.vue"),
        redirect: "/capture",
        meta: {requireAuth: true},
        children: [
            {
                path: "/capture",
                name: "capture",
                component: () => import("./view/pages/capture/capture-page.vue"),
                meta: {title: "Capture"},
            },
            {
                path: "/style-guides",
                name: "style-guides",
                component: () => import("./view/pages/style-guides/style-guides-page.vue"),
                meta: {title: "Style Guides"},
            },
            {
                path: "/reference-images",
                name: "reference-images",
                component: () => import("./view/pages/references-images/reference-images-page.vue"),
                meta: {title: "Reference Images"},
            },
            {
                path: "/transfer",
                name: "transfer",
                component: () => import("./view/pages/transfer/transfer-page.vue"),
                meta: {title: "Transfer"},
            },
        ],
        beforeEnter: async (to, from, next) => {
            const store = useCurrentUserStore();
            const res = await store.getCurrentUser();
            if (!res) {
                next({name: "login"});
            } else {
                next();
            }
        }

    },
];

const router = createRouter({
    history: createMemoryHistory(),
    routes,
});

// router.beforeEach(async (to, from, next) => {
//     const store = useCurrentUserStore();
//     try {
//         if (to.meta?.requireAuth) {
//             const res = await store.getCurrentUser();
//             if (!res) {
//                 next({name: "login"});
//             } else {
//                 next();
//             }
//         } else {
//             next();
//         }
//     } catch {
//         next({name: "login"});
//     }
// });

export default router;
