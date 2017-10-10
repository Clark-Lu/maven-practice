/**
 * Created by changlu on 10/10/17.
 */
app.controller('angularCtrl',function($scope,$http){
    $scope.params = {};
    $scope.$watch('params.keyword',function(newVal,oldVal){
       if(newVal !=null && newVal !=""){
           $http.get('/autoComplete',{params:{"keyword":$scope.params.keyword}}).success(function(data){
               $scope.params.result = data;
           }).error(function(){
               alert("请求出错");
           });
       }else{
           $scope.params.result = {};
       }
    });
});