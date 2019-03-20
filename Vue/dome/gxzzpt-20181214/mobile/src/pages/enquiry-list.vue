<template>
    <div>
       <div class="list-boxs"  v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="30">
        <ListSlot  v-for="(item,index) in data" v-bind:key="index" :Index='index' v-bind:image="item.requirementItemList[0].firstModelFileInfo?item.requirementItemList[0].firstModelFileInfo.thumbnailUrl:''" :shopNumber='true' :url='url'  :params="{id:item.id,name:item.productName}">
            <!-- <span slot='image-txt'>100-200人</span> -->
            <span slot='Title'>{{item.requirementItemList[0].itemName}}</span>
            <span slot='Number'> {{item.requirementItemList[0].estimateCount}}件</span>
            <p slot='text3'><span >工艺：{{item.techniqueInfo?item.techniqueInfo.techniqueName:' '}}</span></p>
            <p slot='text4'><span >截止日期：{{item.offerDeadlineTime?item.offerDeadlineTime.split(" ")[0]:''}}</span></p>
            <!-- <span slot='text5'>行业：{{item.material}}</span> -->
            <span slot='btnName'>立即报价</span>
        </ListSlot>
    </div>
        <to-Top ></to-Top>
    </div>
</template>

<script>
import RequirmentService from '../services/RequirmentService.js'
import ListSlot from '../components/ListSlot.vue';
import toTop from '../components/toTop.vue';
export default {
    components:{ListSlot,toTop},
    data(){
      return{
       service: new RequirmentService(),
       url:'/EnquiryDetails',
       data: [],
       loading:false,
       pageIndexs:1,
       pageCount:0,
       recordCount:0,
       listInfo:[],
      }
    },
    created() {
    },
    mounted(){
        this.LatestInquiry();
    },
    methods: {
      async LatestInquiry(){
        let params={
            pageIndex:this.pageIndexs,
            pageSize:10
        }
        var result = await this.service.InquiriesList(params)
        this.pageCount=result.pagination.pageCount;
        this.recordCount=result.pagination.recordCount;
        this.data=this.data.concat(result.data);
       },
       loadMore(){
        this.loading = true;
        if(this.recordCount<=10||this.pageIndexs==this.pageCount){
            this.loading = false;
        }else{
        setTimeout(() => {
            this.pageIndexs++;
            this.LatestInquiry();
            this.loading = false;
        }, 500);
        }
       } 
    },

}

</script>

<style lang="scss" scoped>
.list-boxs{
    margin-top: 10px;
}
</style>