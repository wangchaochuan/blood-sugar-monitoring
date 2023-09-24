<template>
	<view class="container">
		<!-- <tabbar :current="4"></tabbar> -->
		<u-avatar :src="default_Avatar"></u-avatar>
		<view class="login">
			<u-button type="primary" :plain="true" size="small" text="登录" @click="login"></u-button>
		</view>
	</view>
</template>

<script>
	import default_Avatar from "@/pages/personal-center/data.js";
	export default {
		data() {
			return {
				user: null
			};
		},
		computed: {
			userModel() {
				return this.$store.state.userModel;
			}
		},	
		methods: {
			login: async function() {
				// if (this.userInfo && this.userInfo.avatarUrl) {
				// 	uni.showLoading({
				// 		title: '正在上传图片...',
				// 		mask: true
				// 	});
				// 	//上传头像至云储存并返回图片链接
				// 	const imageUrl = await uploadImage(this.userInfo.avatarUrl)
				// 	if (!imageUrl) {
				// 		return
				// 	}
				// 	this.userInfo = {
				// 		...this.userInfo,
				// 		avatarUrl: imageUrl.fileID
				// 	}
				// }
				const {
					code
				} = await uni.login({
					provider: "weixin"
				});
				const response = await this.userModel.login(code);
			}
		},
	}
</script>

<style scoped lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		height: calc(100vh - 200rpx);
		padding: 32rpx;
		overflow-y: auto;

		.login {
			width: 200rpx;
			margin-top: 16rpx;
		}
	}
</style>