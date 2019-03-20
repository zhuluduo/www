<template>
	<div class="user-manage-wrapper">
		<div class="search-bar">
			<el-select v-model="queryParams.sex" @change="getList">
				<el-option :label="item.label" v-for="item in sexList" :value="item.value"></el-option>
			</el-select>
			<el-select v-model="queryParams.state" @change="getList">
				<el-option v-for="item in stateList" :label="item.label" :value="item.value">启用</el-option>
			</el-select>
			<el-input v-model="queryParams.keyword">
				<el-button slot="append" icon="el-icon-search"></el-button>
			</el-input>
		</div>
		<div class="table-wrapper">
			<el-table :data="dataList">
				<el-table-column label="用户ID" prop="user_id" align="center"></el-table-column>
				<el-table-column label="用户姓名" prop="user_name" align="center"></el-table-column>
				<el-table-column label="性别" align="center">
					<template slot-scope="scope">
						<span v-if="scope.row.user_sex==0">女</span>
						<span v-else-if="scope.row.user_sex==1">男</span>
						<span v-else>保密</span>
					</template>
				</el-table-column>
				<el-table-column label="手机号" prop="user_phone" align="center"></el-table-column>
				<el-table-column label="生日" prop="user_birthday" align="center"></el-table-column>
				<el-table-column label="注册时间" prop="create_time" align="center"></el-table-column>
				<el-table-column label="角色个数" align="center"></el-table-column>
				<el-table-column label="状态" align="center">
					<template slot-scope="scope">
						<span v-if="scope.row.state==1">启用</span>
						<span v-else>禁用</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" width="200">
					<template slot-scope="scope">
						<span class="link" @click="showDialog(scope.row)">编辑</span>
						<span class="link" @click="changeState(scope.row)">{{scope.row.state=='1'?'禁用':'启用'}}</span>
						<span class="link" @click="showPawdDialog(scope.row)">修改密码</span>
					</template>
				</el-table-column>
			</el-table>

			<div class="pagination-box">
				<el-pagination
		            @current-change="changePage"
		            background
		            layout="prev, pager, next"
		            :page-count="pagination.pageCount"
		            :current-page="pagination.currentPageIndex"
		            :page-size="pagination.pageSize"
	          	></el-pagination>
			</div>

			<el-dialog :title="dialog.title" :visible.sync="dialog.visible" width="500px" @close="closeDlg('modifyPhoneForm')">
				<div class="dialog-form">
					<el-form ref="modifyPhoneForm" label-position="left" label-width="70px" :model="dialog.formData" :rules="dialog.rules">
						<el-form-item label="姓名：">
							<el-input disabled v-model="dialog.formData.name"></el-input>
						</el-form-item>	
						<el-form-item label="性别：">
							<el-select disabled v-model="dialog.formData.sex">
								<el-option :label="item.label" v-for="item in sexList" :value="item.value"></el-option>
							</el-select>
						</el-form-item>	
						<el-form-item label="手机号：" prop="phone">
							<el-input v-model="dialog.formData.phone"></el-input>
						</el-form-item>	
						<el-form-item label="邮箱：" prop="email">
							<el-input disabled v-model="dialog.formData.email"></el-input>
						</el-form-item>	
						<el-form-item label="生日：">
							<el-date-picker disabled v-model="dialog.formData.birthday" type="date"></el-date-picker>
						</el-form-item>	
					</el-form>
				</div>
				<div slot="footer" class="dialog-footer">
				    <el-button @click="dialog.visible = false">取 消</el-button>
				    <el-button type="primary" @click="modifyPhone">确 定</el-button>
			  	</div>
			</el-dialog>

			<el-dialog :title="pawdDialog.title" :visible.sync="pawdDialog.visible" @close="closeDlg('modifyPasswordForm')" width="500px">
				<div class="password-dialog-form">
					<el-form ref="modifyPasswordForm" label-position="left" label-width="85px" :model="pawdDialog.formData" :rules="pawdDialog.rules">
						<el-form-item label="新密码：" prop="newPassword">
							<el-input type="password" v-model="pawdDialog.formData.newPassword"></el-input>
						</el-form-item>	
						<el-form-item label="确定密码：" prop="checkPassword">
							<el-input type="password" v-model="pawdDialog.formData.checkPassword"></el-input>
						</el-form-item>	
					</el-form>
				</div>
				<div slot="footer" class="dialog-footer">
				    <el-button @click="pawdDialog.visible = false">取 消</el-button>
				    <el-button type="primary" @click="modifyPassword">确 定</el-button>
			  	</div>
			</el-dialog>
		</div>
	</div>
