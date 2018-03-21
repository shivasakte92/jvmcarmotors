angular.module('app.controllers', ['ngCordova'])

.controller('menuCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {

}])

.controller('uploadAdsCtrl', ['$scope', '$stateParams', '$state', '$cordovaImagePicker', '$cordovaFile', '$timeout', '$ionicPlatform', '$q', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state, $cordovaImagePicker, $cordovaFile, $timeout, $ionicPlatform, $q) {

  var result2 = [];
  var sakte2 = [];
  var ssb2 = [];

  function loadData2(){
    firebase.database().ref('assets/ads').on('value', function(_snapshot){

      var ballan2;
      result2 = [];
      sakte2 = [];
      ssb2 = [];

      _snapshot.forEach(function (childSnapshot){
        var element = childSnapshot.val();
        element.id = childSnapshot.key;
        result2.push(element);
      });

$timeout(function(){
  $scope.searchVehicle2   = ''; 
  $scope.assetCollection3 = result2;
console.log($scope.assetCollection3);

$state.transitionTo($state.current, $stateParams, {
  reload: true,
  inherit: false,
  notify: true
});
}, 1000);

});

  }

  loadData2();

  function saveToFirebase(_imageBlob, _filename){

    return $q(function (resolve, reject){

      var storageRef = firebase.storage().ref();

      var uploadTask = storageRef.child(_filename).put(_imageBlob);

      uploadTask.on('state_changed', function (snapshot){

      }, function(error){

        alert(error.message)
        reject(error)

      }, function(){

        downloadURL = uploadTask.snapshot.downloadURL;
        resolve(uploadTask.snapshot)

      });

    });
  }

  function saveReferenceInDatabase(_snapshot){
    var ref = firebase.database().ref('assets/ads');

    dataToSave = {
      'URL': _snapshot.downloadURL,
      'name':_snapshot.metadata.name,
      'owner':firebase.auth().currentUser.uid,
      'email':firebase.auth().currentUser.email,
      'lastUpdated':new Date().getTime(),
    };

    return ref.push(dataToSave).catch(function(_error){
      alert("Error saving to Assets"+_error.message);
    })

  }

$scope.getImage = function(){

  var options = {
    maximumImagesCount: 1,
    width: 800,
    height: 800,
    quality: 80
  };

  var path;
  var fileName = [];

  $cordovaImagePicker.getPictures(options)
  .then(function (results) {

    for(var j=0; j < results.length; j++){
      fileName[j] = results[j].replace(/^.*[\\\/]/, '')
    }

    if($ionicPlatform.is("android")){
      path = cordova.file.cacheDirectory;
    }else {
      path = cordova.file.tempDirectory
    }

    fileName.forEach(function(fileName){

      $cordovaFile.readAsArrayBuffer(path, fileName)
      .then(function(response){
        var imageBlob = new Blob([response], {type:"image/jpeg"});
        console.log(imageBlob);
        saveToFirebase(imageBlob, fileName)
        .then(function(_responseSnapshot){
          console.log(_responseSnapshot);
          saveReferenceInDatabase(_responseSnapshot);
        })
      })
    })
  }).then(function (_response){
    alert("Saved Successfully")
  }, function(error) {
// error getting photos
});

}

}])

