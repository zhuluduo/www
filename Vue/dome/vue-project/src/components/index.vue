<template>
	<div>这个是首页面
	<el-input v-model="input" placeholder="请输入内容"></el-input>
	<div v-if="input!=''">
		<ul>
			<li v-for="(item,index) in options">{{input+item}}</li>
		</ul>
	</div>
	
    <el-select v-model="value" placeholder="请选择" filterable :filter-method="test" >
         <el-option v-for="item in dataas" :key="item" :label="item" :value="item">
          </el-option>
    </el-select>
		
		
    <el-autocomplete
      class="inline-input"
      v-model="state1"
      :fetch-suggestions="querySearch"
      placeholder="请输入内容"
			:trigger-on-focus="false"
      @select="handleSelect"
    ></el-autocomplete>
	</div>
</template>

<script>
export default {
  data () {
     return {
			 input:'',
			 value:'',
			 value8:'',
			 state1:'',
			 dataas:[],
			 restaurants: [],
			  options1: ["qq.com","163.com","vip.163.com","263.net","yeah.net","sohu.com","sina.cn","sina.com","eyou.com","gmail.com","hotmail.com","42du.cn"],
				options2: ["qq.com","163.com","vip.163.com","263.net","yeah.net","sohu.com","sina.cn","sina.com","eyou.com","gmail.com","hotmail.com","42du.cn"],
	 }
  },
	methods:{
    test(val){
			let dataas=[]
        if (val) { //val存在 
				this.dataas=[]
            this.options = this.options1.filter((item) => {
							let user=val+item;
							this.dataas.push(user)
            })
        } else { //val为空时，还原数组
            this.options =[]
        }
    },
		
		
  querySearch(queryString, cb) {
				var results=[]
				 this.options2.filter((item) => {
					let user={
						 value:queryString+'@'+item
					};
					results.push(user)
				})
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
			handleSelect(item) {
				let pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
				let vals
				for(let ins in item.value){
					vals=item.value
				}
				if(pattern.test(item.value)) {
					console.log('6666')
				}else{
					console.log(7777)
				}
      }
	}
}
</script>

<style>
	li{height: 20px;}
	.el-main{line-height: 0!!important;}
	</style>