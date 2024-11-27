<template>
  <div id="sys-department-list" class="app-container">
    <el-card class="box-card">
      <el-button type="primary"  @click="handleExpandAll">折叠/展开</el-button>
      <el-button type="primary" icon="el-icon-edit"  @click="handleAdd">添加</el-button>
    </el-card>
    <el-card class="box-card">
      <!--      <el-tree-->
      <!--        :data="tableData"-->
      <!--        :props="defaultProps"-->

      <!--      />-->
      <el-table
        ref="departmentTable"
        :data="tableData"
        type="selection"
        style="width: 100%;"
        row-key="id"
        border
        :indent="16"
        :lazy="true"
        :default-expand-all="expandAll"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        :height="tableHeight"
        :header-cell-style="{ background: '#f5f7f9' }"
        @row-click="handleRowClick"
      >
        <!--        <el-table-column-->
        <!--          prop="id"-->
        <!--          label="编号"-->
        <!--          width="125"-->
        <!--          fixed="left"-->
        <!--        />-->
        <el-table-column
          prop="name"
          label="部门名称"
          min-width="250"
          class-name="menu-name"
        />

        <el-table-column
          prop="remark"
          label="备注"
          min-width="250px"
          align="left" 
          header-align="center"
        />
        <el-table-column
          prop="state"
          label="状态"
          width="75px"
          align="center"
        >
          <template slot-scope="{row}">
            <el-tag :type="row.state | stateFilter">
              <span v-if="row.state===1">启用</span>
              <span v-else-if="row.state===0">禁用</span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100" class-name="operation">
          <template slot-scope="{row}">
            <div class="operation-area" @click.stop>
              <el-link type="warning" @click="handUpdate(row.id)">修改</el-link>
              <el-link type="danger" @click="handleDelete(row.id, row.name)">删除</el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <sys-department ref="addPage" is-add @change="getList" />
    <sys-department ref="detailPage" is-detail />
    <sys-department ref="updatePage" is-update @change="getList" />
  </div>
</template>

<script>
import sysDepartmentApi from '@/api/system/sys-department-api'
import SysDepartment from './components/sys-department'

export default {
  name: 'SysDepartmentList',
  components: { SysDepartment },
  directives: {},
  filters: {
    typeFilter(type) {
      if (type === 1) {
        return 'success'
      } else if (type === 2) {
        return 'info'
      }
    },
    stateFilter(state) {
      if (state === 0) {
        return 'info'
      } else if (state === 1) {
        return 'success'
      }
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      expandAll: true,
      expandRow: {},
      tableData: [],
      tableRowData: [],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      tableHeight: window.innerHeight - 252
    }
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        if ((window.innerHeight - 252) < 586) {
          this.tableHeight = 586;
        } else {
          this.tableHeight = window.innerHeight - 252;
        }
      })()
    }
  },
  created() {
    this.getList();
  },
  methods: {
    handleExpandAll() {
      // 如果当前是展开，则设置为折叠，反之亦然
      this.expandAll = !this.expandAll
      this.expandRow = {}
      if (this.tableRowData) {
        this.tableRowData.forEach(row => {
          this.$refs.departmentTable.toggleRowExpansion(row, this.expandAll)
        })
      }
    },
    getList() {
      this.listLoading = true
      sysDepartmentApi.getDepartmentTree().then(response => {
        this.tableData = response.data
        this.listLoading = false
        // 获取一级/二级菜单对象
        if (this.tableData) {
          this.tableData.forEach(row => {
            this.tableRowData.push(row);
            if (row.children && row.children.length > 0) {
              row.children.forEach(r => {
                this.tableRowData.push(r);
              })
            }
          })
        }
      })
    },
    handleRowClick(row, column, event) {
      const expandState = this.expandRow[row.id];
      if (expandState === undefined) {
        this.expandRow[row.id] = !this.expandAll;
      } else if (expandState) {
        this.expandRow[row.id] = false
      } else {
        this.expandRow[row.id] = true;
      }
      this.$refs.departmentTable.toggleRowExpansion(row, this.expandRow[row.id]);
    },
    handleFilter() {
      this.getList()
    },
    handleAdd(event) {
      this.$nextTick(() => {
        this.$refs.addPage.handle()
      })
    },
    handDetail(id) {
      this.$nextTick(() => {
        this.$refs.detailPage.handle(id)
      })
    },
    handUpdate(id) {
      this.$nextTick(() => {
        this.$refs.updatePage.handle(id)
      })
    },
    handleDelete(id, name) {
      this.$confirm('您确定要删除 ' + name + ' ?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        sysDepartmentApi.delete(id).then(response => {
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
#sys-department-list {
}

#sys-department-list .el-table th {
  padding: 6px 0px;
}

#sys-department-list .el-table td {
  padding: 8px 0px;
}

#sys-department-list .filter-item {
  margin-right: 4px;
  vertical-align: baseline;
}

#sys-department-list .el-table__body .operation {
  padding: 0px;
}

#sys-department-list .el-table__body .operation .cell {
  text-align: center;
  padding: 0px;
}

#sys-department-list .el-table__body .operation .cell .operation-area {
  text-align: center;
  padding: 8px 0px;
  margin: 0px;
}

#sys-department-list .el-table__row--level-1 .menu-name .cell {
  border: 0px solid red !important;
  padding-left: 25px !important;
}

#sys-department-list .el-table__row--level-2 .menu-name .cell {
  border: 0px solid blue !important;
  padding-left: 40px !important;
}
</style>
