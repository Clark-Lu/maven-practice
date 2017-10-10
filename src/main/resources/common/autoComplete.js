/**
 * Created by changlu on 10/10/17.
 */
angular.module('dui.component.autocomplete', []).directive('duiAutocomplete', function($http, $filter, $timeout){
    return {
        restrict: 'EA',
        replace: 'true',
        require: '?ngModel',
        template: '<div class="in_block pos_r">' +
        '<input type="text" class="txtNew js_keyword" placeholder="{{placeholder}}" style="width: {{inputWidth || 200}}px" ng-model="keyword"/>' +
        '<div class="autoComplate js_resultPopup" style="left:0; top: 22px; max-height:256px; overflow-y:auto; overflow-x:hidden;">' +
        '<a href="javascript:;" ng-repeat="item in result | limitTo:200" ng-class="{current: $parent.currentIdx == $index}" ' +
        'ng-mouseover="$parent.currentIdx=$index" ng-click="clickItem(item)">{{item[optionKey]}}</a>' +
        '<p class="pd_6 grey999" ng-show="!result.length">没有搜索到数据</p>' +
        '</div>' +
        '</div>',
        scope: {
            url: '@',			//服务器端用					（仅用于服务器端）
            params: '=',		//服务器端自动提示，构建请求参数（仅用于服务器端）
            datasource: '=',	//客户端自动完成用				（仅用户客户端）
            resultKey: '@',		//返回数据的顶级key				（仅用于服务器端）
            optionKey: '@',		//自动提示显示的key				（公共）
            inputWidth: '@',
            placeholder: '@',
            selectCallback: '&'	//回调函数						（公共）
        },
        link: function(scope, el, attrs, ngModel){

            var $keyword = el[0].querySelector('.js_keyword'),
                $popup = el[0].querySelector('.js_resultPopup'),
                searchKey = attrs.keyword || 'keyword',
                delayTime = Number(attrs.delayTime) || 150;


            //默认配置
            scope.currentIdx = -1;

            //同步keyword到controller中的变量
            if(ngModel){
                ngModel.$render = function() {
                    scope.keyword = ngModel.$viewValue || '';
                };
                scope.$watch('keyword', function(val){
                    ngModel.$setViewValue(val);
                });
            }

            //监控输入变化
            var timer = null;
            $keyword.addEventListener('keyup', function(e){
                scope.$apply(function(){
                    if(e.keyCode === 38){			//上箭头
                        scope.currentIdx = scope.currentIdx > 0 ? (scope.currentIdx - 1) : 0;
                    }else if(e.keyCode === 40){		//下箭头
                        scope.currentIdx = scope.currentIdx < (scope.result.length - 1) ? (scope.currentIdx + 1) : (scope.result.length - 1);
                    }else if(e.keyCode === 13){		//回车
                        scope.clickItem(scope.result[scope.currentIdx]);
                    }else{
                        if(scope.keyword){
                            if(scope.datasource){
                                requestClientResult();
                            }else{
                                timer = $timeout(function(){ requestServerResult(); }, delayTime);
                            }
                        }else{
                            hidePopup();
                        }
                    }
                });
            });
            $keyword.addEventListener('keydown', function(e){
                $timeout.cancel(timer);
                e.stopPropagation();
            });


            var allAutoPopDiv = null;
            $keyword.addEventListener('click', function(e){
                e.stopPropagation();

                //click关闭其他所有弹层
                if(allAutoPopDiv === null){
                    allAutoPopDiv = document.querySelectorAll('.js_resultPopup') || [];
                }
                for(var i=0, len=allAutoPopDiv.length; i<len; i++){
                    allAutoPopDiv[i].style.display = 'none';
                }

                scope.$apply(function(){
                    if(attrs.autocompleteOnfocus === 'true'){
                        scope.datasource ? requestClientResult() : requestServerResult();
                    }
                });
            });

            //点击选项
            scope.clickItem = function(item){
                hidePopup();
                scope.keyword = item[scope.optionKey];
                scope.result = [item];

                if(scope.selectCallback){
                    scope.selectCallback({item: item});
                }
            };

            //点击document，关闭弹层
            angular.element(document).bind('click', function(){
                hidePopup(false);
            });

            //客户端筛选
            function requestClientResult(callback){
                scope.result = $filter('filter')(scope.datasource, scope.keyword);
                showPopup();
            }

            //服务器端筛选
            function requestServerResult(callback){
                var method = isCrossDomain(scope.url) ? 'jsonp' : 'get',
                    url = isCrossDomain(scope.url) ? (scope.url + '?jsoncallback=JSON_CALLBACK') : scope.url,
                    resultParams = {};

                resultParams[searchKey] = scope.keyword;
                angular.extend(resultParams, scope.params);

                $http[method](url, {params: resultParams}).success(function(response){
                    if(response){
                        scope.result = scope.resultKey ? response[scope.resultKey] : response;
                        showPopup();
                    }
                });
            }

            //显示弹层
            function showPopup(){
                $popup.style.display = 'block';
            }
            //隐藏弹层
            function hidePopup(){
                $popup.style.display = 'none';
            }

            //验证是否跨域
            function isCrossDomain(url){
                var crossDomain = url.indexOf('http://') !== -1 || scope.url.indexOf('https://') !== -1;
                if(attrs.crossDomain === 'false'){
                    crossDomain = false;
                }
                return crossDomain;
            }
        }
    }
});
