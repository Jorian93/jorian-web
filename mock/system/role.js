import Mock from 'mockjs'
const List = []
const roles=['管理员', '设备组','巡查组',]
const count = 10


for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    createDate: +Mock.Random.date('T'),
    updateDate: +Mock.Random.date('T'),
    'roleName|1':roles ,
    "permission|1-10": ['@natural(1, 20)'],
    'company|1': ['浙江可数科技有限公司', '江苏松岛科技有限公司','安徽森源科技有限公司'],
  }))
}

export default {
  getList: config => {
    const { roleName, company, page = 1, limit = 20, sort } = config.query

    let mockList = List.filter(item => {
      if (company && item.company.indexOf(company) < 0) return false
      if (roleName && item.roleName.indexOf(roleName) < 0) return false
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
  getRole: (config) => {
    const { id } = config.query
    for (const article of List) {
      if (article.id === +id) {
        return article
      }
    }
  },
  createRole: () => ({
    data: 'success'
  }),
  updateRole: () => ({
    data: 'success'
  })
}
