angular.module('app.controllers', [])
  
.controller('itemsYouCanBorrowCtrl', ['$scope', '$stateParams', 'Items_from_database', 'Users_from_database', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, Items_from_database, Users_from_database) 
{

    $scope.items_to_borrow = Items_from_database.items;
    $scope.users = Users_from_database.users;
    var items_to_push = [];
    
    $scope.push_users = function()
    {
        for (var i = 0; i < $scope.users.length; i++)
        {
            var ref = firebase.database().ref('users/').child($scope.users[i].name);
            ref.update($scope.users[i]);
        }

    }
    
    $scope.push_items = function()
    {
        
        for (var i = 0; i < $scope.items_to_borrow.length; i++)
        {
            items_to_push.push($scope.items_to_borrow[i]);
            //delete items_to_push[i]['$$hashKey'];
        }
        //console.log(JSON.stringify($scope.items_to_borrow));
        
        
        for ( i = 0; i < $scope.items_to_borrow.length; i++)
        {
            //items_to_push.push($scope.items_to_borrow[i]);
            delete items_to_push[i]["$$hashKey"];
        }
        
        
        console.log(JSON.stringify(items_to_push));
        firebase.database().ref('things/').set(items_to_push);
        console.log('updating items');

    }
    
}])
   
.controller('itemsYouAreLendingCtrl', ['$scope', '$stateParams', 'Items_from_database', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, Items_from_database) {
    $scope.items_lending = Items_from_database.items;


}])
      
.controller('menuCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {

    $scope.logout = function()
    {
        firebase.auth().signOut().then(function() {
          // Sign-out successful.
          console.log("successfully signed out");
        }, function(error) {
          // An error happened.
          console.log("error siging out");
        });
    }

}])
   
.controller('loginCtrl', ['$scope', '$stateParams', '$rootScope', '$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $rootScope, $state) {

var provider = new firebase.auth.FacebookAuthProvider();

    $rootScope.user =
    {
        'name': '',
        'email': '',
        'profile_photo': 'https://d30y9cdsu7xlg0.cloudfront.net/png/17241-200.png'
    }
    
    $scope.login = function()
    {
        firebase.auth().signInWithPopup(provider).then(function(result)
        {
            console.log("success");
            // console.log(result);
            // console.log(result.user);
          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        //   var token = result.credential.accessToken;
          // The signed-in user info.
        //   var user = result.user;
          // 
            $rootScope.user.name = result.user.displayName;
            $rootScope.user.profile_photo = result.user.photoURL;
            $rootScope.user.email = result.user.email;
            
            //console.log($rootScope.user);
            // var loggedin_user_name_ref =  firebase.database().ref('users/' + $rootScope.user.name + '/name');
            // var loggedin_user_name_email =  firebase.database().ref('users/' + $rootScope.user.name + '/email');
            // var loggedin_user_name_pictureURL =  firebase.database().ref('users/' + $rootScope.user.name + '/pictureURL');
            
            
            var updates = 
                {
                    'pictureURL': $rootScope.user.profile_photo,
                    'email':  $rootScope.user.email,
                    'name':  $rootScope.user.name
                };
                
                firebase.database().ref('/users/' + $rootScope.user.name).update(updates);
            
            // loggedin_user_ref.once("value").then( function(snapshot)
            // {
            //     var loggedin_user = snapshot.val();
            //     loggedin_user.email = $rootScope.user.email;
            //     console.log("DB - " + JSON.stringify(snapshot.val()));
                
                
            // },
            // function(error)
            // {
            //     console.log("error " + error);
            // });
            $state.go('tabsController.itemsYouCanBorrow');
          
          
        }).catch(function(error) {
            console.log("fail");
          // Handle Errors here.
        //   var errorCode = error.code;
        //   var errorMessage = error.message;
          // The email of the user's account used.
        //   var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
        //   var credential = error.credential;
          // ...
        });
        }


}])
   
