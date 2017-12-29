/**
 * Created by changlu on 11/2/17.
 */
/**
 接口参数：
 ------------------------
 date： 双向绑定到外部日期对象
 yearStart：配置可选年份的起始年份
 yearEnd：配置可选年份的结束年份
 selectableStart： 控制可选日期起始时间，不传表示可选的起始时间没有限制
 selectableEnd：控制可选日期的结束时间，不传表示可选的结束时间没有限制
 onlymonth: 配置是否只显示月份， 有该属性表示只显示月份否则显示到天


 html用法：
 ---------------------------
 <dui-date-picker date="birthday1" year-start="2001" year-end="2020"
 selectable-start="{{selectableStart}}" selectable-end="{{selectableEnd}}">
 </dui-date-picker>

 <dui-date-picker date="birthday2" selectable-start="2014-02-01" selectable-end="2014-10-01" onlymonth></dui-date-picker>


 js:
 -------------------------
 angular.module('yourApp', ['dui.component.datepicker']).controller('YourController', function($scope, $filter){
		$scope.selectableStart = '2014-05-01';
		$scope.selectableEnd = $filter('date')(new Date(), 'yyyy-MM-dd');
	});
 **/

(function(){
    angular.module('dui.component.datepicker', []).directive('duiDatePicker', function($http, $filter, $rootScope, duiDatePickerService){
        /**
         内部模型接口：
         --------------------------
         year：选中的年份
         month：选中的月份
         yearRange: 年份的可选范围
         months：展示可选择的月份范围
         days：展示可选的天（根据年份和月份计算出来）
         **/

        return {
            restrict: 'EA',
            replace: true,
            template: '<div class="in_block pos_r">\
						<input type="text" ng-class="{bg_none: date, disable: disabledInput}" class="txtDate" value="{{formatDisplayDate()}}" ng-click="clickSelectInput($event)" readonly>\
						<div class="date_selector js_date_selector" ng-click="clickPanel($event)" style="width:{{isMonth && 185 || 215}}px;">\
							<div class="nav_d clearfix" style="width:{{isMonth && 185 || 215}}px;">\
								<p class="year_nav">\
									<select class="selYear" ng-model="year" ng-options="y for y in getYearRange()"></select>年\
								</p>\
								<p class="month_nav">\
									<select ng-hide="isMonth" class="selMonth" ng-model="month" ng-options="month for month in monthRange"></select>\
									<span class="in_block" style="padding-top:3px;" ng-show="isMonth">{{month}}<span ng-class="{bold: isMonth}">月</span></span>\
								</p>\
								<a href="javascript:;" class="clearDate" ng-hide="cannotEmpty" ng-click="clearDate()">清空</a>\
							</div>\
							<table ng-class="{mt_5: isMonth}">\
								<tbody ng-hide="isMonth">\
									<tr><th ng-repeat="week in weekRange">{{week}}</th></tr>\
									<tr ng-repeat="row in days">\
										<td ng-class="getDayClass(day)" ng-repeat="day in row" ng-click="selectDate(day)">{{day.getDate()}}</td>\
									</tr>\
								</tbody>\
								<tbody ng-show="isMonth">\
									<tr ng-repeat="month in months">\
										<td ng-repeat="day in month" ng-class="getDayClass(day)" ng-click="selectDate(day)">{{day.getMonth() + 1}}月</td>\
									</tr>\
								</tbody>\
							</table>\
						</div>\
					</div>',
            scope: {
                date: '=',
                yearStart: '@',
                yearEnd: '@',
                selectableStart: '@',
                selectableEnd: '@',
                disabled: '@',
                selectCallback: '&'
            },
            link: function(scope, el, attrs){
                scope.now = new Date();
                scope.isMonth = attrs.onlymonth !== undefined;		//是选日期控件， 还是选月份控件
                scope.cannotEmpty = attrs.hasEmpty === 'false';		//判断可否清空选择的日期

                scope.$watch('disabled', function(disabled){
                    scope.disabledInput = disabled === 'true';
                });

                var $popup = el[0].querySelector('.js_date_selector');

                //初始化选中的日期，年份，月份
                scope.$watch('date', function(value, oldVal){
                    if( angular.isNumber(value) ){
                        scope.date = $filter('date')(value, 'yyyy-MM-dd');
                    }
                    var initDate = computeSelectedDate();

                    scope.year = initDate.getFullYear();		//选中年
                    scope.month = (initDate.getMonth() + 1);	//选中月份
                });

                //选择日期
                scope.selectDate = function(clickDate){
                    if(!duiDatePickerService.isSelectable(clickDate, scope.month, scope.selectableStart, scope.selectableEnd, scope.isMonth)) return;

                    scope.date = $filter('date')(clickDate, 'yyyy-MM-dd');

                    if(attrs.selectCallback !== undefined){
                        scope.selectCallback({date: scope.date});
                    }

                    hidePopup();
                };

                //构建年份的区间
                scope.getYearRange = function(){
                    var start = scope.yearStart ? Number(scope.yearStart) : (scope.now.getFullYear() - 10),
                        end = scope.yearEnd ? Number(scope.yearEnd) : (scope.now.getFullYear() + 10);

                    return duiDatePickerService.buildRange(start, end).reverse();
                };

                //月区间
                scope.monthRange = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
                //周区间
                scope.weekRange = ['一', '二' , '三', '四', '五', '六', '日'];

                //年份和月份变化时，重新构建面板内容
                scope.$watch('year + month', function(newValue, oldValue){
                    if(scope.isMonth){
                        scope.months = duiDatePickerService.buildMonthPanel(scope.year);
                    }else{
                        scope.days = duiDatePickerService.buildDatePanel(scope.year, scope.month);
                    }
                });

                //点击选择框
                var allPopup = null;
                scope.clickSelectInput = function($event){
                    if(scope.disabledInput) return;

                    $rootScope.$broadcast('angular-show-datepicker', 'angularDatepicker');

                    $event.stopPropagation();

                    if(!allPopup){
                        allPopup = document.querySelectorAll('.js_date_selector') || [];
                    }
                    for(var i=0, len=allPopup.length; i<len; i++){
                        allPopup[i].style.display = 'none';
                    }
                    showPopup();
                };

                //点击控件外部区域，隐藏日期选择框
                angular.element(document).bind('click', function(){
                    hidePopup();
                });

                //点击日期选择框阻止冒泡
                scope.clickPanel = function($event){
                    $event.stopPropagation();
                };

                //清空日期
                scope.clearDate = function(){
                    scope.date = undefined;
                    hidePopup();
                }

                //格式化显示的日期
                scope.formatDisplayDate = function(){
                    return scope.isMonth ? $filter('date')(scope.date, 'yyyy年MM月') : $filter('date')(scope.date, 'yyyy-MM-dd');
                }

                //生成面板中每个格子需要的class
                scope.getDayClass = function(currentDay){
                    var isSelectable = duiDatePickerService.isSelectable(currentDay, scope.month, scope.selectableStart, scope.selectableEnd, scope.isMonth);
                    return {
                        selectable_day: isSelectable,
                        unselected_month: !isSelectable,
                        today: duiDatePickerService.isDateEqual(scope.now, currentDay, scope.isMonth),
                        selected: duiDatePickerService.isDateEqual(computeSelectedDate() , currentDay, scope.isMonth)
                    };
                };

                function computeSelectedDate(){
                    var initDate = scope.date || scope.selectableStart;
                    return initDate ? new Date(initDate) : new Date();
                }

                function showPopup(){
                    $popup.style.display = 'block';
                }
                function hidePopup(){
                    $popup.style.display = 'none';
                    $rootScope.$broadcast('angular-hide-datepicker', 'angularDatepicker');
                }
            }
        }
    }).factory('duiDatePickerService', function($filter){
        //计算每个月多少天算法
        var dateUtils = {
            start_of_week: 1,
            daysBetween: function(start, end) {
                start = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
                end = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
                return (end - start) / 86400000;
            },
            changeDayTo: function(dayOfWeek, date, direction) {
                var difference = direction * (Math.abs(date.getDay() - dayOfWeek - (direction * 7)) % 7);
                return new Date(date.getFullYear(), date.getMonth(), date.getDate() + difference)
            },
            rangeStart: function(date) {
                return this.changeDayTo(this.start_of_week, new Date(date.getFullYear(), date.getMonth()), -1)
            },
            rangeEnd: function(date) {
                return this.changeDayTo((this.start_of_week - 1) % 7, new Date(date.getFullYear(), date.getMonth() + 1, 0), 1)
            },
            isFirstDayOfWeek: function(date) {
                return date.getDay() == this.start_of_week;
            },
            isLastDayOfWeek: function(date) {
                return date.getDay() == (this.start_of_week - 1) % 7
            }
        };

        return {
            buildMonthPanel: function(year){		//构建月份面板数据
                if(!year) return [];

                //面板要显示为两行，所以数组中为两个元素，每个元素表示一行
                return [this.buildRange(1, 6, buildDate), this.buildRange(7, 12, buildDate)];

                function buildDate(month){ return new Date(year, month -1 , 1); }
            },
            buildDatePanel: function(year, month){	//构建日期面板数据
                if(!year || !month) return [];

                var date = new Date(year, month - 1, 1),
                    rangeStart = dateUtils.rangeStart(date),
                    rangeEnd = dateUtils.rangeEnd(date),
                    numDays = dateUtils.daysBetween(rangeStart, rangeEnd),
                    row = [],
                    days = [];

                for (var i = 0; i <= numDays; i++) {
                    var currentDay = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate() + i, 12, 00);
                    if (dateUtils.isFirstDayOfWeek(currentDay)){
                        row = [];
                    }
                    row.push(currentDay);
                    if (dateUtils.isLastDayOfWeek(currentDay)){
                        days.push(row);
                    }
                };

                return days;
            },
            isSelectable: function(currentDay, currentMonth, selectableStart, selectableEnd, isMonth){		//处理日期是否可选择
                selectableStart = selectableStart || '1800-01-01';
                selectableEnd = selectableEnd || '2099-01-01';
                var strCurDay = $filter('date')(currentDay, isMonth ? 'yyyy-MM-01' : 'yyyy-MM-dd');

                if(isMonth){
                    return strCurDay >=selectableStart && strCurDay <=selectableEnd;
                }
                return currentDay.getMonth() == (currentMonth-1) && strCurDay >=selectableStart && strCurDay <=selectableEnd;
            },
            isDateEqual: function(date1, date2, isMonth){	//判断日期是否相等
                var result = date1.getFullYear() === date2.getFullYear() && date1.getMonth() == date2.getMonth();
                if(!isMonth){
                    result = result && date1.getDate() == date2.getDate();
                }
                return  result;
            },
            buildRange: function(start, end, callback){		//构建数据区间
                var result = [];
                for(var y=start; y<=end; y++){
                    result.push(callback ? callback(y) : y);
                }
                return result;
            }
        };
    });
}());
