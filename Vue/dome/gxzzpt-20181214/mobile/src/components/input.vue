<template>
  <div class="v-input" :class="{required:required||false}" >
    <input :name="name" :readonly="readonly" ref="input" v-bind:value="value" v-on:input="updateValue($event.target.value)"
    v-validate="rules" :type="inputType||'text'" :placeholder="placeholder" :disabled="disabled||false" v-on:click="onClick($event)">
    <div class="error-message" v-show="errors.has(name)">{{ errors.first(name) }}</div>
    <div class="no-error" v-show="!errors.has(name)"></div>
    <i class="eyes-icon" :class="{'open-eyes-icon':inputType=='text'}" v-if="type=='password'" @click="changeType"></i>
    <i :class="icon" v-if="icon"></i>
    <slot></slot>
  </div>
</template>
<script>
  export default {
    props:['value','placeholder','required','rules', 'name', 'type','disabled', 'icon','readonly'],
    data() {
      return {
        inputType:this.type||'text'
      }
    },
    created() {
    },
    methods:{
      updateValue: function (value) {
        this.$validator.validate();
        this.$emit('input', value);
      },
      changeType() {
        if ( this.inputType=='text') {
          this.inputType = 'password';
        } else {
          this.inputType='text';
        }
      },
      validate() {
        let self = this;
        return new Promise(function(resolve, reject){
          self.$validator.validate().then( valid => {
            if ( valid ) {
              resolve(true);
            } else {
              reject(new Error());
            }
          })
        })
        /* this.$validator.validate().then( valid => {
            if ( valid ) {
              return new Promise(function(resolve, reject) {
                resolve();
              })
            } else {
              return new Promise(function(resolve, reject) {
                reject();
              })
            }
          }) */
      },
      onClick() {
        this.$emit('click');
      }
    }
  }
</script>
<style lang="scss" scoped>
.v-input{
  position: relative;
  width: 100%;
  &.required:before{
    content: '*';
    position:absolute;
    top: 36px;
    left: 12px;
    color: #f84b4b;
  }
  input{
    border: 1.5px solid #d0d0d0;
    box-sizing: border-box;
    width: 100%;
    height: 88px;
    text-indent: 36px;
    font-size: 28px;
    border-radius: 0 !important;
    box-shadow:0px 0px 0px rgba(0,0,0,0) !important; 
    -webkit-appearance:none!important;
  }
  .error-message{
    color: #f84b4b;
    text-indent: 10px;
    line-height: 40px;
  }
  .no-error{
    height: 18px;
  }
  .eyes-icon{
    display: block;
    position: absolute;
    top: 24px;
    right: 23px;
    width: 40px;
    height: 40px;
    background: #fff url(../../static/img/close-eyes-icon.png) no-repeat center center;
    background-size: 40px 40px;
  }
  .arrow-icon{
    display: block;
    position: absolute;
    top: 30px;
    right: 23px;
    width: 28px;
    height: 28px;
    background: #fff url(../../static/img/arrow-icon.png) no-repeat center center;
    background-size: 28px 28px;
  //  transform: rotate(90deg);
  }
  .open-eyes-icon{
    background-image: url(../../static/img/open-eyes-icon.png);
  }
  input[type="text"]:disabled,input[type="textarea"]:disabled{
    background-color: #fff;
  }
}
  
</style>
