<template>
    <div>
       <div class="Savage">
        <div class="Savage-img">
            <img src="../../static/img/savage.png" alt="">
            <p>
                <span class="text-1">正在努力开发中...</span>
                <span class="text-2">敬请期待!</span>
            </p>
        </div>
    </div>
    </div>
</template>
<script>
    export default {
    	data(){
            return{
            }
        },
        created() {
        },

        mounted(){
        },

        methods: {

        },

    }

</script>

<style lang="scss" scoped>
    .Savage{
          width: 390px;
          margin:0 auto;
      .Savage-img{
            width: 390px;
            margin-top: 100px;
        img{
            width: 100%;
            height:100%;
        }
        p{
            margin-top: 28px;
          span{
            display: block;
            text-align: center;
            font-family: MicrosoftYaHei;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            }
          .text-1{
           font-size: 24px;
           color: #777777;
           padding-bottom: 28px;
          }
          .text-2{
           font-size: 28px;
           color: #3f8def;
          }
        }
      }
    }
</style>
