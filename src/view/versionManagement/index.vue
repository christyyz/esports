<template>
  <div>
    <!-- <el-row class="searchForm">
      <el-col :span="18">
        <el-form
          :inline="true"
          :model="formInline"
          class="demo-form-inline"
          label-width="85px"
        >
          <el-form-item label="版本号">
            <el-input
              v-model="formInline.id"
              placeholder="版本号"
            ></el-input>
          </el-form-item>
          <el-button
            size="medium"
            type="primary"
            @click="onSubmit"
          >查询</el-button>
        </el-form>
      </el-col>
      <el-col :span="6">
      </el-col>
    </el-row> -->
    <div style="margin:10px">
        <el-button
          type="primary"
          @click="add"
        >新增</el-button>
    </div>
    <el-table :data="formData"
        stripe
        border
        style="width: 100%"
        :empty-text="loadInfo"
        :cell-style="cellStyle"
        :header-cell-style="{background:'#cbe4ff',color:'black',borderColor:'#cccccc'}">
      <el-table-column prop="pfVersionNo"
                       label="易竞平台版本"
                       width="120">
      </el-table-column>
      <el-table-column prop="svrVersionNo"
                       label="服务端模块版本"
                       width="120">
      </el-table-column>
      <el-table-column prop="clientVersionNo"
                       label="客户端模块版本"
                       width="120">
      </el-table-column>
      <el-table-column prop="imageURL"
                       label="软件介质"
                       width="600">
      </el-table-column>
      <el-table-column prop="imageMD5"
                       label="MD5"
                       width="200">
      </el-table-column>
      <el-table-column prop="versionDesc"
                       label="版本描述"
                       :show-overflow-tooltip="true"
                       width="300">
      </el-table-column>
      <el-table-column label="发布日期"
                       width="150">
          <template slot-scope="scope">
            <span>{{creatTime(scope.row.releaseDate)}}</span>
          </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="orderitemsEdit('edit',scope.row)"
          >修改</el-button>
          <el-popconfirm
            title="确定删除该设备吗？"
            @confirm="deleteOrderItem(scope.row)"
          >
            <el-button
              size="mini"
              type="warning"
              style="margin: 0 10px"
              slot="reference">删除</el-button>
          </el-popconfirm>
          <el-button
            size="mini"
            type="info"
            @click="orderitemsEdit('look',scope.row)"
          >详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="com-pagination"
      background
      @size-change="getAllData"
      @current-change="getAllData"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :current-page.sync="pager.currentPage"
      :page-size.sync="pager.countPerPage"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
      <el-dialog title="安装包记录" :visible.sync="dialogFormVisible">
        <el-form :inline="true" :model="orderForm" label-width="140px" ref="orderForm">
          <el-form-item label="易竞平台版本：">
            <el-input v-model="orderForm.pfVersionNo" :disabled="flag == 'look'"></el-input>
          </el-form-item>
          <el-form-item label="服务端模块版本：">
            <el-input v-model="orderForm.svrVersionNo" :disabled="flag == 'look'"></el-input>
          </el-form-item>
          <el-form-item label="客户端模块版本：">
            <el-input v-model="orderForm.clientVersionNo" :disabled="flag == 'look'"></el-input>
          </el-form-item>
          <el-form-item label="MD5：">
            <el-input v-model="orderForm.imageMD5" :disabled="flag == 'look'"></el-input>
          </el-form-item>
            <el-row>
              <el-form-item label="软件介质：">
                <el-input type="textarea"  v-model="orderForm.imageURL" :disabled="flag == 'look'" style="width:500px"></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="版本描述：">
                <el-input type="textarea"  v-model="orderForm.versionDesc" :disabled="flag == 'look'" style="width:500px"></el-input>
              </el-form-item>
            </el-row>
          <el-form-item label="发布日期：">
            <el-date-picker
              v-model="orderForm.releaseDate"
              :disabled="flag == 'look'"
              type="date" 
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import mixin from '@/mixins'
import moment from 'moment'
export default {
  name: 'versionManagement',
  mixins: [mixin],
  data() {
    return {
      dialogFormVisible: false,
      flag: 'add',
      formInline: {},
      orderForm: {},
      formData: [],
      fileList: []
    }
  },
  mounted () {
    console.log(123);
    this.getAllData()
  },
  methods: {
    creatTime (e) {
      return moment(e).format('YYYY-MM-DD')
    },
    add () {
      this.dialogFormVisible = true
      this.flag = 'add'
      this.orderForm = {}
    },
    orderitemsEdit (flag,item) {
      this.dialogFormVisible = true
      this.flag = flag,
      this.changeFormData(this.orderForm, item)
    },
    async getAllData () {
      this.loadInfo = '数据加载中...'
      const params = {
        currentPage: this.pager.currentPage - 1,
        countPerPage: this.pager.countPerPage
      }
      const res = await this.$get('/pfversion/getall',params)
      this.formData = res.pageData
      this.loadInfo = '暂无数据'
      this.total = res.totalElements
    },
    async submitForm () {
      this.$refs['orderForm'].validate(async (valid) => {
          if (valid) {
            const url = this.flag == 'edit' ? '/pfversion/update' : '/pfversion/add'
            const res = await this.$post(url,this.orderForm)
            console.log(res);
            if (res.code == 200) {
              this.$message({
                message: this.flag == 'add'?'新增成功':'修改成功',
                type: "success",
              });
            }
            this.getAllData()
            this.dialogFormVisible = false
          }
      });
    },
    async deleteOrderItem (item) {
      const res = await this.$post(`/pfversion/deletebyid?id=${item.id}`)
      console.log(res);
      if (res.data) {
        this.$message.success(res.msg)
      }
      this.getAllData()
    }
  }
}
</script>

<style lang="less" scoped>
  
.searchForm {
  margin-bottom: 20px;
  border-bottom: 5px solid #cccccc;
  .el-input {
    width: 200px;
  }
}
</style>