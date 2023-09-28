<script>
	export default {
		computed: {
			userModel() {
				return this.$store.state.userModel;
			}
		},
		onLaunch: async function() {
			uni.hideTabBar({});
			try {
				const user = uni.getStorageSync("user")
				if (!user) {
					const {
						code
					} = await uni.login({
						provider: "weixin"
					});
					const response = await this.userModel.login(code);
					if (response?.detail?.user) {
						uni.setStorageSync("user", response.detail.user)
					}
				} else {
					uni.setStorageSync("user", user)
				}
			} catch (e) {
				//TODO handle the exception
			}
		},
		onShow: function() {
			uni.hideTabBar({})
		},
		onHide: function() {}
	}
</script>

<style>
	/*每个页面公共css */
</style>