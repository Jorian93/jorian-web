import Mock from 'mockjs'

const List = []
const count = 10



for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    createDate: +Mock.Random.date('T'),
    updateDate:new Date(),
    'status|1': ['0','1'],
    code:'@guid',
    expireDate: +Mock.Random.date('T'),
    company:'@city(true)'+'文保所',
    owner:'',
    tel:''
  }))
}

export default {
  getList: config => {
    const { company, status,  page = 1, limit = 20, sort } = config.query
  /*  List.forEach((item)=>{
      let time1=new Date()//Wed Apr 03 2019 16:38:26 GMT+0800 (中国标准时间)
      let time2=item.expireDate.getTime()
      alert(time1+"iiii"+time2)
      if(time2<time1){
        item.status='1'
      }else{
        item.status='0'
      }

    })*/
    let mockList = List.filter(item => {
      if (status && item.status !== status) return false
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
  getPv: () => ({
    pvData: [{ key: 'PC', pv: 1024 }, { key: 'mobile', pv: 1024 }, { key: 'ios', pv: 1024 }, { key: 'android', pv: 1024 }]
  }),
  getLicense: (config) => {
    const { id } = config.query
    for (const article of List) {
      if (article.id === +id) {
        return article
      }
    }
  },
  createLicense: () => ({
    data: 'success'
  }),
  updateLicense: () => ({
    data: 'success'
  })
}
