
// const path = require('path');
// module.exports={
// 	entry:'./src/js/main.js',  //通过在 webpack 配置中配置 entry 属性，来指定一个入口起点（或多个入口起点）
// 	output:{
// 		path: path.resolve(__dirname, 'dist/js'),  //出口输出文件地址(必须写成绝对路径)
// 		filename:'bundle.js'   //出口输出文件命名
// 	}
// }


//创建多个入口文件:

 const path=require('path');
 const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports={
	entry:{
		main:'./src/js/main.js',
		a:'./src/js/a.js',
		app:'./src/js/app.js',
	},
	// index-1
	// output:{
	// 	path: path.resolve(__dirname, 'dist/js'),
	// 	filename:'[name]-[chunkhash].js'  //则应该使用占位符(substitutions)来确保每个文件具有唯一的名称。
	// },

	// index-2
	output:{
		path: path.resolve(__dirname, 'dist'),
		filename:'js/[name]-[chunkhash].js',  //则应该使用占位符(substitutions)来确保每个文件具有唯一的名称。
		// publicPath:'http://cdn.com/'   ///版本发布时地址前缀会换成这个
	},
module: {
  rules: [
  	{test: /\.js$/, loader: "babel-loader",include:path.resolve(__dirname, 'src'),exclude:path.resolve(__dirname, 'node_modules'),query:{presets:['latest']}},
    {test: /\.css$/, loader: "style!css?sourceMap!postcss"},
    {test: /\.less$/, loader: "style!css!less|postcss"},
    {test: /\.scss$/, loader: "style!css!sass|postcss"},
    {test: /\.html$/,loader: "html-loader"}
  ]
},
	  plugins: [
    // new HtmlWebpackPlugin()// 默认所生成的inde.html编译到dist/js下
    new HtmlWebpackPlugin({ 
    	filename:'index-[hash].html',//指定所生成的HTML(动态的名称)
    	template: 'index.html',  //这样所生成的inde.html还是会编译到dist/js下(解决方法如index-2)
    	inject:'body', //指定脚本所在区域(head/body/false)
    	title:'测试',
    	// chunks:['main'] //定义多个 new HtmlWebpackPlugin时可通过chunks:['main']方式让每个显示所需js --或--
    	// excludeChunks:[] //移除那个(调用除移除那个全部调用)	
    	//发布前压缩
    	minify:{
    		removeComments:true,  //删除注释
    		collapseWhitespace:true, //删除空格
    	}
    })
  ]
}


