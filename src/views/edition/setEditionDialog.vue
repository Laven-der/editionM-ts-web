<template>
  <el-dialog
    title="发布服务器"
    visible
    width="780px"
    @close="$emit('close')"
  >
    <div class="layout-header">
      目标服务器:
      <svg-icon icon-class="server" />
      <i class="icon-zhankaicaozuo" />
      {{ editionData.serviceName }}
      <span class="branch">
        发版分支-{{ editionData.branch }}
      </span>
    </div>
    <el-steps
      :active="active"
      simple
      finish-status="success"
    >
      <el-step title="准备发版文件">
        <svg-icon
          slot="icon"
          icon-class="documentation"
        />
      </el-step>
      <el-step
        title="上传打包文件"
        icon="el-icon-upload"
      />
      <el-step title="确认发版">
        <svg-icon
          slot="icon"
          icon-class="confirm"
        />
      </el-step>
    </el-steps>
    <div
      v-if="active===0"
      class="set-info set-pro"
    >
      <div class="tip">
        <span>
          <svg-icon icon-class="tip" />
          拉取对应的git项目，并对不同环境修改ENV配置,本地build生成dist.zip前端项目 </span>
        <span>此操作耗时约为3分钟，请耐心等待</span>
      </div>
      <el-switch
        v-model="isDir"
        active-text="已上传"
        inactive-text="未上传"
      />
      <el-button
        :disabled="isDir"
        @click="handleClick(data)"
      >
        生成项目文件
      </el-button>
      <div class="schedule">
        <div
          v-for="(item,index) in progressData"
          :key="item"
        >
          <template v-if="percentage>10*(index+1)">
            <span> {{ item }}
            </span>
            <i class="el-icon-circle-check" />
          </template>
        </div>
      </div>
    </div>
    <div
      v-if="active===1"
      class="set-info"
    >
      <div class="tip">
        <i class="el-icon-collection-tag" />
        <span>上传文件至{{ editionData.remotePath }}注意：可新增isUpload字段，为true时可以自定义上传文件 </span>
      </div>
      <el-button @click="handleUploadPagefile">
        开始上传文件
      </el-button>
    </div>
    <div
      v-if="active===2"
      class="set-info"
    >
      <div class="tip">
        <span> 上次发版日期：
          <svg-icon icon-class="time" />{{ editionData.releaseDate }} </span>
      </div>
      <!-- <el-button @click="handleSetServise"> 确认发版</el-button> -->
    </div>
    <div slot="footer">
      <el-button
        style="margin-top: 12px;"
        :disabled="(!isDir&&active===0)||(active===1&&!isUpload)"
        @click="next"
      >
        {{ active===2 ?'确认发版':'下一步' }}
      </el-button>

      <el-button @click="$emit('close')">
        取消
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getEditionPage, uploadPagefile, setServise } from '@/api/edition';
export default {
  name: 'EditBaseDialog',
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
    const checkCabinetRange = (rule, value, callback) => {
      if (!this.formData.cabinetRange.length) {
        return callback(new Error('请至少选中一种范围值！'))
      } else {
        return callback()
      }
    }
    return {
      percentage: 0,
      editionData: {},
      formData: {
        name: '',
        code: '',
        cabinetRange: []
      },
      formRules: {
        name: [{ required: true, $: '请输入名称', trigger: 'blur' }],
        cabinetRange: [
          { required: true, validator: checkCabinetRange, trigger: 'change' }
        ]
      },
      active: 0,
      loading: null,
      isDir: false,
      isUpload: false
    }
  },
  computed: {
    progressData() {
      return [
        '正在清空本地文件夹',
        `拉取${this.editionData.pageName}项目代码`,
        `检出分支-${this.editionData.branch || 'master'}`,
        '替换发版制定环境ENV文件',
        '依赖安装中',
        '打包项目',
        '输出dist.zip文件'
      ]
    }
  },
  watch: {
    percentage(val) {
      this.progressData.map((item, index) => {
        if (val > (index + 1) * 10) {
          this.loading.setText(item)
        }
      })
    }
  },
  mounted() {
    this.editionData = this.data
  },
  methods: {
    init() {},
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const { name, code, cabinetRange } = this.formData
          const params = {
            name,
            code,
            cabinetsClassifyIds: cabinetRange,
            id: this.id
          }
          this.$emit('submit', params)
        }
      })
    },
    next() {
      if (this.active === 2) {
        this.handleSetServise()
      } else {
        this.active++
      }
    },
    handleClick(data) {
      console.log(data, 'data')
      const time = setInterval(() => {
        this.percentage += 1
        if (this.percentage > 96) {
          clearInterval(time)
        }
      }, 100)

      this.loading = this.$loading({
        lock: true,
        text: '正在清空本地文件夹',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.2)'
      })
      const params = {
        pageName: data.pageName,
        serviceName: data.serviceName,
        isCustom: data.isCustom,
        cmdStr: data.cmdStr,
        gitUrl: data.gitUrl,
        branch: data.branch
      }
      getEditionPage(params)
        .then(response => {
          if (response.code === 1) {
            this.$message.success('项目打包成功')
            clearInterval(time)
            this.percentage = 100
            this.$nextTick(() => {
              // 以服务的方式调用的 Loading 需要异步关闭
              this.isDir = true
              this.loading.close()
            })
          }
        })
        .catch(e => {
          clearInterval(time)
          this.$nextTick(() => {
            // 以服务的方式调用的 Loading 需要异步关闭
            this.loading.close()
          })
        })
    },
    checkPageIsExist() {
      this.isDir = false
    },
    handleUploadPagefile() {
      const params = {
        serviceName: this.editionData.serviceName,
        dirName: null,
        remotePath: this.editionData.remotePath,
        isUpload: false
      }
      console.log(params, 'ss')
      uploadPagefile(params).then(response => {
        console.log(response)
        if (response.code === 1) {
          this.isUpload = true
          this.$message.success('文件上传成功')
        }
      })
    },
    handleSetServise() {
      const params = {
        serviceName: this.editionData.serviceName,
        _id: this.editionData._id,
        remotePath: this.editionData.remotePath
      }
      if (this.editionData.pageName === 'muzuo-platform-fe') {
        params.pageMame = 'fe';
      } else {
        params.pageMame = 'admin';
      }
      setServise(params).then(response => {
        if (response.code === 1) {
          this.$message.success('发版成功')
          this.$emit('close')
        }
      })
    }
  }
}
</script>

<style lang="scss">
.el-dialog__body {
  padding: 16px 24px;
  svg {
    font-size: 24px;
  }
  .layout-header {
    padding: 24px;
    font-size: 16px;
    line-height: 24px;
    .branch {
      color: #19c370;
      margin-left: 12px;
    }
  }
  .set-info {
    padding: 16px;
    .tip {
      text-align: center;
      line-height: 24px;
      padding-bottom: 16px;
      span {
        display: flex;
        line-height: 24px;
        svg {
          margin-right: 4px;
        }
      }
    }
    .schedule {
      padding: 8px;
      div {
        line-height: 24px;
      }
    }
  }
  .set-pro {
    min-height: 300px;
    i {
      float: right;
      color: #19c370;
    }
  }
}
</style>
