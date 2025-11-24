import Vue from 'nativescript-vue'
import {createPinia} from "pinia";
import { createApp } from 'nativescript-vue'
import App from './App.vue';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.start();

