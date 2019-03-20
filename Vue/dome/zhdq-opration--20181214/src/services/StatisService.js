import ApiBase from './ApiBase'
export default class StatisService extends ApiBase {
	/**
	 * [getFlowDailyInfo 获取流量统计数据]
	 * @param  {[string]} channel  [渠道]
	 * @param  {[string]} startDay [开始日期]
	 * @param  {[string]} endDay   [结束日期]
	 * @return {[json]}          [json]
	 */
	async getFlowDailyInfo(channel, startDay, endDay) {
		let result = await super.request('/statis/flow_daily_info', {channel:channel, start_day: startDay, end_day: endDay});
		return result;
	}

	/**
	 * [getFlowSummaryInfo 获取流量统计总体数据]
	 * @param  {[string]} channel [渠道]
	 * @return {[json]}         [json]
	 */
	async getFlowSummaryInfo(channel) {
		let result = await super.request('/statis/flow_summary_info', {channel:channel});
		return result;
	}
	
	/**
	 * [retainedStatistics 流失统计数据]
	 * @param  {[string]} channel [渠道]
	 * @param  {[string]} start_day [开始日期]
	 * @param  {[string]} end_day [结束日期]
	 * @return {[json]}         [json]
	 */
	async churnRateStatistics(channel, startDay, endDay) {
		let parmes ={
			channel: channel,
			start_day: startDay, 
			end_day: endDay
		}
		let result = await super.request('/statis/loss_info', parmes);
		return result;
	}

	/**
	 * [retainedStatistics 时长统计数据]
	 * @param  {[string]} channel [渠道]
	 * @param  {[string]} start_day [开始日期]
	 * @param  {[string]} end_day [结束日期]
	 * @return {[json]}         [json]
	 */
	async durationStatistics(channel, startDay, endDay) {
		let parmes ={
			channel: channel,
			start_day: startDay, 
			end_day: endDay
		}
		let result = await super.request('/statis/use_time_info', parmes);
		return result;
	}

	/**
	 * [retainedStatistics 保留统计数据]
	 * @param  {[string]} channel [渠道]
	 * @param  {[string]} start_day [开始日期]
	 * @param  {[string]} end_day [结束日期]
	 * @return {[json]}         [json]
	 */
	async retainedStatistics(parmes){
		let result = await super.request('/statis/keep_info', parmes);
		return result;
	}

	/**
	 * [activityLevel 活跃率统计数据]
	 * @param  {[string]} parmes [渠道]
	 * @return {[json]}         [json]
	 */
	async activityLevel(parmes){
		let result = await super.request('/statis/active_info', parmes);
		return result;
	}
}