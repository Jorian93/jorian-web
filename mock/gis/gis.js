import Mock from 'mockjs'

const DeviceList = []
const WarningList = []
const HealthList = []
const devicemakerstype = [
  {key: '水质仪', icon: require("@/assets/png/flag-red.png")},
  {key: '裂缝计', icon: require("@/assets/png/crevice.png")},
  {key: '沉降仪', icon: require("@/assets/png/ruler.png")},
  {key: '温湿计', icon: require("@/assets/png/tempture.png")},
]
const warningmakerstype = [
  {key: '一级告警', icon: require("@/assets/png/flag-red.png")},
  {key: '二级告警', icon: require("@/assets/png/levelWarning2.png")},
  {key: '三级告警', icon: require("@/assets/png/levelWarning3.png")},
  {key: '四级告警', icon: require("@/assets/png/levelWarning4.png")},
]

const healthmakerstype = [
  {key: '良好', icon:require("@/assets/png/flag-red.png")},
  {key: '一般', icon: require("@/assets/png/fineless.png")},
  {key: '较差', icon: require("@/assets/png/bad.png")},]

const count =40

for (let i = 0; i < count; i++) {
  DeviceList.push(Mock.mock({
    id: '@increment',
    type:devicemakerstype[i % 4].key,
    text: 'D',
    icon:devicemakerstype[0].icon,
    level: 'A',
    lnglat: [120.0+Mock.Random.float(0, 1, 5, 5),30.129556+Mock.Random.float(0, 1, 5, 5)],
  }))
  WarningList.push(Mock.mock({
    id:  '@increment',
    type:warningmakerstype[i % 4].key,
    icon:warningmakerstype[0].icon,
    text: 'W',
    level: 'B',
    lnglat:[120.0+Mock.Random.float(0, 1, 5, 5),30.129556+Mock.Random.float(0, 1, 5, 5)],
  }))
  HealthList.push(Mock.mock({
    id:  '@increment',
    type:healthmakerstype[i % 3].key,
    icon:healthmakerstype[0].icon,
    text: 'H',
    level: 'C',
    lnglat: [120.0+Mock.Random.float(0, 1, 5, 5),30.129556+Mock.Random.float(0, 1, 5, 5)],
  }))
}

export default {
  getDeviceList: config => {
    const {types, page = 1, limit = 20} = config.query
   let mockList = DeviceList.filter(item => {
    //去掉正常的
     for(type in types){
       if (type && item.type !== type) return false
      }
      return true
    })
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return {
      total: mockList.length,
      items: DeviceList
    }
  },
  getWarningList: config => {
    const {types, page = 1, limit = 20} = config.query
    let mockList = WarningList.filter(item => {
      //去掉正常的
      for(type in types){
        if (type && item.type !== type) return false
      }
      return true
    })
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return {
      total: mockList.length,
      items: WarningList
    }
  },
  getHealthList: config => {
    const {types, page = 1, limit = 20} = config.query
    let mockList = HealthList.filter(item => {
      //去掉正常的
      for(type in types){
        if (type && item.type !== type) return false
      }
      return true
    })
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return {
      total: mockList.length,
      items: HealthList
    }
  },

}
