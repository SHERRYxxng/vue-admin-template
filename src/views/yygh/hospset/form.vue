<template>
  <div class="app-container">
    {{ hospset }}
    <el-form ref="form" :model="hospset" label-width="80px">
      <el-form-item label="医院名称">
        <!-- 虽然在hospset对象中没有定义这个属性，但是不影响 -->
        <el-input v-model="hospset.hosname"></el-input>
      </el-form-item>

      <el-form-item label="医院编号">
        <!-- 虽然在hospset对象中没有定义这个属性，但是不影响 -->
        <el-input v-model="hospset.hoscode"></el-input>
      </el-form-item>

      <el-form-item label="接口地址">
        <!-- 虽然在hospset对象中没有定义这个属性，但是不影响 -->
        <el-input v-model="hospset.apiUrl"></el-input>
      </el-form-item>

      <el-form-item label="签名">
        <!-- 虽然在hospset对象中没有定义这个属性，但是不影响 -->
        <el-input v-model="hospset.signKey"></el-input>
      </el-form-item>

      <el-form-item label="联系人">
        <!-- 虽然在hospset对象中没有定义这个属性，但是不影响 -->
        <el-input v-model="hospset.contactsName"></el-input>
      </el-form-item>

      <el-form-item label="联系方式">
        <!-- 虽然在hospset对象中没有定义这个属性，但是不影响 -->
        <el-input v-model="hospset.contactsPhone"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{ btnName }}</el-button>
        <el-button @click="back">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import hospsetApi from "@/api/yygh/hospset";
export default {
  data() {
    return {
      btnName: "立即开通",
      hospset: {}, //表单绑定的对象(对象中的属性其实可以不用定义)
    };
  },
  methods: {
    back(){
      this.$router.push({path:'/hosp/hospsetlist'})
    },
    //表单页按钮绑定的方法
    onSubmit() {
      if(this.$route.params.id){
        //id有值，执行修改
        this.update()
      }else{
        //执行添加操作
        this.add()
      }
      
      // if(this.hospset.id){
      //   //id有值，执行修改
      // }


      // if(this.btnName == '立即修改'){
      //   //id有值，执行修改
      // }
    },
    add(){
      //表单中的所有数据都是必填
      // console.log(this.hospset.hosname)//undefined没有值
      let flag = this.checkForm();

      //调用js方法saveHospset
      console.log(flag);

      if (flag) {
        //flag=true
        hospsetApi.saveHospset(this.hospset).then((resp) => {
          if (resp.success == true) {
            //提示
            this.$message({
              message: "开通成功",
              type: "success",
            });

            //开通成功，回到医院设置列表页面  list.vue对应的路由路径
            this.$router.push({path:'/hosp/hospsetlist'})

            // this.$confirm("是否继续开通?", "提示", {
            //   confirmButtonText: "确定",
            //   cancelButtonText: "取消",
            //   type: "warning",
            // })
            //   .then(() => {
            //     this.hospset = {}
            //   })
            //   .catch(() => {
            //     this.$router.push({path:'/hosp/hospsetlist'})
            //   });
          }
        });
      }
    },
    update(){
      if(this.checkForm()){
        hospsetApi.updateHospset(this.hospset).then(resp=>{
          if(resp.success==true){
            this.$message({
              message: "修改成功！",
              type: "success",
            });
            //回到列表页面
            this.$router.push({path:'/hosp/hospsetlist'})
          }
        })
      }else{

      }
    },
    //检查表单中的数据是否为空
    checkForm() {
      if (!this.hospset.hosname) {
        //js，如果变量有值，if成立
        this.$message({
          message: "医院名称不能为空！",
          type: "warning",
        });
        //后边的代码不执行了
        return false;
      }
      if (!this.hospset.hoscode) {
        //js，如果变量有值，if成立
        this.$message({
          message: "医院编号不能为空！",
          type: "warning",
        });
        //后边的代码不执行了
        return false;
      }
      if (!this.hospset.apiUrl) {
        //js，如果变量有值，if成立
        this.$message({
          message: "接口地址不能为空！",
          type: "warning",
        });
        //后边的代码不执行了
        return false;
      }
      if (!this.hospset.contactsName) {
        //js，如果变量有值，if成立
        this.$message({
          message: "联系人不能为空！",
          type: "warning",
        });
        //后边的代码不执行了
        return false;
      }
      if (!this.hospset.contactsPhone) {
        //js，如果变量有值，if成立
        this.$message({
          message: "联系方式不能为空！",
          type: "warning",
        });
        //后边的代码不执行了
        return false;
      }
      return true;
    },
  },
  created(){
    //获取路由参数 http://localhost:9528/#/hosp/edit/123
    let id = this.$route.params.id
    console.log(id) //如果点击开通医院设置，跳转到form.vue 此时 id=undefined

    //通过判断id是否有值，推断出此时打开form.vue 是添加还是修改
    if(id){
      //id有值，回显数据
      this.btnName = '立即修改'

      //根据id查询医院设置，赋值给hospset对象
      hospsetApi.getById(id).then(resp=>{
        this.hospset = resp.data.item
      })

    }else{
      //id为undefined
    }
  }
};
</script>

<style>
</style>