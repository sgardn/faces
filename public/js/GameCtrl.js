angular.module('GameCtrl', []).controller('GameCtrl', function($scope, $timeout) {

	var NUM_PEOPLE = 5;
	$scope.usersLeft = NUM_PEOPLE;
	$scope.finished = [];
	$scope.score = 0;
	hint = 0;

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
		$scope.finished.unshift(mine);
	}

	$scope.useHint = function() {
		if(hint < 2){
			$scope.score--;
			hint++;
			$scope.hint = $scope.currentUser().name.substring(0, hint);
		} else {
			alert("No more hints for this name!");
		}
		console.log(hint);
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