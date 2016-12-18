angular.module('app.routes', ['ionicUIRouter'])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('tabsController.itemsYouCanBorrow', {
    url: '/borrow',
    views: {
      'tab1': {
        templateUrl: 'templates/itemsYouCanBorrow.html',
        controller: 'itemsYouCanBorrowCtrl'
      }
    }
  })

  .state('tabsController.itemsYouAreLending', {
    url: '/lend',
    views: {
      'tab3': {
        templateUrl: 'templates/itemsYouAreLending.html',
        controller: 'itemsYouAreLendingCtrl'
      }
    }
  })

  .state('tabsController', {
    url: '/tab-controller',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('aboutLeasily', {
    url: '/about',
    templateUrl: 'templates/aboutLeasily.html',
    controller: 'aboutLeasilyCtrl'
  })

  .state('lendANewItem', {
    url: '/new_item',
    templateUrl: 'templates/lendANewItem.html',
    controller: 'lendANewItemCtrl'
  })

  /* 
    The IonicUIRouter.js UI-Router Modification is being used for this route.
    To navigate to this route, do NOT use a URL. Instead use one of the following:
      1) Using the ui-sref HTML attribute:
        ui-sref='tabsController.itemDescription'
      2) Using $state.go programatically:
        $state.go('tabsController.itemDescription');
    This allows your app to figure out which Tab to open this page in on the fly.
    If you're setting a Tabs default page or modifying the .otherwise for your app and
    must use a URL, use one of the following:
      /tab-controller/tab1/item_description
      /tab-controller/tab3/item_description
  */
  .state('tabsController.itemDescription', {
    url: '/item_description',
	params: {
		item_id: "0"		
},
    views: {
      'tab1': {
        templateUrl: 'templates/itemDescription.html',
        controller: 'itemDescriptionCtrl'
      },
      'tab3': {
        templateUrl: 'templates/itemDescription.html',
        controller: 'itemDescriptionCtrl'
      }
    }
  })

  /* 
    The IonicUIRouter.js UI-Router Modification is being used for this route.
    To navigate to this route, do NOT use a URL. Instead use one of the following:
      1) Using the ui-sref HTML attribute:
        ui-sref='tabsController.chat'
      2) Using $state.go programatically:
        $state.go('tabsController.chat');
    This allows your app to figure out which Tab to open this page in on the fly.
    If you're setting a Tabs default page or modifying the .otherwise for your app and
    must use a URL, use one of the following:
      /tab-controller/tab1/chat
      /tab-controller/tab3/chat
  */
  .state('tabsController.chat', {
    url: '/chat',
	params: {
		conversation_partner: "'Nirnay Patel'"		
},
    views: {
      'tab1': {
        templateUrl: 'templates/chat.html',
        controller: 'chatCtrl'
      },
      'tab3': {
        templateUrl: 'templates/chat.html',
        controller: 'chatCtrl'
      }
    }
  })

  .state('chats', {
    url: '/chats',
    templateUrl: 'templates/chats.html',
    controller: 'chatsCtrl'
  })

$urlRouterProvider.otherwise('/login')

  

});