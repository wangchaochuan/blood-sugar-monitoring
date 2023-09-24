// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const db = uniCloud.database();
const _ = db.command;
const bsCollection = db.collection("blood-sugar");

async function updateRecord(_id, record) {
	try {
		const {
			updated
		} = await bsCollection.where({
			_id: _id
		}).update(record);
		return updated
	} catch (e) {
		//TODO handle the exception
		return null;
	}
}

async function getOneRecord(condition) {
	try {
		const {
			data
		} = await bsCollection.where(condition).get()
		return data?.[0];
	} catch (e) {
		//TODO handle the exception
		return null;
	}
}

module.exports = {
	// 预处理 _before 一般用于拦截器、统一的身份验证、参数校验等。
	_before() {
		// 获取客户端信息
		const clientInfo = this.getClientInfo()
		// 获取 token  缓存字段必须是 uni_id_token
		const token = this.getUniIdToken()
		// 获取方法名
		const methodName = this.getMethodName()
		// 获取参数 []
		const params = this.getParams();
	},
	// 后处理 _after 用来再加工处理本次调用方法的返回结果或者抛出的错误
	// 可以不写。如果写了 _after 那么就要 return result 否则接收不到信息
	_after(error, result) {
		if (error) {
			throw error // 如果方法抛出错误，也直接抛出不处理
		}
		return result
	},
	/**
	 * 添加血糖记录
	 * @param {string} param1 参数1描述
	 * @returns {object} 返回值描述
	 */
	async addRecord(params) {
		// 参数校验，如无参数则不需要
		if (!params) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '参数不能为空'
			}
		}
		// 业务逻辑
		try {
			const {
				userId,
				date
			} = params;
			const record = await getOneRecord(_.and({
				userId: userId
			}, {
				date: date
			}));
			if (record?._id) {
				const updated = await updateRecord(record._id, params)
				if (updated) {
					return {
						errCode: 0,
						errMsg: '添加数据成功'
					}
				}
			} else {
				const res = await bsCollection.add({
					...params
				})
				if (res.id) {
					return {
						errCode: 0,
						errMsg: '添加数据成功'
					}
				}
			}
			return {
				errCode: "add failed",
				errMsg: '添加数据失败'
			}
		} catch (e) {
			console.log(e.message)
			return {
				errCode: "add failed",
				errMsg: '添加数据失败'
			}
		}
	},
	async getRecordList(userId) {
		try {
			if (!userId) {
				return {
					errCode: 'PARAM_IS_NULL',
					errMsg: '参数不能为空'
				}
			}
			const response = await bsCollection.where({
				userId: userId
			}).get();
			return {
				errCode: 0,
				detail: response.data
			}
		} catch (e) {
			//TODO handle the exception
			console.log(e.message)
		}
	},
	toJSON() {}
}