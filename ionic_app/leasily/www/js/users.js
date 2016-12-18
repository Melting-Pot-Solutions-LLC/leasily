/* !!! IMPORTANT: Rename "mymodule" below and add your module to Angular Modules above. */

angular.module('users', [])

.service('Users_from_database', ['$firebaseArray', function($firebaseArray ){
    
    
    var ref_users = firebase.database().ref().child('users');
    var users = $firebaseArray(ref_users); //real time array synced to the Firebase 
    
    
    // users = 
    // [
    //     {
    //         'name': 'Steve Rubin',
    //         'pictureURL': 'https://d30y9cdsu7xlg0.cloudfront.net/png/17241-200.png',
    //         'items_lending': 20,
             
    //     },
    //     {
    //         'name': 'Nirnay Patel',
    //         'pictureURL': 'https://d30y9cdsu7xlg0.cloudfront.net/png/17241-200.png',
    //         'items_lending': 15,
             
    //     }
        
    // ];
    
    
    var users2 = 
    {
      'users': users  
    };
    
    return users2;

}]);

