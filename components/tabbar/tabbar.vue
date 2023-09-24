<template>
	<view>
		<u-tabbar :value="current?current:0" @change="tabbarChange" :fixed="true" :placeholder="false"
			:safeAreaInsetBottom="true" activeColor="#4c5cdb">
			<u-tabbar-item text="控糖小贴士"
				:icon="current===0?'/static/knowledge-active.png':'/static/knowledge.png'"></u-tabbar-item>
			<u-tabbar-item text="历史记录"
				:icon="current===1?'/static/history-active.png':'/static/history.png'"></u-tabbar-item>
			<u-tabbar-item text="添加记录" :icon="current===2?'/static/add-active.png':'/static/add.png'"></u-tabbar-item>
			<u-tabbar-item text="统计图表"
				:icon="current===3?'/static/chart-active.png':'/static/chart.png'"></u-tabbar-item>
			<u-tabbar-item text="推荐食谱" :icon="current===4?'/static/food-active.png':'/static/food.png'"></u-tabbar-item>
		</u-tabbar>
	</view>
</template>

<script>
	export default {
		props: {
			current: Number
		},
		data() {
			return {
				list: [{
						path: "pages/knowledge/knowledge"
					}, {
						path: "pages/list/list"
					},
					{
						path: 'pages/add/add'
					},
					{
						path: 'pages/chart/chart'
					},
					{
						path: "pages/cookbook/cookbook"
					}
				]
			};
		},
		methods: {
			tabbarChange(e) {
				uni.switchTab({
					url: '/' + this.list[e].path
				})
			}
		}
	}
</script>

<style lang="scss">

</style>