import { LocalEntity, Model } from "../../../../language/generated/ast.js"
import fs from "fs";
import { createPath } from "../../../util/generator-utils.js";
import { expandToString } from "langium/generate";
import path from "path";
import { generate as generateComponents } from "./components/generate.js";
import { generate as generateLayouts } from "./layouts/generate.js";
import { generate as generatePlugins } from "./plugins/generate.js";
import { generate as generateScss } from "./scss/generate.js";
import { generate as generateServices } from "./services/generate.js";
import { generate as generateTheme } from "./theme/generate.js";
import { generate as generateRouter } from "./router/generate.js";
import { generate as genrateUtils } from "./utils/generate.js";
import { generate as generateStores } from "./stores/generate.js";
import { generate as generateViews } from "./views/generate.js";
import { generate as generateComposition } from "./composition/generate.js";

export function generate(model: Model, listClassCRUD: LocalEntity[], target_folder: string) : void {

    const src_folder = createPath(target_folder, "src")
    const assets_folder = createPath(src_folder, "assets")
    const images_folder = createPath(assets_folder, "images")
    const components_folder = createPath(src_folder, "components")
    const layouts_folder = createPath(src_folder, "layouts")
    const plugins_folder = createPath(src_folder, "plugins")
    const scss_folder = createPath(src_folder, "scss")
    const services_folder = createPath(src_folder, "services")
    const themes_folder = createPath(src_folder, "theme")
    const router_folder = createPath(src_folder, "router")
    const util_folder = createPath(src_folder, "utils")
    const stores_folder = createPath(src_folder, "stores")
    const views_folder = createPath(src_folder, "views")
    const composition_folder = createPath(src_folder, "composition")

    fs.mkdirSync(src_folder, {recursive:true})
    fs.mkdirSync(assets_folder, {recursive:true})
    fs.mkdirSync(images_folder, {recursive:true})
    fs.mkdirSync(components_folder, {recursive:true})
    fs.mkdirSync(layouts_folder, {recursive:true})
    fs.mkdirSync(plugins_folder, {recursive:true})
    fs.mkdirSync(scss_folder, {recursive:true})
    fs.mkdirSync(services_folder, {recursive:true})
    fs.mkdirSync(themes_folder, {recursive:true})
    fs.mkdirSync(router_folder, {recursive:true})
    fs.mkdirSync(util_folder, {recursive:true})
    fs.mkdirSync(stores_folder, {recursive:true})
    fs.mkdirSync(views_folder, {recursive:true})
    fs.mkdirSync(composition_folder, {recursive:true})

    fs.writeFileSync(path.join(src_folder, 'App.vue'), generateApp());
    fs.writeFileSync(path.join(src_folder, 'config.ts'), generateConfig());
    fs.writeFileSync(path.join(src_folder, 'main.ts'), generateMain());

    generateComponents(model, components_folder);
    generateLayouts(model, listClassCRUD, layouts_folder);
    generatePlugins(model, plugins_folder)
    generateScss(model, scss_folder)
    generateServices(model, listClassCRUD, services_folder)
    generateTheme(model, themes_folder)
    generateRouter(model, listClassCRUD, router_folder)
    genrateUtils(model, util_folder)
    generateStores(model, stores_folder)
    generateViews(model, listClassCRUD, views_folder)
    generateComposition(model, composition_folder)

}  

function generateApp(): string {
    return expandToString`
<template>
  <RouterView></RouterView>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
</script>`
}

function generateConfig(): string {
    return expandToString`
export type ConfigProps = {
    Sidebar_drawer: any;
    Customizer_drawer: boolean;
    mini_sidebar: boolean;
    setHorizontalLayout: boolean;
    setRTLLayout: boolean;
    actTheme: string;
    inputBg:string;
    boxed: boolean;
    setBorderCard: boolean;
};

const config: ConfigProps = {
    Sidebar_drawer: null,
    Customizer_drawer: false,
    mini_sidebar: false,
    setHorizontalLayout: false, // Horizontal layout
    setRTLLayout: false, // RTL layout
    actTheme: 'ORANGE_THEME',
    inputBg: 'ORANGE_THEME',
    boxed: true,
    setBorderCard: false
};

export default config;`
}

function generateMain(): string {
    return expandToString`
import '@/scss/style.scss';
import Maska from 'maska';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import VueTablerIcons from 'vue-tabler-icons';
import VueApexCharts from 'vue3-apexcharts';
import 'vue3-carousel/dist/carousel.css';
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar';
import 'vue3-perfect-scrollbar/style.css';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import { router } from './router';

import { createI18n } from 'vue-i18n';
import VueScrollTo from 'vue-scrollto';
import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';
const i18n = createI18n({
    locale: 'en',
    silentTranslationWarn: true,
    silentFallbackWarn: true
});

const app = createApp(App);
app.use(router);
app.component('EasyDataTable', Vue3EasyDataTable);
app.use(PerfectScrollbarPlugin);
app.use(createPinia());
app.use(VueTablerIcons);
// app.use(print);
app.use(i18n);
app.use(Maska);
app.use(VueApexCharts);
app.use(vuetify).mount('#app');
//ScrollTop Use
// app.use(VueScrollTo);
app.use(VueScrollTo, {
    duration: 1000,
    easing: "ease"
})`
}