.controller('availableCarsCtrl', ['$scope', '$stateParams', '$state', '$cordovaImagePicker', '$cordovaFile', '$timeout', '$ionicSlideBoxDelegate', '$ionicModal',  '$ionicScrollDelegate', '$ionicLoading', '$window', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state, $cordovaImagePicker, $cordovaFile, $timeout, $ionicSlideBoxDelegate, $ionicModal, $ionicScrollDelegate, $ionicLoading, $window) {

  $scope.show = function() {
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
  };

  $scope.hide = function(){
    $ionicLoading.hide();
  };

  $scope.show($ionicLoading);

  var result = [];
  var sakte = [];
  var ssb = [];

  function loadData(){
    firebase.database().ref('assets/ssb').on('value', function(_snapshot){

      var ballan;
      result = [];
      sakte = [];
      ssb = [];

      _snapshot.forEach(function (childSnapshot){
        var element = childSnapshot.val();
        element.id = childSnapshot.key;
        result.push(element);
      });

      ssb.push(result[0]);

      if(result!=0){
        ballan = result[0].numplate;
        sakte.push(ballan);
      }
      for(var i=0; i < result.length; i++){
        if(ballan!=result[i].numplate){
          ssb.push(result[i]);
          ballan = result[i].numplate;
          sakte.push(ballan);
        }
      }

      $timeout(function(){
        $scope.searchVehicle   = ''; 
        $scope.assetCollection = result;
        $scope.assetCollection2 = ssb;

$state.transitionTo($state.current, $stateParams, {
  reload: true,
  inherit: false,
  notify: true
});
}, 1000);
      $scope.hide($ionicLoading);

    });

  }

  loadData();

$scope.numberOfItemsToDisplay = 3; // Use it with limit to in ng-repeat
$scope.addMoreItem = function(done) {
  $timeout(function() {
    if ($scope.assetCollection2.length > $scope.numberOfItemsToDisplay)
$scope.numberOfItemsToDisplay += 3; // load number of more items
$scope.$broadcast('scroll.infiniteScrollComplete')
}, 1000);
}

$scope.showImages = function(index) {
  $scope.activeSlide = 0;

  var vinoth; 
  vinoth = sakte[index];

  var jana = [];

  for(var i=0; i < result.length; i++){
    if(vinoth==result[i].numplate){
      jana.push(result[i]);
    }
  }

  index = 0;

  $scope.assetCollection3 = jana;

  $scope.showModal('templates/imagepopover.html');
}
$scope.showModal = function(templateUrl) {
  $ionicModal.fromTemplateUrl(templateUrl, {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
    $scope.modal.show();
  });
}    
// Close the modal
$scope.closeModal = function() {
  $scope.modal.hide();
  $scope.modal.remove()
};

$scope.deleteitem = function(numplate){

  var retVal = confirm("Are you sure you want to delete this vehicle?");
  if( retVal == true ){

    var resulttobedeleted = [];

    for(var i=0; i < result.length; i++){
      if(numplate == result[i].numplate){
        resulttobedeleted.push(result[i]);
      }
    }

    for(var i=0; i<resulttobedeleted.length; i++){
      firebase.database().ref('assets/ssb').child(resulttobedeleted[i].id).remove(function(error){
        if (error) {
          console.log("Error:", error);
        } else {
          console.log("Removed successfully!");
        }
      });
    }

    var storage = firebase.storage();
    var storageRef = storage.ref();

    for(var i=0; i<resulttobedeleted.length; i++){
// Create a reference to the file to delete
var desertRef = storageRef.child(resulttobedeleted[i].name);
// Delete the file
desertRef.delete().then(function() {

}).catch(function(error) {
// Uh-oh, an error occurred!
});

}

}
else{

}
}

$scope.doRefresh = function() {
  $timeout( function() {

    $scope.$broadcast('scroll.refreshComplete');

  }, 1000);

};

$scope.allImages = [{
  'src' : 'img/pic1.jpg'
}, {
  'src' : 'img/pic2.jpg'
}, {
  'src' : 'img/pic3.jpg'
}];

var result2 = [];
var sakte2 = [];
var ssb2 = [];
var allImages2 = [];

function loadData2(){
  firebase.database().ref('assets/ads').on('value', function(_snapshot){

    var ballan2;
    result2 = [];
    sakte2 = [];
    ssb2 = [];
    $scope.allImages2 = [];

    _snapshot.forEach(function (childSnapshot){
      var element = childSnapshot.val();
      element.id = childSnapshot.key;
      result2.push(element);
    });

    for(var i=0; i < result2.length; i++){
      console.log(result2[i].URL);
      var ooh;
      ooh = result2[i].URL;
      $scope.allImages2.push({'URL' : result2[i].URL});
    }

    $timeout(function(){
      $scope.searchVehicle2   = ''; 
      $scope.assetCollection4 = result2;
      $state.transitionTo($state.current, $stateParams, {
        reload: true,
        inherit: false,
        notify: true
      });
    }, 1000);

});

}

loadData2();

for(var i=0; i < result2.length; i++){
  console.log(result2[i].URL);
  var ooh;
  ooh = result2[i].URL;
  allImages2.push(ooh);
}

$scope.image = [{
  src: 'img/dollar.png',
}];

$scope.image2 = [{
  src: 'img/meter.png',
}];

$scope.image3 = [{
  src: 'img/date.png',
}];

$scope.image4 = [{
  src: 'img/gear.png',
}];

}])

.controller('availableCars2Ctrl', ['$scope', '$stateParams',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('cartTabDefaultPageCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {

}])

