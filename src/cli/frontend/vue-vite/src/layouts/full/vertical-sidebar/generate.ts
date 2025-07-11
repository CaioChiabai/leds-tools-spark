import fs from "fs";
import { expandToString } from "langium/generate";
import path from "path";
import { createPath } from "../../../../../../util/generator-utils.js";
import { LocalEntity, Model } from "../../../../../../../language/generated/ast.js";

export function generate(model: Model, listClassCRUD: LocalEntity[], target_folder: string) : void {
    
    const NavCollapse_folder =  createPath(target_folder, "NavCollapse")
    const NavGroup_folder = createPath(target_folder, "NavGroup")
    const NavItem_folder = createPath(target_folder, "NavItem")

    fs.mkdirSync(NavCollapse_folder, {recursive:true})
    fs.mkdirSync(NavItem_folder, {recursive:true})
    fs.mkdirSync(NavGroup_folder, {recursive:true})


    fs.writeFileSync(path.join(target_folder, 'Icon.vue'), generateIcon());
    fs.writeFileSync(path.join(target_folder, 'VerticalSidebar.vue'), generateVerticalSidebar());
    fs.writeFileSync(path.join(target_folder, 'sidebarItem.ts'), generateSidebarItem(model, listClassCRUD));
    fs.writeFileSync(path.join(NavGroup_folder, 'index.vue'), generateNavGroup());
    fs.writeFileSync(path.join(NavItem_folder, 'index.vue'), generateNavItem());
    fs.writeFileSync(path.join(NavCollapse_folder, 'NavCollapse.vue'), genenrateNavCollapse());

}  

function generateIcon(): string {
    return expandToString`
<script setup>
const props = defineProps({ item: Object, level: Number });
</script>

<template>
  <template v-if="level > 0">
    <component
      :is="item"
      size="14"
      stroke-width="1.5"
      class="iconClass"
    ></component>
  </template>
  <template v-else>
    <component
      :is="item"
      size="20"
      stroke-width="1.5"
      class="iconClass"
    ></component>
  </template>
</template>`
}

function generateVerticalSidebar(): string {
    return expandToString`
<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import { useCustomizerStore } from '@/stores/customizer';
import sidebarItems from './sidebarItem';

import NavGroup from './NavGroup/index.vue';
import NavItem from './NavItem/index.vue';
import NavCollapse from './NavCollapse/NavCollapse.vue';
import Logo from '../logo/Logo.vue';
import { useAuthStore } from '@/stores/auth';
const customizer = useCustomizerStore();
const sidebarMenu = shallowRef(sidebarItems);
const authStore = useAuthStore();
</script>

<template>
    <v-navigation-drawer left v-model="customizer.Sidebar_drawer" elevation="0" rail-width="75" 
        app class="leftSidebar" :rail="customizer.mini_sidebar" expand-on-hover width="256">
        <div class="pa-5 pl-4">
            <Logo />
        </div>
        <!-- ---------------------------------------------- -->
        <!---Navigation -->
        <!-- ---------------------------------------------- -->
        <perfect-scrollbar class="">
            <v-list class="py-6 px-4">
                <!---Menu Loop -->
                <template v-for="(item, i) in sidebarMenu">
                    <!---Item Sub Header -->
                    <NavGroup :item="item" v-if="item.header" :key="item.title" />
                    <!---If Has Child -->
                    <NavCollapse class="leftPadding" :item="item" :level="0" v-else-if="item.children" />
                    <!---Single Item-->
                    <NavItem :item="item" v-else class="leftPadding" />
                    <!---End Single Item-->
                </template>
            </v-list>
        </perfect-scrollbar>
    </v-navigation-drawer>
</template>`
}

function generateSidebarItem(model: Model, listClassCRUD: LocalEntity[]): string {
    
    let items = ""
    
    for(const cls of listClassCRUD) {
        items += `
  {
    title: "${cls.name}",
    icon: JumpRopeIcon,
    to: "/${cls.name}/Index${cls.name}",
  },`
    }

    const result =  generateSidebarItemText(items)
    return result;
}

