// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
// 小程序的appId和appSecret
const mp_wx_data = {
	appId: "wxfe36b2900ac8ac84",
	appSecret: "e15286190840140f738979ac8b0e24d5"
}
const db = uniCloud.database();
const _ = db.command;
const userCollection = db.collection("users");
/** 
 * @description 根据微信小程序code获取用户openId和session_key
 * @@param {string} code 
 * @@return {string} openId
 * @@return {string} session_key
 */
async function _getOpenId(code) {
	const params = {
		appid: mp_wx_data.appId,
		secret: mp_wx_data.appSecret,
		js_code: code,
		grant_type: "authorization_code"
	}
	try {
		const {
			data
		} = await uniCloud.httpclient.request("https://api.weixin.qq.com/sns/jscode2session", {
			method: 'GET',
			data: params,
			contentType: 'json', // 指定以application/json发送data内的数据
			dataType: 'json' // 指定返回值为json格式，自动进行parse
		})
		return {
			openId: data.openid,
			sessionKey: data.session_key
		}
	} catch (e) {
		throw new Error(e.message)
	}
}

/**
 * @description 注册用户
 * @@param {string} code 
 * @@return {string} token
 */
async function _register(openId, userInfo) {
	try {
		// user表中插入数据
		const result = await userCollection.add({
			nickName: userInfo?.nickName,
			avatarUrl: userInfo?.avatarUrl,
			gender: userInfo?.gender,
			mp_wx_openid: openId,
			register_date: new Date().getTime()
		})
		// 写入数据失败
		if (!result.id) {
			throw new Error("写入数据失败")
		}
		const user = await getUser(openId);
		return user;
	} catch (e) {
		console.log(e)
		return null;
	}
}

async function getUser(openId) {
	try {
		const result = await userCollection.where({
			mp_wx_openid: openId
		}).get();
		return result.data[0]
	} catch (e) {
		return {
			errCode: 'get user failed',
			errMsg: e.message
		}
	}
}

module.exports = {
	// 预处理 _before 一般用于拦截器、统一的身份验证、参数校验等。
	_before: function() {},
	/**
	 * @description 登录
	 * @@param {string} code 
	 * @@return {string} token
	 */
	login: async function(code) {
		try {
			if (!code) {
				return {
					errCode: 'code is null',
					errMsg: '参数不能为空'
				}
			}
			const {
				openId,
				sessionKey
			} = await _getOpenId(code);
			if (!openId) {
				return {
					errCode: 'get openid failed',
					errMsg: '从微信获取登录信息失败'
				}
			}
			let user = await getUser(openId);
			// 尚未注册的用户,先注册
			if (!user) {
				user = _register(openId)
			}
			if (user?._id) {
				return {
					errCode: 0,
					errMsg: 'login success',
					detail: {
						user
					}
				}
			}
			return {
				errCode: "login failed",
				errMsg: '登录失败'
			}
		} catch (e) {
			return {
				errCode: 'login failed',
				errMsg: e.message
			}
		}
	},
	toJSON() {}
}