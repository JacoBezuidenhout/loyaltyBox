angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,$http,$cordovaBarcodeScanner,$cordovaPinDialog,$ionicLoading,$ionicPopup,$location) {

  $scope.error = function(m)
  {
    $scope.hide(); 
    var alertPopup = $ionicPopup.alert({
      title: 'Error',
      template: '<pre><code>' + m + '</code></pre>'
    });
    alertPopup.then(function(res) {
      console.log('Thank you for not eating my delicious ice cream cone');
    });
    $timeout(function() {
       alertPopup.close(); //close the popup after 3 seconds for some reason
    }, 3000);
  }

  $scope.success = function()
  {
    var myPopup = $ionicPopup.show({
      template: '',
      title: 'Success',
      subTitle: 'Transaction added successfully.',
      scope: $scope,
      buttons: [
        {
          text: '<b>Ok</b>'
        }
      ]
    });
    // $timeout(function() {
    //    myPopup.close(); //close the popup after 3 seconds for some reason
    // }, 3000);
  }

  $scope.transaction = function()
  {
    
    $cordovaBarcodeScanner.scan().then(function(qrMember) {
      var t = {};
      t.trans = {};
      $scope.t = t;
      
      if (qrMember.text.length > 0 && !qrMember.cancelled)
      {
        t.qrMember = qrMember;
        var id = JSON.parse(qrMember.text.replace("id",'"id"').replace("deviceId",'"deviceId"')).id;
        $http.get(url + "/member/" + id).then(function(response){

          var myPopup = $ionicPopup.show({
            templateUrl: "./templates/transactionForm.html",
            title: 'Transaction Info',
            subTitle: 'Check information',
            scope: $scope,
            buttons: [
              { text: 'Cancel' },
              {
                text: '<b>Save</b>',
                type: 'button-positive',
                onTap: function(e) {
                  console.log(e);
                  // t.check = $scope.trans.check;
                  // t.amount = $scope.trans.amount;
                  alert(JSON.stringify(t));
                  $cordovaBarcodeScanner.scan().then(function(qrAdmin) {
                    t.qrAdmin = qrAdmin;
                    $http.post(url + "/member/" + response.data.id + "/transactions/add/",t)
                    .then(function(response){
                      $scope.success();
                    },function(error){
                      $scope.error(JSON.stringify(error,null,4));
                    });
                  },function(error) {
                    $scope.error(JSON.stringify(error,null,4));
                  });
                }
              }
            ]
          });
        
          myPopup.then(function(res) {
            console.log('Tapped!', res);
          });

        },function(error){$scope.error(JSON.stringify(error,null,4));});
      }
      else
      {
        $scope.error("QR code scanning cancelled");
      }
    },function(error) {
        $scope.error(JSON.stringify(error,null,4));
    });

  


  }

})

.controller('newMemberCtrl', function($scope,$http,$cordovaBarcodeScanner,$cordovaPinDialog,$ionicLoading,$ionicPopup,$location) {
  $scope.show = function() {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });
  };
  $scope.hide = function(){
    $ionicLoading.hide();
  };

  $scope.success = function()
  {
    var myPopup = $ionicPopup.show({
      template: '',
      title: 'Success',
      subTitle: 'Member added successfully.',
      scope: $scope,
      buttons: [
        {
          text: '<b>Ok</b>',
          type: 'button-balanced',
          onTap: function(e) {
            $location.path("/dash");
          }
        },
        {
          text: '<b>Start Transaction</b>',
          type: 'button-positive',
          onTap: function(e) {
            alert("new Transaction");
          }
        }
      ]
    });
    // $timeout(function() {
    //    myPopup.close(); //close the popup after 3 seconds for some reason
    // }, 3000);
  }

  $scope.error = function(m)
  {
    $scope.hide(); 
    var alertPopup = $ionicPopup.alert({
      title: 'Error',
      template: '<pre><code>' + m + '</code></pre>'
    });
    alertPopup.then(function(res) {
      console.log('Thank you for not eating my delicious ice cream cone');
    });
    $timeout(function() {
       alertPopup.close(); //close the popup after 3 seconds for some reason
    }, 3000);
  }

  $scope.create = function(m)
  {
    $scope.show();
    $cordovaBarcodeScanner.scan().then(function(imageData) {
      if (imageData.text.length > 0 && !imageData.cancelled)
      {
        m.qr = imageData;
        m.qr.text = JSON.parse(m.qr.text.replace("id",'"id"').replace("deviceId",'"deviceId"'));
        $cordovaPinDialog.prompt('Please enter a PIN (eg. 0000)').then(
          function(result) {
            if (result.buttonIndex == 1)
            {
              m.pin = result.input1;
              if (m.pin.length >= 4)
              {
                $http.post(url + "/member/update/" + m.qr.text.id, m)
                .then(function(response){
                  // $scope.data = JSON.stringify(response.data,null,4);
                  $scope.member = {};
                  $scope.hide();  
                  $scope.success();
                },function(response){
                  $scope.hide();
                });
              }
              else
              { 
                $scope.error('Pin should at least be longer than 4 characters.');
              }
            }
            else
            { 
              $scope.error('No pin code entered');
            }
          },
          function (error) {
            $scope.error(JSON.stringify(error,null,4));
        });
      }
      else
      {
        $scope.error("QR code scanning cancelled");
      }
    }, function(error) {
        $scope.error(JSON.stringify(error,null,4));
    });
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
