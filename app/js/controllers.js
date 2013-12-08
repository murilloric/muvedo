'use strict';

var host = window.location.hostname;
if ((host === 'localhost')) {
  host = 'http://' + host + ':8082';
} else {
  host = 'http://' + host;
}

console.log(host);


/* Controllers */
// function accessFooterCtrl($scope, $http){
//   console.log('trigger')
//   $scope.access_trigger = ''
//   // $scope.check_for_user()
//    $http.get('/accesscontrol/checkuser').success(function(data){
//             console.log('check_for_user_++++')
//             console.log(data.message)
//             alert('monkey')
//             if (data.message === 'no'){
//               alert(data.message)
//                 $scope.access_trigger = 'login'
//             }else{
//                 $scope.access_trigger = 'logout'
//             }
//   })
// }


function memberCtrl($scope, $http) {
  $scope.member_button = true;
  $scope.member_form = false;
  $scope.member_enter = function(){
    $scope.member_button = false;
    $scope.member_form = true;
  }
}

function homeCtrl($scope, $http, $routeParams, $location, $timeout) {

  $scope.host = '/app/index.html#';

  $scope.route_message = $routeParams.route_message;
  if ($scope.route_message === 'Thanks for joining Muvedo. Please Login!'){
      $scope.show_route_message = true;
  }else{
    $scope.show_route_message = false;
  }

  $scope.trigger_route_message = function(route_message, status){
    $scope.show_route_message = status;
    $scope.route_message = route_message;
    $timeout(function(){
        $scope.trigger_route_message('ddd', false)
    }, 3000);
  }


  $scope.login_member = {username:'', password:''}

  $scope.login_member_form = function(){
    console.log('login_member_form')
    var validate_form = $scope.validate_login.$valid;
    if (validate_form === false){
        $scope.trigger_route_message('your input is not valid', true)
    }else{
        console.log('is valide ' + validate_form)
        $http.post('/accesscontrol/loginmember', $scope.login_member).success(function(data){
          console.log('login data')
          var message = data.message
          // console.log(data)
          if (message === false){
            $scope.trigger_route_message('Sorry Email or Password do not match', true)
          }else{
            // $location.path('/'+ message.path + '/' + message.username)
            window.location = host 
            $scope.check_for_user();
          }
        })
    }
  }

// handle login button
  $scope.member_button = true;
  $scope.member_form = false;
  $scope.member_enter = function(){
    $scope.member_button = false;
    $scope.member_form = true;
  }
//handler login button

}

function socialCtrl($scope){}

function artistsCtrl($scope){}

