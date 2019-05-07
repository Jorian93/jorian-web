<template>
  <div class="app-container">
    <el-row>
      <pie-chart height="400px" width="100%" />
    </el-row>
    <el-row style="margin-top: 40px">
      <mix-chart height="400px" width="100%" />
    </el-row>
    <!--<el-row>
      <el-col>
        <bar-chart height="400px" width="100%" />
      </el-col>
    </el-row>-->

  </div>
</template>

<script>
import MixChart from './components/mixChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import BoxCard from './components/BoxCard'
export default {
  name: 'Chart',
  components: {
    MixChart,
    PieChart,
    BarChart,
    TransactionTable,
    BoxCard }

}
</script>

<style scoped>
 .app-container{
   padding: 32px;
   background-color: rgb(240, 242, 245);
 }

</style>