function generateSidebarItemText(items: string): string {
    return expandToString`
import {
  AlertCircleIcon,
  ApertureIcon,
  AppsIcon,
  BasketIcon,
  BorderAllIcon,
  BorderHorizontalIcon,
  BorderInnerIcon,
  BorderStyle2Icon,
  BorderTopIcon,
  BorderVerticalIcon,
  BoxAlignBottomIcon,
  BoxAlignLeftIcon,
  BoxIcon,
  BoxModelIcon,
  BrandCodesandboxIcon,
  BrandTablerIcon,
  CalendarIcon,
  CardboardsIcon,
  ChartArcsIcon,
  ChartAreaIcon,
  ChartBarIcon,
  ChartCandleIcon,
  ChartDonut3Icon,
  ChartDotsIcon,
  ChartLineIcon,
  ChartPieIcon,
  ChartRadarIcon,
  CircleDotIcon,
  ColumnsIcon,
  EditCircleIcon,
  EyeTableIcon,
  FileDotsIcon,
  FilesIcon,
  FileTextIcon,
  FilterIcon,
  JumpRopeIcon,
  LayoutGridIcon,
  LayoutKanbanIcon,
  LoginIcon,
  Message2Icon,
  PageBreakIcon,
  PhotoIcon,
  RotateIcon,
  RowInsertBottomIcon,
  ServerIcon,
  SettingsIcon,
  ShoppingCartIcon,
  SortAscendingIcon,
  UserCircleIcon,
  UserPlusIcon,
  ZoomCodeIcon
} from 'vue-tabler-icons';

export interface menu {
  header?: string;
  title?: string;
  icon?: any;
  to?: string;
  chip?: string;
  chipBgColor?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
}

const sidebarItem: menu[] = [
  { header: 'SideBar' },
${items.slice(0, items.lastIndexOf(','))}
];

export default sidebarItem;`
}

function genenrateNavCollapse(): string {
    return expandToString`
<script setup>
import NavItem from '../NavItem/index.vue';
import Icon from '../Icon.vue';

const props = defineProps({ item: Object, level: Number });
</script>

<template>
    <!-- ---------------------------------------------- -->
    <!---Item Childern -->
    <!-- ---------------------------------------------- -->
    <v-list-group no-action>
        <!-- ---------------------------------------------- -->
        <!---Dropdown  -->
        <!-- ---------------------------------------------- -->
        <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" :value="item.title" rounded class="mb-1">
                <!---Icon  -->
                <template v-slot:prepend>
                    <Icon :item="item.icon" :level="level" />
                </template>
                <!---Title  -->
                <v-list-item-title class="mr-auto">{{ $t(item.title) }}</v-list-item-title>
                <!---If Caption-->
                <v-list-item-subtitle v-if="item.subCaption" class="text-caption mt-n1 hide-menu">
                    {{ item.subCaption }}
                </v-list-item-subtitle>
            </v-list-item>
        </template>
        <!-- ---------------------------------------------- -->
        <!---Sub Item-->
        <!-- ---------------------------------------------- -->
        <template v-for="(subitem, i) in item.children" :key="i" v-if="item.children">
            <NavCollapse :item="subitem" v-if="subitem.children" :level="level + 1" />
            <NavItem :item="subitem" :level="level + 1" v-else></NavItem>
        </template>
    </v-list-group>

    <!-- ---------------------------------------------- -->
    <!---End Item Sub Header -->
    <!-- ---------------------------------------------- -->
</template>`
}

function generateNavGroup(): string {
    return expandToString`
<script setup>
const props = defineProps({ item: Object });
</script>

<template>
    <v-list-subheader  class="smallCap text-uppercase text-subtitle-2 mt-5 font-weight-semibold d-flex align-items-center">
        <span class="mini-icon"><DotsIcon size="16" stroke-width="1.5" class="iconClass" /></span>
       <span class="mini-text">{{ $t(props.item.header) }}</span> 
    </v-list-subheader>
</template>`
}

function generateNavItem(): string {
    return expandToString`
<script setup>
import Icon from '../Icon.vue';

const props = defineProps({ item: Object, level: Number });
</script>

<template>
    <!---Single Item-->
    <v-list-item
        :to="item.type === 'external' ? '' : item.to"
        :href="item.type === 'external' ? item.to : ''"
        rounded
        class="mb-1"
        :disabled="item.disabled"
        :target="item.type === 'external' ? '_blank' : ''"
        v-scroll-to="{ el: '#top' }"
    >
        <!---If icon-->
        <template v-slot:prepend>
            <Icon :item="item.icon" :level="level" />
        </template>
        <v-list-item-title>{{ $t(item.title) }}</v-list-item-title>
        <!---If Caption-->
        <v-list-item-subtitle v-if="item.subCaption" class="text-caption mt-n1 hide-menu">
            {{ item.subCaption }}
        </v-list-item-subtitle>
        <!---If any chip or label-->
        <template v-slot:append v-if="item.chip">
            <v-chip
                :color="item.chipColor"
                :class="'sidebarchip hide-menu bg-' + item.chipBgColor"
                :size="item.chipIcon ? 'small' : 'small'"
                :variant="item.chipVariant"
                :prepend-icon="item.chipIcon"
            >
                {{ item.chip }}
            </v-chip>
        </template>
    </v-list-item>
</template>`
}