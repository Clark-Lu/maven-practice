/**
 * Created by changlu on 11/2/17.
 */
/**
 *
 * 接口参数：
 * ===================
 * show： 双向绑定到外部控制器， 控制弹层的显示隐藏
 * title：配置弹层的标题
 * width: 配置弹层的宽度
 * height: 配置弹层的高度
 *
 *
 * html:
 * ====================
 * 	<!-- 初始化弹层 -->
 <dui-popup-layer title="测试弹层" show="showPop" width="600" height="200">
 <table border="0" cellpadding="0" cellspacing="0" class="tableFormNew mt_10">
 <tbody>
 <tr>
 <td class="tdTitle" width="100">姓名：</td>
 <td class="request" width="20">●</td>
 <td><input type="text" class="txtNew" ng-model="name" name="name" rule="required"></td>
 </tr>
 <tr>
 <td class="tdTitle">联系电话：</td>
 <td class="request">●</td>
 <td><input type="text" class="txtNew tt160" ng-model="phone" name="phone" rule="required"></td>
 </tr>
 <tr>
 <td class="tdTitle">身份证号：</td>
 <td class="request">●</td>
 <td><input type="text" class="txtNew tt160" ng-model="idcard" name="idcard" rule="required"></td>
 </tr>
 </tbody>
 </table>
 <div class="bubbleBoxBtn js_customFooterBar">
 <a href="javascript:;" class="btn-small btn-silver in_block" ng-click="showPop=false;">关闭</a>
 <a href="javascript:;" class="btn-small btn-blue in_block" ng-click="submitCallback()">提交</a>
 </div>
 </dui-popup-layer>
 */
(function(){
    angular.module('dui.component.poplayer', []).directive('duiPopupLayer', function(){
        return {
            restrict:'E',
            replace: true,
            scope: {
                title: '@',
                popTitle: '@',
                show: '='
            },
            transclude: true,
            template: '<div ng-show="show">\
						<div class="popLayer bubbleBox js_popLayer" style="display: block; position: fixed; left: 50%; top: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%); width:{{width}}px;">\
							<div class="bubbleBoxTitle clearfix">\
								<h1 ng-bind-html-unsafe="popTitle || title"></h1>\
								<div class="cls">\
									<a href="javascript:;" class="closePopBox xx" ng-click="show=false;"></a>\
								</div>\
							</div>\
							<div class="bubbleBoxCon pd_20 js_bubbleBoxCon" style="max-height:{{height}}px; overflow-y:auto;">\
								<div ng-transclude></div>\
							</div>\
							<div class="bubbleBoxBtn js_popLayerFooter"></div>\
						</div>\
						<div style="position: fixed; width: 100%; left: 0; top: 0; bottom: 0; z-index: 997; opacity: 0.2; background: #333; overflow: hidden;"></div>\
					</div>',
            compile: function(el, attrs, transcludeFn) {
                return function postLink(scope, el, attrs, controller) {
                    var conDom = el[0].querySelector('.js_bubbleBoxCon');

                    conDom.innerHTML = '';
                    angular.element(conDom).append(transcludeFn(scope.$parent));

                    if(el[0].querySelector('.js_customFooterBar')){
                        el[0].querySelector('.js_popLayerFooter').appendChild(el[0].querySelector('.js_customFooterBar'));
                    }
                    scope.width = attrs.width || 500;
                    scope.height = attrs.height || 500;
                };
            }
        };
    });
}());
