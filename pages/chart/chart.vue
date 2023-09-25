<template>
	<view class="container">
		<tabbar :current="3"></tabbar>
		<scroll-view class="chart-container">
			<qiun-data-charts type="line" :opts="opts" :chartData="chartData" :ontouch="true" />
		</scroll-view>
	</view>
</template>

<script>
	import dayjs from "dayjs";
	export default {
		data() {
			return {
				chartData: {},
				//您可以通过修改 config-ucharts.js 文件中下标为 ['line'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
				opts: {
					color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
						"#ea7ccc"
					],
					padding: [15, 10, 0, 15],
					enableScroll: true,
					legend: {},
					xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 4
					},
					yAxis: {
						gridType: "dash",
						dashLength: 2
					},
					extra: {
						line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
						}
					}
				}
			};
		},
		computed: {
			model() {
				return this.$store.state.bloodSugarModel;
			}
		},
		onReady() {
			this.getServerData();
		},
		methods: {
			async getServerData() {
				const user = uni.getStorageSync("user")
				const response = await this.model.getRecordList(user?._id);
				const data = {
					series: []
				};
				const list = response.detail;
				data.categories = list.map(v => dayjs(v.date).format("YYYY-MM-DD"));
				const keyList = [{
					key: "limosis",
					label: "空腹血糖"
				}, {
					key: "afterBreakfast",
					label: "早餐后血糖"
				}, {
					key: "beforeLunch",
					label: "午餐前血糖"
				}, {
					key: "afterLunch",
					label: "午餐后血糖"
				}, {
					key: "beforeDinner",
					label: "晚餐前血糖"
				}, {
					key: "afterDinner",
					label: "晚餐后血糖"
				}, {
					key: "beforeSleep",
					label: "睡前血糖"
				}];
				keyList.forEach(v => {
					const name = v.label;
					const array = list.map(k => k[v.key]?.value || 0)
					data.series.push({
						name,
						data: array
					})
				})
				this.chartData = JSON.parse(JSON.stringify(data));
			},
		}
	};
</script>


<style lang="scss">
	.container {
		height: calc(100vh - 200rpx);

		.chart-container {
			height: fit-content;
			max-height: 100%;
		}
	}
</style>