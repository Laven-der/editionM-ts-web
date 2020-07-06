<template>
  <div class="content">
    <div class="header">
      <el-button
        type="primary"
        @click="addEdition"
      >
        新增版本
      </el-button>
    </div>
    <el-table :data="serviceData">
      <el-table-column
        prop="tag"
        label="标签"
        width="200"
        filter-placement="bottom-end"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.tag === '家' ? 'primary' : 'success'"
            disable-transitions
          >
            {{ scope.row.tag }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="branch"
        label="发版分支"
        width="100"
      />
      <el-table-column
        prop="apiDomain"
        label="API_DOMAIN"
      />
      <el-table-column
        prop="resetDomain"
        label="PASSWORD_DOMAIN"
      />
      <el-table-column
        prop="releaseDate"
        label="发版日期"
        width="220"
      />
      <el-table-column
        label="操作"
        width="330"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleRelease(scope.$index)"
          >
            发布版本
          </el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
          >
            {{ checkPermission(["admin"]) ? "编辑" : "编辑" }}配置
          </el-button>
          <el-button
            v-if="checkPermission(['admin'])"
            type="danger"
            size="mini"
            @click="handleDelete(scope.$index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <SetEditionDialog
      v-if="isRelease"
      :data="itemData"
      @close="isRelease = false"
    />
    <EditEditionDialog
      v-if="isEdit"
      :data="itemData"
      @close="isEdit = false"
      @submit="submit"
    />
  </div>
</template>
<script>
import SetEditionDialog from './setEditionDialog'
import EditEditionDialog from './editEditionDialog'
import { deleteEditionItem } from '@/api/edition'
import { EditionModule } from '@/store/modules/edition'
import { checkPermission } from '@/utils/permission' // 权限判断函数
export default {
  name: 'Documentation',
  components: { SetEditionDialog, EditEditionDialog },
  data() {
    return {
      itemData: {},
      isEdit: false,
      isAdd: false,
      isRelease: false
    }
  },
  computed: {
    serviceData() {
      console.log(2)
      return EditionModule.editionLists
    }
  },
  watch: {
    serviceData(val) {
      console.log(val, 'ss')
    }
  },
  mounted() {
    this.init()
    console.log(EditionModule, 222)
  },
  methods: {
    init() {
      EditionModule.GetEditionLists()
    },
    checkPermission,
    handleRelease(row) {
      this.isRelease = true
      this.itemData = Object.assign({}, this.serviceData[row])
    },
    handleEdit(row) {
      this.isEdit = true
      this.itemData = Object.assign({}, this.serviceData[row])
      this.isAdd = false
    },
    handleDelete(row) {
      const itemData = Object.assign({}, this.serviceData[row])
      const params = {
        _id: itemData._id
      }
      this.$confirm(
        `确定删除该服务器：${itemData.serviceName}配置吗？`,
        '删除成功后将无法恢复！'
      ).then(() => {
        deleteEditionItem(params).then(response => {
          if (response.code === 1) {
            this.$message.success('删除成功')
          }
        })
      })
    },
    addEdition() {
      this.isEdit = true
      this.itemData = {
        pageName: 'muzuo-platform-fe',
        branch: 'master',
        serviceName: 'MUZUO_ALPHA',
        remotePath: '/mnt/static/dist.zip',
        apiDomain: 'https://zeus.dabanjia.com',
        resetDomain: 'https://sys.dabanjia.com',
        releaseDate: '2020-01-10 11:26:16',
        gitUrl: 'https://gitlab.dabanjia.com/backend/muzuo-platform-fe.git',
        tag: '木作alpha前端',
        cmdStr: '',
        isCustom: false
      }
      this.isAdd = true
    },
    submit(data) {
      if (this.isAdd) {
        this.$store.dispatch('addEditionItem', data).then(result => {
          this.isEdit = false
          this.init()
        })
      } else {
        this.$store.dispatch('updateEditionItem', data).then(result => {
          this.isEdit = false
          this.init()
        })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.documentation-container {
  margin: 50px;
  .document-btn {
    float: left;
    margin-left: 50px;
    display: block;
    cursor: pointer;
    background: black;
    color: white;
    height: 60px;
    width: 200px;
    line-height: 60px;
    font-size: 20px;
    text-align: center;
  }
}
.content {
  padding: 16px 8px;
  .header {
    padding: 16px;
  }
  .el-table {
    margin: 24px;
    width: auto;
  }
}
</style>
