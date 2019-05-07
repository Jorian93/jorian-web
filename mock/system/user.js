import Mock from 'mockjs'

const List = []
const count = 10
let currentuser={
    id: '101',
    createDate: '@datetime',
    nickname: 'admin 大魔王',
    username: 'admin',
    password: 'admin',
    roles: ['管理员',],
    sex: '',
    status: '',
    company: '',
    phone: '',
    email:'',
    avatar: Mock.Random.dataImage('200x300','admin大魔王'),
}
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    createDate: +Mock.Random.date('T'),
    nickname: '@cname()',
    username:'sdfasef'+i,
    password:'asdfasfsdsdfsdf',
    roles: ['管理员', '设备组','巡查组'],
    'sex|1': ['0', '1'],
    'status|1': ['0', '1'],
    'company|1': ['浙江可数科技有限公司', '江苏松岛科技有限公司','安徽森源科技有限公司'],
    phone:/^1[385][1-9]\d{8}/,
    email:'@email',
    avatar:''
  }))
}
const users = {
  'admin-token': {
    key:{
      id:'101'
    },
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    key:{
      id:'102'
    },
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

export default {
  getList: config => {
    const { nickname, status, username,phone,company, page = 1, limit = 20, sort } = config.query

    let mockList = List.filter(item => {

      if (status && item.status !== status) return false
      if (nickname && item.nickname.indexOf(nickname) < 0) return false
      if (username && item.username.indexOf(username) < 0) return false
      if (phone && item.phone.indexOf(phone) < 0) return false
      if (company && item.company.indexOf(company) < 0) return false
      return true
    })

    if (sort === '-id') {
      mockList = mockList.reverse()
    }

    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      total: mockList.length,
      items: pageList
    }
  },

  getUser: (config) => {
    const { token } = config.query
    const info = users[token]
    //根据info解出id，username，password，查询并返回详情

    return currentuser
  },
  createUser: () => ({
    data: 'success'
  }),
  updateUser: (config) => {

    const tempuser= Object.assign({},config)
    currentuser.avatar =tempuser.avatar
    return {
      data: 'success'
    }

  }
}
