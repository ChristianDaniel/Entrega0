

app.controller('DetalleCiudadCtrl', [
'$scope',
'$modal',
'viajes',
'ciudad',
'dialogs',
'auth',



function($scope, $modal, viajes, ciudad, dialogs, auth){
  //$scope.viaje = viaje; 
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.punto_interes = '';

  $scope.ciudad = ciudad;

  
  var bounds_ciudad= new google.maps.LatLngBounds();
  var point = new google.maps.LatLng($scope.ciudad.latitude,$scope.ciudad.longitude);
  bounds_ciudad.extend(point);

  $scope.result = '';
  $scope.options = {
    types: 'establishment',
    bounds: bounds_ciudad,
    country: $scope.ciudad.pais,
    watchEnter: true
  };    


  $scope.details = '';





   centrarMapa = function(lat,longg) {

    $scope.map = { center:{ latitude: lat, 
                            longitude: longg }, zoom: 15 };
   }

   $scope.addNewChoice = function() {
  if(! ($scope.punto_interes==="") )

    {

      informacion = {}
      informacion.nombre = $scope.punto_interes;
      informacion.direccion = $scope.details.formatted_address;

      latt = parseFloat($scope.details.geometry.location.A);
      longg = parseFloat($scope.details.geometry.location.F);

      informacion.latitude = latt;
      informacion.longitude = longg;

      if($scope.details.rating)
         { informacion.calificacion = $scope.details.rating}
      if($scope.details.website)
        { informacion.website = $scope.details.website }


      $scope.ciudad.puntosDeInteres.push(informacion);

      $scope.guardarEdicionDeCiudad();
      
      centrarMapa(latt,longg);

      $scope.punto_interes = "";

 
    }
  
  };

  $scope.guardarEdicionDeCiudad = function(){
    viajes.guardarEdicionDeCiudad($scope.ciudad._id,{
      puntosDeInteres: $scope.ciudad.puntosDeInteres
    });
  }

  $scope.borrarPuntoDeInteres = function(punto_interes) {
    dlg = dialogs.confirm('Por favor confirme','¿Esta seguro que quiere borrar el punto de interes: ' + punto_interes.nombre + '?');
    
    dlg.result.then(function(btn){
      
      index = $scope.ciudad.puntosDeInteres.indexOf(punto_interes);
      if (index > -1) $scope.ciudad.puntosDeInteres.splice(index, 1);
      var cant_puntos = $scope.ciudad.puntosDeInteres.length;
      
      if(cant_puntos>0) 
        { 
          var ultimo_punto = $scope.ciudad.puntosDeInteres[$scope.ciudad.puntosDeInteres.length-1]
          latt = ultimo_punto.latitude;
          longg = ultimo_punto.longitude; }
      else 
        {  latt = $scope.ciudad.latitude
           longg = $scope.ciudad.longitude }
      
      $scope.guardarEdicionDeCiudad();
      centrarMapa(latt,longg);

    },function(btn){
      //agregar mensaje de cancelación
    }); 

  };
  
  $scope.gotoHomePage = function(){
    viajes.gotoHomePage()
  };



  var cantidadDePuntos = $scope.ciudad.puntosDeInteres.length
  var currentLat = $scope.ciudad.latitude
  var currentLong = $scope.ciudad.longitude

  if(cantidadDePuntos != 0){
    currentLat = parseFloat($scope.ciudad.puntosDeInteres[cantidadDePuntos-1].latitude);
    currentLong = parseFloat($scope.ciudad.puntosDeInteres[cantidadDePuntos-1].longitude);

  } 

  centrarMapa(currentLat,currentLong);




////////////////////////////////////////////////////// PROBEMOS BUSCAR EL HOTEL
var map;
var infowindow;
$scope.hoteles = [];
$scope.hotel = {};


function initialize() {
  

  map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: point,
    zoom: 15
  });

  var request = {
    location: point,
    radius: 500,
    types: ['lodging']
  };

  infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  $scope.service_googlemaps = service;
  service.nearbySearch(request, callback);
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      savePlace(results[i]);
         
    }

  }

};

