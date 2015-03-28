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
  //          { firstName : "Thomas", lastName : "Anderson", pictureUrl : "images/neo.gif", complete : false },
  //          { firstName : "The", lastName : "Trinity", pictureUrl : "images/trinity.gif", complete : false },
  //          { firstName : "Mr", lastName : "Cypher", pictureUrl : "images/cypher.gif", complete : false },
  //          { firstName : "Lord", lastName : "Morpheus", pictureUrl : "images/morpheus.gif", complete : false },
  //          { firstName : "Agent" lastName : "Smith", pictureUrl : "images/agent\ smith.gif", complete : false },
  //        ];

  $scope.finished = [];
  $scope.score = 0;
  hint = 0;

  $scope.peopleLeft = angular.copy($scope.people);

  // ugly, but functional
  // should this return the index, or update scope.index?
  function nextIndex () {
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
    $scope.name = $scope.hint = "";
    hint = 0;
    flash("skipped");
    $scope.index = nextIndex();
  }

  $scope.currentUser = function () {
    return $scope.peopleLeft[$scope.index];
  }
  
  function shiftCurrentUser() {
    var mine = $scope.peopleLeft.splice($scope.index, 1);
    $scope.finished.unshift(mine[0]);
    $scope.index = nextIndex();
  }

  $scope.useHint = function() {
    if(hint < 3){
      $scope.score--;
      hint++;
      $scope.hint = $scope.currentUser().name.substring(0, hint);
    } else {
      flash("no more hints!");
    }
  }

  // we consume our array in order, to prevent hitting a user we've already seen
  function nextUser () {
    shiftCurrentUser();
    if($scope.peopleLeft.length){
      $scope.name = $scope.hint = "";
      hint = 0;
      flash("success");
    }
  }

  $scope.$watch("name", function (newValue, oldValue) {
    if(angular.lowercase(newValue) == angular.lowercase($scope.currentUser().name)){
      $scope.score += 5;
      nextUser();
    }
  });

  flash = function (message) {
    $scope.message = message;
    $timeout(function() {
      $scope.message = "";
    }, 1000);
  }

  // initialize = function () {
  // }

  // initialize();
});