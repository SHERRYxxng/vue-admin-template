<template>
  <div class="app-container">

    <!-- {{searchObj}} -->
    <!-- {{multipleSelection}} -->

    <!-- 表单 -->
    <!-- :model="formInline" 表单绑定的对象 -->
    <el-form :inline="true" :model="searchObj" class="demo-form-inline">

      <el-form-item label="医院名称">
        <el-input v-model="searchObj.hosname" placeholder="医院名称"></el-input>
      </el-form-item>


      <el-form-item label="医院编号">
        <el-input v-model="searchObj.hoscode" placeholder="医院编号"></el-input>
      </el-form-item>

     
      <el-form-item>
        <!-- 点击查询按钮，从第一页开始，按照searchObj的条件进行查询 -->
        <!-- 注意：方法上，绑定一个方法，小括号加上，确保没错  -->
        <el-button type="primary" @click="fetchData()">查询</el-button>
        <!-- 点击清空按钮，无条件的分页查询，并且从第一页开始 -->
        <el-button type="primary" @click="clear()">清空</el-button>

        <el-button type="warning" round @click="batchDelete()">批量删除</el-button>

      </el-form-item>
    </el-form>

    <!-- shift+alt+f  代码格式化 -->
    <!-- :data="tableData"  表格绑定的集合，也就是vue中的一个变量 tableData -->
    <!-- label：表头名称  width：列的宽度 -->
    <!-- prop： 表格绑定的集合中每个对象（json）中的属性名-->
    <!-- @selection-change="handleSelectionChange"  勾选了复选框，触发的事件，handleSelectionChange是一个方法 -->
    <el-table :data="list" style="width: 100%"  v-loading="loading" element-loading-text="拼命加载中" @selection-change="handleSelectionChange">

      <!-- 第一列多选框 -->
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>

      <el-table-column label="序号">
        <template slot-scope="scope">
          <!-- 当前行索引，从0开始 -->
          <!-- 第一页的序号 1-5，  第二页的序号6-10 -->
          {{ scope.$index + 1 + (pageNum - 1) * pageSize }}
        </template>
      </el-table-column>
      <el-table-column prop="hosname" label="医院名称" width="180">
      </el-table-column>
      <el-table-column prop="hoscode" label="医院编号" width="180">
      </el-table-column>
      <el-table-column prop="apiUrl" label="接口地址"> </el-table-column>
      <!-- 医院设置的状态status，0：锁定  1：正常 -->
      <el-table-column label="医院设置状态">
        <template slot-scope="scope">
          <!-- 当前行的数据json -->
          {{ scope.row.status == 0 ? "锁定" : "正常" }}
        </template>
      </el-table-column>

      <el-table-column prop="signKey" label="秘钥签名"> </el-table-column>
      <el-table-column prop="contactsName" label="联系人"> </el-table-column>
      <el-table-column label="操作" width="300">
        <!-- 按钮绑定的方法在哪里？methods中定义 -->
        <!-- 传入当前行id -->
        <template slot-scope="scope">

          <!-- 锁定or解锁 （同一行只能显示其中一个按钮） -->
          <el-button @click="updateStatus(scope.row.id,1)" v-if="scope.row.status==0" type="success" icon="el-icon-key" circle></el-button>
          <el-button @click="updateStatus(scope.row.id,0)" v-if="scope.row.status==1" type="warning" icon="el-icon-lock" circle></el-button>

          <el-button @click="deleteById(scope.row.id)" type="danger" icon="el-icon-delete" circle></el-button>
          
          <!-- 修改按钮 -->
          <!-- <el-button @click="toEdit(scope.row.id)" type="primary" icon="el-icon-edit" circle></el-button> -->
          &nbsp;
          <router-link :to="'/hosp/edit/' + scope.row.id">
            <el-button type="primary" icon="el-icon-edit" circle></el-button>
          </router-link>
          
        </template>
      </el-table-column>
    </el-table>

    <!-- table表格后添加一个分页控件 -->
    <!-- total:总记录数 -->
    <!-- page-size： 默认每页多少条   -->
    <!-- current-page：当前第几页 -->
    <!-- @ 表示事件，绑定了方法 -->
    <!-- 每页显示多少条发生改变时，调用handleSizeChange方法 -->
    <!-- 当前第几页发生改变， handleCurrentChange方法-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="fetchData"
      :current-page="pageNum"
      :page-sizes="[3, 5, 7, 9]"
      style="padding: 30px 0; text-align: center"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
