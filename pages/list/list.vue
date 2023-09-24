<template>
	<view>
		<tabbar :current="1"></tabbar>
		<u-loading-icon size="24" color="#4c5cdb" :show="loading"></u-loading-icon>
		<u-empty mode="history" :show="list.length===0" text="暂无历史记录" marginTop="36"></u-empty>
		<scroll-view v-if="list.length>0">
			<view v-for="item in list" :key="item._id">
				<view v-text="item._id"></view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loading: false,
				list: []
			};
		},
		computed: {
			model() {
				return this.$store.state.bloodSugarModel;
			}
		},
		async onShow() {
			try {
				const user = uni.getStorageSync("user")
				const response = await this.model.getRecordList(user?._id);
				this.list = response.detail;
			} catch {}
		}
	}
</script>

<style lang="scss">

</style>