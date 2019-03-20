<template>
    <aside id='goToTop' class="return_top" @click="backTop">
        <i><img src="../../static/img/goToTop.png" alt="" ></i>
    </aside>
</template>

<script>
import {goToTop} from '../lib/animate.js'
    export default {
    	data(){
            return{
            }
        },
        created() {
           
        },
        mounted(){
        

        },
        props: [],
        methods: {
            backTop(){
                goToTop('goToTop');
            }
        },

    }

</script>

<style lang="scss" scoped>
     .return_top{
        z-index: 101;
		position: fixed;
		bottom: 30px;
        right: 10px;
        i{
            width: 96px;
            height: 96px;
            display: block;
          
            img{
                width: 100%;
                height: 100%;
            }
        }
	}
</style>