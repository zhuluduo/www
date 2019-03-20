<template>
  <div class="hello">
    <div class="container" id="container">
			<header>
				<v-header></v-header>
			</header>
			<section>
				<div class="main" id="main">
					<router-view></router-view>
				</div>
			</section>
			<footer>
			 <v-footer></v-footer>
			</footer>
			
    </div>
  </div>
</template>

<script>
import header from './header';
import footer from './footer'
export default {
	components:{
		'v-header':header,
		'v-footer':footer
	},
  data () {
    return {
			
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
		#container{
			min-width: 1300px;
		}
</style>
