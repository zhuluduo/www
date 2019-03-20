<template>
    <div id="v-form" >
        <slot></slot>
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    methods:{
        validate() {
            var proList = [];
            if ( this.$children.length > 0 ) {
                 this.$children.map((item) => {
                    var validater = item.validate();
                    proList.push(validater);
                })
            }
            return Promise.all(proList).then(()=> {
                return new Promise(function(resolve, reject){
                    resolve(true);
                })
            }, ()=> {
                 return new Promise(function(resolve, reject){
                    resolve(false);
                })
            })
        }
    }
}
</script>
<style lang="scss">
#v-form{
    
}
</style>

