<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        backgroundColor: '#344b58',
        title: {
          text: '档案分类统计',
          x: 'center',
          top: '15',
          textStyle: {
            color: '#fff',
            fontSize: '18'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
              type: ['pie', 'funnel']
            },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        legend: {
          orient: 'vertical',
          x: 'left',
          textStyle: {
            color: '#90979c'
          },
          data: ['政策法规', '地方文献', '相关规划', '国际公约', '标准规范', '法律法规', '地方规章', '地方志', '水利志', '舆图', '论文', '保护管理规划', '航道港口规划', '城市总体规划', '水资源规划']
        },
        series: [
          {
            name: '档案分类',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '30%'],

            label: {
              normal: {
                position: 'inner'
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: 600, name: '政策法规', selected: true },
              { value: 793, name: '地方文献' },
              { value: 791, name: '相关规划' }
            ]
          },
          {
            name: '档案分类',
            type: 'pie',
            radius: ['40%', '55%'],
            label: {
              normal: {
                formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                backgroundColor: '#eee',
                borderColor: '#aaa',
                borderWidth: 1,
                borderRadius: 4,
                // shadowBlur:3,
                // shadowOffsetX: 2,
                // shadowOffsetY: 2,
                // shadowColor: '#999',
                // padding: [0, 7],
                rich: {
                  a: {
                    color: '#999',
                    lineHeight: 22,
                    align: 'center'
                  },
                  // abg: {
                  //     backgroundColor: '#333',
                  //     width: '100%',
                  //     align: 'right',
                  //     height: 22,
                  //     borderRadius: [4, 4, 0, 0]
                  // },
                  hr: {
                    borderColor: '#aaa',
                    width: '100%',
                    borderWidth: 0.5,
                    height: 0
                  },
                  b: {
                    fontSize: 16,
                    lineHeight: 33
                  },
                  per: {
                    color: '#eee',
                    backgroundColor: '#334455',
                    padding: [2, 4],
                    borderRadius: 2
                  }
                }
              }
            },
            data: [
              { value: 110, name: '国际公约' },
              { value: 160, name: '标准规范' },
              { value: 70, name: '法律法规' },
              { value: 260, name: '地方规章' },
              { value: 348, name: '地方志' },
              { value: 151, name: '水利志' },
              { value: 47, name: '舆图' },
              { value: 247, name: '论文' },
              { value: 247, name: '保护管理规划' },
              { value: 187, name: '航道港口规划' },
              { value: 97, name: '城市总体规划' },
              { value: 260, name: '水资源规划' }
            ]
          }
        ]

      })
    }
  }
}
</script>
