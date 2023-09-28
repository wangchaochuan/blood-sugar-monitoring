<template>
	<view class="container">
		<tabbar :current="2"></tabbar>
		<scroll-view class="form-container">
			<u--form labelPosition="top" :model="record" :rules="rules" ref="uForm" :labelWidth="80" labelAlign="left">
				<u-form-item label="血糖值" prop="value" required>
					<u-input v-model="record.value" type="digit" placeholder="请输入" border="bottom" inputAlign="right">
						<u--text text="mmol/L" slot="suffix" margin="0 3px 0 0" type="tips"></u--text>
					</u-input>
				</u-form-item>
				<u-form-item label="记录日期" prop="date" @click="showDatePicker=true">
					<u-input v-model="record.date" border="bottom" inputAlign="right" readonly></u-input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<u-form-item label="记录时间" prop="time" @click="showTimePicker=true">
					<u-input v-model="record.time" border="bottom" inputAlign="right" readonly></u-input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<u-form-item label="时段标签" prop="tag" @click="showPicker=true">
					<u-input v-model="record.tag" border="bottom" inputAlign="right" readonly></u-input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<u-form-item v-if="showDinnerLabel" :label="record.tag.substring(0,2)+'时间'" prop="dinnerTime"
					@click="showDinnerPicker=true">
					<u-input v-model="record.dinnerTime" border="bottom" inputAlign="right" placeholder="请选择"
						readonly></u-input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<u-form-item v-if="showDinnerLabel" :label="record.tag.substring(0,2)+'食物'" prop="dinnerFood">
					<u--textarea v-model="record.dinnerFood" placeholder="请输入" border="bottom" autoHeight></u--textarea>
				</u-form-item>
				<u-form-item label="备注" prop="remark">
					<u--textarea v-model="record.remark" placeholder="请输入该记录的备注" border="bottom"
						autoHeight></u--textarea>
				</u-form-item>
			</u--form>
		</scroll-view>
		<u-datetime-picker v-model="date" mode="date" :show="showDatePicker" :closeOnClickOverlay="true"
			@confirm="confirmDate" @close="showDatePicker=false" @cancel="showDatePicker=false"
			:max-date="current"></u-datetime-picker>
		<u-datetime-picker v-model="time" mode="time" :show="showTimePicker" :closeOnClickOverlay="true"
			@confirm="confirmTime" @close="showTimePicker=false" @cancel="showTimePicker=false"></u-datetime-picker>
		<u-datetime-picker v-model="dinnerTime" mode="time" :show="showDinnerPicker" :closeOnClickOverlay="true"
			@confirm="confirmDinnerTime" @close="showDinnerPicker=false"
			@cancel="showDinnerPicker=false"></u-datetime-picker>
		<u-picker v-model="record.tag" :show="showPicker" :closeOnClickOverlay="true" :columns="[tagList]"
			@confirm="confirmTag" @close="showPicker=false" @cancel="showPicker=false"></u-picker>
		<view class="submit">
			<u-button text="提交" size="large" type="primary" shape="circle" @click="submit"></u-button>
		</view>
		<view class="reset">
			<u-button text="重置" size="large" type="error" shape="circle" @click="reset"></u-button>
		</view>
	</view>
</template>

<script>
	import dayjs from 'dayjs';
	import {
		formatRecord
	} from "@/utils/index.js";
	export default {
		data() {
			return {
				showPicker: false,
				showDatePicker: false,
				showTimePicker: false,
				showDinnerPicker: false,
				showDinnerLabel: false,
				date: dayjs().valueOf(), // 与record.date保持一致,但是不能使用同一个变量,因为数据格式不一样
				time: dayjs().format("HH:mm"),
				dinnerTime: dayjs().format("HH:mm"),
				current: dayjs().valueOf(), // 最大日期为当前日期
				maxHour: dayjs().format("HH"),
				record: {
					value: undefined,
					tag: "空腹",
					dinnerTime: undefined,
					dinnerFood: undefined,
					remark: undefined,
					date: dayjs().format("YYYY-MM-DD"),
					time: dayjs().format("HH:mm"),
				},
				rules: {
					'value': {
						type: 'number',
						required: true,
						message: '请填写血糖值',
						trigger: ['blur']
					},
				},
			};
		},
		computed: {
			tagList() {
				return this.$store.state.tagList;
			},
		},
		watch: {
			"record.tag": {
				handler(value) {
					this.showDinnerLabel = ["早餐后", "午餐后", "晚餐后"].includes(value);
				},
				immediate: true
			}
		},
		methods: {
			confirmDate(e) {
				this.date = e.value;
				this.record.date = dayjs(e.value).format("YYYY-MM-DD");
				this.showDatePicker = false;
			},
			confirmTime(e) {
				this.time = e.value;
				this.record.time = e.value;
				this.showTimePicker = false;
			},
			confirmDinnerTime(e) {
				this.dinnerTime = e.value;
				this.record.dinnerTime = e.value;
				this.showDinnerPicker = false;
			},
			confirmTag(e) {
				this.record.tag = e.value[0];
				this.showPicker = false;
			},
			reset() {
				this.record = {
					value: undefined,
					tag: "空腹",
					dinnerTime: undefined,
					dinnerFood: undefined,
					remark: undefined,
					time: dayjs().format("YYYY/MM/DD HH:mm"),
				}
			},
			async submit() {
				try {
					await this.$refs.uForm.validate();
					const record = {
						...this.record,
						value: Number(this.record.value),
						date: dayjs(this.record.date).startOf('day').valueOf(),
						dateStr: dayjs(this.record.date).format("YYYY-MM-DD")
					}
					const params = formatRecord(record);
					const db = uniCloud.database();
					const _ = db.command;
					const collection = db.collection("blood-sugar");
					const {
						userId,
						date
					} = params;
					const response = await collection.where(_.and({
						userId
					}, {
						date
					})).get()
					let res = null;
					// 已经存在的数据，更新即可
					if (response?.result?.affectedDocs) {
						const _id = response.result.data[0]._id;
						res = await collection.doc(_id).update(params);
					} else {
						// 否则新增
						res = await collection.add(params)
					}
					if (res?.result?.errCode === 0) {
						uni.showToast({
							title: "添加记录成功"
						})
						setTimeout(() => {
							this.reset();
							uni.switchTab({
								url: "/pages/list/list"
							})
						}, 1500)
					}
				} catch (e) {
					console.error(e.message)
					//TODO handle the exception
					uni.showToast({
						title: e.message
					})
				}
			}
		},
		onReady() {
			//如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
			this.$refs.uForm.setRules(this.rules)
		},
	};
</script>

<style scoped lang="scss">
	.container {
		height: calc(100vh - 200rpx);
		display: flex;
		flex-direction: column;
		padding: 32rpx;

		&>.form-container {
			flex: 1;
		}

		.submit,
		.reset {
			height: 100rpx;
			margin-bottom: 24rpx;
		}
	}
</style>