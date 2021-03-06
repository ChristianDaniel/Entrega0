app.factory('viajes', ['$http', 'auth', function($http, auth){
  var o = {
    viajes: []
  };

  o.getAll = function() {
    return $http.get('/viajes').success(function(data){
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

  o.get = function(id) {
  return $http.get('/viajes/' + id).then(function(res){
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
