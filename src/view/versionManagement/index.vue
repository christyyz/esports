<template>
  <div>
    <el-row class="searchForm">
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
    </el-row>
    <div style="textAlign:right;marginBottom:10px">
        <el-button
          type="primary"
          @click="dialogFormVisible = true"
        >上传</el-button>
    </div>
    <el-table :data="tableData"
        stripe
        border
        style="width: 100%"
        :cell-style="cellStyle"
        :header-cell-style="{background:'#cbe4ff',color:'black',borderColor:'#cccccc'}">
      <el-table-column prop="name1"
                       label="版本号"
                       width="150">
      </el-table-column>
      <el-table-column prop="name2"
                       label="更新时间"
                       width="200">
      </el-table-column>
      <el-table-column prop="name3"
                       label="下载次数"
                       width="150">
      </el-table-column>
      <el-table-column prop="name4"
                       label="版本描述"
                       width="600">
      </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
          >下载</el-button>
          </template>
        </el-table-column>
    </el-table>
      <el-dialog title="安装包上传" :visible.sync="dialogFormVisible">
        <el-form :inline="true" :model="orderForm" label-width="85px">
          <el-form-item label="版本号：">
            <el-input v-model="orderForm.id"></el-input>
          </el-form-item>
            <el-row type="flex">
              <el-form-item label="版本描述：">
                <el-input type="textarea" v-model="orderForm.id" style="width:500px"></el-input>
              </el-form-item>
            </el-row>
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList">
            安装包：<el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能excel上传文件，且不超过500kb</div>
          </el-upload>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import mixin from '@/mixins'
export default {
  name: 'versionManagement',
  mixins: [mixin],
  data() {
    return {
      dialogFormVisible: false,
      formInline: {},
      orderForm: {},
      tableData: [
        {
          id: 1,
          name1: '20211212001',
          name2: '2021-12-12 10:00:01',
          name3: '23',
          name4: '更新了表格样式上传功能'
        },
        {
          id: 2,
          name1: '20211212002',
          name2: '2021-12-12 10:10:01',
          name3: '23',
          name4: '更新了表格样式上传功能'
        },
        {
          id: 3,
          name1: '20211212001',
          name2: '2021-12-12 10:00:01',
          name3: '23',
          name4: '更新了表格样式上传功能'
        },
        {
          id: 4,
          name1: '20211212001',
          name2: '2021-12-12 10:00:01',
          name3: '23',
          name4: '更新了表格样式上传功能'
        },
        {
          id: 5,
          name1: '20211212001',
          name2: '2021-12-12 10:00:01',
          name3: '23',
          name4: '更新了表格样式上传功能'
        },
        {
          id: 6,
          name1: '20211212001',
          name2: '2021-12-12 10:00:01',
          name3: '23',
          name4: '更新了表格样式上传功能'
        },
        {
          id: 7,
          name1: '20211212001',
          name2: '2021-12-12 10:00:01',
          name3: '23',
          name4: '更新了表格样式上传功能'
        },
        {
          id: 8,
          name1: '20211212001',
          name2: '2021-12-12 10:00:01',
          name3: '23',
          name4: '更新了表格样式上传功能'
        }
      ],
      fileList: []
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
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