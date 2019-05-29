<template>
  <div class="dashboard-editor-container">
    <github-corner class="github-corner" />
    <!--<el-carousel :interval="4000" type="card" width="850px"height="550px">
      <el-carousel-item v-for="item in srcs" :key="item">
        <img :src="item.src" class="dash-img">
      </el-carousel-item>
    </el-carousel>-->
    <el-card v-for="item in srcs" class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ item.name }}</span>
      </div>
      <div>
        <img class="dash-img" :src="item.src">
      </div>
    </el-card>
  </div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner'

export default {
  name: 'DashboardAdmin',
  components: {
    GithubCorner
  },
  data() {
    return {
      imageUrl: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      srcs: [
        { name: '用户管理', src: require('@/assets/dashboard/2019-05-29_150510.png') },
        { name: '用户编辑', src: require('@/assets/dashboard/2019-05-29_150552.png') },
        { name: '资源配置，配置即显示', src: require('@/assets/dashboard/2019-05-29_150617.png') },
        { name: '资源图标在线修改', src: require('@/assets/dashboard/2019-05-29_150702.png') },
        { name: '角色配置，权限粒度至url级别', src: require('@/assets/dashboard/2019-05-29_150737.png') },
        { name: '权限树查看', src: require('@/assets/dashboard/2019-05-29_150759.png') },
        { name: '日志管理', src: require('@/assets/dashboard/2019-05-29_150826.png') },
        { name: 'logo显隐，主题更改，定制化设置', src: require('@/assets/dashboard/2019-05-29_150907.png') },
        { name: '国际化，个人中心，重置密码', src: require('@/assets/dashboard/2019-05-29_151003.png') }
      ]
    }
  },
  methods: {
    handleSetLineChartData(type) {
    }
  }
}
</script>
<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }
  .el-carousel__item:nth-child(2n) {
    /*background-color: #99a9bf;*/
  }
  .el-carousel__item:nth-child(2n+1) {
    /*background-color: #d3dce6;*/
  }

</style>
<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
  .dash-img{
    width: 100%;
  }
  .box-card{
    margin-bottom: 20px;
  }
}
</style>

