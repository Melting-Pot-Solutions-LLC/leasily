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
        // firebase.auth().signOut().then(function() {
        //   // Sign-out successful.
        //   console.log("successfully signed out");
        // }, function(error) {
        //   // An error happened.
        //   console.log("error siging out");
        // });
        facebookConnectPlugin.logout(
        function()
        {
            console.log('successfully logged out');
        },
        function()
        {
            console.log('error logging out');
        });
    }

}])

.controller('loginCtrl', ['$scope', '$stateParams', '$rootScope', '$state', '$ionicModal',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $rootScope, $state, $q, $ionicLoading, $timeout, $ionicModal) {

var provider = new firebase.auth.FacebookAuthProvider();

    $rootScope.user =
    {
        'name': '',
        'email': '',
        'profile_photo': 'https://d30y9cdsu7xlg0.cloudfront.net/png/17241-200.png',
        'phone_number': '8030000000'
    }

    $scope.show_phone_input = false;

   $scope.anotherLogin = function() {

     console.log('button pressed');
      facebookConnectPlugin.getLoginStatus(function(success)
      {
        if(success.status === 'connected'){
        
          console.log('getLoginStatus - ', success.status);
          facebookConnectPlugin.api('/me?fields=email,name,picture.width(720).height(720)&access_token=' + success.authResponse.accessToken, null,
        function (response) {
                  console.log(JSON.stringify(response));

                  $rootScope.user.name = response.name;
                  $rootScope.user.email =  response.email;
                  $rootScope.user.profile_photo = response.picture.data.url;

        },
        function (response) {
          alert(response);
        });

        update_db_and_go_further();

      }
      else 
      {
        console.log('getLoginStatus', success.status);
        $scope.show_phone_input = true;
        console.log('show_phone_input - ', $scope.show_phone_input);
        facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);

      }
    });
    	// 	$ionicLoading.show({
        //   template: 'Logging in...'
        // });
        // while($rootScope.user.name == '')
        // {

        // }
        // update_db_and_go_further();

  };


var update_db_and_go_further = function()
{
    console.log("went to update_db_and_go_further");
    var updates = {};

    if($scope.show_phone_input)
    {
      var updates =
                {
                    'pictureURL': $rootScope.user.profile_photo,
                    'email':  $rootScope.user.email,
                    'name':  $rootScope.user.name,
                    'phone_number':  $rootScope.user.phone_number

                };
    }
    else
    {
      var updates =
                {
                    'pictureURL': $rootScope.user.profile_photo,
                    'email':  $rootScope.user.email,
                    'name':  $rootScope.user.name,
                    

                };
    }
    firebase.database().ref('/users/' + $rootScope.user.name).update(updates);
    $state.go('tabsController.itemsYouCanBorrow');
}

  var fbLoginError = function(error){
    alert('fbLoginError', error);
    // $ionicLoading.hide();
  };

  var fbLoginSuccess = function(response) {
    if (!response.authResponse){
      fbLoginError("Cannot find the authResponse");
      return;
    }

    alert("logged in successfully!");

   facebookConnectPlugin.api('/me?fields=email,name&access_token=' + response.authResponse.accessToken, null,
      function (response) {
                console.log(JSON.stringify(response));
                $rootScope.user.name = response.name;
                $rootScope.user.email =  response.email;
                $rootScope.user.profile_photo = "https://graph.facebook.com/" + response.id + "/picture?type=large";

      },
      function (response) {
				alert(response);
      });

      

    // $ionicLoading.hide();

  };

    $scope.assign_phone_and_proceed = function()
    {
        $rootScope.user.phone_number = $("phone_number").val();
        update_db_and_go_further();
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
            console.log(JSON.stringify(error));

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

    $scope.proceed_wo_login = function()
    {
        $rootScope.user =
        {
            'name': 'Guest',
            'email': 'no-email',
            'profile_photo': 'https://d30y9cdsu7xlg0.cloudfront.net/png/17241-200.png'
        }
        $state.go('tabsController.itemsYouCanBorrow');

    }


}])

.controller('aboutLeasilyCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('lendANewItemCtrl', ['$scope', '$stateParams', '$firebaseArray', 'Items_from_database', '$rootScope', '$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $firebaseArray, Items_from_database, $rootScope, $state)
{
    $scope.new_item = {};
    var items = Items_from_database.items;

    $scope.picture = 'http://2.design-milk.com/images/2012/03/design-storey-object-1-hand.jpg';

    $scope.take_a_photo = function()
    {

        console.log("take_a_photo button pressed");
        var options = {
                    quality: 75,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    allowEdit: true,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 300,
                    targetHeight: 300,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false
                };

                    navigator.camera.getPicture(function (imageData) {
                        console.log("picture taken successfully");
                        // $scope.imgURI = "data:image/jpeg;base64," + imageData;
                        // var image = document.getElementById('image');
                        $scope.picture_to_submit = "data:image/jpeg;base64," + imageData;
                        $("#image").attr('src', "data:image/jpeg;base64," + imageData);
                        $("#lendANewItem-button8").html("Change a photo")


                    }, function (err) {
                        console.log("picture taken with an error");

                    }, options);

    }


    // function onSuccess(imageURI)
    // {
    //     alert('success!');
    //     console.log(imageURI);
    //     // var image = document.getElementById('image');
    //     // image.src = imageURI;
    //     // $scope.picture = imageURI;
    //     $scope.imgURI = "data:image/jpeg;base64," + imageURI;
    // }

    // function onFail(message)
    // {
    //     alert('Failed because: ' + message);
    // }


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
            'pictureURL': $scope.picture_to_submit,
            'price': $scope.new_item.price,
            'renters_name': $rootScope.user.name,
            'renters_picture_url': $rootScope.user.profile_photo,
            'valid_until': $scope.new_item.lend_until
        }

        items.$add(new_item);
        console.log("submitting a new item");
        alert("your item has successfully been submitted! ");
        $state.go('tabsController.itemsYouCanBorrow');

   }

}])

