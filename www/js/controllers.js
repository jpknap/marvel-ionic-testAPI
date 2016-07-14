angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });


})


//consulta de todos los comics http://gateway.marvel.com:80/v1/public/comics?format=comic&formatType=comic&limit=20&offset=0&apikey=c0ca1b116a2c6df7a2886c89801e4a80&hash=aaa17a9a11a4832c57774f3d2a36497e&ts=1468431064
.controller('PlaylistsCtrl', function($scope, $http,$ionicPopup) {
  $scope.busTitle="";
  $scope.busYear ="";
  $scope.callAPI = function(){
    $http.get('http://gateway.marvel.com:80/v1/public/comics?format=comic&formatType=comic&limit=20&offset=0&apikey=c0ca1b116a2c6df7a2886c89801e4a80&hash=aaa17a9a11a4832c57774f3d2a36497e&ts=1468431064'+$scope.busTitle+$scope.busYear)
      .success(function(data, status, headers,config){
        $scope.cantidad = data.data.total;
        $scope.comics = data.data.results; // for UI
        var offSetVar=1;
        $scope.loadMore = function() {

            $http.get('http://gateway.marvel.com:80/v1/public/comics?format=comic&formatType=comic&limit=20&offset='+offSetVar*20+'&apikey=c0ca1b116a2c6df7a2886c89801e4a80&hash=aaa17a9a11a4832c57774f3d2a36497e&ts=1468431064'+$scope.busTitle+$scope.busYear)
            .success(function(data, status, headers,config){
              for (var i = 0 ; data.data.results.length > i; i++){
                $scope.comics.push(data.data.results[i]);
              }
              offSetVar++;
            })

          $scope.$broadcast('scroll.infiniteScrollComplete');


        }
        $scope.canWeLoadMoreContent = function() {
           return ($scope.comics.length > $scope.cantidad) ? false : true;
         }

         if($scope.cantidad<=0){
             $scope.showAlert();
         }
      })
      .error(function(data, status, headers,config){
        console.log('data error');
      })
      .then(function(result){
        things = result.data;
      });
  };
    $scope.searchFiltre= function(varTitle,varYear){
      $scope.busTitle="";
      $scope.busYear="";
      if(varTitle){
        $scope.busTitle ="&titleStartsWith="+varTitle

      }
      if(varYear ){
        $scope.busYear ="&startYear="+varYear
       }
      $scope.callAPI();
    }

    $scope.showAlert = function() {
      $ionicPopup.alert({
        title: 'No se encontraron cohincidencias',
        content: 'Lo sentimos, pero no se encontraron cohincidencias con lo añadido en el filtro'
      }).then(function(res) {
        //console.log('Test Alert Box');
      });
    };

    $scope.callAPI();

})

.controller('PlaylistCtrl', function($scope, $stateParams,$http) {
 var idComic = $stateParams.comicId;
 $http.get('http://gateway.marvel.com:80/v1/public/comics/'+idComic+'?apikey=c0ca1b116a2c6df7a2886c89801e4a80&hash=aaa17a9a11a4832c57774f3d2a36497e&ts=1468431064')
   .success(function(data, status, headers,config){
     $scope.comic = data.data.results[0];
   })
   .error(function(data, status, headers,config){
     console.log('data error');
   })
   .then(function(result){
     things = result.data;
   });


});
