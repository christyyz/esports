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
    <div style="textAlign:right;">
      <el-button type="primary" style="margin:0 10px 10px 0">导出</el-button>
    </div>
    <el-table
      :data="formData"
      stripe
      border
      style="width: 100%"
      :header-cell-style="{background:'#cbe4ff',color:'black',borderColor:'#ccccccc'}"
    >
      <el-table-column
        prop="name1"
        label="订单号"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="name2"
        label="项目名称"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="name3"
        label="设备型号"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="name4"
        label="MAC地址"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="name5"
        label="当前状态"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="name6"
        label="创建日期"
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
      <el-form :inline="true" :model="modelsForm" label-width="85px">
        <el-form-item label="订单号：">
          <el-input v-model="modelsForm.id"></el-input>
        </el-form-item>
        <el-form-item label="项目名称：">
          <el-input v-model="modelsForm.id"></el-input>
        </el-form-item>
        <el-form-item label="设备型号：">
          <el-input v-model="modelsForm.id"></el-input>
        </el-form-item>
        <el-form-item label="mac地址：">
          <el-input v-model="modelsForm.id"></el-input>
        </el-form-item>
        <el-form-item label="当前状态：">
          <el-input v-model="modelsForm.id"></el-input>
        </el-form-item>
        <el-form-item label="创建时间：">
          <el-input v-model="modelsForm.id"></el-input>
        </el-form-item>
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
  name: 'modelsManagement',
  mixins: [mixin],
  data () {
    return {
      formInline: {},
      modelsForm: {},
      formData: [
        {
          id: 1,
          name1: '1331113331',
          name2: '爱电竞1',
          name3: '拯救者刃7000K',
          name4: '44-45-53-54-00-00',
          name5: '已激活',
          name6: '2022-05-27 11:00:00',
        },
        {
          id: 2,
          name1: '1331113332',
          name2: '爱电竞2',
          name3: '天逸510S',
          name4: '44-45-53-54-00-01',
          name5: '已激活',
          name6: '2022-05-27 11:10:00'
        },
        {
          id: 3,
          name1: '1331113333',
          name2: '爱电竞3',
          name3: '扬天M400q',
          name4: '44-45-53-54-00-02',
          name5: '已激活',
          name6: '2022-05-27 11:20:00'
        },
        {
          id: 4,
          name1: '1331113334',
          name2: '爱电竞4',
          name3: '天逸510pro',
          name4: '44-45-53-54-00-03',
          name5: '未激活',
          name6: '2022-05-27 11:30:00'
        }
      ],
      dialogFormVisible: false,
    }
  },
  methods: {
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