//Module
var loanApp = angular.module('loanApp', ['ngRoute', 'ngResource']);

//routes
loanApp.config(function($routeProvider){

    $routeProvider

    .when('/', {
        templateUrl: 'pages/home.htm',
        controller: 'homeController'
    })
   
    .when('/loans', {
        templateUrl: 'pages/loans.htm',
        controller: 'loansController'
    })

    .when('/newloan', {
        templateUrl: 'pages/newloan.htm',
        controller: 'newLoanController'
    })

    .when('/customers', {
        templateUrl: 'pages/customers.htm',
        controller: 'customersController'
    })

    .when('/saveloan', {
        templateUrl: 'pages/saveloan.htm',
        controller: 'saveLoanController'
    })

    .when('/paynow', {
        templateUrl: 'pages/paynow.htm',
        controller: 'payNowController'
    })



});

//Services
loanApp.service('loanService', function(){

    this.id = null;
    this.customerId = null;
});

//Controllers
loanApp.controller('homeController', ['$scope', function($scope){

}]);

loanApp.controller('loansController', ['$scope', '$http', 'loanService', function($scope, $http, loanService){
    $scope.payLoan = function(emp) {
        console.log(emp);
        $scope.loanId = emp.id;
        $scope.customerId = emp.customer.id;
        loanService.id = $scope.loanId;
        loanService.customerId = $scope.customerId;

    };

    $http.get("http://localhost:8080/loans")
    .then(function(response){

        $scope.loanResult=response.data;
        console.log($scope.loanResult);
    });
    console.log($scope.loanResult);

    
}]);


loanApp.controller('newLoanController', ['$scope', '$http', function($scope, $http){

    $scope.customer = null;

    $scope.saveLoan = function () {
        var customer = {
            firstName: $scope.firstName,
            lastName: $scope.lastName,
            occupation: $scope.occupation,
            salary: $scope.salary
        };

        console.log(customer);

        $http.post("http://localhost:8080/customers/getbyname", JSON.stringify(customer))
        .then(function(response) {
    
            console.log(response);

            $scope.customer = response.data; 

            var loan = {
                balance: $scope.loanAmount,
                monthsToPay: $scope.monthsToPay,
                loanAmount: $scope.loanAmount,
                customer: $scope.customer
            };
        
            $http.post("http://localhost:8080/saveloan/", JSON.stringify(loan))
            .then(function(response) {
        
                console.log(response);
    
                $scope.loan = response.data; 
                
            });
           
        });
        
    };    

}]);

loanApp.controller('customersController', ['$scope', '$http', function($scope, $http) {
    
    $http.get("http://localhost:8080/customers")
    .then(function(response){

        $scope.customersResult=response.data;
        console.log($scope.customersResult);
    });
    console.log($scope.customersResult);

}]); 

loanApp.controller('saveLoanController', ['$scope', '$http', function($scope, $http) {
    
}]); 

loanApp.controller('payNowController', ['$scope', '$http', 'loanService',  function($scope, $http, loanService) {

    $scope.loanId = loanService.id;
    $scope.customerId = loanService.customerId;

     $scope.payLoan = function () {
        var transaction = {
            customer: {"id": $scope.customerId},
            loan: {"id": $scope.loanId},
            amountPaid: $scope.amountPaid
        }
        $http.post("http://localhost:8080/savetransaction/", transaction)
            .then(function(response) {
                console.log(response);
                $scope.transaction = response.data; 
            });
    };

}]);