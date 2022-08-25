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
                meta: {title: "Reference Images"},
            },
        ]
    },
];

const router = createRouter({
    history: createMemoryHistory(),
    routes,
});

export default router;
