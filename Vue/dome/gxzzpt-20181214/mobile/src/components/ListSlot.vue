<template>
    <div class="list-box" @click="Wholebtn(Index)">
        <div class="list-cont">
           <div class="list-cont-img">
            <img v-if="image!=''&&image!=undefined" v-lazy="image" alt="">
            <img v-else src="../../static/img/NoupImg.png" alt="">
            <slot name="image"></slot>
            <slot name="image-txt"></slot>
           </div>
           <div class="list-cont-txt">
               <p class="title" :class="shopNumber==true?'titleInfo1':'titleInfo2'"><slot name="Title"></slot><slot name="Number"></slot></p>
               <div class="txtList "> 
                   <slot name="text3"></slot>
                   <slot name="text4"></slot>
                   <slot name="text5"></slot>
               </div>
           </div>
           <div class="list-cont-btn">
               <p @click="btn(Index)"  class="activeName"><slot name="btnName" ></slot></p>
           </div>
        </div>
    </div>
</template>

<script>
    export default {

        props:['image','shopNumber','Index','url','params'],
    	data(){
            return{
                active:0,
                indexData:[]
            }
        },

        created() {
        },
        mounted(){
        
        },
        methods: {
           btn(Index){
            this.addClass(Index)
            this.$router.push({path:this.url, query:this.params});
           },
           Wholebtn(Index){
            this.addClass(Index)
            this.$router.push({path:this.url, query:this.params});
           },
           addClass(Index){
             let name=document.getElementsByClassName('activeName');
             for(let i=0;i<name.length;i++){
                name[i].className='activeName'; 
             }
             name[Index].className='activeName active';
           }

        },

    }

</script>
<style lang="scss">
*{-webkit-text-size-adjust:auto !important;}
.list-cont-txt{
    .txtList{
       p{
        &:last-child{
            padding-bottom:0!important; 
        }
       }
    }
}
</style>

<style lang="scss" scoped>
.pill-ellipsis{
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
    .list-box{
       padding: 0 21px;
       background: #fff;
        &:last-child{
          .list-cont{
            border-bottom:0   
          }  
        }
       .list-cont{
         overflow: hidden;
         border-bottom: 1.5px solid #e2e2e2;
         padding: 34px 0;
         position: relative;
         .list-cont-img{
            float: left;
            margin-top:10px; 
            img{
                width: 96px;
                height: 96px;
            }
            span{
                display:block;
                font-size: 20px;  
            }
           }
        .list-cont-txt{
           width: calc(100% - 270px); 
           margin-left: 40px;
           float: left;
           p{
              padding-bottom:6px;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
            }
           .title{
             span{
              font-size:24px;
              transform: scaleY(1.08);
              color: #a09f9f;   
              display: inline-block;
              vertical-align: bottom;
             }   
             span:first-child{
                color: #6b6b6b;
                padding-right: 16px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
             }
           }
           .titleInfo1{
                span:first-child{
                max-width: calc(100% - 110px); 
                }
           }
            .titleInfo2{
                span:first-child{
                max-width: calc(100% - 5px); 
                }
           }
           .title>span{
                display: inline-block;
           }
           .txtList{
             p{
               max-width: calc(100% - 5px);   
                span{
                color: #a09f9f;
                font-size: 24px;  
                }
             }
           }
        }
        .list-cont-btn{
            float:right;
            width: 122px;
            height: 100%;
            position: absolute;
            top: 0;
            right: 0px;
            display: -ms-flexbox;
            display: flex;
            -ms-flex-pack: left;
            justify-content: left;
            -ms-flex-align: center;
            align-items: center;
           p{
            width: 122px;
            height: 48px;
            line-height:48px; 
            border-radius: 4px;
            border: solid 1.5px #3f8def;
            text-align: center;
            span{
                color: #3f8def;
            }
           }
        .active{
           background: #3f8def; 
           span{color: #fff;}
        }
        }
       }
    }
    .fz26 {font-size: 26px;}
    .fz24 {font-size: 24px;}
</style>