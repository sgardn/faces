angular.module('GameCtrl', []).controller('GameCtrl', function($scope, $timeout) {

  $scope.peopleLeft = [
           { firstName : "Thomas", lastName : "Anderson", pictureUrl : "images/neo.gif" },
           { firstName : "The", lastName : "Trinity", pictureUrl : "images/trinity.gif" },
           { firstName : "Mr", lastName : "Cypher", pictureUrl : "images/cypher.gif" },
           { firstName : "Lord", lastName : "Morpheus", pictureUrl : "images/morpheus.gif" },
           { firstName : "Agent", lastName : "Smith", pictureUrl : "images/agent\ smith.gif" }
         ];

  $scope.finished = [];
  $scope.score = 0;

  hintLength = {
    first:0,
    last:0
  }

  $scope.hint = {
    first:"?",
    last:"?"
  }

  $scope.nameParts = {
    first: false,
    last: false
  }

  function clearData() {
    $scope.nameMatcher = "";
    $scope.hint.first = $scope.hint.last = "?";
    hintLength.first = hintLength.last = 0;
    $scope.nameParts.first = $scope.nameParts.last = false;
  }

  // should this return the index, or update scope.index?
  function nextIndex() {
    if($scope.peopleLeft.length){
      if($scope.peopleLeft.length == 1){
        flash("last person!");
        return 0;
      } else {
        var newVal = $scope.index;
        while(newVal == $scope.index){
          newVal = Math.floor(Math.random() * $scope.peopleLeft.length);
        }
        return newVal;
      }
    } else {
      return -1;
    }
  }

  $scope.index = nextIndex();

  $scope.skip = function() {
    clearData();
    flash("skipped");
    $scope.index = nextIndex();
  }

  $scope.currentUser = function() {
    return $scope.peopleLeft[$scope.index];
  }
  
  function shiftCurrentUser() {
    var mine = $scope.peopleLeft.splice($scope.index, 1);
    person = mine[0];
    person.hintsUsed = hintLength.first + hintLength.last;
    $scope.finished.unshift(person);
    $scope.index = nextIndex();
  }

  $scope.useHint = function(type) {
    if(hintLength[type] < 3){
      console.log(hintLength[type])
      $scope.score--;
      hintLength[type]++;
      $scope.hint[type] = $scope.currentUser()[type+"Name"].substring(0, hintLength[type]);
    } else {
      flash("no more hints!");
    }
  }

  function nextUser() {
    shiftCurrentUser();
    clearData();
    if($scope.peopleLeft.length){
      flash("success");
    }
  }

  function foundName(type) {
    $scope.nameParts[type] = true;
    if($scope.nameParts.first && $scope.nameParts.last){
      $scope.score += 5;
      nextUser();
    } else {
      $scope.nameMatcher = "";
    }
  }

  $scope.$watch("nameMatcher", function(newValue, oldValue) {
    if(angular.lowercase(newValue) == angular.lowercase($scope.currentUser().firstName)){
      foundName("first");
    }
    if(angular.lowercase(newValue) == angular.lowercase($scope.currentUser().lastName)){
      foundName("last");
    }
  });
  var timeoutPromise;
  flash = function(message) {
    if(timeoutPromise){
      $timeout.cancel(timeoutPromise)
    }
    $scope.message = message;
    timeoutPromise = $timeout(function() {
      $scope.message = "";
    }, 1000);
  }
});