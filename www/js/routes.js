angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('tabsController.availableCars', {
    url: '/page2',
    views: {
      'tab1': {
        templateUrl: 'templates/availableCars.html',
        controller: 'availableCarsCtrl'
      }
    }
  })

  .state('tabsController.uploadAds', {
    url: '/page3',
    views: {
      'tab2': {
        templateUrl: 'templates/uploadAds.html',
        controller: 'uploadAdsCtrl'
      }
    }
  })

  .state('tabsController.uploadCars', {
    url: '/page4',
    views: {
      'tab3': {
        templateUrl: 'templates/uploadCars.html',
        controller: 'uploadCarsCtrl'
      }
    }
  })

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('findCar', {
    url: '/page7',
    templateUrl: 'templates/findCar.html',
    controller: 'findCarCtrl'
  })

  .state('contactUs', {
    url: '/page9',
    templateUrl: 'templates/contactUs.html',
    controller: 'contactUsCtrl'
  })

  .state('support', {
    url: '/page10',
    templateUrl: 'templates/support.html',
    controller: 'supportCtrl'
  })

  .state('login', {
    url: '/page11',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('signup', {
    url: '/page12',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
  })

  .state('logout', {
    url: '/page13',
    templateUrl: 'templates/logout.html',
    controller: 'logoutCtrl'
  })

$urlRouterProvider.otherwise('/page11')

});