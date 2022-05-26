//Module
var loanApp = angular.module('loanApp', ['ngRoute', 'ngResource']);

//Routes
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

//Directives
loanApp.directive('backButton', function(){
    return {
      restrict: 'A',

      link: function(scope, element, attrs) {
        element.bind('click', goBack);

        function goBack() {
          history.back();
          scope.$apply();
        }
      }
    }
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
    
}]);

loanApp.controller('newLoanController', ['$scope', '$http', '$window', function($scope, $http, $window){

    $scope.customer = null;

    $scope.saveLoan = function () {
        var customer = {
            firstName: $scope.firstName,
            lastName: $scope.lastName,
            occupation: $scope.occupation,
            salary: $scope.salary
        };

        console.log(customer);

        $http.post("http://localhost:8080/customers/getbyname/",  JSON.stringify(customer))
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

                if (response.data != null) {
                    alert("Loan Approved. Redirect to home.");
                    $window.location.href = "#/"
                } else {
                    alert("Loan Unsuccessful.")
                };  
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

}]); 

loanApp.controller('payNowController', ['$scope', '$http', 'loanService', '$window',  function($scope, $http, loanService, $window) {

    $http.get("http://localhost:8080/loans/" + loanService.id.toString())
    .then(function(response){

        $scope.loan = response.data;
        console.log($scope.loan);
    });

    $http.get("http://localhost:8080/gettransactions/" + loanService.id.toString())
    .then(function(response){

        $scope.transactionsRecords = response.data;
        console.log($scope.transactionsRecords);

        $scope.totalAmountPaid = 0;
        angular.forEach($scope.transactionsRecords, function(transactionRecord, key) {
            $scope.totalAmountPaid += transactionRecord.amountPaid;
        });
        console.log("amount paid: " + $scope.totalAmountPaid);
    });
    
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

                $scope.loan = response.data; 

                if (response.data != null) {
                    alert("Payment Successful. Click Ok to redirect.");
                    $window.location.href = "#/loans";
                }; 
            });
        };   
}]);