//必须引入js，才能调用其中的方法
import hospsetApi from "@/api/yygh/hospset";
// import abc from '@/api/yygh/hospset'
export default {
  data() {
    return {
      multipleSelection: [],
      loading:true,//显示加载数据的动画
      //用来定义vue的各种变量
      list: [],
      pageNum: 1, //默认第1页
      pageSize: 5, //默认每页5条
      searchObj: { hosname: "", hoscode: "" }, //对应 @RequestBody HospitalSetQueryVo hospitalSetQueryVo
      total: 0, //分页控件使用总记录数
    };
  },
  methods: {
    toEdit(id){
      //跳转到form.vue回显页面
      this.$router.push({path:'/hosp/edit/' + id})
    },
    updateStatus(id,status){
        //确认框， 是否确定要锁定？  是否确定要解锁？
        // this.$confirm('是否确定'+(status==1?'解锁':'锁定')+'？', '提示', {
        this.$confirm(`是否确定${status==1?'解锁':'锁定'}？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {


          hospsetApi.updateStatus(id,status).then(resp=>{
            // if(resp.code==20000)
            if(resp.success==true){
              //提示
              this.$message({
                type: 'success',
                message: `${status==1?'解锁':'锁定'}成功！`
              });
              //重新加载当前页数据
              this.fetchData(this.pageNum)
            }
          })

          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    batchDelete(){
      //1、判断用户是否选中行数据
      if(this.multipleSelection.length == 0){
        this.$message({
          message: '请先选择要删除的行数据！',
          type: 'warning'
        });
        return
      }
      //2、准备id数组（勾选的行的id集合）
      // let ids = [1,2,3]
      // ids = ids.map(item=>{
      //   return item+1
      // })
      let ids = []
      // ids = this.multipleSelection.map(item=>{
      //   return item.id
      // })
      // this.multipleSelection.map(item=>{
      //   ids.push(item.id)
      // })

      for(var i = 0 ; i < this.multipleSelection.length ; i++){
        ids.push(this.multipleSelection[i].id)
      }

      //3、调用hospset.js 中的方法发起请求
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          hospsetApi.deleteByIds(ids).then(resp=>{
            if(resp.success == true){
              //提示
              this.$message({
                type: 'success',
                message: '批量删除成功!'
              });
              //重新加载当前页数据
              this.fetchData(this.pageNum)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });

    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteById(id){
      // console.log(id)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //点击确定时要执行

          hospsetApi.deleteById(id).then(resp=>{
            //后端接口调用完整
            if(resp.success == true){
              //消息提示
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              //重新加载当前页的数据
              this.fetchData(this.pageNum)
            }
          })

        }).catch(() => {
          //点击取消时要执行
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    clear(){
      //1、清空查询条件
      this.searchObj = { hosname: "", hoscode: "" }
      //2、调用fetchData方法，从第一页开始查询
      this.fetchData()
    },
    //参数：下拉框选择的新值
    handleSizeChange(val) {
      //当每页显示多少条发生改变，从第一页开始重新查询
      this.pageSize = val;
      // this.pageNum = 1
      this.fetchData(); //不传递参数，就相当于传递了1
    },
    //参数：当前希望查询第几页
    handleCurrentChange(val) {
      // this.pageNum = val
      this.fetchData(val);
    },

    //定义自定义方法
    // page=1 ， 表示当调用该方法时，如果没有传递参数就相当于传递了1；如果传递了实际的参数，1就没有作用了
    fetchData(page = 1) {
      // console.log(page)
      // if(!page){  page没有值（undefined），取反之后if成立
      //     page = 1
      // }
      this.pageNum = page;
      console.log("fetchData被调用");
      //hospset.js 中的pageQuery方法
      hospsetApi
        .pageQuery(this.pageNum, this.pageSize, this.searchObj)
        .then((resp) => {
          //使用request.js发起请求，返回值已经做了处理，此时在then中的resp就已经表示后端接口的返回值了，也就是R
          this.total = resp.data.total; //总记录数
          this.list = resp.data.rows; //当前页的结果集

          //加载当前pageNum页数据时，如果当前页数据集合为空，并且当前不是第一页，就向前查一页；
          //当前已经是第一页，就不需要再向前查询
          if(this.list.length == 0 && this.pageNum>1){
            this.fetchData(this.pageNum-1)
          } 

          //关闭动画效果
          this.loading = false
        });
    },
  },
  created() {
    //钩子函数（注意：别写到methods里边去了）
    this.fetchData(); //当前vue视图被打开时，vue实例初始化完成后，钩子方法created被执行
  },
};
</script>