<template>
  <div id="sys-cost-list" class="app-container">
    <el-card>
      <el-row>
        <el-col :span="6">
          <el-input v-model="searchValue" placeholder="请输入关键字查询" clearable  style="width:100%;padding-right :10px;" />
        </el-col>
        <el-col :span="18">
          <el-button type="primary" icon="el-icon-search"  @click="handleClear()">搜索</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card style="margin-top: 10px;">
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        :height="tableHeight"
        :header-cell-style="{ background: '#f5f7f9' }"
      >
        <el-table-column label="操作类型" width="150px" align="left">
          <template slot-scope="{row}">
            <span>{{ row.type | typeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作人" width="150px" align="left">
          <template slot-scope="{row}">
            <span>{{ row.userName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" min-width="150px" align="left">
          <template slot-scope="{row}">
            <span>{{ row.describeContent }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作时间" width="170px" align="left">
          <template slot-scope="{row}">
            <span>{{ row.createTime }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageIndex"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
      />
    </el-card>
  </div>

</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import sysOrderOperationLogApi from "@/api/system/sys-order-operation-log-api";
import sysCostApi from "@/api/system/sys-cost-api";


const typeEnum = { 0: '取消确认', 1: '确认', 2: '新增', 3: '修改', 4: '删除', 5: '生成运单', 6: '取消发运', 7: '确认发运', 8: '确认接单', 9: '确认提货', 10: '确认送达', 11: '异常' };
export default {
  name: "SysOperationLogList",
  components: { Pagination },
  filters: {
    typeFilter(type) {
      return typeEnum[type]
    }
  },
  directives: { waves },
  data() {
    return {
      list: [],
      total: 0,
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        keyword: null
      },
      listLoading: false,
      searchValue: null,
      tableHeight: null
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        if ((window.innerHeight - 304) < 586) {
          this.tableHeight = 586;
        } else {
          this.tableHeight = window.innerHeight - 304;
        }
      })()
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      sysOrderOperationLogApi.getPageList(this.listQuery).then(response => {
        if (response.code === 200) {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
          console.log(this.list, 123)
        }
      })
    },
    handleClear() {
      this.listQuery.keyword = this.searchValue
      this.getList()
    },
    handleAdd() {
      this.$nextTick(() => {
        this.$refs.addPage.openDialog()
      })
    },
    handUpdate(id) {
      this.$nextTick(() => {
        this.$refs.updatePage.openDialog(id)
      });
    },
    handleDelete(id) {
      this.$confirm('您确定要删除 ?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        sysCostApi.delete(id).then(response => {
          if (response.code === 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getList()
          }
        })
      });
    }
  }
}
</script>

<style lang="scss">
#sys-cost-list .el-table th, .el-table td {
  padding: 6px 0px;
}


</style>
