
//定义两个token
const token = '111222'

//根据token封装user
const users = {
    id:"1128217126515646466",
    createTime:"2019-05-14T16:34:58",
    updateTime:"2019-05-15T08:25:47",
    nickname:"游客",
    username:"test",password:"ba2db62f990019023b2dd826df80ddb9",sex:1,status:1,company:"test",phone:"18552365241",email:null,avatar:"http://jorianye.cn:8084/2019/05/15/17/234318328.jpg",roles:[{id:"1128215278081679361",createTime:"2019-05-14T16:27:38",updateTime:"2019-05-14T16:27:38",name:"GUEST",description:"游客，只能查看，不能修改删除",resources:null}]}



export default [
  // user login
  {
    url: '/account',
    type: 'post',
    response: config => {
      console.log(token)
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }
      return {
        code: 200,
        msg:'success',
        data: token
      }
    }
  },

  // get user info
  {
    url: '/account',
    type: 'get',
    response: (config) => {
      const info = users
      console.log(info)
      // mock error
      if (!info) {
        return {
          code: 50008,
          message: '登陆陆失败，无法获取用户详情'
        }
      }
      return {
        code: 200,
        msg:'游客信息',
        data: users
      }
    }
  },
  // user routers
  {
    url: '/account/routers',
    type: 'get',
    response: config => {
      return {
        code:200,
        msg:"操作成功",
        data:routers
      }
    }
  }
]
