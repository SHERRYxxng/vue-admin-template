//1、先引入request.js，他是封装了axios.js , 用于统一的发起请求的代码的编写
import request from '@/utils/request'

//类上的公共路径
const api_name = '/admin/hosp/hospset'

//2、es6的模块化
export default {

    //用于调用后端 查询医院设置 接口（条件+分页）
    pageQuery(pageNum,pageSize,searchObj){
        return request({
            url:`${api_name}/${pageNum}/${pageSize}`, //接口的地址  ${}
            method:'post',
            data:searchObj // 给后端传递的json
        })
    },

    //调用后端根据id删除接口
    deleteById(id){
        return request({
            url:`${api_name}/${id}`,
            method:'delete'
        })
    },

    //批量删除
    deleteByIds(ids){
        return request({
            url:`${api_name}/deleteByIds`,
            method:'delete',
            data:ids 
        })
    },
    //调用后端的修改status接口
    updateStatus(id,status){
        return request({
            url:`${api_name}/lockHospset/${id}/${status}`,
            method:'get'
        })
    },
    //调用开通医院设置接口
    saveHospset(hospset){
        return request({
            url:`${api_name}/saveHospset`,
            method:'post',
            data:hospset 
        })
    },
    //调用后端根据id查询
    getById(id){
        return request({
            url:`${api_name}/${id}`,
            method:'get'
        })
    },
    //调用后端更新医院设置接口
    updateHospset(hospset){
        return request({
            url:`${api_name}/updateHospset`,
            method:'post',
            data:hospset 
        })
    }

}