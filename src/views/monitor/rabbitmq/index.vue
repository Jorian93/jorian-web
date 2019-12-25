<template>
  <div class="docker-server">
    <iframe  name = "iframeChild" id = "iframeChild" v-bind:src="PageUrl"
             width="100%"
             :height=iframeHeight
             frameborder="0"
             scrolling="no"
             ref="iframeDom"
    ></iframe>
  </div>
</template>

<script type="text/ecmascript-6">
  import { fetchDruid} from '@/api/monitor/server'
  import { parseTime } from '@/utils'
  export default {
    name: "druid",
    data(){
      return{
        iframeHeight:2900,
        PageUrl:`http://120.78.172.59:15672/#/`
      }
    },
    mounted: function () {
      this.$nextTick(() => {
        if(this.$refs.iframeDom)
          this.iframeHeight = window.innerHeight - this.$refs.iframeDom.$el.offsetTop;
      })

    },
  }
</script>

<style scoped>

</style>
