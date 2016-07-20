// bug -- names correctly identified not saved...

angular.module('GameCtrl', []).controller('GameCtrl', function($scope, $timeout) {

  $scope.peopleLeft = [
           { firstName : "Thomas", lastName : "Anderson", pictureUrl : "images/neo.gif", firstHint : "", lastHint : "" },
           { firstName : "The", lastName : "Trinity", pictureUrl : "images/trinity.gif", firstHint : "", lastHint : ""  },
           { firstName : "Mr", lastName : "Cypher", pictureUrl : "images/cypher.gif", firstHint : "", lastHint : ""  },
           { firstName : "Lord", lastName : "Morpheus", pictureUrl : "images/morpheus.gif", firstHint : "", lastHint : ""  },
           { firstName : "Agent", lastName : "Smith", pictureUrl : "images/agent\ smith.gif", firstHint : "", lastHint : ""  }
         ];

  $scope.finished = [];
  $scope.score = 0;
  $scope.nameMatcher = "";
  $scope.index = 0;
  $scope.frontUser = {};
  $scope.backUser = {};
  $scope.flipped = false;

  $scope.nameParts = {
    first: false,
    last: false
  }

  function clearTempData() {
    $scope.nameMatcher = "";
    $scope.nameParts.first = $scope.nameParts.last = false;
  }

  var timeoutPromise;
  flash = function(message, messageClass, messageIconClass) {
    $scope.flashClass = messageClass;
    $scope.messageIconClass = messageIconClass;
    if(timeoutPromise){
      $timeout.cancel(timeoutPromise)
    }
    $scope.message = message;
    $scope.showMessage = true;
    timeoutPromise = $timeout(function() {
      $scope.showMessage = false;
    }, 1000);
  }

  // calculateNextIndex after adjusting length
  function calculateNextIndex() {
    if($scope.peopleLeft.length && $scope.peopleLeft.length > 1){
      $scope.index = ($scope.index + 1) % $scope.peopleLeft.length;
    } else {
      $scope.index = 0;
    }
    return $scope.index;
  }

  $scope.cheat = function() {
    foundUser();
  }

  function preserveFormState () {
    if($scope.flipped) {
      angular.copy($scope.backUser, $scope.peopleLeft[$scope.index]);
    } else {
      angular.copy($scope.frontUser, $scope.peopleLeft[$scope.index]);
    }
  }

  $scope.skip = function() {
    if($scope.peopleLeft.length && $scope.peopleLeft.length > 1){
      preserveFormState();
      clearTempData();
      populateNextUser();
      flash("skipped!", "Flash--info", "icon-info-circle");
    } else {
      flash("last person!", "Flash--error", "icon-exclamation-triangle");
    }
  }

  function currentUserFromArray() {
    return $scope.peopleLeft[$scope.index]
  }
  function userDataFromForm () {
    if($scope.flipped) {
      return $scope.backUser;
    } else {
      return $scope.frontUser;
    }
  }

  // shifts the current user to finished array
  function saveCurrentUser() {
    var mine = $scope.peopleLeft.splice($scope.index, 1);
    person = mine[0];
    person.hintsUsed = person.firstHint.length + person.lastHint.length;
    $scope.finished.unshift(person);
  }

  $scope.useHint = function(hintType) {
    var hintKey = hintType+"Hint";
    var nameKey = hintType+"Name";
    var c = userDataFromForm();
    if($scope.nameParts[hintType]){
      flash("no hint for a known name!", "Flash--info", "icon-info-circle")
    } else if(c[nameKey].length <= c[hintKey].length && c[hintKey].length <= 2){
      flash("no more hints!", "Flash--error", "icon-exclamation-triangle");
    } else if(c[hintKey].length <= 2){
      $scope.score--;
      c[hintKey] = c[nameKey].substring(0, c[hintKey].length + 1);
    } else {
      flash("3 hints per name!", "Flash--error", "icon-exclamation-triangle");
    }
  }

  // populate the next card side with a user, update index
  function populateNextUser() {
    calculateNextIndex();
    if($scope.flipped) {
      angular.copy(currentUserFromArray(), $scope.frontUser);
    } else {
      angular.copy(currentUserFromArray(), $scope.backUser);
    }
    $scope.flipped = !$scope.flipped;
  }

  function foundUser() {
    $scope.score += 5;
    saveCurrentUser();
    clearTempData();
    if($scope.peopleLeft.length > 0){
      flash("correct!", "Flash--success", "icon-check-square");
      populateNextUser();
    } else {
      unbindNameMatcher();
      flash("game won!", "Flash--success", "icon-check-square");
    }
  }

  function foundName(type) {
    $scope.nameParts[type] = true;
    var key = type + "Name";
    if($scope.flipped) {
      $scope.backUser[key] = currentUserFromArray()[key]
    } else {
      $scope.frontUser[key] = currentUserFromArray()[key]
    }

    if($scope.nameParts.first && $scope.nameParts.last){
      foundUser();
    } else {
      $scope.nameMatcher = "";
    }
  }

  var unbindNameMatcher = $scope.$watch("nameMatcher", function(newValue, oldValue) {
    if(angular.lowercase(newValue) == angular.lowercase(currentUserFromArray().firstName)){
      foundName("first");
    }
    if(angular.lowercase(newValue) == angular.lowercase(currentUserFromArray().lastName)){
      foundName("last");
    }
  });

  angular.copy($scope.peopleLeft[$scope.index], $scope.frontUser);
});