function artistProfileCtrl($scope, $timeout,  $routeParams, $http){
  $scope.check_for_user()
  //data sets
  // $scope.SC = SC.initialize({
  //   client_id: '277c65cb151544526ccea5e92f7aedcb'
  // });

  $scope.show_route_message = true

  $scope.group_message = 'Hey how goes it.  This green bar is our community message bar. Updates will be posted here.'

  $timeout(function(){
    $scope.group_message = false
  }, 9000)

  // console.log($scope.SC)
  // var play_song = SC.stream("/tracks/293", function(sound){
  //   sound.play();
  // });

  // console.log(play_song)
  // $scope.get_sound_cloud_tracks = function(){
  // $scope.SC.get('/users', { q: 'muvedo'}, function(users) {
  //   console.log(users);
  //   if (users.length){
  //     for ( var a in users){
  //       if (users[a].username == 'muvedo'){
  //         $scope.artist_audio_id = users[a].id
  //         $scope.SC.get('/users/'+ users[a].id + '/tracks', {}, function(tracks){
  //           console.log('tracks')
  //           console.log(tracks)
  //           if (tracks.length){
  //             for (var t in tracks){
  //               $scope.SC.oEmbed(tracks[t].uri, { auto_play: false }, function(oEmbed) {
  //                 console.log('oEmbed response: ');
  //                 console.log(oEmbed)
  //               });
                
  //             }
  //           }
  //         })
  //       }
  //     }
  //   }
  // });
  // }


  $scope.artist_name = $routeParams.artist_name;
  $scope.artist_data = {name:'loading name...', avatar:false, bio:'loading artist bio...', category:'loading category...' }
  $scope.profile_key = 'ahBkZXZ-bXV2ZWRvZGlyZWN0choLEg1BcnRpc3RQcm9maWxlGICAgICAoOAIDA'
  $scope.social_link_item = ''
  $scope.social_links = [
    {name:'Audio', img_src: host+'/app/img/PNG/64/row6/14.png' , links:[]},
    {name:'Video', img_src: host+'/app/img/PNG/64/row4/4.png', links:[]},
    {name:'Image', img_src: host+'/app/img/PNG/64/row13/12.png' , links:[]},
    {name:'Text', img_src: host+'/app/img/PNG/64/row10/12.png', links:[]},
  ]
  $scope.fake_images = [
    // {src:'http://www.sweden.se/upload/Sweden_se/english/articles/SI/2007/Street_art/street_art_sweden.jpg'},
    // {src:'http://www.sweden.se/upload/Sweden_se/english/articles/SI/2007/Street_art/street_art_sweden.jpg'},
    // {src:'http://www.sweden.se/upload/Sweden_se/english/articles/SI/2007/Street_art/street_art_sweden.jpg'},
    // {src:'http://www.sweden.se/upload/Sweden_se/english/articles/SI/2007/Street_art/street_art_sweden.jpg'},
    // {src:'http://www.sweden.se/upload/Sweden_se/english/articles/SI/2007/Street_art/street_art_sweden.jpg'},
    // {src:'http://www.sweden.se/upload/Sweden_se/english/articles/SI/2007/Street_art/street_art_sweden.jpg'},
    // {src:'http://www.sweden.se/upload/Sweden_se/english/articles/SI/2007/Street_art/street_art_sweden.jpg'},
    // {src:'http://www.sweden.se/upload/Sweden_se/english/articles/SI/2007/Street_art/street_art_sweden.jpg'}
    ]
  //end data sets


//media widgets

$scope.social_link_message = false

$scope.show_social_link_message = function(msg){
  $scope.social_link_message = msg;
  $timeout(function(){
    $scope.social_link_message = false
  }, 5000)
}

$scope.edit_social_links = function(idx, media_name, social_link_item){
  console.log('media_name ' + media_name)
  if (!social_link_item){
    $scope.show_social_link_message(" Oh, no you didn't. lol just kidding.   Try adding http://")
    return
  }


  if (media_name == 'Audio'){
    if ($scope.artist_data.audio_links.length >= 5){
      $scope.show_social_link_message('Oh you are really give me a hard time! Sorry, but 5 is the max amount of links. ; ) ')
      return
    }else{
      $scope.artist_data.audio_links.push(social_link_item)
      $scope.update_artist_profile()
    }
  }else if (media_name == 'Video'){
    if ($scope.artist_data.video_links.length >= 5){
      $scope.show_social_link_message('sorry 5 is the max amount of links')
      return
    }else{
      $scope.artist_data.video_links.push(social_link_item)
      $scope.update_artist_profile()
    }
  }else if (media_name == 'Image'){
    if ($scope.artist_data.image_links.length >= 5){
      $scope.show_social_link_message('sorry 5 is the max amount of links')
      return
    }else{
      $scope.artist_data.image_links.push(social_link_item)
      $scope.update_artist_profile()
    }
  }else if (media_name == 'Text'){
    if ($scope.artist_data.text_links.length >= 5){
      $scope.show_social_link_message('sorry 5 is the max amount of links')
      return
    }else{
      $scope.artist_data.text_links.push(social_link_item)
      $scope.update_artist_profile()
    }
  }
}

$scope.remove_social_link = function(idx, link_obj){
  console.log(link_obj)
    link_obj.splice(idx, 1)
    $scope.update_artist_profile()
}

$scope.social_tabs = function(tab_name){
  console.log(tab_name)
  $scope.show_tab = tab_name
}

// end media widget



//load profile by artist name
  $scope.load_profile = function(){
      var post_data = {crud:'review', key: $scope.artist_name, data:''}
      $http.post('/artist/crud', post_data).success(function(data){
        console.log('artist profile postback data');
        console.log(data.message);
        $scope.social_links = [
          {name:'Audio', img_src:host+'/app/img/PNG/64/row6/14.png' , links: data.message.audio_links},
          {name:'Video', img_src:host+'/app/img/PNG/64/row4/4.png', links:data.message.video_links},
          {name:'Image', img_src:host+'/app/img/PNG/64/row13/12.png' , links:data.message.image_links},
          {name:'Text', img_src:host+'/app/img/PNG/64/row10/12.png', links:data.message.text_links},
        ]

        $scope.artist_data = data.message;
        if (data.message.avatar === 'none'){
          $('#avatar_div').attr('src', 'http://www.brooklynstreetart.com/theblog/wp-content/uploads/2009/09/brooklyn-street-art-rwk-veng-chris-jaime-rojo-09-0915.jpg')
        }else{
          $('#avatar_div').attr('src', host + data.message.avatar)
        }

      })
  }
//end load profile

  // $scope.check_user_name_from_url = function(){
  //   console.log('check check_user_name_from_url')
  //   console.log($scope.artist_name + ' _____ ' + $scope.root_artist_name)
  //   if($scope.root_artist_name === undefined){
      
  //   }else{
  //     if ($scope.artist_name === $scope.root_artist_name){
  //         $scope.artist_dashboard = true;
  //         $scope.user_id = $scope.root_user_id;      
  //     }else{
  //        $scope.artist_dashboard = false;
  //        $scope.user_id = 0
  //     }

      $scope.load_profile();


  // $scope.check_user_name_from_url();

//update artist data by user_id
  $scope.edit_artist_data = function(form_data){
    $scope.edit_artist_form= true;
  }

  $scope.update_artist_profile = function(){
    console.log('user id ++++')
    var post_data = {crud:'update', key: $scope.root_user_id, data:$scope.artist_data}
    console.log(post_data)
    $http.post('/artist/crud', post_data).success(function(data){
      console.log('update artist')
      console.log(data)
      $scope.edit_artist_form= false;
    })
  }
  //end update artist

  //upload avatar
  $scope.trigger_file_upload = function(){
    $('#avatarFile').trigger('click');
  }

  $scope.delete_old_avatar = function(old_blob_key){
    $http.get('/media/deletefile?blob_key=' + old_blob_key).success(function(data){
      console.log('blob deleted??')
      console.log(data)
    })
  }

  $scope.create_upload_url =function(){
    //console.log('create upload url')
    $http.get('/media/getuploadurl').success(function(data){
      $scope.upload_url = data.data
      //console.log('upload url: ' + $scope.upload_url)
    })
  }

  $scope.create_upload_url();

  $scope.setFiles = function(element) {
    $scope.$apply(function($scope) {
      // console.log('set avatar')
      // console.log(element)
       $scope.files = []
          for (var i = 0; i < element.files.length; i++) {
             $scope.files.push(element.files[i])
          }
          // console.log('image width and height')
          // console.log($scope.files)
         $scope.uploadFile();
    });
  };


  $scope.uploadFile = function() {
        var fd = new FormData()
        for (var i in $scope.files) {
            fd.append("uploadedFile", $scope.files[i])
            ////console.log('file size: ' + $scope.files[i].size)
            if ($scope.files[i].size > 1000000) {
              alert("Whoa, That's a big file!  Please keep it under 1MB. Thanks!")
              return;
            }
        }

        var xhr = new XMLHttpRequest()
        xhr.addEventListener("load", uploadComplete, false)
        xhr.addEventListener("error", uploadFailed, false)
        xhr.addEventListener("abort", uploadCanceled, false)
        xhr.open("POST", $scope.upload_url)
        $scope.progressVisible = true
        xhr.send(fd)
    }

    function uploadComplete(evt) {
        /* This event is raised when the server send back a response */
         $scope.$apply(function(){
            $scope.image_src = evt.target.responseText
            var response = JSON.parse(evt.target.responseText)
            //delete old avatar
            if($scope.artist_data.avatar){
              $scope.delete_old_avatar($scope.artist_data.avatar.split('/')[3])
            }

            $scope.fileToUpload = ''
            //store new avatar
            var img_url = host + response.data
            $('#avatar_div').attr('src', img_url)
            $scope.artist_data.avatar = response.data
            $scope.create_upload_url();
            $scope.update_artist_profile()

        })

    }

    function uploadFailed(evt) {
        alert("There was an error attempting to upload the file.")
    }

    function uploadCanceled(evt) {
        $scope.$apply(function(){
            $scope.progressVisible = false
        })
        alert("The upload has been canceled by the user or the browser dropped the connection.")
    }


  //end upload avatar

}

function muvedotvCtrl($scope, $routeParams){
  $scope.artist_param = $routeParams;
}


function contactCtrl($scope, $http){
  $scope.message = 'tell us about yourself...'
  $scope.contact_form = true;
  var data = $scope.contact = {artist_name:'', artist_bio:'', facebook:'', twitter:'', instagram:'', youtube:''}
  $scope.contact_btn = function(){
    $http.post('/contact', data).success(function(data){
      console.log(data)
      $scope.message = data;
      $scope.contact_form = false;
    })
  }
  
}








