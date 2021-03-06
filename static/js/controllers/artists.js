


function artistProfileCtrl($scope, $timeout,  $routeParams, $http){
  $scope.check_for_user()
  //data sets
  // $scope.SC = SC.initialize({
  //   client_id: '277c65cb151544526ccea5e92f7aedcb'
  // });
  $scope.show_route_message = true

  // $scope.group_message = 'Hey how goes it.  This green bar is our community message bar. Updates will be posted here.'

  $timeout(function(){
    $scope.group_message = false
  }, 9000)

  $scope.artist_name = $routeParams.artist_name;
  $scope.artist_data = {name:'loading name...', avatar:false, bio:'loading artist bio...', category:'loading category...' }
  // $scope.profile_key = 'ahBkZXZ-bXV2ZWRvZGlyZWN0choLEg1BcnRpc3RQcm9maWxlGICAgICAoOAIDA'
  $scope.tintup_feed = '<script async src="https://d36hc0p18k1aoc.cloudfront.net/public/js/modules/tintembed.js"></script><div class="tintup" data-id="muvedo" data-columns="3"  style="height:500px;width:960px;"><a href="http://www.tintup.com/blog/the-best-twitter-widget" style="width:118px;height:31px;background-image:url(//d33w9bm0n1egwm.cloudfront.net/assets/logos/poweredbytintsmall.png);position:absolute;bottom:10px;right: 20px;text-indent: -9999px;z-index:9;">twitter widget</a></div>'
  $scope.social_feed_message = 'paste your tintup feed here'
  $scope.social_link_item = ''
  $scope.social_links = [
    {name:'Audio', description:'Ex. SoundCloud', img_src: host+'/app/img/PNG/64/row6/14.png' , links:[]},
    {name:'Video', description:'Ex. Youtube', img_src: host+'/app/img/PNG/64/row4/4.png', links:[]},
    {name:'Image', description:'Ex. Instagram', img_src: host+'/app/img/PNG/64/row13/12.png' , links:[]},
    {name:'Text', description:'Ex. Tumblr', img_src: host+'/app/img/PNG/64/row10/12.png', links:[]},
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

// $scope.edit_social_links = function(idx, media_name, social_link_item){
//   console.log('media_name ' + media_name)
//   if (!social_link_item){
//     $scope.show_social_link_message(" Oh, no you didn't. lol just kidding.   Try adding http://")
//     return
//   }


//   if (media_name == 'Audio'){
//     if ($scope.artist_data.audio_links.length >= 5){
//       $scope.show_social_link_message('Oh you are really give me a hard time! Sorry, but 5 is the max amount of links. ; ) ')
//       return
//     }else{
//       $scope.artist_data.audio_links.push(social_link_item)
//       $scope.update_artist_profile()
//     }
//   }else if (media_name == 'Video'){
//     if ($scope.artist_data.video_links.length >= 5){
//       $scope.show_social_link_message('sorry 5 is the max amount of links')
//       return
//     }else{
//       $scope.artist_data.video_links.push(social_link_item)
//       $scope.update_artist_profile()
//     }
//   }else if (media_name == 'Image'){
//     if ($scope.artist_data.image_links.length >= 5){
//       $scope.show_social_link_message('sorry 5 is the max amount of links')
//       return
//     }else{
//       $scope.artist_data.image_links.push(social_link_item)
//       $scope.update_artist_profile()
//     }
//   }else if (media_name == 'Text'){
//     if ($scope.artist_data.text_links.length >= 5){
//       $scope.show_social_link_message('sorry 5 is the max amount of links')
//       return
//     }else{
//       $scope.artist_data.text_links.push(social_link_item)
//       $scope.update_artist_profile()
//     }
//   }
// }

// $scope.remove_social_link = function(idx, link_obj){
//   console.log(link_obj)
//     link_obj.splice(idx, 1)
//     $scope.update_artist_profile()
// }

// $scope.social_tabs = function(tab_name){
//   console.log(tab_name)
//   $scope.show_tab = tab_name
// }

// end media widget



//load profile by artist name
  $scope.load_profile = function(){
      var post_data = {crud:'review', key: $scope.artist_name, data:''}
      $http.post('/artist/crud', post_data).success(function(data){
        console.log('artist profile postback data');
        console.log(data.message.avatar)
        $scope.social_links = [
          {name:'Audio', description:'Ex. SoundCloud', img_src:host+'/app/img/PNG/64/row6/14.png' , links: data.message.audio_links},
          {name:'Video', description:'Ex. Youtube', img_src:host+'/app/img/PNG/64/row4/4.png', links:data.message.video_links},
          {name:'Image', description:'Ex. Instagram', img_src:host+'/app/img/PNG/64/row13/12.png' , links:data.message.image_links},
          {name:'Text', description:'Ex. Tumblr', img_src:host+'/app/img/PNG/64/row10/12.png', links:data.message.text_links},
        ]

        $scope.artist_data = data.message;
        if (data.message.tintup_feed === null){
          $scope.artist_data.tintup_feed  =  $scope.tintup_feed
        }
        if (data.message.avatar === 'none'){
          $('#avatar_div').attr('src', host + '/app/img/default-avatar.png')
        }else{
          $('#avatar_div').attr('src', host + data.message.avatar)
        }

      })
  }
//end load profile


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

  $scope.save_your_socialfeed = function(){
    $scope.check_for_tintup = $scope.artist_data.tintup_feed.search('tintup')

    if (!$scope.artist_data.tintup_feed){
      $scope.social_feed_message = 'Oh no, please add your tintup feed.'
    }else if ($scope.check_for_tintup === -1){
      $scope.social_feed_message = 'This is not a tintup embed code. Please try again.'
    }else{
      if($scope.check_for_tintup > 100){
        $scope.update_artist_profile();
        $scope.social_feed_message = 'Your social feed has been saved.'
      }else{
        $scope.social_feed_message = 'This is not a tintup embed code. Please try again.'
      }
    }
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