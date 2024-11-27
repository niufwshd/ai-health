<template>
  <div id="sys-role-list" class="app-container">
    <el-card class="box-card">
      <el-row>
        <el-col :span="2">
          <el-select
            v-model="listQuery.state"
            placeholder="状态"
            clearable
            class="filter-item"
            style="width: 100%;padding-right: 10px;"
            
            @change="handleFilter"
          >
            <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-input
            v-model="searchValue"
            placeholder="请输入关键字进行查询"
            clearable
            class="input-with-select"
            
            style="width:100%;padding-right: 10px;"
            @keyup.enter.native="getList()"
          >
            <el-select
              slot="prepend"
              v-model="searchColumn"
              placeholder="请选择"
            >
              <el-option
                v-for="item in searchOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-input>
        </el-col>
        <el-col :span="14">
          <el-button v-waves type="primary" icon="el-icon-search"  @click="handleFilter">搜索</el-button>
          <el-button type="primary" icon="el-icon-edit"  @click="handleAdd">添加</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card">
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        :height="tableHeight"
        :header-cell-style="{ background: '#f5f7f9' }"
        @sort-change="sortChange"
      >
        <el-table-column
          label="编号"
          prop="id"
          sortable="custom"
          align="center"
          width="75px"
          :class-name="getSortClass('id')"
        >
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色代码" width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色名称" width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="备注" min-width="200px" align="left" header-align="center">
          <template slot-scope="{row}">
            <span>{{ row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" class-name="status-col" width="75" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.state | stateClassFilter">
              <span>{{ row.state | stateFilter }}</span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="最后修改时间" prop="createTime" sortable="custom" width="175px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.updateTime }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="145" class-name="operation" fixed="right">
          <!--        <template slot="header" slot-scope="scope">-->
          <!--          操作-->
          <!--          <el-dropdown trigger="click">-->
          <!--            <el-link type="primary" style="vertical-align: baseline;">-->
          <!--              <i class="el-icon-s-operation"/>-->
          <!--            </el-link>-->
          <!--            <el-dropdown-menu slot="dropdown">-->
          <!--              <el-dropdown-item>-->
          <!--                <el-checkbox v-model="tableColumnChecked">角色名称</el-checkbox>-->
          <!--              </el-dropdown-item>-->
          <!--              <el-dropdown-item>-->
          <!--                <el-checkbox v-model="tableColumnChecked">角色编码</el-checkbox>-->
          <!--              </el-dropdown-item>-->
          <!--              <el-dropdown-item>-->
          <!--                <el-checkbox v-model="tableColumnChecked">角色备注</el-checkbox>-->
          <!--              </el-dropdown-item>-->
          <!--              <el-dropdown-item>-->
          <!--                <el-checkbox v-model="tableColumnChecked">状态</el-checkbox>-->
          <!--              </el-dropdown-item>-->
          <!--            </el-dropdown-menu>-->
          <!--          </el-dropdown>-->
          <!--          <el-link type="primary" style="vertical-align: baseline;margin: 0px 3px;">-->
          <!--            <i class="el-icon-document"/>-->
          <!--          </el-link>-->
          <!--          <el-link type="primary" style="vertical-align: baseline;">-->
          <!--            <i class="el-icon-printer"/>-->
          <!--          </el-link>-->
          <!--        </template>-->
          <template slot-scope="{row}">
            <!--          <el-link type="primary" @click="handDetail(row.id)">详情</el-link>-->

            <router-link :to="'/system/sys-role-menu/'+row.id">
              <el-link type="primary" @click="handUpdate(row.id)">权限设置</el-link>
            </router-link>

            <el-link type="warning" @click="handUpdate(row.id)">修改</el-link>
            <el-link type="danger" @click="handleDelete(row.id, row.name)">删除</el-link>
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
      <!--      <div class="pagination-block-right">-->
      <!--        -->
      <!--      </div>-->
    </el-card>

    <sys-role ref="detailPage" is-detail />
    <sys-role ref="addPage" is-add @change="getList" />
    <sys-role ref="updatePage" is-update @change="getList" />

  </div>
</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

import SysRole from './components/sys-role'
import sysRoleApi from '@/api/system/sys-role-api'

// eslint-disable-next-line no-unused-vars
const stateEnum = { 0: '禁用', 1: '启用' }
const stateClassEnum = { 0: 'info', 1: 'success' }
const stateOptions = [
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 }
];
const searchOptions = [
  { label: '全部', value: 'keyword' },
  { label: '角色代码', value: 'code' },
  { label: '角色名称', value: 'name' }
];

export default {
  name: 'SysRoleList',
  components: { SysRole, Pagination },
  directives: { waves },
  filters: {
    stateClassFilter(state) {
      return stateClassEnum[state]
    },
    stateFilter(state) {
      return stateEnum[state];
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      sortColumn: 'id',
      sortAsc: false,
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        keyword: null,
        name: null,
        code: null,
        state: null,
        pageSorts: []
      },
      tableColumnChecked: null,
      searchColumn: 'keyword',
      searchValue: null,
      createTimeRange: null,
      showReviewer: true,
      dialogStatus: '',
      stateOptions,
      searchOptions,
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      downloadLoading: false,
      tableHeight: window.innerHeight - 310
    }
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        if ((window.innerHeight - 310) < 586) {
          this.tableHeight = 586;
        } else {
          this.tableHeight = window.innerHeight - 310;
        }
      })()
    }
  },
  created() {
    this.setDefaultSort()
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      sysRoleApi.getPageList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      });
    },
    handleFilter() {
      this.listQuery.pageIndex = 1
      this.listQuery.keyword = null;
      this.listQuery.name = null;
      this.listQuery.code = null;
      this.listQuery[this.searchColumn] = this.searchValue;
      this.getList()
    },
    setDefaultSort() {
      // 设置默认排序
      this.listQuery.pageSorts = [{
        column: this.sortColumn,
        asc: this.sortAsc
      }]
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'createTime') {
        this.sortColumn = 'create_time'
      } else {
        this.sortColumn = prop
      }
      this.sortAsc = order === 'ascending'
      this.listQuery.pageSorts = [{
        column: this.sortColumn,
        asc: this.sortAsc
      }]
      this.handleFilter()
    },
    getSortClass: function(key) {
      if (this.sortColumn === key) {
        return this.sortAsc ? 'ascending' : 'descending'
      } else {
        return ''
      }
    },
    handleAdd() {
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs.addPage.openDialog()
      });
    },
    handDetail(id) {
      this.$nextTick(() => {
        this.$refs.detailPage.openDialog(id)
      });
    },
    handUpdate(id) {
      this.$nextTick(() => {
        this.$refs.updatePage.openDialog(id)
      });
    },
    handleDelete(id, name) {
      this.$confirm('您确定要删除 ' + name + ' ?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        sysRoleApi.delete(id).then(response => {
          if (response.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.handleFilter()
          }
        })
      })
    }
  }
}
</script>

<style lang="scss">
#sys-role-list {
}

#sys-role-list .el-table th {
  padding: 6px 0px;
}

#sys-role-list .el-table td {
  padding: 8px 0px;
  /*border: 1px solid red;*/
}

#sys-role-list .filter-container {
  /*border: 1px solid red;*/
  /*padding-bottom: 10px;*/
}

#sys-role-list .input-with-select {
  /*border: 1px solid red;*/
  /*vertical-align: top;*/
  width: 505px;
  margin-right: 4px;
}

#sys-role-list .input-with-select .el-select .el-input {
  width: 120px;
}

.input-with-select .el-input-group__prepend {
  background-color: #fff;
}

#sys-role-list .filter-item {
  margin-right: 4px;
  /*border: 1px solid red;*/
  vertical-align: baseline;
}

#sys-role-list .el-table__body .operation .cell {
  /*border: 1px solid blue;*/
  text-align: center;
}

</style>
