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
          <el-form-item label="设备型号">
            <el-input
              v-model="formInline.modelType"
              placeholder="设备型号"
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
              <el-form-item label="MAC地址">
                <el-input
                  v-model="formInline.MACaddress"
                  placeholder="MAC地址"
                ></el-input>
              </el-form-item>
              <el-form-item label="当前状态">
                  <el-select v-model="formInline.state" placeholder="请选择" style="width:200px">
                    <el-option label="已激活" :value="1"></el-option>
                    <el-option label="未激活" :value="2"></el-option>
                  </el-select>
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
    <div style="marginBottom:10px">
      <el-button type="primary" @click="orderitemsAdd">新增</el-button>
      <el-button type="primary">导出</el-button>
    </div>
    <el-table
      :data="formData"
      stripe
      border
      style="width: 100%"
      :header-cell-style="{background:'#cbe4ff',color:'black',borderColor:'#ccccccc'}"
    >
      <el-table-column
        prop="orderFormNo"
        label="订单号"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="deviceName"
        label="设备名称"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="modelNo"
        label="设备型号"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="macAddr"
        label="MAC地址"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="status"
        label="当前状态"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建日期"
        width="200"
      >
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="orderitemsEdit('edit',scope.row)"
          >修改</el-button>
          <el-popconfirm
            title="确定删除该设备吗？"
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
      <el-form :inline="true" :model="modelsForm" label-width="100px" :rules="rules" ref="modelsForm">
        <el-form-item label="订单号：" prop="orderFormNo">
          <el-input v-model="modelsForm.orderFormNo" :disabled="flag == 'look'"></el-input>
        </el-form-item>
        <el-form-item label="设备名称：" prop="deviceName">
          <el-input v-model="modelsForm.deviceName" :disabled="flag == 'look'"></el-input>
        </el-form-item>
        <el-form-item label="设备型号：" prop="modelNo">
          <el-input v-model="modelsForm.modelNo" :disabled="flag == 'look'"></el-input>
        </el-form-item>
        <el-form-item label="mac地址：" prop="macAddr">
          <el-input v-model="modelsForm.macAddr" :disabled="flag == 'look'"></el-input>
        </el-form-item>
        <el-form-item label="当前状态：" prop="status">
          <el-select v-model="modelsForm.status" placeholder="请选择" style="width:205px" :disabled="flag == 'look'">
            <el-option label="已激活" value="已激活"></el-option>
            <el-option label="未激活" value="未激活"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间：" prop="createTime">
            <el-date-picker
              v-model="modelsForm.createTime"
              :disabled="flag == 'look'"
              type="date" 
              placeholder="选择日期">
            </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="flag !== 'look'">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="modelsFormSubmit('modelsForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import mixin from '@/mixins'
export default {
  name: 'modelsManagement',
  mixins: [mixin],
  data () {
    return {
      formInline: {},
      modelsForm: {
        orderFormNo: '',
        deviceName: '',
        modelNo: '',
        macAddr: '',
        status: '',
        createTime: '',
      },
      formData: [
        {
          id: 1,
          orderFormNo: '1331113331',
          deviceName: '爱电竞1',
          modelNo: '拯救者刃7000K',
          macAddr: '44-45-53-54-00-00',
          status: '已激活',
          createTime: '2022-05-27 11:00:00',
        },
        {
          id: 2,
          orderFormNo: '1331113332',
          deviceName: '爱电竞2',
          modelNo: '天逸510S',
          macAddr: '44-45-53-54-00-01',
          status: '已激活',
          createTime: '2022-05-27 11:10:00'
        },
        {
          id: 3,
          orderFormNo: '1331113333',
          deviceName: '爱电竞3',
          modelNo: '扬天M400q',
          macAddr: '44-45-53-54-00-02',
          status: '已激活',
          createTime: '2022-05-27 11:20:00'
        },
        {
          id: 4,
          orderFormNo: '1331113334',
          deviceName: '爱电竞4',
          modelNo: '天逸510pro',
          macAddr: '44-45-53-54-00-03',
          status: '未激活',
          createTime: '2022-05-27 11:30:00'
        }
      ],
      dialogFormVisible: false,
      flag: '',
      rules: {
        orderFormNo: [
          { required: true, message: '请输入订单号', trigger: 'blur' },
        ],
        deviceName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        modelNo: [
          { required: true, message: '请输入设备类型', trigger: 'blur' }
        ],
        macAddr: [
          { required: true, message: '请输入MAC地址', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择当前状态', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '请输入创建时间', trigger: 'blur' }
        ],
        
      }
    }
  },
  methods: {
    getNowTime() {
       var now = new Date();
       var year = now.getFullYear(); //得到年份
       var month = now.getMonth(); //得到月份
       var date = now.getDate(); //得到日期
       month = month + 1;
       month = month.toString().padStart(2, "0");
       date = date.toString().padStart(2, "0");
       var defaultDate = `${year}-${month}-${date}`;
       this.$set(this.orderForm, "createTime", defaultDate);
   },
    orderitemsAdd() {
      this.flag = 'add'
      this.id = 0
      this.modelsForm = {}
      this.dialogFormVisible = true
    },
    orderitemsEdit(flag,item) {
      this.id = item.id
      this.flag = flag
      this.modelsForm = item
      this.dialogFormVisible = true
    },
    modelsFormSubmit (formName) {
      this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const url = (this.flag == 'add'?'/orderitems/add':'/orderitems/update')
            const res = await this.$post(url,this.modelsForm)
            console.log(res);
            this.dialogFormVisible = false
          }
      });
    }
  }
}
</script>

<style lang="less" scoped>
.backBox {
  align-items: center;
  text-align: left;
  line-height: 60px;
}
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