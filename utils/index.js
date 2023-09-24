export const formatRecord = (record) => {
	const {
		value,
		tag,
		date,
		time,
		remark,
		dinnerTime,
		dinnerFood
	} = record;
	const userId = uni.getStorageSync("user")._id;
	const result = {
		date,
		userId,
	};
	switch (tag) {
		case "空腹":
			result.limosis = {
				value,
				time,
				remark
			}
			break;
		case "早餐后":
			result.afterBreakfast = {
				value,
				time,
				remark,
				dinnerTime,
				food: dinnerFood
			}
			break;
		case "午餐前":
			result.beforeLunch = {
				value,
				time,
				remark,
			}
			break;
		case "午餐后":
			result.afterLunch = {
				value,
				time,
				remark,
				dinnerTime,
				food: dinnerFood
			}
			break;
		case "晚餐前":
			result.beforeDinner = {
				value,
				time,
				remark,
			}
			break;
		case "晚餐后":
			result.afterDinner = {
				value,
				time,
				remark,
				dinnerTime,
				food: dinnerFood
			}
			break;
		case "睡前":
			result.beforeSleep = {
				value,
				time,
				remark,
			}
			break;
		default:
			console.log("非法的类型")
	}
	return result;
}