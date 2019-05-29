<template>
  <div class="app-container">
    <el-col :span="24" :xs="24" align="center">
      <el-card style="margin-bottom:20px;">
        <div slot="header" class="clearfix">
          <span>重置密码</span>
        </div>
        <div class="user-profile">
          <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 600px; margin-left:50px;">
            <el-form-item :label="$t('账户名')" prop="username">
              <el-input v-model="temp.username" :disabled="true" />
            </el-form-item>
            <el-form-item :label="$t('旧密码')" prop="password">
              <el-input v-model="temp.password" type="password" />
            </el-form-item>
            <el-form-item :label="$t('新密码')" prop="newPassword">
              <el-input v-model="temp.newPassword" type="password" />
            </el-form-item>
            <el-form-item :label="$t('重复新密码')" prop="repassword">
              <el-input v-model="rePassword" type="password" />
            </el-form-item>
          </el-form>
        </div>
        <div class="dialog-footer" align="center">
          <el-button>{{ $t('放弃修改') }}</el-button>
          <el-button type="primary" style="margin-left: 160px" @click="resetPassword">{{ $t('确认修改') }}</el-button>
        </div>
      </el-card>
    </el-col>
  </div>
</template>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
<script>
import { getInfo, resetPassword } from '@/api/account/account'
import store from '@/store'
import waves from '@/directive/waves' // Waves directive
import { validUsername, validPassword } from '@/utils/validate'
import { parseTime } from '@/utils'
export default {
  name: 'ComplexTable',
  directives: { waves },
  components: { },
  filters: {
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    const validateRePassword = (rule, value, callback) => {
      if (!validPassword(this.repassword)) {
        callback(new Error('密码应该由6到10位字母数字组成'))
      } else {
        if (this.repassword !== this.password) {
          callback(new Error('两次输入不一致'))
        } else {
          callback()
        }
      }
    }
    return {
      rePassword: '',
      temp: {
        username: '',
        password: '',
        newPassword: ''
      },
      editable: false,
      dialogStatus: '',
      dialogImageUrl: '',
      rules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        newPassword: [{ required: true, trigger: 'blur', validator: validatePassword }]
      /*  rePassword: [{ required: true, trigger: 'blur', validator: validateRePassword }]*/
      },
      downloadLoading: false
    }
  },
  created() {
    this.getUserDetail()
  },
  methods: {
    getUserDetail() {
      this.listLoading = true
      getInfo(this.listQuery).then(response => {
        this.temp.username = response.data.username
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },
    resetPassword() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          resetPassword(tempData).then(() => {
            this.$notify({
              title: '成功',
              message: '重置密码成功',
              type: 'success',
              duration: 2000
            })
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          })
        }
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }

}
</script>
