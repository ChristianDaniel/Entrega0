 
app.controller('NewViajeCtrl', [
'$scope',
'viajes',
'auth',
'dialogs',
function($scope, viajes, auth, dialogs){

   $scope.markerList = []
   $scope.result = '';
    $scope.options = {
      types: '(cities)',
      watchEnter: true
    };    
    $scope.details = '';


  $scope.ciudades = [];
  $scope.isLoggedIn = auth.isLoggedIn;
  
  $scope.gotoHomePage = function(){
    viajes.gotoHomePage()
  };

  $scope.addViaje = function(){
    if(!$scope.fecha_inicio || $scope.fecha_inicio === '' || !$scope.fecha_fin || $scope.fecha_fin === '' ) { return; }
    
    if(moment($scope.fecha_fin).isBefore($scope.fecha_inicio)) { 
        dlg = dialogs.notify('No puedes comenzar un viaje si ya lo has terminado!','La fecha de fin no puede ser menor a la fecha de fin.');
        return;
    } 

    destinos = [];
    $scope.ciudades.forEach(function(ciudad) {
        destinos.push(ciudad.nombre);
      });

    viajes.create({
      nombre: $scope.nombre,
      usuario: "",
      fecha_inicio: $scope.fecha_inicio,
      fecha_fin: $scope.fecha_fin,
      ciudades: destinos
    });	
    $scope.nombre = '';
    $scope.fecha_inicio = '';
    $scope.fecha_fin = '';
    $scope.ciudad = '';
    $scope.ciudades = [];
  };

  $scope.openFrom = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.openedFrom = true;
  };

  $scope.openUntil = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.openedUntil = true;
  };
}
]);