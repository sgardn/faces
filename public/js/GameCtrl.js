angular.module('GameCtrl', []).controller('GameCtrl', function($scope, $timeout) {

	var NUM_PEOPLE = 5;
	$scope.usersLeft = NUM_PEOPLE;
	$scope.finished = [];

	// { name : "Bill", pictureUrl : "images/bill.jpeg", complete : false },
	// { name : "Ted", pictureUrl : "images/ted.gif", complete : false },
	$scope.people = [
						{ name : "Neo", pictureUrl : "images/neo.gif", complete : false },
						{ name : "Trinity", pictureUrl : "images/trinity.gif", complete : false },
						{ name : "Cypher", pictureUrl : "images/cypher.gif", complete : false },
						{ name : "Morpheus", pictureUrl : "images/morpheus.gif", complete : false },
						{ name : "Agent Smith", pictureUrl : "images/agent\ smith.gif", complete : false },
						 ];

	$scope.index = Math.floor(Math.random() * NUM_PEOPLE);

	$scope.currentUser = function () {
		return $scope.people[$scope.index];
	}
	
	function shiftCurrentUser() {
		var mine = angular.copy($scope.people[$scope.index]);
		console.log(mine);
		$scope.finished.unshift(mine);
	}

	function nextUser () {
		shiftCurrentUser();
		$scope.usersLeft--;
		if($scope.usersLeft){
			$scope.people[$scope.index].complete = true;
			$scope.index = ($scope.index + 1) % NUM_PEOPLE;
			$scope.name = "";
			flash();	
		} else {
			// alert("game over!");
		}
	}

	$scope.$watch("name", function (newValue, oldValue) {
		// console.log(newValue);
		// console.log($scope.currentUser().name);
		if(angular.lowercase(newValue) == angular.lowercase($scope.currentUser().name)){
			nextUser();
		}
	});

	flash = function () {
		$scope.message = "Success";
		$timeout(function() {
			console.log("timeout reached!");
			$scope.message = "";
		}, 1000);
	}

	initialize = function () {

	}

	initialize();
});