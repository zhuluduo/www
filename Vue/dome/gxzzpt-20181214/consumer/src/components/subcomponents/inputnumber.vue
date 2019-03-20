<template>
   <div>
        <el-input-number v-model="count" @change="handleChange" :precision="0"  size="mini" :min="1"  label="描述文字"></el-input-number>
   </div>
</template>

<style scoped>
    div{
        width: 96px;
        /* height: 30px; */
    }
</style>

<script>
    export default {
       data() {
           return {
                count:1,
                price:0,
           }
       },
       //父传子之间的通讯,传递数据;
       props: ['initCount','goodsId'],
       created() {
           this.count = this.initCount
       },
       methods: {
            handleChange(value) {
                this.count =value;
                this.$http.post("/custom/cart/setQuantity",{id:this.goodsId,quantity:this.count} ).then(res => {
                    if (res.data.code == 200) {
                        this.price=res.data.price;
                    } else {
                        this.$message({
                            type: "error",
                            message: res.data.message
                        });
                    }
                    this.notify()
                });
            },
            notify(){
                //子组件，通过触发自定义事件，把我们商品id和数量传递给父组件
                // console.log({goodsId:this.goodsId,count:this.count});
                this.$emit('numberChange',{goodsId:this.goodsId,count:this.count})//获取商品Id及数量；
                this.$emit('priceChange',{goodsId:this.goodsId,price:this.price})//获取商品的价格及id；
            }
       }
   }
</script>