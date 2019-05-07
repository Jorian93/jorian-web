<template>
  <div>
    <div class="app-container">
      <el-input v-model="filterText" placeholder="请输入过滤词" style="margin-bottom:30px;" />
      <tree-table
        ref="TreeTable"
        :filter-node-method="filterNode"
        :data="tableData"
        :default-expand-all="true"
        :columns="columns"
        border
        default-children="children"
        @selection-change="selectChange"
      >

        <template slot="selection">
          <el-table-column type="selection" align="center" width="55" />
        </template>
        <template slot="operation" slot-scope="{scope}">
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
      </tree-table>
    </div>
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
        <el-form-item :label="$t('分类名称')" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item :label="$t('分类描述')" prop="dsc">
          <el-input v-model="temp.dsc" type="textarea" />
        </el-form-item>
        <el-form-item :label="textMap[dialogStatus]+$t('时间')" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateItem()">{{ $t('确认') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import TreeTable from '@/components/TreeTable'
import data from './data.js'

export default {
  components: { TreeTable },
  data() {
    return {
      tableData: [],
      temp: {
        id: undefined,
        pid: '',
        name: '', // 名称
        type: '', // 状态
        dsc: '', // 描述
        children: [],
        createDate: new Date(),
        timestamp: new Date()// 修改时间
      },
      row: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '创建'
      },
      rules: {
        // type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: '时间必须有', trigger: 'change' }],
        name: [{ required: true, message: '名称必须有', trigger: 'blur' }],
        dsc: [{ required: true, message: '描述必须有', trigger: 'blur' }]
      },
      createType: '',
      columns: [
        {
          label: '分类名称',
          key: 'name',
          expand: true,
          align: 'left'
        },
        {
          label: '描述',
          key: 'dsc',
          align: 'left'
        },
        {
          label: '操作',
          key: 'operation',
          width: 360
        }
      ]
    }
  },
  watch: {
    filterText(val) {
      this.$refs.TreeTable.filter(val)
    }
  },
  created() {
    this.getData()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        pid: '',
        name: '', // 名称
        type: '', // 状态
        dsc: '', // 描述
        children: [],
        timestamp: new Date()// 修改时间
      }
    },
    handleCreate(row, type) {
      this.resetTemp()
      this.temp.pid = row.id
      this.dialogStatus = 'create'
      this.createType = type
      this.row = row
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.row = row
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    getData() {
      this.tableData = data
    },
    async updateItem() {
      await this.$refs.TreeTable.updateTreeNode(this.temp)
      this.dialogFormVisible = false
      this.$notify({
        title: '成功',
        message: '修改成功',
        type: 'success',
        duration: 2000
      })
    },
    createData() {
      if (this.createType === 'children') {
        this.$refs.TreeTable.addChild(this.row, this.temp)
      }
      if (this.createType === 'brother') {
        this.$refs.TreeTable.addBrother(this.row, this.temp)
      }
      this.dialogFormVisible = false
      this.$notify({
        title: '成功',
        message: '创建成功',
        type: 'success',
        duration: 2000
      })
    },
    deleteItem(row) {
      this.$refs.TreeTable.delete(row)
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
    },
    selectChange(val) {
      console.log(val)
    }

  }
}
</script>
