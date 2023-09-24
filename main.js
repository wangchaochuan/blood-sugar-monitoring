import App from './App'
import uView from '@/uni_modules/uview-ui'
import dayjs from "dayjs"
import store from "@/store/index.js"
Vue.use(uView)
Vue.prototype.$store = store

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	store,
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif