import Mock from 'mockjs'
const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    createDate: +Mock.Random.date('T'),
    name: '@cname()',
    'role|1': ['管理员', '设备组','巡查组'],
    'sex|1': ['男', '女'],
    'status|1': [0, 1],
    'company|1': ['浙江可数科技有限公司', '江苏松岛科技有限公司','安徽森源科技有限公司'],
    phone:/^1[385][1-9]\d{8}/
    /*forecast: '@float(0, 100, 2, 2)',
    importance: '@integer(1, 3)',
    'type|1': ['CN', 'US', 'JP', 'EU'],
    'status|1': ['published', 'draft', 'deleted'],
    display_time: '@datetime',
    comment_disabled: true,
    pageviews: '@integer(300, 5000)',
    image_uri,
    platforms: ['a-platform']*/
  }))
}

export default {
  getList: config => {
    const { importance, type, title, page = 1, limit = 20, sort } = config.query

    let mockList = List.filter(item => {
      if (importance && item.importance !== +importance) return false
      if (type && item.type !== type) return false
      if (title && item.title.indexOf(title) < 0) return false
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
    const { id } = config.query
    for (const article of List) {
      if (article.id === +id) {
        return article
      }
    }
  },
  createUser: () => ({
    data: 'success'
  }),
  updateUser: () => ({
    data: 'success'
  })
}
