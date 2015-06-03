var app = angular.module('flapperNews', ['ngSanitize', 'ui.select','ui.router','ui.bootstrap','dialogs.main','ngAutocomplete','uiGmapgoogle-maps','mwl.calendar']);


app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

$stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/templates/home.html',
      controller: 'MainCtrl',
      resolve: {
        viajePromise: ['viajes', function(viajes){
        return viajes.getAll();
        }]
      }
  })
  $urlRouterProvider.otherwise('home');
    
  $stateProvider
    .state('viajes', {
      url: '/viajes/{id}',
      templateUrl: '/templates/viajes.html',
      controller: 'ViajesCtrl',
      resolve: {
          viaje: ['$stateParams', 'viajes', function($stateParams, viajes) {
          return viajes.get($stateParams.id);
        }]
      }
  });

  $stateProvider
  .state('createViaje', {
    url: '/createViaje',
    templateUrl: '/templates/createViaje.html',
    controller: 'NewViajeCtrl',
    resolve: {
        //viaje: {}
    }
  });


  $stateProvider
    .state('detalleCiudad', {
      url: '/ciudad/{idc}',
      templateUrl: '/templates/detalle_ciudad.html',
      controller: 'DetalleCiudadCtrl',
      resolve: {
          ciudad: ['$stateParams', 'viajes', function($stateParams, viajes) {
            //var currentViaje = viajes.get($stateParams.idv);
            //var indiceDeLaCiudad = currentViaje.ciudades.map(function(el){return el._id;}).indexOf($stateParams.idc);
          return viajes.getCiudad($stateParams.idc);//currentViaje.ciudades[indiceDeLaCiudad];
        }]
      }
  });


  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: '/templates/login.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'auth', function($state, auth){
        if(auth.isLoggedIn()){
          $state.go('home');
        }
      }]
  });

  $stateProvider   
    .state('register', {
      url: '/register',
      templateUrl: '/templates/register.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'auth', function($state, auth){
        if(auth.isLoggedIn()){
          $state.go('home');
        }
      }]
  });
}
]);