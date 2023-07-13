//1、先引入request.js，他是封装了axios.js , 用于统一的发起请求的代码的编写
import request from '@/utils/request'

//类上的公共路径
const api_name = '/admin/cmn'

//2、es6的模块化
export default {

    //根据id查询下级
    findChildData(id){
        return request({
            url:`${api_name}/findChildData/${id}`,
            method:'get'
        })
    },
    //根据dictCode查询数据字典列表
    findByDictCode(dictCode){
        return request({
            url:`${api_name}/findByDictCode/${dictCode}`,
            method:'get'
        })
    }

}