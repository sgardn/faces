angular.module('GameCtrl', []).controller('GameCtrl', function($scope, $timeout) {

	$scope.people = [
						{ name : "Neo", pictureUrl : "images/neo.gif", complete : false },
						{ name : "Trinity", pictureUrl : "images/trinity.gif", complete : false },
						{ name : "Cypher", pictureUrl : "images/cypher.gif", complete : false },
						{ name : "Morpheus", pictureUrl : "images/morpheus.gif", complete : false },
						{ name : "Agent Smith", pictureUrl : "images/agent\ smith.gif", complete : false },
					];

	// for two named people...
	// $scope.people = [
	// 					{ firstName : "Thomas", lastName : "Anderson", pictureUrl : "images/neo.gif", complete : false },
	// 					{ firstName : "The", lastName : "Trinity", pictureUrl : "images/trinity.gif", complete : false },
	// 					{ firstName : "Mr", lastName : "Cypher", pictureUrl : "images/cypher.gif", complete : false },
	// 					{ firstName : "Lord", lastName : "Morpheus", pictureUrl : "images/morpheus.gif", complete : false },
	// 					{ firstName : "Agent" lastName : "Smith", pictureUrl : "images/agent\ smith.gif", complete : false },
	// 				];

	var NUM_PEOPLE = $scope.people.length;
	$scope.usersLeft = NUM_PEOPLE;
	$scope.finished = [];
	$scope.score = 0;
	$scope.index = Math.floor(Math.random() * NUM_PEOPLE);
	hint = 0;

	$scope.currentUser = function () {
		return $scope.people[$scope.index];
	}
	
	function shiftCurrentUser() {
		var mine = angular.copy($scope.people[$scope.index]);
		$scope.finished.unshift(mine);
	}

	$scope.useHint = function() {
		if(hint < 3){
			$scope.score--;
			hint++;
			$scope.hint = $scope.currentUser().name.substring(0, hint);
		} else {
			alert("No more hints for this name!");
		}
	}

	$scope.skip = function() {
		$scope.index = ($scope.index + 1) % $scope.usersLeft;
	}

	function nextUser () {
		shiftCurrentUser();
		$scope.usersLeft--;
		if($scope.usersLeft){
			$scope.people[$scope.index].complete = true;
			$scope.index = ($scope.index + 1) % NUM_PEOPLE;
			$scope.name = $scope.hint = "";
			hint = 0;
			flash();
		}
	}

	$scope.$watch("name", function (newValue, oldValue) {
		if(angular.lowercase(newValue) == angular.lowercase($scope.currentUser().name)){
			$scope.score += 5;
			nextUser();
		}
	});

	flash = function () {
		$scope.message = "Success";
		$timeout(function() {
			$scope.message = "";
		}, 1000);
	}

	initialize = function () {
	}

	initialize();
});