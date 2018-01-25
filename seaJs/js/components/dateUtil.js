
define("components/dateUtil", [], function(require,exports, module) {

	var dateUtil = {

		 addDays:function (date, nextDays) {
			if (!(date instanceof Date) || typeof nextDays !== 'number') {
				throw new Error('参数错误');
			}
			var _date = new Date(date);
			return new Date(_date.setDate(_date.getDate() + nextDays));
		},
		handleStr :function(str) {
			var handledStr = str < 10 ? ('0') + str : str;
			return handledStr;
		}

	};

  module.exports = dateUtil;

})