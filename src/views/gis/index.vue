<template>
  <!--
  :content="getDeviceMarkerContent(item, 30, 30)"
  -->
  <div id="mapDemo">
    <el-amap
      ref="map"
      vid="amapDemo"
      :amap-manager="amapManager"
      :plugin="plugins"
      :events="mapEvents"
      :zoom="zoom"
      map-style="amap://styles/blue"
      :center="center"
      class="amap-demo"
    >
      <el-amap-marker
        v-for="(item, index) in deviceDatas"
        :key="index"
        class="selectedMarker"
        :position="item.lnglat"
        top-when-click="true"
        :ext-data="item"
        :events="markerEvents"
        :icon="item.icon"
      />
      <el-amap-marker
        v-for="(item, index) in warningDatas"
        :key="index"
        class="selectedMarker"
        :position="item.lnglat"
        top-when-click="true"
        :ext-data="item"
        :icon="item.icon"
        :events="markerEvents"
      />
      <el-amap-marker
        v-for="(item, index) in healthDatas"
        :key="index"
        class="selectedMarker"
        :position="item.lnglat"
        top-when-click="true"
        :ext-data="item"
        :icon="item.icon"
        :events="markerEvents"
      />

    </el-amap>
    <div id="option-window" style="position:absolute;top:0px;left:0px;">
      <el-collapse accordion>
        <el-collapse-item>
          <template slot="title">
            <svg-icon icon-class="device" class-name="" />选项
          </template>
          <el-tag>设备</el-tag>
          <div class="option-item">
            <el-checkbox v-model="ischeckDevicesAll" :indeterminate="isIndeterminateDevice" @change="handleCheckAllDevicesChange">全选</el-checkbox>
            <el-checkbox-group v-model="checkedDevices" @change="handleCheckedDeviceChange">
              <el-checkbox v-for="item in devicemakerstype" :key="item.key" :label="item.key"><img :height="15" :width="15" :src="item.icon">{{ item.key }}</el-checkbox>
            </el-checkbox-group>
          </div>
          <el-tag>告警等级</el-tag>
          <div class="option-item">
            <el-checkbox v-model="ischeckWarningsAll" :indeterminate="isIndeterminateWarning" @change="handleCheckAllWarningsChange">全选</el-checkbox>
            <el-checkbox-group v-model="checkedWarnings" @change="handleCheckedWarningChange">
              <el-checkbox v-for="item in warningmakerstype" :key="item.key" :label="item.key"><img :height="15" :width="15" :src="item.icon">{{ item.key }}</el-checkbox>
            </el-checkbox-group>
          </div>
          <el-tag>遗产点健康程度</el-tag>
          <div class="option-item">
            <el-checkbox v-model="ischeckHealthsAll" :indeterminate="isIndeterminateHealth" @change="handleCheckAllHealthsChange">全选</el-checkbox>
            <el-checkbox-group v-model="checkedHealths" @change="handleCheckedHealthChange">
              <el-checkbox v-for="item in healthmakerstype" :key="item.key" :label="item.key"><img :height="15" :width="15" :src="item.icon">{{ item.key }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-collapse-item>
      </el-collapse>

    </div>
  </div>
</template>

<style  scoped>
  .amap-demo {
    height: 56rem;
    position: relative
  }
  .option-item{
    margin: 20px 15px;
  }
</style>

<script>
import { fetchDevices, fetchWarnings, fetchHealths } from '@/api/gis/gis'
import { AMapManager } from 'vue-amap'
const amapManager = new AMapManager()

const deviceOptions = ['水质仪', '裂缝计', '沉降仪', '温湿计']
const warningOptions = ['一级告警', '二级告警', '三级告警', '四级告警']
const healthOptions = ['良好', '一般', '较差']

const devicemakerstype = [
  { key: '水质仪', icon: require('@/assets/png/beaker.png') },
  { key: '裂缝计', icon: require('@/assets/png/crevice.png') },
  { key: '沉降仪', icon: require('@/assets/png/ruler.png') },
  { key: '温湿计', icon: require('@/assets/png/tempture.png') }
]
const warningmakerstype = [
  { key: '一级告警', icon: require('@/assets/png/levelWarning1.png') },
  { key: '二级告警', icon: require('@/assets/png/levelWarning2.png') },
  { key: '三级告警', icon: require('@/assets/png/levelWarning3.png') },
  { key: '四级告警', icon: require('@/assets/png/levelWarning4.png') }
]

const healthmakerstype = [
  { key: '良好', icon: require('@/assets/png/fine.png') },
  { key: '一般', icon: require('@/assets/png/fineless.png') },
  { key: '较差', icon: require('@/assets/png/bad.png') }]
export default {
  data() {
    const self = this
    return {
      devicemakerstype,
      warningmakerstype,
      healthmakerstype,
      listQueryDevice: {
        limit: 20,
        types: []
      },
      listQueryWarning: {
        limit: 20,
        types: []
      },
      listQueryHealth: {
        limit: 20,
        types: []
      },
      plugins: [
        {
          pName: 'OverView',
          events: {
            init(instance) {
              console.log(instance)
            }
          }
        },
        {
          pName: 'MapType',
          defaultType: 0,
          events: {
            init(instance) {
              console.log(instance)
            }
          }
        }

      ],
      amapManager,
      zoom: 18, // 地图缩放级别
      center: [120.080782, 30.129556], // 用户当前位置经纬度
      listDevices: [],
      listWarnings: [],
      listHealths: [],
      deviceDatas: [],
      warningDatas: [],
      healthDatas: [],
      ischeckDevicesAll: false,
      ischeckWarningsAll: false,
      ischeckHealthsAll: false,
      checkedDevices: deviceOptions,
      checkedWarnings: [],
      checkedHealths: [],
      deviceOptions,
      warningOptions,
      healthOptions,
      isIndeterminateDevice: true,
      isIndeterminateWarning: true,
      isIndeterminateHealth: true,
      clickedMarker: null, // 保存当前点击的Marker
      mapEvents: {
        init(o) {
          // o 为地图组件实例
        },
        complete() {
          const map = self.amapManager.getMap() // 获取地图组件实例
          // setFitView(overlayList:Array)
          // 根据地图上添加的覆盖物分布情况，
          // 自动缩放地图到合适的视野级别，参数overlayList默认为当前地图上添加的所有覆盖物图层
          map.setFitView()
        }
      },
      markerEvents: {
        click(e) {
          if (self.clickedMarker === e.target) return // 点击的是同一个Marker
          const data = e.target.getExtData()
          if (self.clickedMarker) { // 先恢复上次点击的Marker的样式
            self.clickedMarker.setOffset(new AMap.Pixel(-10, -30))
            self.clickedMarker.setContent(self.getMarkerContent(self.clickedMarker.getExtData(), 30, 30))
          }
          e.target.setContent(self.getMarkerContent(data, 40, 40, true))
          e.target.setOffset(new AMap.Pixel(-18, -50))
          self.clickedMarker = e.target
        }
      }

    }
  },
  watch: {

  },
  created() {
    this.getDeviceDatas()
    this.getWarningDatas()
    this.getHealthDatas()
  },
  mounted() {
    AMap.plugin('AMap.CircleEditor', function() { // 回调函数
    })
  },
  methods: {
    getDeviceMarkerContent(item, width, height, isRotate = false) {
      const bgRoate = isRotate ? 'transform: rotate(45deg);' : ''
      const txRotate = isRotate ? 'transform: rotate(-45deg);' : ''
      let backgroundColor = item.level === 'A' ? '#FF8100' : (item.level === 'B' ? '#8D3ECD' : '#2DCD72')
      if (isRotate) {
        backgroundColor = '#0893FF'
      }
      const content = `<div style="display: flex;
                                      justify-content: center;
                                      align-items: center;
                                      height: ${width}px;
                                      width: ${height}px;
                                      border-radius: .05rem;
                                      ${bgRoate}
                                      font-family: Arial-BoldMT;
                                      font-size: 16px;
                                      color: #FFFFFF;
                                      box-shadow: 2px 2px 4px 0 rgba(0,0,0,0.30);
                                      background-color: ${backgroundColor};">
                                         <div style="${txRotate}"><svg-icon icon-class="walter" /> ${item.text} </div>
                           </div>`

      return content
    },

    handleCheckAllDevicesChange(val) {
      this.checkedDevices = val ? deviceOptions : []
      this.isIndeterminateDevice = false
      const temp = []
      if (this.checkedDevices.length > 0) {
        this.checkedDevices.forEach((type) => {
          this.listDevices.forEach((data) => {
            if (data.type === type) {
              temp.push(data)
            }
          })
        })
      }
      this.deviceDatas = temp
    },
    handleCheckAllWarningsChange(val) {
      this.checkedWarnings = val ? warningOptions : []
      this.isIndeterminateWarning = false
      const temp = []
      if (this.checkedWarnings.length > 0) {
        this.checkedWarnings.forEach((type) => {
          this.listWarnings.forEach((data) => {
            if (data.type === type) {
              temp.push(data)
            }
          })
        })
      }
      this.warningDatas = temp
    },
    handleCheckAllHealthsChange(val) {
      this.checkedHealths = val ? healthOptions : []
      this.isIndeterminateHealth = false
      const temp = []
      if (this.checkedHealths.length > 0) {
        this.checkedHealths.forEach((type) => {
          this.listHealths.forEach((data) => {
            if (data.type === type) {
              temp.push(data)
            }
          })
        })
      }
      this.healthDatas = temp
    },
    handleCheckedDeviceChange(value) {
      const checkedCount = value.length
      this.ischeckDevicesAll = checkedCount === this.deviceOptions.length
      this.isIndeterminateDevice = checkedCount > 0 && checkedCount <= this.deviceOptions.length
      this.deviceDatas = []
      const temp = []
      if (this.checkedDevices.length > 0) {
        this.checkedDevices.forEach((type) => {
          this.listDevices.forEach((data) => {
            if (data.type === type) {
              temp.push(data)
            }
          })
        })
      }
      this.deviceDatas = temp
    },
    handleCheckedWarningChange(value) {
      const checkedCount = value.length
      this.ischeckWarningsAll = checkedCount === this.warningOptions.length
      this.isIndeterminateWarning = checkedCount > 0 && checkedCount < this.warningOptions.length
      this.warningDatas = []
      const temp = []
      if (this.checkedWarnings.length > 0) {
        this.checkedWarnings.forEach((type) => {
          this.listWarnings.forEach((data) => {
            if (data.type === type) {
              temp.push(data)
            }
          })
        })
      }
      this.warningDatas = temp
    },
    handleCheckedHealthChange(value) {
      const checkedCount = value.length
      this.ischeckHealthsAll = checkedCount === this.healthOptions.length
      this.isIndeterminateHealth = checkedCount > 0 && checkedCount < this.healthOptions.length
      this.healthDatas = []
      const temp = []
      if (this.checkedHealths.length > 0) {
        this.checkedHealths.forEach((type) => {
          this.listHealths.forEach((data) => {
            if (data.type === type) {
              temp.push(data)
            }
          })
        })
      }
      this.healthDatas = temp
    },
    getDeviceDatas() {
      this.listLoading = true
      fetchDevices(this.listQueryDevice).then(response => {
        this.deviceDatas = response.items
        this.listDevices = response.items
        this.total = response.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getWarningDatas() {
      this.listLoading = true
      fetchWarnings(this.listQueryWarning).then(response => {
        // this.warningDatas = response.items
        this.listWarnings = response.items
        this.total = response.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getHealthDatas() {
      this.listLoading = true
      fetchHealths(this.listQueryHealth).then(response => {
        // this.healthDatas = response.items
        this.listHealths = response.items
        this.total = response.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    }

  }

}
</script>