function obtenerDetalles(details) {

  var informacion = {};
  informacion.nombre = details.name;
  informacion.id = details.place_id;
  informacion.direccion = details.formatted_address;
  if(details.formatted_phone_number)
    { informacion.numero_telefono = details.formatted_phone_number}
  if(details.international_phone_number)
    { informacion.numero_telefono_internacional = details.international_phone_number}
  if(details.rating)
    { informacion.calificacion = details.rating}
  if(details.website)
    { informacion.website = details.website }
  if(details.reviews)
    { 
      var comentarios = [];
      for  (var i = 0; i < details.reviews.length; i++)
        {
          comentario = details.reviews[i];
          if (! (comentario.text === ""))
          {
            var c = {};
            c.autor = comentario.author_name;
            c.raiting = comentario.rating;
            c.texto = comentario.text;
            comentarios.push(c);
          }
        }
      informacion.comentarios_huespedes = comentarios;   

        
     }
  return informacion;
}



function savePlace(place) {
  var placeLoc = place.geometry.location;

   var request = { reference: place.reference };

  $scope.actual_place = place

  $scope.service_googlemaps.getDetails(request, function(details, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {

      informacion = obtenerDetalles(details);
      $scope.hoteles.push(informacion);

      if ($scope.ciudad.hotelReference){
        if(informacion.nombre==$scope.ciudad.hotelReference) $scope.hotel.selected = informacion;
        }
     }
      
    });
}



initialize();

// MODAL

 $scope.openPunto = function (punto,size) {

    var modalInstance = $modal.open({
      animation: true,
      templateUrl: 'modalDetalles.html',
      controller: 'DetalleCtrl',
      size: size,
      resolve: {
        punto_seleccionado: function () {
          return punto
          }
      }
    });


};

  $scope.$watch('hotel.selected', function() {

       if($scope.hotel.selected) {
     
      viajes.guardarEdicionDeCiudad($scope.ciudad._id,{
      hotelReference: $scope.hotel.selected.nombre });
    }
   });




}
]);

app.controller('DetalleCtrl', function ($scope, $modalInstance, punto_seleccionado) {

  $scope.punto = punto_seleccionado;

  $scope.isCollapsed = true;

  $scope.is_raiting = false;
  $scope.max = 5;
  $scope.isReadonly = true;

  if ( $scope.punto.numero_telefono) $scope.is_numero_telefono = true;
  else $scope.is_numero_telefono = false;
 
  if ( $scope.punto.calificacion) {
    $scope.is_raiting = true;
    $scope.rate = $scope.punto.calificacion; 
    $scope.percent = (100 * $scope.rate) / $scope.max;
  }
  else $scope.is_raiting = false; 

  if ($scope.punto.direccion) $scope.is_direccion = true;
  else $scope.is_direccion = false; 

  if ($scope.punto.numero_telefono_internacional) $scope.is_numero_telefono_internacional = true;
  else $scope.is_numero_telefono_internacional = false; 

  if ($scope.punto.website) $scope.is_website = true;
  else $scope.is_website = false;

  if ($scope.punto.comentarios_huespedes) $scope.is_comentarios_huespedes = true;
  else $scope.is_comentarios_huespedes = false;  


     $scope.submit = function() {
         console.log($scope.percent) ; //null
     }

   

  
 // buildIWContent($scope.hotel);

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});



app.controller('RatingDeeeemoCtrl', function ($scope) {

   
    $scope.myRate = 0;

     $scope.submit = function() {
         console.log($scope.percent) ; //null
     }

     $scope.rate = 1;
     $scope.max = 5;
     $scope.isReadonly = true;
     $scope.percent = 20;

      $scope.hoveringOver = function(value,object) {
        console.log('hoveringOver', value);
        $scope.overStar = value;
        $scope.percent = (100 * $scope.overStar) / $scope.max;
      };
      
       $scope.hoveringLeave = function(rate) {
         console.log('hoveringLeave',  $scope.rate);
        
       $scope.percent = (100 * $scope.rate) / $scope.max;
      };
    });









