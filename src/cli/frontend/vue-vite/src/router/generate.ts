import { LocalEntity, Model } from "../../../../../language/generated/ast.js"
import fs from "fs";
import { expandToString } from "langium/generate";
import path from "path";

export function generate(model: Model, listClassCRUD: LocalEntity[], target_folder: string) : void {

    fs.writeFileSync(path.join(target_folder, "index.ts"), generateIndex())
    fs.writeFileSync(path.join(target_folder, "AuthRoutes.ts"), generateAuthRoutes())
    
    let paths = ""
    for(const cls of listClassCRUD) {
        paths += `
{

    name: '${cls.name}',
    path: '/${cls.name}/Index${cls.name}',
    component: () => import('@/views/${model.configuration?.name}/${cls.name}/Index${cls.name}.vue'),
},
{
    name: 'Detalhes${cls.name}',
    path: '/${cls.name}/Details${cls.name}/:id?',
    component: () => import('@/views/${model.configuration?.name}/${cls.name}/Details${cls.name}.vue'),
    props: true
},
{
    name: 'Cadastro${cls.name}',
    path: '/${cls.name}/form${cls.name}/:id?/:${cls.name}?',
    component: () => import('@/views/${model.configuration?.name}/${cls.name}/Form${cls.name}.vue'),
},`
    }

    fs.writeFileSync(path.join(target_folder, `MainRoutes.ts`), generateMainRoutes(paths))
}  

function generateIndex(): string {
    return expandToString`
import { createRouter, createWebHistory } from 'vue-router';
import AuthRoutes from './AuthRoutes';
import MainRoutes from './MainRoutes';

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/:pathMatch(.*)*',
            component: () => import('@/views/authentication/Error.vue')
        },
        MainRoutes,
        AuthRoutes
    ]
});

// router.beforeEach(async (to, from, next) => {
//     // Verificação de login
//     const publicPages = ['/auth/login'];
//     const authRequired = !publicPages.includes(to.path);
//     const auth: any = useAuthStore();

//     if (to.matched.some((record) => record.meta.requiresAuth)) {
//         if (authRequired && !auth.user) {
//             auth.returnUrl = to.fullPath;
//             return next('/auth/login');
//         } else next();
//     } else {
//         next();
//     }
// });`
}

function generateMainRoutes(paths: string): string{
    return expandToString`
const MainRoutes = {
    path: '/main',
    meta: {
        requiresAuth: true
    },
    redirect: '/main',
    component: () => import('@/layouts/full/FullLayout.vue'),
    children: [
    {
    name: 'Index',
    path: '/',
    component: () => import('@/views/index.vue'),
    },
    ${paths}
    ]
};

export default MainRoutes;
`
}

function generateAuthRoutes(): string {
    return expandToString`
const AuthRoutes = {
    path: '/auth',
    component: () => import('@/layouts/blank/BlankLayout.vue'),
    meta: {
        requiresAuth: false
    },
    children: [

        {
            name: 'Side Login',
            path: '/auth/login',
            component: () => import('@/views/authentication/SideLogin.vue')
        },
        {
            name: 'Error',
            path: '/auth/404',
            component: () => import('@/views/authentication/Error.vue')
        }
    ]
};

export default AuthRoutes;`
}