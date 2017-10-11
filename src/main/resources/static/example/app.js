/**
 * Created by changlu on 10/10/17.
 */
var app = angular.module("app",["ngRoute","angularFileUpload"]);

app.config(function($routeProvider){
    $routeProvider.when("/thymeleaf",{
        templateUrl:"/static/angular/view/view.html",
        controller:"angularCtrl"
    }).when("/bootstrap",{
        templateUrl:"/static/angular/view/bootstrap.html",
        controller:"bootstrapCtrl"
    }).otherwise({redirectTo: '/thymeleaf'});
});
