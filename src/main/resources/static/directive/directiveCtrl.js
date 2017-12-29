/**
 * Created by changlu on 11/2/17.
 */
app.controller("directiveCtrl",function($scope,$http){
    $scope.params={};
    $scope.params.snow={};
    $scope.params.snowList = [];
    function init(){
        creatSnow();
    }
    function creatSnow(){
        $scope.params.snow.top = 20;
        $scope.params.snow.with = Math.random()*1000;
        $scope.params.snowList.push($scope.params.snow);
        console.log("create snow...");
    }
});
