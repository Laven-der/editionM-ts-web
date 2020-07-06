<template>
  <el-dialog
    :title="onlyRead ? '查看版本配置' : '编辑版本配置'"
    visible
    width="600px"
    @close="$emit('close')"
  >
    <el-form
      ref="formData"
      :model="formData"
      status-icon
      :rules="formRules"
      label-width="120px"
      class="form-edition"
    >
      <el-form-item
        label="项目名称"
        prop="pageName"
      >
        <el-input
          v-model="formData.pageName"
          :disabled="onlyRead"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item
        label="服务器名称"
        prop="serviceName"
      >
        <el-input
          v-model="formData.serviceName"
          :disabled="onlyRead"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item
        label="发版分支"
        prop="pass"
      >
        <el-input
          v-model="formData.branch"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item
        label="前端目录配置"
        prop="remotePath"
      >
        <el-input
          v-model="formData.remotePath"
          :disabled="onlyRead"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item
        label="前端API域名"
        prop="checkPass"
      >
        <el-input
          v-model="formData.apiDomain"
          :disabled="onlyRead"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item
        label="重置密码域名"
        prop="checkPass"
      >
        <el-input
          v-model="formData.resetDomain"
          :disabled="onlyRead"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item
        label="发版日期"
        prop="checkPass"
      >
        <el-col :span="11">
          <el-form-item prop="date1">
            <el-date-picker
              v-model="formData.releaseDate"
              type="date"
              :disabled="onlyRead"
              placeholder="选择日期"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item
        label="gitlab地址"
        prop="checkPass"
      >
        <el-input
          v-model="formData.gitUrl"
          :disabled="onlyRead"
          class="input-with-select"
        />
      </el-form-item>
      <el-form-item
        label="标签"
        prop="checkPass"
      >
        <el-input
          v-model="formData.tag"
          :disabled="onlyRead"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item
        label="自定义执行sh"
        prop="checkPass"
      >
        <el-switch v-model="formData.isCustom" />
        <el-input
          v-if="formData.isCustom"
          v-model="formData.cmdStr"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submit('formData')"
        >
          确认
        </el-button>
        <el-button @click="$emit('close')">
          {{ onlyRead ? "返回" : "取消" }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
// import Uploader from "@/components/common/Uploader"
import { checkPermission } from '@/utils/permission' // 权限判断函数
export default {
  name: 'EditEditionDialog',
  components: {},
  props: {
    id: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    // const checkCabinetRange = (rule, value, callback) => {
    //   if (!this.formData.cabinetRange.length) {
    //     return callback(new Error("请至少选中一种范围值！"));
    //   } else {
    //     return callback();
    //   }
    // };
    return {
      formData: {},
      formRules: {
        serviceName: [
          { required: true, message: '请输入服务器名称', trigger: 'blur' }
        ],
        remotePath: [
          { required: true, message: '请输入前端目录配置', trigger: 'blur' }
        ]
      },
      active: 0
    }
  },
  computed: {
    onlyRead() {
      return !checkPermission(['admin'])
    }
  },
  mounted() {
    this.formData = this.data
    console.log(this.formData)
  },
  methods: {
    checkPermission,
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            ...this.formData
          }
          this.$emit('submit', params)
        }
      })
    },
    next() {
      if (this.active++ > 2) this.active = 0
    },
    handleOptimizeParam(data, file) {
      console.log(data, file)
    }
  }
}
</script>

<style lang="scss">
.form-edition {
  .el-input {
    width: 380px;
  }
}
</style>
