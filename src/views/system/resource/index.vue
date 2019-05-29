<template>
  <div class="app-container">
    <el-input v-model="search" placeholder="请输入过滤词" style="margin-bottom:30px;" />
    <el-table
      :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%;margin-bottom: 20px;"
      border
      row-key="id"
    >
      <el-table-column
        label="资源名称"
        min-width="160"
      >
        <template slot-scope="scope">
          <el-tag size="medium">{{ scope.row.title }}</el-tag>
        </template>
      </el-table-column>
      <!--<el-table-column
        label="组件名称"
        min-width="120">
        <template slot-scope="scope">
          <span  style="color:sandybrown">{{ scope.row.name }}</span>
        </template>
      </el-table-column>-->
      <el-table-column
        label="类型"
        min-width="60"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.type===1" style="color:sandybrown">菜单</span>
          <span v-else-if="scope.row.type==0" style="color:sandybrown">按钮</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Path"
        min-width="160"
      >
        <template slot-scope="scope">
          <span style="color:sandybrown">{{ scope.row.path }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="权限标识"
        width="180"
      >
        <template slot-scope="scope">
          <span style="color:sandybrown">{{ scope.row.permission }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Icon"
        width="65"
        align="center"
      >
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column
        label="是否校验"
        width="80"
        align="center"
      >
        <template slot-scope="scope" width="65">
          <span v-if="scope.row.isVerify" style="color:sandybrown">是</span>
          <span v-else-if="!scope.row.isVerify" style="color:sandybrown">否</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        width="135"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        min-width="340"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleCreate(scope.row,'brother')"
          >添加同级
          </el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handleCreate(scope.row,'children')"
          >添加下级
          </el-button>
          <el-button size="mini" type="success" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="danger" @click="deleteItem(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="85px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item v-if="false" :label="$t('父级分类id')" prop="pid">
          <el-input v-model="temp.pid" />
        </el-form-item>
        <el-form-item v-if="false" :label="$t('分类id')" prop="id">
          <el-input v-model="temp.id" />
        </el-form-item>
        <el-form-item :label="$t('资源名称')" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item :label="$t('Path')" prop="path">
          <el-input v-model="temp.path" />
        </el-form-item>
        <el-form-item :label="$t('面包屑跳转')" prop="redirect">
          <el-input v-model="temp.redirect" />
        </el-form-item>
        <el-form-item :label="$t('组件名')" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item :label="$t('组件路径')" prop="component">
          <el-input v-model="temp.component" />
        </el-form-item>
        <el-form-item :label="$t('是否隐藏')" prop="hidden">
          <el-select v-model="temp.hidden" class="filter-item" placeholder="请选择">
            <el-option v-for="item in hiddenOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('资源类型')" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="请选择">
            <el-option v-for="item in typeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('权限标识')" prop="permission">
          <el-input v-model="temp.permission" />
        </el-form-item>
        <el-form-item :label="$t('图标')" prop="icon">
          <el-input v-model="temp.icon" /><el-button type="text" @click="iconPanelVisible = true">选择图标</el-button>
        </el-form-item>
        <el-form-item :label="$t('是否校验')" prop="isVerify">
          <el-select v-model="temp.isVerify" class="filter-item" placeholder="请选择">
            <el-option v-for="item in isVerifyOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('序号')" prop="sort">
          <el-input v-model="temp.sort" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateItem()">{{ $t('确认') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('图标')" :visible.sync="iconPanelVisible">
      <Icons @closeMoule="closeMoule" />
    </el-dialog>

  </div>
</template>

<script>

import { fetchTree, deleteResource, createResource, updateResource } from '../../../api/system/resource'
import Icons from '@/views/icons'
const typeOptions = [
  { key: 0, display_name: '按钮' },
  { key: 1, display_name: '菜单' }
]
const isVerifyOptions = [
  { key: true, display_name: '是' },
  { key: false, display_name: '否' }
]
const hiddenOptions = [
  { key: true, display_name: '是' },
  { key: false, display_name: '否' }
]
export default {
  name: 'CustomTreeTableDemo',
  components: { Icons },
  data() {
    return {
      search: '',
      tableData: [],
      temp: {
        id: undefined,
        pid: undefined,
        title: undefined, // 名称
        name: undefined, //
        component: undefined, //
        redirect: undefined, //
        type: undefined, // 类型
        permission: undefined, // 权限标识
        icon: undefined, // 图标
        path: undefined, // 地址
        isVerify: true, // 是否校验权限
        sort: undefined,
        children: [],
        createTime: new Date(),
        updateTime: new Date()// 修改时间
      },
      row: {},
      dialogFormVisible: false,
      iconPanelVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '创建'
      },
      isVerifyOptions,
      typeOptions,
      hiddenOptions,
      rules: {
        // type: [{ required: true, message: 'type is required', trigger: 'change' }],
        updateDate: [{ type: 'date', required: true, message: '时间必须有', trigger: 'change' }],
        title: [{ required: true, message: '名称必须有', trigger: 'blur' }],
        sort: [{ required: true, message: 'paixu必须有', trigger: 'blur' }]
      },
      createType: ''

    }
  },
  watch: {

  },
  created() {
    this.getData()
  },
  methods: {
    resetTemp() {
      this.temp = {
        id: undefined,
        pid: undefined,
        name: undefined, // 名称
        title: undefined, // 名称
        component: undefined, //
        redirect: undefined, //
        type: undefined, // 类型
        permission: undefined, // 权限标识
        icon: undefined, // 图标
        path: undefined, // 地址
        isVerify: true, // 是否校验权限
        children: [],
        createTime: new Date(),
        updateTime: new Date()// 修改时间
      }
    },
    handleCreate(row, type) {
      this.resetTemp()
      if (type === 'children') {
        this.temp.pid = row.id
      }
      if (type === 'brother') {
        this.temp.pid = row.pid
      }
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.updateDate = new Date(this.temp.updateDate)
      this.row = row
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    getData() {
      fetchTree().then(response => {
        this.tableData = response.data
        setTimeout(() => {
        }, 1.5 * 1000)
      })
    },
    async updateItem() {
      updateResource(this.temp).then(response => {
        this.getData()
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    createData() {
      // 后台保存
      createResource(this.temp).then(response => {
        this.getData()
        this.dialogFormVisible = false
        this.$notify({
          title: response.code,
          message: response.msg,
          type: 'success',
          duration: 2000
        })
      })
    },
    deleteItem(row) {
      deleteResource(row.id).then(response => {
        this.getData()
        this.$notify({
          title: response.code,
          message: response.msg,
          type: 'success',
          duration: 2000

        })
      })
    },
    selectChange(val) {
      console.log(val)
    },
    closeMoule(e) {
      this.temp.icon = e
      this.iconPanelVisible = false
    }

  }
}
</script>
