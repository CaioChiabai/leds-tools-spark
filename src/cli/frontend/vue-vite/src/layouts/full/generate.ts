import { LocalEntity, Model } from "../../../../../../language/generated/ast.js"
import fs from "fs";
import { createPath } from "../../../../../util/generator-utils.js";
import { expandToString } from "langium/generate";
import path from "path";
import { generate as generateCustomizer } from "./customizer/generate.js";
import { generate as generateHorizontalHeader } from "./horizontal-header/generate.js";
import { generate as generateHorizontalSideBar } from "./horizontal-sidebar/generate.js";
import { generate as generateLogo } from "./logo/generate.js";
import { generate as generateVerticalHeader } from "./vertical-header/generate.js";
import { generate as generateVerticalSidebar } from "./vertical-sidebar/generate.js";

export function generate(model: Model, listClassCRUD: LocalEntity[], target_folder: string) : void {

    const customizer_folder = createPath(target_folder, "customizer")
    const horizontal_header_folder =  createPath(target_folder, "horizontal-header")
    const horizontal_sidebar_folder = createPath(target_folder, "horizontal-sidebar")
    const logo_folder = createPath(target_folder, "logo")
    const vertical_header_folder = createPath(target_folder, "vertical-header")
    const vertical_sidebar_folder = createPath(target_folder, "vertical-sidebar")

    fs.mkdirSync(customizer_folder, {recursive:true})
    fs.mkdirSync(horizontal_header_folder, {recursive:true})
    fs.mkdirSync(horizontal_sidebar_folder, {recursive: true})
    fs.mkdirSync(logo_folder, {recursive:true})
    fs.mkdirSync(vertical_header_folder, {recursive:true})
    fs.mkdirSync(vertical_sidebar_folder, {recursive:true})

    fs.writeFileSync(path.join(target_folder, 'FullLayout.vue'), generateFullLayout());

    generateCustomizer(customizer_folder)
    generateHorizontalHeader(horizontal_header_folder)
    generateHorizontalSideBar(horizontal_sidebar_folder)
    generateLogo(logo_folder)
    generateVerticalHeader(vertical_header_folder)
    generateVerticalSidebar(model, listClassCRUD, vertical_sidebar_folder)
    
}  

function generateFullLayout(): string {
    return expandToString`
<script async setup lang="ts">
import config from '@/config';
import { RouterView } from 'vue-router';
import HorizontalHeader from './horizontal-header/HorizontalHeader.vue';
import HorizontalSidebar from './horizontal-sidebar/HorizontalSidebar.vue';
import VerticalSidebarVue from './vertical-sidebar/VerticalSidebar.vue';
import VerticalHeaderVue from './vertical-header/VerticalHeader.vue';
import Customizer from './customizer/Customizer.vue';
</script>

<template>
    <!-----RTL LAYOUT------->
    <v-locale-provider v-if="!config.setRTLLayout">
        <v-app :theme="config.actTheme" :class="[
            config.actTheme,
            config.mini_sidebar ? 'mini-sidebar' : '',
            config.setHorizontalLayout ? 'horizontalLayout' : 'verticalLayout',
            config.setBorderCard ? 'cardBordered' : '',
            config.inputBg ? 'inputWithbg' : ''
        ]">
            <VerticalSidebarVue v-if="!config.setHorizontalLayout" />
            <VerticalHeaderVue v-if="!config.setHorizontalLayout" />
            <HorizontalHeader v-if="config.setHorizontalLayout" />
            <HorizontalSidebar v-if="config.setHorizontalLayout" />

            <v-main>
                <v-container fluid class="page-wrapper pb-sm-15 pb-10">
                    <div :class="config.boxed ? 'maxWidth' : ''">
                        <RouterView />
                    </div>
                </v-container>
            </v-main>
        </v-app>
    </v-locale-provider>
</template>
`
}