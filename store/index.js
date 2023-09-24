import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

const modelOption = {
	customUI: true,
	errorOptions: {
		type: 'toast'
	}
}

const store = new Vuex.Store({
	state: {
		tagList: ["空腹", "早餐后", "午餐前", "午餐后", "晚餐前", "晚餐后", "睡前"],
		// 云对象
		bloodSugarModel: uniCloud.importObject("bloodSugarModel", modelOption),
		userModel: uniCloud.importObject("userModel", modelOption)
	}
})

export default store;