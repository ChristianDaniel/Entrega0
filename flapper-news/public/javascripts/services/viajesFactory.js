app.factory('viajes', ['$http', 'auth', function($http, auth){
  var o = {
    viajes: []
  };

  o.getAll = function() {
    return $http.get('/viajes',{
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      angular.copy(data, o.viajes);
    });
  };
  
  o.create = function(viaje) {
  return $http.post('/createViaje', viaje, {
    headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      o.viajes.push(data);
      window.location='/#/home'
    });
  };

  o.borrarViaje = function(id,index) {
    return $http.delete('/viajes/'+ id, {
    headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      o.viajes.splice(index,1);
    });
  };

  o.guardarEdicionDeViaje = function(id, viaje){
    return $http.put('/viajes/'+id, viaje, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    });
  }
  //CIUDAD
  o.agregarCiudad = function(id, ciudad) {
    return $http.post('/viajes/' + id + '/ciudad', ciudad, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    });
  };

  o.guardarEdicionDeCiudad = function(id, ciudad){
    console.log("aca estoy")
    return $http.put('/ciudad/'+id, ciudad, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    });
  }
  o.borrarCiudad = function(viajeId,viajeIndex,ciudadId,ciudadIndex) {
    return $http.delete('/ciudad/' + ciudadId, {
    headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      console.log("deleeeeeeeeee ciudades " + ciudadIndex)

    });
  };
  //
  o.get = function(id) {
  return $http.get('/viajes/' + id).then(function(res){
      return res.data;
    });
  };
  o.getCiudad = function(id) {
  return $http.get('/ciudad/' + id).then(function(res){
      return res.data;
    });
  };
 
  o.gotoHomePage = function(){
    window.location='/#/home'
  }
  
  o.gotoCreateViajePage = function(){
    window.location='/#/createViaje' 
  }

  return o;
}
]);
