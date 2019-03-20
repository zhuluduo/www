<template>
    <div id="dialog-box" class="dialog-box" >
        <div  id="iosMask" class="iosMask" @click="closeMask" :class="LandState?'iosMaskShow':''"></div>
        <div id="el-dialog__wrappers" class="el-dialog__wrappers" >
            <div class="overflowH">
               <slot></slot>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    /*
      @params toggle:true/false  弹框显隐
      @params direction：top/left/right  弹框出现方向
      @params WH 自定义弹框宽高度(默认100%)
      @params 案例 <DialogSlot :toggle.sync='toggle' :direction='"top"' :WH='"50%"'></DialogSlot>
    */
    props:['toggle','direction','WH','LandState'],
    data(){
        return{
          toggles:false,
        }
    },
    watch:{
      toggle(val){
        this.toggles=val;
        this.animation();
        this.scrollH();
        if(val==true){
          this.openModal('modal-open')
        }else{
          this.closeModal('modal-open')
        }
      }  
    },
    methods:{
        openModal: function(bodyCls) {
          let scrollTop;
          scrollTop = document.scrollingElement.scrollTop;
          document.body.classList.add(bodyCls);
          document.body.style.top = -scrollTop + 'px';
        },
        closeModal: function(bodyCls) {
          let scrollTop;
          document.body.classList.remove(bodyCls);
          document.scrollingElement.scrollTop = scrollTop;
        },
        //计算scroll值
        scrollH(){
          let maxH=document.getElementsByClassName('overflowH')[0];
          var h=document.documentElement.clientHeight;
           if(this.toggles==true){
              // if(this.WH!=undefined){
              //    if(this.direction=='top'){
              //      maxH.style.maxHeight=""+this.WH+"";
              //    }else{
              //      maxH.style.maxHeight=""+h+'px'+""
              //    }
              // }else{
              //   maxH.style.maxHeight=""+h+'px'+""
              // }
              maxH.style.maxHeight=""+h+'px'+""
           }else{
             maxH.style=''
           }
        },
      //全屏
      animation(){
        let Name=document.getElementById('el-dialog__wrappers');
        let iosMasks=document.getElementById('iosMask');
        let maxH=document.getElementsByClassName('overflowH')[0];
        if(this.toggles==true){
          iosMasks.style.opacity='1';
          iosMasks.style.pointerEvents='auto'
        }else{
          iosMasks.style=''
        }
        if(this.direction=='top'){
          Name.style.left="0";
           if(this.toggles==true){
                if(this.WH!=undefined){
                  Name.style.height=this.WH;
                  Name.style.top='auto';
                    // Name.style.WebkitTransform="translateY("+this.WH+")";
                    // if(this.WH=='auto'){
                    //   Name.style.WebkitTransform="translateY("+(100%-(maxH.offsetHeight+10)+'px')+")";
                    // }
                }
               Name.className='el-dialog__wrappers el-dialog__wrapper__toggle translatePY';
           }else{
               Name.className='el-dialog__wrappers el-dialog__wrapper__toggle translateTN';
                Name.style='';
                Name.style.top='auto';
           }
        }
        if(this.direction=='left'){
          Name.style.left="0";
           if(this.toggles==true){
                if(this.WH!=undefined){
                    // Name.style.WebkitTransform="translateX("+this.WH+")";
                  Name.style.width=this.WH;
                }
               Name.className='el-dialog__wrappers el-dialog__wrapper__toggle translatePY';
           }else{
               Name.className='el-dialog__wrappers el-dialog__wrapper__toggle translateLN';
               Name.style.width=this.WH;
           }
        }
        if(this.direction=='right'){
          Name.style.right="0";
           if(this.toggles==true){
                if(this.WH!=undefined){
                    Name.style.width=this.WH;
                    Name.style.left='auto';
                }
               Name.className='el-dialog__wrappers el-dialog__wrapper__toggle translatePY';
           }else{
               Name.className='el-dialog__wrappers el-dialog__wrapper__toggle translateRN';
               Name.style.width=this.WH;
               Name.style.left='auto';
           }
        }
      },

      //点击阴影部分关闭弹出框
      closeMask(){
        if(!this.LandState){
           this.$emit('update:toggle', false)
        }
      },

      //原生点击事件touch
      touch(){
        var _this=this;
        var mybody = document.getElementById("dialog-box");

        var startX, startY;
        mybody.addEventListener('touchstart', function (ev){
          ev.preventDefault();

          startX = ev.touches[0].pageX;

          startY = ev.touches[0].pageY; 

        }, false);

        mybody.addEventListener('touchmove', function (ev){

          var endX, endY;

          ev.preventDefault();

          endX = ev.changedTouches[0].pageX;

          endY = ev.changedTouches[0].pageY;

 

        var direction = _this.GetSlideDirection(startX, startY, endX, endY);

        switch (direction){

          case 0:

            console.log("没滑动");

            break;

          case 1:

            console.log("向上");

            break;

          case 2:

            console.log("向下");

            break;

          case 3:

            console.log("向左");

            break;

          case 4:

            console.log("向右");

            break;

          default:          

        } 

      }, false);
      
      },
      GetSlideDirection(startX,startY, endX, endY) {

          var dy = startY - endY;
          var dx = endX - startX;
          console.log(startX)
          console.log(startY)
          console.log(endX)
          console.log(endY)
          console.log(dy)
          console.log(dx)
          var result = 0;

          //如果滑动距离太短
          if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
             return result;
          }

          var angle = this.GetSlideAngle(dx, dy);
          if (angle >= -45 && angle < 45) {
             result = 4;
          }else if (angle >= 45 && angle < 135) {
             result = 1;
          }else if (angle >= -135 && angle < -45) {
             result = 2;
          }else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
             result = 3;
          }
          return result;
        },
        GetSlideAngle(dx,dy) {
          return Math.atan2(dy,dx) * 180 / Math.PI;
        }
    },
    mounted() {
      this.toggles=this.toggle;
      // this.touch();
      this.animation();
      this.scrollH();
      this.$bus.$on('StateToggle', (content)=>{
        this.$emit('update:toggle', content)
      })
    },
}
</script>
<style lang="scss">
body.modal-open {
    position: fixed;
    width: 100%;
}
</style>

