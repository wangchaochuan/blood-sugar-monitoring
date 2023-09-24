<template>
	<view class="container">
		<tabbar :current="4"></tabbar>
		<view class="cookbook">
			<view class="title">
				<view class="date">
					<view>今天是</view>
					<view class="text">{{date}}</view>
				</view>
				<view class="day">{{week}}</view>
			</view>
			<view class="content">
				<view class="text">今天为您推荐的食谱为：</view>
				<view class="breakfast">
					<view class="label">早餐：</view>
					<view>{{breakfast}}</view>
				</view>
				<view class="lunch">
					<view class="label">午餐：</view>
					<view>{{lunch}}</view>
				</view>
				<view class="dinner">
					<view class="label">晚餐：</view>
					<view>{{dinner}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import dayjs from "dayjs";
	const breakfastMap = {
		0: "窝头1个(50克)，牛奶1杯(250毫升)，鸡蛋1个，凉拌豆芽1小蝶。",
		1: "全麦面包片(50克)，豆浆1杯(400毫升)，茶鸡蛋1个，凉拌苦瓜1小蝶。",
		2: "蔬菜包子1个(50克)，米粥1碗，鸡蛋1个，拌白菜心1小蝶。",
		3: "豆包1个(50)，荷叶绿豆粥1碗，鸡蛋1个，凉拌三丝1小蝶。",
		4: "牛奶燕麦粥(牛奶250毫升，燕麦25克)，鸡蛋羹(鸡蛋1个)，海米拌芹菜1小蝶。",
		5: "全麦小馒头1个(50克)，薏苡仁粥1碗，鸡蛋1个，拌莴笋丝1小蝶。",
		6: "牛奶240ml，鸡蛋1个，馒头50克",
	};
	const lunchMap = {
		0: "米饭一碗(100克)，雪菜豆腐，肉丝炒芹菜。",
		1: "烙饼2块(100块)，口蘑冬瓜，牛肉丝炒胡萝卜。",
		2: "荞麦面条1碗(100克)，西红柿炒鸡蛋，素鸡菠菜。",
		3: "玉米面馒头1个(100克)，炒鱿鱼卷芹菜，素烧茄子。",
		4: "荞麦大米饭1碗(100克)，青椒肉丝，香菇豆腐汤。",
		5: "茭白鳝丝面(含面条100克)，醋溜大白菜。",
		6: "烙饼150克，酱牛肉80克，醋烹豆芽菜",
	};
	const dinnerMap = {
		0: "馒头1个(100克)，盐水大虾，鸡片炒油菜。",
		1: "米饭1碗(100克)，鸡汤豆腐小白菜，清炒虾仁黄瓜。",
		2: "紫米馒头1个(100克)，香菇菜心，沙锅小排骨。",
		3: "米饭1碗(100克)，葱花烧豆腐，椒油圆白菜。。",
		4: "花卷1个(100克)，醋椒鱼，西红柿炒扁豆。",
		5: "葱油饼(含面粉100克)，芹菜香干，紫菜冬瓜汤。",
		6: "米饭150克，肉末烧豆腐，蒜茸菠菜",
	};
	export default {
		data() {
			return {
				date: "",
				week: "",
				breakfast: "",
				lunch: "",
				dinner: ""
			};
		},
		methods: {
			async login() {
				const {
					code
				} = await uni.login({
					provider: "weixin"
				})
				const model = this.$store.state.bloodSugarModel;
				const params = {
					js_code: code,
					grant_type: "authorization_code",
					appid: this.$store.state.appId,
					secret: this.$store.state.appSecret
				}
				const data = await model.getOpenId(params);
				console.log(data)
			},
		},
		onLoad() {
			const time = new Date();
			const date = dayjs(time).format("YYYY-MM-DD");
			const day = dayjs(time).day();
			let week = "星期";
			switch (day) {
				case 0:
					week += "日";
					break;
				case 1:
					week += "一";
					break;
				case 2:
					week += "二";
					break;
				case 3:
					week += "三";
					break;
				case 4:
					week += "四";
					break;
				case 5:
					week += "五";
					break;
				case 6:
					week += "六";
					break;
			}
			const breakfast = breakfastMap[day];
			const lunch = lunchMap[day];
			const dinner = dinnerMap[day];
			this.date = date;
			this.week = week;
			this.breakfast = breakfast;
			this.lunch = lunch;
			this.dinner = dinner;
		}
	}
</script>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		height: calc(100vh - 200rpx);

		.login {
			margin-bottom: 16rpx;
		}
	}

	.cookbook {
		width: calc(100vw - 64rpx);
		flex: 1;
		overflow-y: auto;
		padding: 32rpx;
		line-height: 54rpx;
	}

	.date {
		display: flex;
	}

	.date>.text {
		color: #4c5cdb;
		margin-left: 8rpx;
	}

	.day {
		color: red;
	}

	.label {
		font-weight: 700;
	}
</style>