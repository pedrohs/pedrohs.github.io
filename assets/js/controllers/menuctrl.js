var app = angular.module('App', ['angularUtils.directives.dirPagination']);

app.config(function($interpolateProvider){
	$interpolateProvider.startSymbol('||');
    $interpolateProvider.endSymbol('||');
});

app.controller('menuCtrl', function($scope, $http){

	$scope.modalView = false;

	$scope.modalPesq = function(){
		$scope.modalView = !$scope.modalView;
	}

	$scope.$watch('inputPesq.title', function(valor){
		console.log(valor);
	});

	$http.get('/api.json').success(function(data){
		$scope.resultados = data;
	});
});