.controller('aboutLeasilyCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('lendANewItemCtrl', ['$scope', '$stateParams', '$firebaseArray', 'Items_from_database', '$rootScope', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $firebaseArray, Items_from_database, $rootScope) 
{
    $scope.new_item = {};
    var items = Items_from_database.items;
    
    $scope.submit_new_item = function()
    {
        // alert($scope.new_item.name + ' - ' + $scope.new_item.lend_until + ' - ' + $scope.new_item.description);
            // Push to child path.
          // [START oncomplete]
        //   storageRef.child('images/' + file.name).put(file, metadata).then(function(snapshot) {
        //     console.log('Uploaded', snapshot.totalBytes, 'bytes.');
        //     console.log(snapshot.metadata);
        //     var url = snapshot.metadata.downloadURLs[0];
        //     console.log('File available at', url);
        //     // [START_EXCLUDE]
        //     document.getElementById('linkbox').innerHTML = '<a href="' +  url + '">Click For File</a>';
        //     // [END_EXCLUDE]
        //   }).catch(function(error) {
        //     // [START onfailure]
        //     console.error('Upload failed:', error);
        //     // [END onfailure]
        //   });
        //   // [END oncomplete]
        
        var new_item = 
        {
            'name': $scope.new_item.name,
            'description': $scope.new_item.description,
            'id': (items.length + 1),
            'pictureURL': 'http://kingofwallpapers.com/object/object-004.jpg',
            'price': $scope.new_item.price,
            'renters_name': $rootScope.user.name,
            'renters_picture_url': $rootScope.user.profile_photo,
            'valid_until': $scope.new_item.lend_until
        }
        
        items.$add(new_item);
        
   }

}])
   
.controller('itemDescriptionCtrl', ['$scope', '$stateParams', 'Items_from_database', 'Users_from_database', '$ionicLoading', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, Items_from_database, Users_from_database, $ionicLoading)
{
    
    $ionicLoading.show(
    {
      template: 'Loading...',
    });
    
    
    var i = 0;
    var id = $stateParams.item_id;
    var users = Users_from_database.users;
    var items = Items_from_database.items;
    var username = null;
    
    
    $scope.item = null;
    $scope.user = null;
    //find which item is the one clicked
    for (i = 0; i < items.length; i++) 
    {
        if (items[i].id == id)
        {
            $scope.item = items[i];
            console.log('here is the item - ' + $scope.item);
        }
    }
    
    // if ($scope.item === null)
    // {
    //     console.log('Error finding the item');
    // }
    // else
    // {
    //     username = $scope.item.renters_name;
    //     //find the user who has that item
        
    //     for (i = 0; i < users.length; i++) 
    //     {
    //         if (items[i].renters_name == username)
    //         {
    //             $scope.user = users[i];
    //         }
    //     }
        
    //     if ($scope.user === null)
    //     {
    //         console.log('Error finding the user');
    //     }
    // }
    
    $ionicLoading.hide();

}])
   
.controller('chatCtrl', ['$scope', '$stateParams', '$firebaseArray', '$rootScope', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $firebaseArray, $rootScope) {
    
    alert($stateParams.conversation_partner);

    // $rootScope.user.name = result.user.displayName;
    // $rootScope.user.profile_photo = result.user.photoURL;



    $scope.data = 
    {
        'message': ''
    }
    
    var ref =  firebase.database().ref('users/' + $rootScope.user.name + '/dialogs/with ' + $stateParams.conversation_partner);
    var ref2 =  firebase.database().ref('users/' + $stateParams.conversation_partner + '/dialogs/with ' + $rootScope.user.name);
    
    $scope.messages = $firebaseArray(ref);
    $scope.messages2 = $firebaseArray(ref2);
    
    $scope.addMessage = function()
    {
        console.log('button pressed!');
        var message_to_push = 
        {
            text: $scope.data.message,
            author: $rootScope.user.name,
            author_picture_url: $rootScope.user.profile_photo
        }
        $scope.messages.$add(message_to_push);
        $scope.messages2.$add(message_to_push);
        
        //clear the input field
        $scope.data.message = '';
    }
}])
   
.controller('chatsCtrl', ['$scope', '$stateParams', '$rootScope', '$ionicLoading', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $rootScope, $ionicLoading) {

    $scope.chats = [];
    
    $ionicLoading.show(
    {
      template: 'Loading...',
    });
    
    
    var ref = firebase.database().ref('users/' + $rootScope.user.name + '/dialogs');
    
    $scope.chats = [];
    ref.once('value', function(snapshot) 
    {
            var name, photo;
            for (var key in snapshot.val()) 
            {
                if (key.indexOf('with') > -1)
                {
                    name = key.substr(5);
                    console.log("name = " + name);
                }
                
                
                
                $scope.chats.push
                ({
                        'name': name,
                        'pictureURL': 'no-url'
                });
                
                
            }
            
        
        firebase.database().ref('/users/').once('value').then
        (
            function(snapshot)
            {
                console.log('got a hold of the 2nd DB');
                
                for (var i = 0; i < $scope.chats.length; i++)
                {
                    console.log('i = ' + i);
                    $scope.chats[i].pictureURL = snapshot.child($scope.chats[i].name + '/pictureURL').val();
                }
            },
            function(error)
            {
                console.log('error!DID NOT got a hold of the 2nd DB');
            }
        );

    });


    
    $ionicLoading.hide();
}])
 