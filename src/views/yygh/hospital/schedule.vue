<template>
  <div class="app-container">
    <div style="margin-bottom: 10px; font-size: 10px">选择：</div>
    <el-container style="height: 100%">

      <!-- 左侧（tree） -->
      <el-aside width="200px" style="border: 1px silver solid">
        <!-- 部门 -->
        <!-- data 大科室集合 [{depname:xx,depcode:xxx,children: [ {depname:xx,depcode:,children:null},{} ] },{}] -->
        <el-tree
          :data="data"
          :props="defaultProps"
          :default-expand-all="true"
          @node-click="handleNodeClick"
        >
        </el-tree>
      </el-aside>
    
      <!-- 右侧 -->
      <el-main style="padding: 0 0 0 20px">
        <!-- 上方的日期列表 -->
        <el-row style="width: 100%">
          <!-- 排班日期 分页 -->
          <!-- 每个日期小方块就是一个tag标签 -->
          <el-tag
            v-for="(item, index) in bookingScheduleList"
            :key="item.id"
            @click="selectDate(item.workDate, index)"
            :type="index == activeIndex ? '' : 'info'"
            style="
              height: 60px;
              margin-right: 5px;
              margin-right: 15px;
              cursor: pointer;
            "
          >
            {{ item.workDate }} 
            {{ item.dayOfWeek }}<br />

            {{ item.availableNumber }} / 
            {{ item.reservedNumber }}
            <!-- 排班数量（医生数量） -->
            &nbsp;&nbsp;
            {{item.docCount}}
          </el-tag>
          <!-- 分页 -->
          <el-pagination
            :current-page="page"
            :total="total"
            :page-size="limit"
            class="pagination"
            layout="prev, pager, next"
            @current-change="getPage"
          >
          </el-pagination>
        </el-row>
        
        <!-- 下方的排班列表 -->
        <el-row style="margin-top: 20px">
          <!-- 排班日期对应的排班医生 -->
          <el-table
            v-loading="listLoading"
            :data="scheduleList"
            border
            fit
            highlight-current-row
          >
            <el-table-column label="序号" width="60" align="center">
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column label="职称" width="150">
              <template slot-scope="scope">
                {{ scope.row.title }} | {{ scope.row.docname }}
              </template>
            </el-table-column>
            <el-table-column label="号源时间" width="80">
              <template slot-scope="scope">
                {{ scope.row.workTime == 0 ? "上午" : "下午" }}
              </template>
            </el-table-column>
            <el-table-column
              prop="reservedNumber"
              label="可预约数"
              width="80"
            />
            <el-table-column
              prop="availableNumber"
              label="剩余预约数"
              width="100"
            />
            <el-table-column prop="amount" label="挂号费(元)" width="90" />
            <el-table-column prop="skill" label="擅长技能" />
          </el-table>
        </el-row>
      </el-main>


    </el-container>
  </div>
</template>
<script>
import hospApi from "@/api/yygh/hospital";
import schApi from "@/api/yygh/schedule";
export default {
  data() {
    return {
      data: [ {depname:'大科室名称',children:[{depname:'小科室1'},{depname:'小科室2'}]} ],
      //每个json中的属性=depname+children
      defaultProps: {
        children: "children",//子节点列表对应的属性，每个子节点也是depname + children
        label: "depname",//每个节点，无论大节点还是小节点显示的属性
      },
      hoscode: null,
      activeIndex: 0,
      depcode: null,
      depname: null,
      workDate: null,
      bookingScheduleList: [],
      baseMap: {},
      page: 1, // 当前页
      limit: 5, // 每页个数
      total: 0, // 总页码
      scheduleList: [], //排班详情
      listLoading:false
    };
  },
  created() {
    //获取路由参数，参数名hoscode  医院编号  http://localhost:9528/#/hosp/schedule/10000
    this.hoscode = this.$route.params.hoscode;
    console.log(this.hoscode)
    this.workDate = this.getCurDate();
    this.fetchData();
  },
  methods: {
    //查询排班详情
    //根据医院编号+科室编号+排班日期，查询对应的排班列表
    getDetailSchedule() {
      schApi
        .getScheduleDetail(this.hoscode, this.depcode, this.workDate)
        .then((response) => {
          this.scheduleList = response.data.list;
        });
    },
    fetchData() {
      //根据医院编号查询该医院下的科室列表
      hospApi.getDeptByHoscode(this.hoscode).then((response) => {
        //this.data = 科室列表
        this.data = response.data.list;//大科室列表
        // 默认选中第一个
        if (this.data.length > 0) {
          //默认查询第一个大科室下的第一个小科室的排班日期列表
          this.depcode = this.data[0].children[0].depcode;//第一个大科室的第一个小科室编号
          this.depname = this.data[0].children[0].depname;//第一个大科室的第一个小科室名称

          this.getPage();//没有传参数，默认传递1
        }
      });
    },
    getPage(page = 1) {
      this.page = page;//this.page默认=1 （默认加载第一页的日期列表）

      this.workDate = null;
      this.activeIndex = 0;

      //默认根据第一个小科室，查询该小科室下的排班日期列表
      this.getScheduleRule();
    },
    //查询某个医院某个科室下的排班日期列表
    getScheduleRule() {
      schApi
        .getScheduleRule(this.page, this.limit, this.hoscode, this.depcode)
        .then((response) => {

          //返回值解析（排班的日期列表）
          this.bookingScheduleList = response.data.bookingScheduleRuleVoList;
          this.total = response.data.total;//总的vo的个数（总的日期个数），分页控件使用


          // this.scheduleList = response.data.scheduleList;
          // this.baseMap = response.data.baseMap;//注意：后端不需要返回baseMap值，该前端页面没有使用


          // 分页后workDate=null，默认选中第一个
          if (this.workDate == null) {
            //日期列表的第一个vo中的workDate取出
            this.workDate = this.bookingScheduleList[0].workDate;
          }
          //调用查询排班详情
          this.getDetailSchedule();
        });
    },
    //第一个参数：点击的节点对应的json对象（数组中的对象）
    handleNodeClick(data) {

      this.bookingScheduleList = []
      this.scheduleList = []

      console.log(data)
      // 科室大类直接返回
      if (data.children != null) {
        return
      };

      //当前点击的小科室编号和名称
      this.depcode = data.depcode;
      this.depname = data.depname;

      this.getPage(1);//根据新的depcode查询第一页的日期列表
    },
    //workDate点击的方块，对应的日期
    selectDate(workDate, index) {
      this.workDate = workDate;
      this.activeIndex = index;
      //调用查询排班详情
      this.getDetailSchedule();
    },
    getCurDate() {
      var datetime = new Date();
      var year = datetime.getFullYear();
      var month =
        datetime.getMonth() + 1 < 10
          ? "0" + (datetime.getMonth() + 1)
          : datetime.getMonth() + 1;
      var date =
        datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
      return year + "-" + month + "-" + date;
    },
  },
};
</script>
<style>
.el-tree-node.is-current > .el-tree-node__content {
  background-color: #409eff !important;
  color: white;
}
.el-checkbox__input.is-checked + .el-checkbox__label {
  color: black;
}
</style>