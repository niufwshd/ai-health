<template>
  <div id="sys-user-list" class="app-container">
    <el-card class="box-card">
      <el-row>
        <el-col :span="4">
          <tree-select :data="treeSelectData" placeholder="部门名称" clearable :select-key.sync="listQuery.departmentId"
            style="width:100%;padding-right:10px;" @change="handleFilter" />
        </el-col>
        <el-col :span="4">
          <el-select v-model="listQuery.roleId" placeholder="角色名称" style="width:100%;padding-right:10px;" clearable>
            <el-option v-for="item in roleOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="listQuery.state" placeholder="状态" style="width:100%;padding-right:10px;" clearable>
            <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
        <el-col :span="12">
          <date-picker-range :date-range.sync="createTimeRange" :start-date.sync="listQuery.createTimeStart"
            :end-date.sync="listQuery.createTimeEnd" />
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="14">
          <el-input v-model="searchValue" placeholder="请输入关键字进行查询" clearable class="input-with-select"
            style="width:100%;padding-right:10px;">
            <el-select slot="prepend" v-model="searchColumn" placeholder="请选择">
              <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-input>
        </el-col>
        <el-col :span="10">
          <el-button type="primary" icon="el-icon-search" @click="handleClear()">搜索</el-button>
          <el-button type="primary" icon="el-icon-edit" @click="handleAdd">添加用户</el-button>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="box-card">
      <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row
        style="width: 100%;" :height="tableHeight" :header-cell-style="{ background: '#f5f7f9' }"
        @sort-change="sortChange">
        <el-table-column label="编号" prop="id" sortable="custom" align="center" width="75px"
          :class-name="getSortClass('id')">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <!--      <el-table-column label="头像" width="80px" align="center">-->
        <!--        <template slot-scope="{row}">-->
        <!--          <img :src="row.head" alt="" style="width: 34px; max-height: 34px; vertical-align: middle;">-->
        <!--        </template>-->
        <!--      </el-table-column>-->
        <el-table-column label="登录账号" width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户名称" width="200px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.nickname }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="showReviewer" label="手机号码" width="125px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.phone }}</span>
          </template>
        </el-table-column>
        <!--        <el-table-column label="所属部门" width="150px" align="center">-->
        <!--          <template slot-scope="{row}">-->
        <!--            <span>{{ row.departmentName }}</span>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column label="所属角色" width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.roleName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" min-width="150px" align="left" header-align="center">
          <template slot-scope="{row}">
            <span>{{ row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最后修改时间" prop="createTime" sortable="custom" width="175px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" class-name="status-col" width="75px" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.state | stateClassFilter">
              <span>{{ row.state | stateFilter }}</span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="215" class-name="operation" fixed="right">
          <!--        <template slot="header" slot-scope="scope">-->
          <!--          操作-->
          <!--                    <el-dropdown trigger="click">-->
          <!--                      <el-link type="primary" style="vertical-align: baseline;">-->
          <!--                        <i class="el-icon-s-operation"/>-->
          <!--                      </el-link>-->
          <!--                      <el-dropdown-menu slot="dropdown">-->
          <!--                        <el-dropdown-item>-->
          <!--                          <el-checkbox v-model="tableColumnChecked">账号</el-checkbox>-->
          <!--                        </el-dropdown-item>-->
          <!--                        <el-dropdown-item>-->
          <!--                          <el-checkbox v-model="tableColumnChecked">用户名称</el-checkbox>-->
          <!--                        </el-dropdown-item>-->
          <!--                        <el-dropdown-item>-->
          <!--                          <el-checkbox v-model="tableColumnChecked">电话号码</el-checkbox>-->
          <!--                        </el-dropdown-item>-->
          <!--                        <el-dropdown-item>-->
          <!--                          <el-checkbox v-model="tableColumnChecked">性别</el-checkbox>-->
          <!--                        </el-dropdown-item>-->
          <!--                      </el-dropdown-menu>-->
          <!--                    </el-dropdown>-->
          <!--                    <el-link type="primary" style="vertical-align: baseline;margin: 0px 3px;">-->
          <!--                      <i class="el-icon-document"/>-->
          <!--                    </el-link>-->
          <!--                    <el-link type="primary" style="vertical-align: baseline;">-->
          <!--                      <i class="el-icon-printer"/>-->
          <!--                    </el-link>-->
          <!--        </template>-->
          <template slot-scope="{row}">
            <!--          <el-link type="primary" @click="handDetail(row.id)">详情</el-link>-->
            <!--            <el-link type="primary" @click="handleHeadUpload(row.id, row.head)">上传头像</el-link>-->
            <el-link type="primary" @click="handleRestPassword(row.id)">重置密码</el-link>
            <el-link type="warning" @click="handUpdate(row.id)">修改</el-link>
            <el-link type="danger" @click="handleDelete(row.id, row.username)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize"
        @pagination="getList" />
    </el-card>

    <sys-user ref="detailPage" is-detail />
    <sys-user ref="addPage" is-add @change="handleFilter" />
    <sys-user ref="updatePage" is-update @change="getList" />
    <sys-user-head ref="headUploadPage" @change="getList" />
    <sys-user-password ref="resetPasswordPage" />
  </div>
</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import TreeSelect from '@/components/TreeSelect'
import DatePickerRange from '@/components/DatePickerRange'

import SysUser from './components/sys-user'
import SysUserHead from './components/sys-user-head'
import SysUserPassword from './components/sys-user-password'

import sysUserApi from '@/api/system/sys-user-api'
import sysDepartmentApi from '@/api/system/sys-department-api'
import sysRoleApi from '@/api/system/sys-role-api'

const stateEnum = { 0: '禁用', 1: '启用', 2: '锁定' }
const stateClassEnum = { 0: 'info', 1: 'success', 2: 'warning' }
const stateOptions = [
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 },
  { label: '锁定', value: 2 }
]
const searchOptions = [
  { label: '全部', value: 'keyword' },
  { label: '账号', value: 'username' },
  { label: '用户名称', value: 'nickname' }
]

export default {
  name: 'SysUserList',
  components: { DatePickerRange, TreeSelect, SysUserPassword, SysUserHead, SysUser, Pagination },
  directives: { waves },
  filters: {
    stateClassFilter(state) {
      return stateClassEnum[state]
    },
    stateFilter(state) {
      return stateEnum[state]
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
        username: null,
        nickname: null,
        departmentId: null,
        roleId: null,
        state: null,
        createTimeStart: null,
        createTimeEnd: null,
        pageSorts: []
      },
      treeSelectData: null,
      roleOptions: [],
      stateOptions,
      tableColumnChecked: null,
      searchColumn: 'keyword',
      searchValue: null,
      searchOptions,
      createTimeRange: null,
      showReviewer: true,
      downloadLoading: false,
      tableHeight: window.innerHeight - 355
    }
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        if ((window.innerHeight - 355) < 586) {
          this.tableHeight = 586
        } else {
          this.tableHeight = window.innerHeight - 355
        }
      })()
    }
  },
  created() {
    this.setDefaultSort()
    this.getList()
    this.getDepartmentTree()
    this.getRoleList()
  },
  methods: {
    getList() {
      this.listLoading = true
      sysUserApi.getPageList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    getDepartmentTree() {
      sysDepartmentApi.getDepartmentTree().then(response => {
        this.treeSelectData = response.data
      })
    },
    getRoleList() {
      sysRoleApi.getList().then(response => {
        this.roleOptions = response.data
      })
    },
    handleFilter() {
      this.listQuery.pageIndex = 1
      this.listQuery.keyword = null
      this.listQuery.username = null
      this.listQuery.nickname = null
      this.listQuery[this.searchColumn] = this.searchValue
      this.getList()
    },
    handleCreateTimeFilter() {
      this.handleFilter()
    },
    handleClear() {
      this.handleFilter()
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
    getSortClass: function (key) {
      if (this.sortColumn === key) {
        return this.sortAsc ? 'ascending' : 'descending'
      } else {
        return ''
      }
    },
    handleAdd() {
      this.$nextTick(() => {
        this.$refs.addPage.openDialog()
      })
    },
    handDetail(id) {
      this.$nextTick(() => {
        this.$refs.detailPage.openDialog(id)
      })
    },
    handUpdate(id) {
      this.$nextTick(() => {
        this.$refs.updatePage.openDialog(id)
      })
    },
    handleHeadUpload(id, head) {
      this.$nextTick(() => {
        this.$refs.headUploadPage.handle(id, head)
      })
    },
    handleRestPassword(id) {
      this.$nextTick(() => {
        this.$refs.resetPasswordPage.handle(id)
      })
    },
    handleDelete(id, username) {
      this.$confirm('您确定要删除 ' + username + ' ?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        sysUserApi.delete(id).then(response => {
          if (response.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.handleFilter()
          }
        })
      })
    }
  }
}
</script>

<style lang="scss">
#sys-user-list .el-table th,
.el-table td {
  padding: 6px 0px;
}

#sys-user-list .filter-container {
  padding-bottom: 10px;
}

#sys-user-list .filter-container .tree-select-item {
  width: 120px;
  display: inline-block;
  vertical-align: top;
  margin-right: 4px;
}

#sys-user-list .input-with-select {
  vertical-align: top;
  margin-right: 4px;
}

#sys-user-list .input-with-select .el-select .el-input {
  width: 120px;
}

#sys-user-list .input-with-select .el-input-group__prepend {
  background-color: #fff;
}

#sys-user-list .filter-item {
  //margin-right: 4px;
}

#sys-user-list .el-table__body .operation .cell {
  text-align: center;
}
</style>
