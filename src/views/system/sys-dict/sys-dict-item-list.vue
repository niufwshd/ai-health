<template>
  <div id="sys-dicts-list" class="app-container">
    <el-button type="warning" icon="el-icon-plus" @click="handleAdd()">添加</el-button>
    <el-row :gutter="10">
      <el-col :span="24">
        <el-table
          v-loading="listLoading"
          :data="list"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          :height="tableHeight"
        >
          <el-table-column label="名称" min-width="50px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.dictName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="数据值" min-width="50px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.dictValue }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="215" class-name="operation" fixed="right">
            <template slot-scope="{row}">
              <el-link type="primary" @click="handleForm(row.id)">修改</el-link>
              <el-link type="danger" @click="handleDelete(row.id, row.dictNo)">删除</el-link>

            </template>
          </el-table-column>
        </el-table>

        <!--        <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getList" />-->

      </el-col>
    </el-row>


  </div>

</template>

<script>
import { deleteDict, getDictItemList } from '@/api/basics/bas-dict-api'


const formJson = {
  dictId: null,
  dictValue: null,
  dictName: null
}
export default {
  name: "SysDictItemList",
  components: {},
  props: {
    dictCode: {
      type: String,
      default: ''
    },
    showDictListViews: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        dictId: null,
        dictValue: null,
        dictName: null,
        pageSorts: []
      },
      tableHeight: null
    }
  },
  computed: {
    show() {
      return this.showDictListViews
    }
  },
  watch: {
    show(newV, oldV) {
      if (newV) {
        if (this.dictCode) {
          this.getList()
        } else {
          this.list = []
        }
      }
      if (oldV) {
        this.form = formJson
      }
    }
  },
  created() {
    console.log('012')
    this.getList()
    window.onresize = () => {
      return (() => {
        if ((window.innerHeight - 455) < 586) {
          this.tableHeight = 586;
        } else {
          this.tableHeight = window.innerHeight - 455;
        }
      })()
    }
  },
  methods: {
    getList() {
      if (this.dictCode) {
        this.listLoading = true
        this.listQuery.dictCode = this.dictCode
        getDictItemList(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      }
    },
    handleForm(id) {
      if (id) {
        this.$nextTick(() => {
          this.$refs.updatePage.openDialog(id)
        });
      } else {
        this.$nextTick(() => {
          this.$refs.addPage.openDialog()
        });
      }
    },
    handleDelete(id) {
      deleteDict(id).then(response => {
        if (response.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getList();
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