<style lang="scss" scoped>
.dialog-box{
  .el-dialog__wrapper__toggle{
    position: fixed;
    bottom: 0;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    z-index: 8888;
    width: 100%;
    height: 100%;
    padding: 5px;
    background-color: #fff;
    -webkit-transition: -webkit-transform 0.35s ;
    transition: -webkit-transform 0.35s;
    -o-transition: transform 0.35s;
    transition: transform 0.35s;
    transition: transform 0.35s, -webkit-transform 0.35s;
    word-wrap:break-word;  
    word-break:break-all;  
    overflow: hidden; 
    }
  .translateTN{
    -webkit-transform: translate(0, 100%);
    -ms-transform: translate(0, 100%);
    transform: translate(0, 100%);
    }
    .translateRN{
    -webkit-transform: translate(100%,0);
    -ms-transform: translate(100%,0);
    transform: translate(100%,0);
    }
    .translateLN{
    -webkit-transform: translate(-100%,0);
    -ms-transform: translate(-100%,0);
    transform: translate(-100%,0);
    }
  .translatePY{
    -webkit-transform: translate(0, 0);
    -ms-transform: translate(0, 0);
    transform: translate(0, 0);
    }
}
.iosMask{
    position: fixed;
    right: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 7777;
    background: rgba(0, 0, 0, 0.5);
		opacity: 0;
    will-change: opacity;
		pointer-events: none;
    -webkit-transition: opacity 0.4s cubic-bezier(0,0,0.3,1);
    -o-transition: opacity 0.4s cubic-bezier(0,0,0.3,1);
    transition: opacity 0.4s cubic-bezier(0,0,0.3,1);
}
.iosMaskShow{
  height:calc(100% - 100px) ;
}

.iosMaskHide{
    opacity: 0;
    display: none;
}
.overflowH{
  overflow-y: auto;
  overflow-x: hidden;
}
</style>


