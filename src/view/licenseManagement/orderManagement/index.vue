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
          <el-form-item label="订单号">
            <el-input
              v-model="formInline.id"
              placeholder="订单号"
            ></el-input>
          </el-form-item>
          <el-form-item label="项目名称">
            <el-input
              v-model="formInline.subjectName"
              placeholder="项目名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="客户名称">
            <el-input
              v-model="formInline.customerName"
              placeholder="客户名称"
            ></el-input>
          </el-form-item>
          <transition
            :duration="{ enter: 800, leave: 100 }"
            mode="out-in"
            name="el-fade-in-linear"
          >
            <div
              class="selectMode"
              v-if="!isUpDown"
            >
              <el-form-item label="创建人">
                <el-input
                  v-model="formInline.createPerson"
                  placeholder="创建人"
                ></el-input>
              </el-form-item>
              <el-form-item label="创建时间">
                <el-date-picker
                  v-model="formInline.time"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                >
                </el-date-picker>
              </el-form-item>
            </div>
          </transition>
        </el-form>
      </el-col>
      <el-col :span="6">
        <el-button
          size="medium"
          type="primary"
          @click="onSubmit"
        >查询</el-button>
        <el-button
          size="medium"
          type="primary"
          @click="onSubmit"
        >重置</el-button>
        <el-button
          size="medium"
          type="primary"
          :icon="isUpDown?'el-icon-arrow-up':'el-icon-arrow-down'"
          @click="onUpDown"
          class="highSearch"
        >高级查询</el-button>
      </el-col>
    </el-row>
    <div>
      <div style="textAlign:left;marginBottom:10px">
        <el-button
          type="primary"
          @click="dialogFormVisible = true"
        >添加</el-button>
        <el-button
          type="primary"
          @click="dialogFormVisible1 = true"
        >导出</el-button>
      </div>
      <el-table
        :data="formData"
        stripe
        border
        style="width: 100%"
        :cell-style="cellStyle"
        :header-cell-style="{background:'#cbe4ff',color:'black',borderColor:'#cccccc'}"
      >
        <el-table-column
          prop="name0"
          label="订单号"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="name1"
          label="项目名称"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="name9"
          label="客户名称"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="name2"
          label="设备总数"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="name3"
          label="激活设备数"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="name4"
          label="创建人"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="name5"
          label="创建时间"
          width="200"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="dialogFormVisible = true"
          >修改</el-button>
          <el-popconfirm
            title="确定删除该设订单吗？"
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
            @click="dialogFormVisible = true"
          >详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="com-pagination"
        @size-change="search"
        @current-change="search"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        :current-page.sync="pager.page"
        :page-size.sync="pager.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <el-dialog title="设备信息" :visible.sync="dialogFormVisible">
        <el-form :inline="true" :model="orderForm" label-width="85px">
          <el-form-item label="订单号：">
            <el-input v-model="orderForm.id"></el-input>
          </el-form-item>
          <el-form-item label="项目名称：">
            <el-input v-model="orderForm.id"></el-input>
          </el-form-item>
          <el-form-item label="客户名称：">
            <el-input v-model="orderForm.id"></el-input>
          </el-form-item>
          <el-row>
            <el-form-item label="设备：">
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
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能excel上传文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="设备信息" :visible.sync="dialogFormVisible1">
        <el-form :inline="true" :model="orderForm1" label-width="85px">
          <el-row>
            <el-form-item label="订单号：">
              <el-input v-model="orderForm1.id"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="设备数量：">
              <el-input-number v-model="orderForm1.num" :min="1" label="描述文字" style="width:210px"></el-input-number>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="有效时间：">
              <el-date-picker
                v-model="orderForm1.time"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible1 = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import mixin from '@/mixins'
export default {
  name: 'licenseManagement',
  mixins: [mixin],
  data () {
    return {
      table: false,
      dialogFormVisible: false,
      dialogFormVisible1: false,
      formData: [
        {
          id: 1,
          name0: '1331113331',
          name1: '链家酒店',
          name2: '50',
          name3: '27',
          name4: 'keshi',
          name5: '2022-05-26 11:23:13',
          name9: '松山'
        },
        {
          id: 2,
          name0: '1331113332',
          name1: '爱电竞',
          name2: '80',
          name3: '23',
          name4: 'keshi',
          name5: '2022-05-27 11:23:13',
          name9: '松山'
        },
        {
          id: 3,
          name0: '1331113333',
          name1: '如家酒店',
          name2: '90',
          name3: '42',
          name4: 'keshi',
          name5: '2022-05-28 11:23:13',
          name9: '松山'
        },
        {
          id: 4,
          name0: '1331113334',
          name1: '速8酒店',
          name2: '50',
          name3: '27',
          name4: 'keshi',
          name5: '2022-05-29 11:23:13',
          name9: '松山'
        },
        {
          id: 5,
          name0: '1331113335',
          name1: '格林豪泰酒店',
          name2: '50',
          name3: '27',
          name4: 'keshi',
          name5: '2022-05-30 11:23:13',
          name9: '松山'
        },
        {
          id: 6,
          name0: '1331113336',
          name1: '7天连锁酒店',
          name2: '50',
          name3: '27',
          name4: 'keshi',
          name5: '2022-05-31 11:23:13',
          name9: '松山'
        },
      ],
      orderForm: {},
      orderForm1: {
        time:[]
      },
      formInline: {},
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      fileList: []
    }
  },
  methods: {
    add () {
      this.$router.push({
        name: 'orderManagement',
        params: {
          flag: 'add'
        }
      })
    },
    modelsDetails () {
      this.$router.push({
        name: 'modelsDetails',
      })
    },
    orderDetails (e) {
      this.$router.push({
        name: 'patientsDetail'
      })
    },
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
.el-col {
  padding: 0 0 0 20px;
}
.searchForm {
  margin-bottom: 20px;
  border-bottom: 5px solid #cccccc;
  .el-input {
    width: 200px;
  }
}
.el-drawer.btt {
  padding-top: 10px;
}
</style>