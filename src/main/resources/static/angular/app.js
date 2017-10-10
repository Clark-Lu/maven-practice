/**
 * Created by changlu on 10/10/17.
 */
var app = angular.module("app",["ngRoute"]);

app.config(function($routeProvider){
    $routeProvider.when("/thymeleaf",{
        templateUrl:"static/angular/view/view.html",
        controller:"angularCtrl"
    }).otherwise({redirectTo: '/thymeleaf'});
});
