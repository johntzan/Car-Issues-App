var app = angular.module('CarIssues', ['ngAnimate']); // [] used to define other modules

app.controller('carController', ['$scope', '$http',
  function($scope, $http) {

    var carInDB = false;
    $scope.car = "";
    $scope.issueArr = [];
    $scope.showAlert = false;

    $scope.sortType = 'mileage'; //default
    $scope.sortReverse  = false;

    $scope.getCarData = function(car) {

      $http.get('/cars/name/' + car) //Gets Car's Issues by Car's Name. Function is called after Car is selected. 
      .then(function(response) {
        $scope.issuesCarName = response.data.name;
        $scope.issuesCar_id = response.data._id;
        $scope.issueArr = response.data.issues;
        console.log($scope.issueArr);
        carInDB = true;
      }, function(error) {
        carInDB = false;

        console.log('Car Not Found | Error: ' + error); //car isnt found, divs change interactively with angular 
      });
    }

    $scope.addNewIssue = function(car) {

      var IssueText = $scope.IssueText; //Gets issue Text from form 
      var IssueMileage = $scope.IssueMileage; // Gets mileage text from form
      var carSelected = car;

      if (!(typeof IssueText === 'undefined' || typeof IssueMileage === 'undefined')) {

        console.log("Issue: " + IssueText + " --- mileage: " + IssueMileage);

        if (carInDB) { //If car is in db, add issue, else car is not in db, Create new Car .post, with issue given

          var newIssue = {
            "issues": [{
              "issueName": IssueText,
              "mileage": IssueMileage
            }]
          };

          console.log("ID: " + $scope.issuesCar_id);

          $http.put('/cars/' + $scope.issuesCar_id, newIssue).then(function(response) {

            console.log("new Issue has been added");
            $scope.showAlert = true;

          }, function(error) { //Error occured on http.post
            console.log('Error: ' + error);
          });

        } // end if carInDB check //Works..
        else { // else create new car post request with issue data and name.

          console.log("Car isn't in DB so making new entry into db");

          var newCar = {
            name: carSelected,
            issues: [{
              issueName: IssueText,
              mileage: IssueMileage
            }]
          };

          console.log(newCar);

          $http.post('/cars', newCar)
            .then(function(response) {

              $scope.showAlert = true;
              console.log("Successfully Created a new Car in DB");

            }, function(error) { //Error occured on http.post
              console.log('Error: ' + error);
            });

        } //end else

        $scope.resetModal(); //Resets modals input to default placeholderss

        $scope.getCarData($scope.car);
      } else {

        console.log("Invalid Form");
        $scope.resetModal(); //Resets modals input to default placeholderss


      }

    }; //End AddNewIssue

    $scope.upvote = function(issue) {
      console.log(issue._id);

    //   $http({                                  ALTERNATE WAY OF $HTTP (also works)
    //     method: 'PUT',
    //     url: '/cars/' + $scope.issuesCar_id + '/issue/' + issue._id + '/upvote',
    // })
    //   .success(function(data){
    //   console.log("upvoted");
    //   issue.disabled = true;
    // });

          return $http.put('/cars/' + $scope.issuesCar_id + '/issue/' + issue._id + '/upvote', null).then(function(response) {

            console.log("upvoted");
            issue.disabled = true;
            issue.up = issue.up + 1;
            // $scope.getCarData($scope.car); CAUSE OF PROBLEM //updates view with new car data  

          }, function(error) { //Error occured on http.post
            console.log('Error: ' + error);
          });

    }

    $scope.downvote = function(issue) {
      console.log(issue._id);

      return $http.put('/cars/' + $scope.issuesCar_id + '/issue/' + issue._id + '/downvote', null).then(function(response) {

        console.log("downvoted");
        //$scope.getCarData($scope.car);
        issue.disabled = true;
        issue.down = issue.down - 1;


      }, function(error) { //Error occured on http.post
        console.log('Error: ' + error);
      });
    }

    // get all the makes when site loads
    $http.get('https://api.edmunds.com/api/vehicle/v2/makes?&fmt=json&api_key=h6vybwk6ujptu6xcreuvajk9&view=full')
      .then(function(response) {
        $scope.makes = response.data.makes;
        $scope.resetDropDown();
      }, function(error) {
        $scope.error1 = JSON.stringify(error);
      });

    // for selected make - get all the models.
    $scope.getModels = function(makeName) {
      console.log(makeName);

      $http.get('https://api.edmunds.com/api/vehicle/v2/' + makeName + '/models?fmt=json&api_key=h6vybwk6ujptu6xcreuvajk9&view=full')
        .then(function(response) {
          console.log(response.data.models);
          $scope.models = response.data.models;

        }, function(error) {
          $scope.error2 = JSON.stringify(error);
        });
    };

    $scope.getYears = function(makeModels, makeName) {
      console.log(makeName + ' ' + makeModels);
      $scope.resetCar();
      $scope.resetYears();
      if (makeModels != null)
        $http.get('https://api.edmunds.com/api/vehicle/v2/' + makeName + '/' + makeModels + '/years?&fmt=json&api_key=h6vybwk6ujptu6xcreuvajk9')
        .then(function(response) {
          console.log(response.data.years);
          $scope.years = response.data.years;
          console.log($scope.years);

        }, function(error) {
          $scope.error3 = JSON.stringify(error);
        });
    };

    //get trim styles 
    $scope.getStyles = function(makeModels, makeName, makeYears) {
      console.log(makeYears + ' ' + makeName + ' ' + makeModels);
      $scope.resetCar();
      if (makeModels != null || makeYears != null)
        $http.get('https://api.edmunds.com/api/vehicle/v2/' + makeName + '/' + makeModels + '/' + makeYears + '/styles?&fmt=json&api_key=h6vybwk6ujptu6xcreuvajk9')
        .then(function(response) {
          console.log(response.data.styles);
          $scope.styles = response.data.styles;
          console.log($scope.styles);

        }, function(error) {
          $scope.error4 = JSON.stringify(error);
        });
    };

    $scope.checkSelection = function(makeModels, makeName, makeYears) {
      if (makeModels === null || makeName === null || makeYears === null)
        return false;
      else
        return true;
    }


    //get cars full name to display
    $scope.getCar = function(makeModels, makeName, makeYears, makeStyles) {
      $scope.car = makeYears + ' ' + makeName + ' ' + makeModels + ' ' + makeStyles;
      $scope.getCarData($scope.car);
      console.log($scope.car); // Car's Full Name Ex: 2011 Mitsubishi Lancer Evolution GSR 4dr Sedan AWD (2.0L 4cyl Turbo 5M)
    }; //end getCar

    $scope.resetDropDown = function() {

      $scope.years = "";
      $scope.styles = "";
      $scope.car = "";
    }
    $scope.resetCar = function() {
      $scope.car = "";
    }
    $scope.resetYears = function() {
      $scope.years = "";
    }
    $scope.resetModal = function() {
      $scope.IssueText = null;
      $scope.IssueMileage = null;
    }

  }
]); //end carController