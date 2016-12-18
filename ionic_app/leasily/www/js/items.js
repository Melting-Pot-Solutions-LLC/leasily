/* !!! IMPORTANT: Rename "mymodule" below and add your module to Angular Modules above. */

angular.module('items', [])
 
.service('Items_from_database', ['$firebaseArray', function($firebaseArray ){
    
    var ref_items = firebase.database().ref('things');
    var items = $firebaseArray(ref_items); //real time array synced to the Firebase 
    
    // var items = 
    // [
    //     {
    //         'id': 1,
    //         'name': 'drill',
    //         'renters_name': 'Steve Rubin',
    //         'renters_picture_url': 'https://d30y9cdsu7xlg0.cloudfront.net/png/17241-200.png',
    //         'pictureURL': 'http://s.hswstatic.com/gif/power-drill-1.jpg',
    //         'valid_until': '01/01/2017',
    //         'description': ' tool fitted with a cutting tool attachment or driving tool attachment',
    //         'price': '$5/hr'
    //     },
        
    //     {
    //         'id': 2,
    //         'name': 'MacBook Pro 13 ',
    //         'renters_name': 'Nirnay Patel',
    //         'renters_picture_url': 'https://d30y9cdsu7xlg0.cloudfront.net/png/17241-200.png',
    //         'pictureURL': 'http://images.newseveryday.com/data/images/full/43002/apple-may-finally-put-down-the-legacy-macbook-pro.jpg',
    //         'valid_until': '03/19/2017',
    //         'description': ' line of Macintosh portable computers introduced in January 2006 by Apple Inc.',
    //         'price': '$2/hr'
    //     }
    // ];
    
    var items2 = 
    {
        'items': items
    };
    
    return items2;

}]);

