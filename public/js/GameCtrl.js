angular.module('GameCtrl', []).controller('GameCtrl', function($scope, $timeout) {

  $scope.peopleLeft = [
           { firstName : "Thomas", lastName : "Anderson", pictureUrl : "images/neo.gif", firstHint : "", lastHint : "" },
           // { firstName : "The", lastName : "Trinity", pictureUrl : "images/trinity.gif", firstHint : "", lastHint : ""  },
           // { firstName : "Mr", lastName : "Cypher", pictureUrl : "images/cypher.gif", firstHint : "", lastHint : ""  },
           // { firstName : "Lord", lastName : "Morpheus", pictureUrl : "images/morpheus.gif", firstHint : "", lastHint : ""  },
           // { firstName : "Agent", lastName : "Smith", pictureUrl : "images/agent\ smith.gif", firstHint : "", lastHint : ""  }
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
    // $scope.hint.first = $scope.hint.last = "?";
    // hintLength.first = hintLength.last = 0;
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

  // will always return a new user if possible
  function nextIndex() {
    if($scope.peopleLeft.length){
      if($scope.peopleLeft.length == 1){
        return 0;
      } else {
        var newVal = $scope.index;
        while(newVal == $scope.index){
          newVal = Math.floor(Math.random() * $scope.peopleLeft.length);
        }
        return newVal;
      }
    }
    // TODO -- DO WE NEED THIS?
    // else {
    //   return -1;
    // }
  }

  $scope.index = nextIndex();

  $scope.cheat = function() {
    $scope.score += 5;
    nextUser();
  }

  $scope.skip = function() {
    var next = nextIndex();
    // last person!
    if(next !== $scope.index){
      $scope.index = next;
      clearData();
      flash("skipped!", "Flash--info", "icon-info-circle");
    } else {
      flash("last person!", "Flash--error", "icon-exclamation-triangle");
    }
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
      $scope.score--;
      hintLength[type]++;
      $scope.hint[type] = $scope.currentUser()[type+"Name"].substring(0, hintLength[type]);
    } else {
      flash("no more hints!", "Flash--error", "icon-exclamation-triangle");
    }
  }

  function nextUser() {
    shiftCurrentUser();
    clearData();

    if($scope.peopleLeft.length){
      flash("correct!", "Flash--success", "icon-check-square");
    } else {
      unbindNameMatcher();
      console.log($scope.peopleLeft)
      flash("game won!", "Flash--success", "icon-check-square");
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

  var unbindNameMatcher = $scope.$watch("nameMatcher", function(newValue, oldValue) {
    if(angular.lowercase(newValue) == angular.lowercase($scope.currentUser().firstName)){
      foundName("first");
    }
    if(angular.lowercase(newValue) == angular.lowercase($scope.currentUser().lastName)){
      foundName("last");
    }
  });

});