.controller('itemDescriptionCtrl', ['$scope', '$stateParams', 'Items_from_database', 'Users_from_database', '$ionicLoading', '$http', '$ionicModal', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, Items_from_database, Users_from_database, $ionicLoading, $http, $ionicModal)
{


    $ionicModal.fromTemplateUrl('my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });
      $scope.rent_item = function() {
        $scope.modal.show();
      };
      $scope.closeModal = function() {
        $scope.modal.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });
      // Execute action on hide modal
      $scope.$on('modal.hidden', function() {
        // Execute action
      });
      // Execute action on remove modal
      $scope.$on('modal.removed', function() {
        // Execute action
      });


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
            // console.log('here is the item - ' + $scope.item);
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



  $scope.submit_payment = function( payment ) {


        // Obtain your unique Mashape ID from here:
        // https://market.mashape.com/noodlio/noodlio-pay-smooth-payments-with-stripe
        var NOODLIO_PAY_API_URL         = "https://noodlio-pay.p.mashape.com";
        var NOODLIO_PAY_API_KEY         = "0TCPnWxV17mshLwDLi52Yv9kq0tJp1e3iOnjsnVXey4p7a2ACo";

        // Obtain your unique Stripe Account Id from here:
        // https://www.noodl.io/pay/connect
        // Please also connect your account on this address
        // https://www.noodl.io/pay/connect/test
        var STRIPE_ACCOUNT_ID           = "acct_19YnEsBzXZdrt0Sd";

        // Define whether you are in development mode (TEST_MODE: true) or production mode (TEST_MODE: false)
        var TEST_MODE = true;

        // add the following headers for authentication
        $http.defaults.headers.common['X-Mashape-Key']  = NOODLIO_PAY_API_KEY;
        $http.defaults.headers.common['Content-Type']   = 'application/x-www-form-urlencoded';
        $http.defaults.headers.common['Accept']         = 'application/json';

        $scope.FormData = {
          number: payment.card_number,
          cvc: payment.cvc,
          exp_month: payment.exp_month,
          exp_year: payment.exp_year,
          test: true,
        };

        // // Defines your checkout key
        //  switch (TEST_MODE) {
        //    case true:
        //      //
        //      StripeCheckoutProvider.defaults({key: NOODLIO_PAY_CHECKOUT_KEY['test']});
        //      break
        //    default:
        //      //
        //      StripeCheckoutProvider.defaults({key: NOODLIO_PAY_CHECKOUT_KEY['live']});
        //      break
        //  };

          // init for the DOM
          $scope.ResponseData = {
            loading: true
          };

          // create a token and validate the credit card details
          $http.post(NOODLIO_PAY_API_URL + "/tokens/create", $scope.FormData)
          .success(
            function(response){

              // --> success
              console.log(response)

              if(response.hasOwnProperty('id')) {
                var token = response.id; $scope.ResponseData['token'] = token;
                proceedCharge(token);
              } else {
                $scope.ResponseData['token'] = 'Error, see console';
                $scope.ResponseData['loading'] = false;
              };

            }
          )
          .error(
            function(response){
              console.log(JSON.stringify(response))
              $scope.ResponseData['token'] = 'Error, see console';
              $scope.ResponseData['loading'] = false;
            }
          );


        // charge the customer with the token
        function proceedCharge(token) {

          var param = {
            source: token,
            amount: 50,
            currency: "usd",
            description: "Your custom description here",
            stripe_account: STRIPE_ACCOUNT_ID,
            test: TEST_MODE,
          };

          $http.post(NOODLIO_PAY_API_URL + "/charge/token", param)
          .success(
            function(response){

              // --> success
              console.log(JSON.stringify(response));
              $scope.ResponseData['loading'] = false;

              if(response.hasOwnProperty('id')) {
                var paymentId = response.id; $scope.ResponseData['paymentId'] = paymentId;
              } else {
                $scope.ResponseData['paymentId'] = 'Error, see console';
              };

            }
          )
          .error(
            function(response){
              console.log(JSON.stringify(response));
              $scope.ResponseData['paymentId'] = 'Error, see console';
              $scope.ResponseData['loading'] = false;
            }
          );
        };
        $scope.closeModal();
  };


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