.controller('uploadCarsCtrl', ['$scope', '$stateParams','$state', '$cordovaImagePicker', '$cordovaFile', '$ionicPlatform', '$q', '$timeout', '$window', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state, $cordovaImagePicker, $cordovaFile, $ionicPlatform, $q, $timeout, $window) {

  var numplate1, carmake1, carmodel1, caryear1, cc1, trans1, mileage1;

  function saveToFirebase(_imageBlob, _filename){

    return $q(function (resolve, reject){

      var storageRef = firebase.storage().ref();

      var uploadTask = storageRef.child(_filename).put(_imageBlob);

      uploadTask.on('state_changed', function (snapshot){

      }, function(error){

        alert(error.message)
        reject(error)

      }, function(){

        downloadURL = uploadTask.snapshot.downloadURL;
        resolve(uploadTask.snapshot)

      });

    });
  }

  function saveReferenceInDatabase(_snapshot){
    var ref = firebase.database().ref('assets/ssb');

    console.log(numplate1,carmake1,carmodel1,caryear1,cc1,trans1,mileage1,numowner1,lastowner1,deposit1,loanamt1,loanyear1,monthly1,price1,description1,location1);

    if(location1=='1'){

      var location2 = "Pandamaran";

    }else{

      var location2 = "Kg. Jawa";

    }

    dataToSave = {
      'URL': _snapshot.downloadURL,
      'name':_snapshot.metadata.name,
      'numplate':numplate1,
      'carmake':carmake1,
      'carmodel':carmodel1,
      'caryear':caryear1,
      'cc':cc1,
      'trans':trans1,
      'mileage':mileage1,
      'numowner':numowner1,
      'lastowner':lastowner1,
      'deposit':deposit1,
      'loanamt':loanamt1,
      'loanyear':loanyear1,
      'monthly':monthly1,
      'price':price1,
      'description':description1,
      'location':location2,
      'owner':firebase.auth().currentUser.uid,
      'email':firebase.auth().currentUser.email,
      'lastUpdated':new Date().getTime(),
    };

    console.log(dataToSave);

    return ref.push(dataToSave).catch(function(_error){
      alert("Error saving to Assets"+_error.message);
    })

  }

  $scope.carfolder = function(numplate,carmake,carmodel,caryear,cc,trans,mileage,numowner,lastowner,deposit,loanamt,loanyear,monthly,price,description,location){

    numplate1 = numplate;
    carmake1 = carmake;
    carmodel1 = carmodel;
    caryear1 = caryear;
    cc1 = cc;
    trans1 = trans;
    mileage1 = mileage;
    numowner1 = numowner;
    lastowner1 = lastowner;
    deposit1 = deposit;
    loanamt1 = loanamt;
    loanyear1 = loanyear;
    monthly1 = monthly;
    price1 = price;
    description1 = description;
    location1 = location;

  }

  $scope.getImage = function(){

    var options = {
      maximumImagesCount: 6,
      width: 800,
      height: 800,
      quality: 80
    };

    var path;
    var fileName = [];

    $cordovaImagePicker.getPictures(options)
    .then(function (results) {

      for(var j=0; j < results.length; j++){
        fileName[j] = results[j].replace(/^.*[\\\/]/, '')
      }

      if($ionicPlatform.is("android")){
        path = cordova.file.cacheDirectory;
      }else {
        path = cordova.file.tempDirectory
      }

      fileName.forEach(function(fileName){

        $cordovaFile.readAsArrayBuffer(path, fileName)
        .then(function(response){
          var imageBlob = new Blob([response], {type:"image/jpeg"});
          console.log(imageBlob);
          saveToFirebase(imageBlob, fileName)
          .then(function(_responseSnapshot){
            console.log(_responseSnapshot);
            saveReferenceInDatabase(_responseSnapshot);
          })
        })
      })
    }).then(function (_response){
      alert("Saved Successfully")
    }, function(error) {
// error getting photos
});

  }

  $scope.reset = function(){

scope.numplate = "";
scope.carmake = "";
scope.carmodel = "";
scope.caryear = "";
scope.cc = "";
scope.trans = "";
scope.mileage = "";
scope.numowner = "";
scope.lastowner = "";
scope.price = "";

}


}])

.controller('findCarCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('contactUsCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {

}])

.controller('supportCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {

}])

.controller('loginCtrl', ['$scope', '$stateParams', '$state', '$cordovaImagePicker', '$cordovaFile','$timeout','$ionicLoading',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state, $cordovaImagePicker, $cordovaFile, $timeout, $ionicLoading, $ionicSideMenuDelegate) {

//$ionicSideMenuDelegate = Apperyio.get("$ionicSideMenuDelegate"); 
//$ionicSideMenuDelegate.canDragContent(false); 

$scope.show = function() {
  $ionicLoading.show({
    template: '<p>Loading...</p><ion-spinner></ion-spinner>'
  });
};

$scope.hide = function(){
  $ionicLoading.hide();
};

$scope.loginEmail = function(cred) {
  $scope.show($ionicLoading);
//Email
firebase.auth().signInWithEmailAndPassword(cred.email,cred.password).then(function(result) {

  $state.go('tabsController.availableCars', {}, {location: "replace"});

  $scope.hide($ionicLoading);
}),
function(error) {
}
}

function logout(){

  firebase.auth().signOut().then(function() {

}).catch(function(error) {
// An error happened.
window.alert("Error!");
});

}

logout();

}])

.controller('signupCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {

}])
