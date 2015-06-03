app.controller('ViajesCtrl', [
'$scope',
'viajes',
'viaje',
'dialogs',
'auth',
function($scope, viajes, viaje, dialogs, auth){
  $scope.viaje = viaje;
  $scope.viajes = viajes.viajes;
  
  $scope.result = '';
  $scope.options = {
    types: '(cities)',
    watchEnter: true
  };    
  $scope.details = '';

  $scope.cantidadDeDias = null;
  $scope.isCollapsed = true;


  $scope.isLoggedIn = auth.isLoggedIn;

  
  $scope.gotoHomePage = function(){
    viajes.gotoHomePage()
  };

  var cantidadDeCiudades = $scope.viaje.ciudades.length
  var currentLat = 0
  var currentLong = 0
  var currentZoom = 1
  if(cantidadDeCiudades != 0){
    currentLat = parseFloat($scope.viaje.ciudades[cantidadDeCiudades-1].latitude);
    currentLong = parseFloat($scope.viaje.ciudades[cantidadDeCiudades-1].longitude);
    currentZoom = 10;
  } 

  $scope.map = { center: { latitude: currentLat, longitude: currentLong }, zoom: currentZoom };

  mostrarActividad();

  $scope.agregarCiudad = function(){
    var ciudadNro = $scope.viaje.ciudades.length+1;
    var ciudadLat = parseFloat($scope.details.geometry.location.A)
    var ciudadLong = parseFloat($scope.details.geometry.location.F)

    //Sacar country short name 
    atributos = $scope.details.address_components;
    var country_short_name= "";
    atributos.forEach(function(data) {
        if(data.types.indexOf('country') > -1){
        country_short_name = data.short_name; };
      });

    viajes.agregarCiudad($scope.viaje._id,{
      nombre: $scope.nombre_ciudad,
      cantidadDeDias: $scope.cantidadDeDias,
      latitude: ciudadLat,
      longitude: ciudadLong,
      message: "Destino numero " + ciudadNro,
      pais: country_short_name,
      puntosDeInteres: [],
      hotel: {}

    }).success(function(ciudad){
       $scope.viaje.ciudades.push(ciudad);
       $scope.map = { center:{ latitude: ciudadLat, longitude: ciudadLong }, zoom: 10 };
       $scope.nombre_ciudad = "";
       mostrarActividad();
    })
  }

  $scope.addNewChoice = function() {
  if(! ($scope.nombre_ciudad==="") )

    {
      var newItemNo = $scope.viaje.ciudades.length+1;

      addressComponent = $scope.details.address_components
      addressComponent.forEach(function(data) {
        if(data.types.indexOf('administrative_area_level_1') > -1){
        city_short_name = data.short_name; };
      });
       console.log(city_short_name);


      $scope.viaje.ciudades.push({'id':'ciudad'+newItemNo,
                            'nombre': $scope.nombre_ciudad,
                            'latitude': parseFloat($scope.details.geometry.location.A),
                            'longitude': parseFloat($scope.details.geometry.location.F),
                            'city_short_name': city_short_name, 
                            'message': "Destino numero " + newItemNo });
      
      $scope.nombre_ciudad = "";
      $scope.guardarEdicionDeViaje();
    }
  $scope.map = { center:{ latitude: parseFloat($scope.details.geometry.location.A), longitude: parseFloat($scope.details.geometry.location.F) }
    , zoom: 10 };
  };

  //$scope.borrarCiudad = function(ciudad) {
  //  dlg = dialogs.confirm('Por favor confirme','Esta seguro que quiere borrar la ciudad: ' + ciudad.nombre + '??');
  //  dlg.result.then(function(btn){
  //    index = $scope.viaje.ciudades.indexOf(ciudad);
  //    if (index > -1) $scope.viaje.ciudades.splice(index, 1);
  //    $scope.guardarEdicionDeViaje();
  //  },function(btn){
  //    //agregar mensaje de cancelación
  //  }); 
  //
  //};

  $scope.borrarCiudad = function(ciudad) {
    dlg = dialogs.confirm('Por favor confirme','Esta seguro que quiere borrar la ciudad: ' + ciudad.nombre + '??');
    dlg.result.then(function(btn){
      var indiceDelViaje = viajes.viajes.map(function(el){return el._id;}).indexOf($scope.viaje._id);
      var indiceDeLaCiudad = viaje.ciudades.indexOf(ciudad);
      viajes.borrarCiudad($scope.viaje._id, indiceDelViaje,ciudad._id,indiceDeLaCiudad)
                          .success(function(data){
                                    $scope.viaje.ciudades.splice(indiceDeLaCiudad,1);
                                    $scope.guardarEdicionDeViaje();
      });
    },function(btn){
      //agregar mensaje de cancelación
    }); 

  };

  $scope.guardarEdicionDeViaje = function(){
    viajes.guardarEdicionDeViaje($scope.viaje._id,{
      nombre: $scope.viaje.nombre,
      fecha_inicio: $scope.viaje.fecha_inicio,
      fecha_fin: $scope.viaje.fecha_fin,
      ciudades: $scope.viaje.ciudades
    });
  }








///////////////////////////////////////////// CALENDAR


function mostrarActividad(){
   $scope.events = [];
   var coloresDeActividad = ['important', 'warning', 'info', 'inverse', 'success','special']
   var currentFecha = $scope.viaje.fecha_inicio;
   var currentIndiceDeActividad = 0;
   for  (var i = 0; i < $scope.viaje.ciudades.length; i++){
    var currentCiudad = $scope.viaje.ciudades[i];
    var currentFechaFin = moment(moment(currentFecha).add(currentCiudad.cantidadDeDias, 'days')).format('L');
    var currentColorDeActividad = coloresDeActividad[currentIndiceDeActividad];
    if(currentIndiceDeActividad > coloresDeActividad.length) currentIndiceDeActividad = 0;
    else currentIndiceDeActividad++;
    $scope.events.push({
      title: currentCiudad.nombre,
      type: currentColorDeActividad,
      startsAt: currentFecha,
      endsAt: currentFechaFin,
      editable: false, // If edit-event-html is set and this field is explicitly set to false then dont make it editable
      deletable: false, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable
      incrementsBadgeTotal: true //If set to false then will not count towards the badge total amount on the month and year view
    });
    currentFecha = currentFechaFin;
  }
}
$scope.calendarView = 'month';
$scope.calendarDay = Date();
//$scope.calendarTitle = 'month';

}
]);