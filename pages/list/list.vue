<template>
	<view class="container">
		<tabbar :current="1"></tabbar>
		<u-loading-icon size="24" color="#4c5cdb" :show="loading"></u-loading-icon>
		<u-empty mode="history" :show="list.length===0" text="暂无历史记录" marginTop="36"></u-empty>
		<u--form v-if="list.length>0" labelPosition="top" :model="condition" ref="uForm" :labelWidth="80"
			labelAlign="left">
			<u-form-item label="日期范围" prop="range" @click="showRangePicker=true">
				<u-input v-model="condition.range" border="bottom" placeholder="请选择查询起止日期,默认查询最近7天" inputAlign="right"
					readonly></u-input>
				<u-icon slot="right" name="arrow-right"></u-icon>
			</u-form-item>
		</u--form>
		<scroll-view v-if="list.length>0">
			<view v-for="item in list" :key="item._id">
				<view class="card">
					<view class="date">{{formatDate(item.date)}}</view>
					<view v-for="v in keyList" :key="v.key" class="tag">
						<u-swipe-action>
							<u-swipe-action-item :options="options" autoClose
								@click="edit(item[v.key],v.key,item.date)">
								<view class="value-container">
									<view class="left">
										{{v.label}}
									</view>
									<view class="right">
										<u-text :text="formatValue(item[v.key],'value')"
											:color="formatClass(item[v.key])"></u-text>
										<text v-if="formatValue(item[v.key],' value')!=='-'">mmol/L</text>
									</view>
								</view>
								<view class=" time-container">
									<view class="left">
										记录时间
									</view>
									<view class="right">{{formatValue(item[v.key],"time")}}</view>
								</view>
							</u-swipe-action-item>
						</u-swipe-action>
					</view>
				</view>
			</view>
		</scroll-view>
		<u-calendar :show="showRangePicker" :default-date="defaultDate" title="日期范围" :min-date="minDate"
			:max-date="maxDate" mode="range" :closeOnClickOverlay="true" :allowSameDay="true" :monthNum="4"
			@close="showRangePicker=false" @confirm="confirm">
		</u-calendar>
	</view>
</template>

<script>
	import dayjs from "dayjs";
	export default {
		data() {
			return {
				loading: false,
				list: [],
				defaultDate: [],
				minDate: dayjs().subtract(90, 'day').format("YYYY-MM-DD"),
				maxDate: dayjs().format("YYYY-MM-DD"),
				condition: {
					range: dayjs().subtract(6, 'day').format("YYYY-MM-DD") + "~" + dayjs().format("YYYY-MM-DD")
				},
				showRangePicker: false,
				options: [{
					text: "编辑",
					style: {
						backgroundColor: "#4c5cdb"
					}
				}],
				keyList: [{
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
				}]
			};
		},
		methods: {
			formatDate(date) {
				return dayjs(date).format("YYYY-MM-DD")
			},
			formatValue(o, key) {
				return o?.[key] || "-"
			},
			formatClass(o) {
				const value = o?.value;
				if (value < 7) {
					return "#5ac725"
				}
				if (value < 10) {
					return "#f9ae3d"
				}
				if (value >= 10) {
					return "#f56c6c"
				}
				return ""
			},
			edit(v, k, d) {
				const map = {
					limosis: "空腹",
					afterBreakfast: "早餐后",
					beforeLunch: "午餐前",
					afterLunch: "午餐后",
					beforeDinner: "晚餐前",
					afterDinner: "晚餐后",
					beforeSleep: "睡前"
				}
				const tag = map[k];
				const date = dayjs(d).format("YYYY-MM-DD");
				const record = {
					...v,
					tag,
					date,
					dinnerFood: v.food
				}
				const params = Object.keys(record).reduce((value, key) => `${value}&${key}=${record[key]}`, "")
				uni.navigateTo({
					url: `/pages/edit/edit?${params}`
				})
			},
			confirm(e) {
				this.condition.range = e[0] + "~" + e[e.length - 1];
				this.showRangePicker = false;
				this.getData()
			},
			async getData() {
				try {
					this.loading = true;
					const userId = uni.getStorageSync("user")?._id;
					const [start, end] = this.condition.range.split('~');
					const startTime = dayjs(start).valueOf();
					const endTime = dayjs(end).valueOf();
					const db = uniCloud.database();
					const _ = db.command;
					if (userId) {
						const response = await db.collection("blood-sugar").orderBy("date desc").where({
							userId,
							date: _.gte(startTime).and(_.lte(endTime))
						}).get();
						if (response.result.errCode === 0) {
							const list = response.result.data;
							this.list = list;
						}
					}
				} catch (e) {
					//TODO handle the exception
					uni.showToast({
						title: e.message
					})
				} finally {
					this.loading = false;
				}
			}
		},
		onShow() {
			for (let i = 6; i >= 0; i--) {
				this.defaultDate.push(dayjs().subtract(i, 'day').format("YYYY-MM-DD"))
			}
			this.getData();
		}
	}
</script>

<style lang="scss">
	.container {
		height: calc(100vh - 200rpx);
		overflow-y: auto;
		padding: 32rpx;

		.card {
			min-height: 100rpx;
			border: 2rpx solid #bfbfbf;
			border-radius: 16rpx;
			box-shadow: 0 4rpx 4rpx #efefef;
			padding: 16rpx;
			margin-bottom: 24rpx;

			.date {
				line-height: 64rpx;
				border-bottom: 2rpx dashed #efefef;
			}

			.tag {
				border-bottom: 2rpx dashed #efefef;

				.value-container,
				.time-container {
					display: flex;
					padding-right: 16rpx;
					justify-content: space-between;

					&>view {
						line-height: 64rpx;
					}
				}
			}
		}
	}
</style>