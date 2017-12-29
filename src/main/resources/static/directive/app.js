/**
 * Created by changlu on 11/2/17.
 */
var app = angular.module("app",["ngRoute"]);

app.config(function($routeProvider,$locationProvider){
    $locationProvider.html5Mode(true);
    $routeProvider.when("/directive",{
        templateUrl : "/static/directive/view/view.html",
        controller : "directiveCtrl"
    }).otherwise({redirectTo : "/directive"});
});

app.directive("helloWorld",function(){
    return {
        restrict : "EA",
        replace : true,
        template : "<p>hello directive</p>"
    }
});