</template>
<script>
import { emailValidator, phoneValidator } from '../../../lib/validate.js'
import UserService from '../../../services/UserService.js'
export default {
	data() {
		return {
			userService: new UserService,
			queryParams: {
				sex: 3,
				state: 2,
				keyword:'',
				pageIndex:1,
				pageSize: 10,
			},
			pagination: {
				pageSize: 10,
				pageIndex: 1,
				pageCount:0
			},
			dataList: [],
			sexList:[
				{label:'全部', value: 3},
				{label:'男', value: 1},
				{label:'女', value: 0},
				{label:'保密', value: 2}
			],
			stateList: [
				{label:'启用', value:1},
				{label:'禁用', value:0},
				{label:'全部', value:2}
			],
			dialog: {
				title:'编辑用户',
				visible: false,
				formData: {
					name: '',
					sex: '',
					phone: '',
					email: '',
					birthday: '',
					oldPhone: ''
				},
				rules: {
					phone: [{required: true,validator:phoneValidator,trigger:'blur'}]
				}
			},
			pawdDialog: {
				title: '修改密码',
				visible: false,
				formData: {
					newPassword:'',
					checkPassword:'',
					phone: ''
				},
				rules:{
					newPassword: [{required: true,message:'请输入密码',trigger:'blur'}],
					checkPassword: [{required: true,message:'请输入密码',trigger:'blur'}]
				}
			}
		}
	},
	created() {
		this.getList();
	},
	methods: {

		closeDlg( formName ) {
			this.$refs[formName].resetFields();
		},

		async changeState( row ) {
			let result = await this.$confirm('您确定要启用该用户吗？', '提示');
			if ( result === 'confirm' ) {
				let res = await this.userService.modifyState(row.user_phone, row.state==1?0:1);
				if ( res.code == 200 ) {
					this.$message({type: 'success', duration:1000, message:'更新成功！'});
					this.getList();
				} else {
					this.$message({type: 'error', duration:1000, message:'更新失败！'});
				}
			}
		},

		showDialog( row ) {
			this.dialog.formData.name = row.user_name;
			this.dialog.formData.sex = Number(row.user_sex);
			this.dialog.formData.phone = row.user_phone;
			this.dialog.formData.birthday = row.user_birthday;
			this.dialog.formData.oldPhone = row.user_phone;
			this.dialog.visible = true;
		},

		showPawdDialog( row ) {
			this.pawdDialog.formData.phone = row.user_phone;
			this.pawdDialog.visible = true;
			
		},

		async getList() {
			let res = await this.userService.getList( this.queryParams.pageSize, this.queryParams.pageIndex, this.queryParams.sex, this.queryParams.state);
			this.dataList = res.data.list;
			this.pagination = res.data.pagination;
		},

		async modifyPhone() {
			let valid = await this.$refs['modifyPhoneForm'].validate();
			if ( valid ) {
				let res = await this.userService.modifyPhone(this.dialog.formData.oldPhone, this.dialog.formData.phone);
				if ( res.code == 200 ) {
					this.dialog.visible = false;
					this.$message({type: 'success', duration:1000, message:'更新成功！'});
					this.getList();
				} else {
					this.$message({type: 'error', duration:1000, message:'更新失败！'});
				}
			}
		},

		async modifyPassword() {
			let valid = await this.$refs['modifyPasswordForm'].validate();
			if ( valid ) {
				if ( this.pawdDialog.formData.newPassword == this.pawdDialog.formData.checkPassword ) {
					let res = await this.userService.modifyPassword(this.pawdDialog.formData.phone, this.pawdDialog.formData.newPassword);
						if ( res.code == 200 ) {
							this.$message({type: 'success', duration:1000, message:'更新成功！'});
							this.pawdDialog.visible = false;
						} else {
							this.$message({type: 'error', duration:1000, message:'更新失败！'});
						}
				} else {
					this.$message({type: 'error', duration:1200, message:'新密码与确认密码不一致！'});
				}
			}
		},


		changePage( pageIndex ) {

		}
	}
}
</script>
<style scoped>
.search-bar{display: flex;background-color: #fff;padding: 15px;}
.el-select{margin-left: 15px;}
.el-input{width: 350px;margin-left: 15px;}
.table-wrapper{margin-top: 20px;background-color: #fff;padding: 15px;}
.link{color: #3f8def;margin: 0 8px;cursor: pointer}
.dialog-form .el-input,.dialog-form .el-select{width: 370px;}
.password-dialog-form .el-input{width: 360px;}
.pagination-box{display: flex;justify-content: flex-end;padding: 15px 0}
</style>