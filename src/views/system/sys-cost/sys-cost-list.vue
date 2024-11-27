<template>
  <div id="sys-cost-list" class="app-container">
    <el-card>
      <el-row>
        <el-col :span="6">
          <el-input v-model="searchValue" placeholder="请输入关键字查询" clearable size="small" style="width:100%;padding-right :10px;" />
        </el-col>
        <el-col :span="18">
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleClear()">搜索</el-button>
          <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAdd()">添加</el-button>
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
        <el-table-column label="发运地" min-width="150px" align="left" :show-overflow-tooltip="true">
          <template slot-scope="{row}">
            <span>{{ row.cityStartAddress }}</span>
          </template>
        </el-table-column>
        <el-table-column label="目的地" min-width="150px" align="left" :show-overflow-tooltip="true">
          <template slot-scope="{row}">
            <span>{{ row.cityEndAddress }}</span>
          </template>
        </el-table-column>
        <el-table-column label="重量单价" width="150px" align="right">
          <template slot-scope="{row}">
            <span>{{ row.weightPrice.toFixed(2) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="体积单价" width="150px" align="right">
          <template slot-scope="{row}">
            <span>{{ row.volumePrice.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="85" class-name="operation">
          <template slot-scope="{row}">
            <el-link type="warning" @click="handUpdate(row.id)">修改</el-link>
            <el-link type="danger" @click="handleDelete(row.id)">删除</el-link>
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

    <sys-cost ref="addPage" is-add @change="getList" />
    <sys-cost ref="updatePage" is-update @change="getList" />
  </div>

</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import SysCost from './components/sys-cost'
import sysCostApi from "@/api/system/sys-cost-api";

// eslint-disable-next-line no-undef
export default {
  name: "SysCostList",
  components: { SysCost, Pagination },
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
      sysCostApi.getPageList(this.listQuery).then(response => {
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
