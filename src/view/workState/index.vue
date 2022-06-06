<template>
  <div class="big">
    <el-row class="topInfo">
      <cardType :cardList="cardList"></cardType>
    </el-row>
    <!-- <div class="shadow">
      <el-row :gutter="20">
        <el-col
          v-for="(card, key) in toolCards"
          :key="key"
          :span="4"
          :xs="8"
          @click.native="toTarget(card.name)"
        >
          <el-card shadow="hover" class="grid-content">
            <i :class="card.icon" :style="{ color: card.color }" />
            <p>{{ card.label }}</p>
          </el-card>
        </el-col>
      </el-row>
    </div> -->
    <el-row class="echartsBox">
      <el-col :xs="24" :sm="24" :md='18' class="boxLeft">
        <el-col :xs="24" :sm="24" :md='12'>
          <div id="activeRate" class="activeRate"></div>
        </el-col>
        <el-col :xs="24" :sm="24" :md='12'>
          <div id="modelsRate" class="modelsRate"></div>
        </el-col>
        <el-col :xs="24" :sm="24" :md='24'>
          <div id="activetime" class="activetime"></div>
        </el-col>
        <!-- <div id="activeRate" class="activeRate"></div>
        <div id="subjectTim" class="subjectTim">
          <template>
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div> -->
      </el-col>
      <el-col :xs="24" :sm="24" :md='6' class="boxRight">
        <div id="activeRanking" class="activeRanking">
          <h3 style="paddingBottom:10px;borderBottom:2px solid #eeeeee"><span class="titleIcon"></span>订单排名</h3>
          <ul>
            <li v-for="(item,index) in orderList" :key="index" class="activeRankingItem">
              <div>{{index + 1}}.{{item.title}}</div>
              <div>{{item.num}}</div>
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import cardType from '@/components/cardType/index'
var myChart1
var myChart2
var myChart3
export default {
  name: 'workState',
  components: {
    cardType
  },
  data() {
    return {
      cardList: [
        {
          id: '1',
          title1: '以激活设备',
          num: 1000
        },
        {
          id: '2',
          title1: '未激活设备',
          num: 1500
        },
        {
          id: '3',
          title1: '设备总数',
          num: 2500
        },
        {
          id: '4',
          title1: '订单数',
          num: 1000
        },
      ],
      // toolCards: [
      //   {
      //     label: '用户管理',
      //     icon: 'el-icon el-icon-user',
      //     name: 'user',
      //     color: '#ff9c6e'
      //   },
      //   {
      //     label: '角色管理',
      //     icon: 'el-icon el-icon-setting',
      //     name: 'authority',
      //     color: '#69c0ff'
      //   },
      //   {
      //     label: '菜单管理',
      //     icon: 'el-icon el-icon-menu',
      //     name: 'menu',
      //     color: '#b37feb'
      //   },
      //   {
      //     label: 'api管理',
      //     icon: 'el-icon el-icon-cpu',
      //     name: 'api',
      //     color: '#ffd666'
      //   },
      //   {
      //     label: '机构管理',
      //     icon: 'el-icon el-icon-document-checked',
      //     name: 'organizational',
      //     color: '#ff85c0'
      //   },
      //   {
      //     label: '字典管理',
      //     icon: 'el-icon el-icon-monitor',
      //     name: 'dictionary',
      //     color: '#5cdbd3'
      //   },
      //   {
      //     label: '课题管理',
      //     icon: 'el-icon el-icon-tickets',
      //     name: 'project',
      //     color: '#5cdbd3'
      //   }
      // ],
      options: [
        {
          value: '2018',
          label: '2018年'
        }, {
          value: '2019',
          label: '2019年'
        }, {
          value: '2020',
          label: '2020年'
        }, {
          value: '2021',
          label: '2021年'
        }, {
          value: '2022',
          label: '2022年'
        }
      ],
      orderList: [
        {
          title: '联想集团',
          num: 2000
        },
        {
          title: '交大科技',
          num: 2000
        },
        {
          title: '联想集团',
          num: 2000
        },
        {
          title: '联想集团',
          num: 2000
        },
        {
          title: '联想集团',
          num: 2000
        },
        {
          title: '联想集团',
          num: 2000
        },
        {
          title: '联想集团',
          num: 2000
        },
        {
          title: '联想集团',
          num: 2000
        },
        {
          title: '联想集团',
          num: 2000
        },
        {
          title: '联想集团',
          num: 2000
        },
        {
          title: '联想集团',
          num: 2000
        },
        {
          title: '联想集团',
          num: 2000
        }
      ],
      leftWidth: '',
      value: '2021'
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  mounted () {
    const screenWidth = document.body.clientWidth

    if (screenWidth < 1000) {
      this.leftWidth = screenWidth - 40 + 'px'
    } else {
      this.leftWidth = null
    }
    this.bus.$on('collapse', item => {
      setTimeout(() => {
        console.log(12311);
        this.activeRateCharts()
        this.modelsRateCharts()
        this.activetimeCharts()
      },300)
    })
    this.activeRateCharts()
    this.modelsRateCharts()
    this.activetimeCharts()
  },
  methods: {
    // toTarget(name) {
    //   this.$router.push({ name })
    // },
    activeRateCharts () {
      if (myChart1 != null && myChart1 != "" && myChart1 != undefined) {
        myChart1.dispose(); //销毁
      }
      // 基于准备好的dom，初始化echarts实例
      myChart1 = this.$echarts.init(document.getElementById('activeRate'))
      // 绘制图表
      myChart1.setOption({
        title: {
          text: '激活占比',
          left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
            {
                name: '激活占比',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'

                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '20',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    {value: 1048, name: '已激活'},
                    {value: 735, name: '未激活'},
                    {value: 580, name: '其它'},
                ]
            }
        ]
      })
      window.addEventListener('resize',function(){
        if(myChart1){
             myChart1.resize()   // 不报错
        }
      })
    },
    modelsRateCharts () {
      if (myChart2 != null && myChart2 != "" && myChart2 != undefined) {
        myChart2.dispose(); //销毁
      }
      // 基于准备好的dom，初始化echarts实例
      myChart2 = this.$echarts.init(document.getElementById('modelsRate'))
      // 绘制图表
      myChart2.setOption({
        title: {
          text: '机型占比',
          left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
            {
                name: '机型占比',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'

                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '20',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    {value: 1048, name: '拯救者刃7000K'},
                    {value: 735, name: 'Geekpro'},
                    {value: 580, name: '天逸510pro'},
                    {value: 300, name: '拯救者9000k'},
                    {value: 251, name: '天逸510s'},
                    {value: 120, name: '扬天M4000q'},
                ]
            }
        ]
      })
      window.addEventListener('resize',function(){
        if(myChart2){
             myChart2.resize()   // 不报错
        }
      })
    },
    activetimeCharts () {
      if (myChart3 != null && myChart3 != "" && myChart3 != undefined) {
        myChart3.dispose(); //销毁
      }
      // 基于准备好的dom，初始化echarts实例
      myChart3 = this.$echarts.init(document.getElementById('activetime')) // 绘制图表
      myChart3.setOption({
        title: {
          text: '激活时间'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['拯救者刃7000K', 'Geekpro', '天逸510pro', '拯救者9000k', '天逸510s','扬天M4000q']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        },
        yAxis: {
            type: 'value'
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260, 224, 218, 135, 147, 260],
            type: 'line',
            smooth: true,
            stack: 'Total',
            name: '拯救者刃7000K',
          },
          {
            data: [100, 130, 324, 258, 125, 117, 660, 324, 518, 335, 547, 230],
            type: 'line',
            smooth: true,
            stack: 'Total',
            name: 'Geekpro',
          },
          {
            data: [150, 230, 224, 218, 135, 147, 260, 224, 218, 135, 147, 260],
            type: 'line',
            smooth: true,
            stack: 'Total',
            name: '天逸510pro',
          },
          {
            data: [150, 230, 224, 218, 135, 147, 260, 224, 218, 135, 147, 260],
            type: 'line',
            smooth: true,
            stack: 'Total',
            name: '拯救者9000k',
          },
          {
            data: [150, 230, 224, 218, 135, 147, 260, 224, 218, 135, 147, 260],
            type: 'line',
            smooth: true,
            stack: 'Total',
            name: '天逸510s',
          },
          {
            data: [150, 230, 224, 218, 135, 147, 260, 224, 218, 135, 147, 260],
            type: 'line',
            smooth: true,
            stack: 'Total',
            name: '扬天M4000q',
          }
        ]
      })
      window.addEventListener('resize',function(){
        if(myChart3){
             myChart3.resize()   // 不报错
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  padding: 0 !important;
}
.big {
  .shadow {
  padding: 10px 0;
      border-radius: 4px;
  border-bottom: 10px solid #eeeeee;
  .grid-content {
      background-color: #fff;
      border-radius: 4px;
      text-align: center;
      padding: 10px 0;
      margin: 10px 0;
      cursor: pointer;

      .el-icon {
          width: 30px;
          height: 30px;
          font-size: 30px;
          margin-bottom: 8px;
      }
  }
  }
  .echartsBox {
    .boxLeft {
      .activeRate {
        height: 250px;
        padding-top: 20px;
      }
      .modelsRate {
        height: 250px;
        padding-top: 20px;
        border-left: 10px solid #eeeeee;
      }
      .activetime {
        height: 250px;
        padding-top: 20px;
        border-top: 10px solid #eeeeee;
      }
    }
    .boxRight {
      border-left: 10px solid #eeeeee;
      .activeRanking {
        height: 500px;
        padding: 20px;
        .titleIcon {
          width: 5px;
          height: 20px;
          margin-right: 10px;
          display: inline-block;
          vertical-align: middle;
          background-color: #4978ef;
        }
        li {
          padding: 10px 0;
          cursor: pointer;
          list-style: none;
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #cccccc;
        }
        li:hover {
          background-color: #f1f3f4;
          line-height: 25px;
        }
        li:last-child{
          border-bottom: 0
        }
      }
    }
  }
}
@media (max-width: 1000px) {
  .big {
    .echartsBox {
      .boxRight {
        border-left: 0;
        border-top: 10px solid #eeeeee;
      }
    }
  }
}
</style>