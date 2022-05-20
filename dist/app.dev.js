"use strict";

//Module
var loanApp = angular.module('loanApp', ['ngRoute', 'ngResource']); //routes

loanApp.config(function ($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'pages/home.htm',
    controller: 'homeController'
  }).when('/loans', {
    templateUrl: 'pages/loans.htm',
    controller: 'loansController'
  }).when('/newloan', {
    templateUrl: 'pages/newloan.htm',
    controller: 'newLoanController'
  }).when('/customers', {
    templateUrl: 'pages/customers.htm',
    controller: 'customersController'
  }).when('/saveloan', {
    templateUrl: 'pages/saveloan.htm',
    controller: 'saveLoanController'
  }).when('/paynow', {
    templateUrl: 'pages/paynow.htm',
    controller: 'payNowController'
  });
}); //Services

loanApp.service('loanService', function () {
  this.loan = "Apply for loan";
}); //Controllers

loanApp.controller('homeController', ['$scope', function ($scope) {}]);
loanApp.controller('loansController', ['$scope', '$resource', '$http', function ($scope, $resource, $http) {
  // $scope.loan = loanService.loan;
  // $scope.loansAPI = $resource("http://localhost:8080/loans"), {callback: "JSON_CALLBACK"}, {get: {method: "JSONP"}};
  // $scope.loansResult = $scope.loansAPI.get({});
  // console.log($scope.loansResult);
  $http.get("http://localhost:8080/loans").then(function (response) {
    $scope.loanResult = response.data;
    console.log($scope.loanResult);
  });
  console.log($scope.loanResult);
}]);
loanApp.controller('newLoanController', ['$scope', '$http', '$resource', 'loanService', '$routeParams', function ($scope, $http, $resource, loanService, $routeParams) {
  $scope.customer = null;

  $scope.saveLoan = function () {
    var customer = {
      firstName: $scope.firstName,
      lastName: $scope.lastName,
      occupation: $scope.occupation,
      salary: $scope.salary
    };
    console.log(customer);
    $http.post("http://localhost:8080/customers/getbyname", JSON.stringify(customer)).then(function (response) {
      console.log(response);
      $scope.customer = response.data;
      var loan = {
        balance: $scope.loanAmount,
        monthsToPay: $scope.monthsToPay,
        loanAmount: $scope.loanAmount,
        customer: $scope.customer
      };
      $http.post("http://localhost:8080/saveloan/", JSON.stringify(loan)).then(function (response) {
        console.log(response);
        $scope.loan = response.data;
      });
    });
  };
}]);
loanApp.controller('customersController', ['$scope', '$http', function ($scope, $http) {
  $http.get("http://localhost:8080/customers").then(function (response) {
    $scope.customersResult = response.data;
    console.log($scope.customersResult);
  });
  console.log($scope.customersResult);
}]);
loanApp.controller('saveLoanController', ['$scope', '$http', function ($scope, $http) {// $scope.postdata1 = function () {
  //     register = {
  //     customerId: $scope.customerId,
  //     balance: $scope.balance,
  //     monthsToPay: $scope.monthsToPay,
  //     loanAmount: $scope.loanAmount,
  //     }
  //     $http.post("http://localhost:8080/saveloan", JSON.stringify(register))
  //     .then(function(response) {
  //         console.log(response);
  //         $scope.register = response.data.register; 
  //     });
  // }
}]);
loanApp.controller('payNowController', ['$scope', '$http', function ($scope, $http) {}]);