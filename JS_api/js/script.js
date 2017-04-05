

//twitter API
      $(document).ready(function(){
        console.log('doc ready!');  //document ready the button

        $('#submit').click(function(){ //you have a link and the user clicks on the link

        var search_term = {
          q:'france'   //search term not appearing as an object
        };
          // console.dir(search_term);
          search(search_term); //the search term is created and that gets passed to a function
        });
        
      });

      function search(search_term){
        console.log('searching for');
        console.dir(search_term);

    $.getJSON({
          url: 'http://search.twitter.com/search.json?q=jquery4u&rpp=5&callback=?' + $.param(search_term),
          dataType: 'jsonp',
          success:function(data){
            console.dir(data);

            for(item in data['results']){
              $('#tweets').append('<li>' + data['results'][item]['text'] + '<li>');
                
            }
          }

        });

      }

      //flicker

      (function() {
  var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
  $.getJSON( flickerAPI, {
    tags: "paris",
    tagmode: "any",
    format: "json"
  })
    .done(function( data ) {
      $.each( data.items, function( i, item ) {
        $( "<img>" ).attr( "src", item.media.m ).appendTo( "#images" );
        if ( i === 7 ) {
          return false;
        }
      });
    });
})();

function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -33.8688, lng: 151.2195},
          zoom: 13
        });

        var input = document.getElementById('pac-input');

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        var infowindow = new google.maps.InfoWindow();
        var infowindowContent = document.getElementById('infowindow-content');
        infowindow.setContent(infowindowContent);
        var marker = new google.maps.Marker({
          map: map
        });
        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });

        autocomplete.addListener('place_changed', function() {
          infowindow.close();
          var place = autocomplete.getPlace();
          if (!place.geometry) {
            return;
          }

          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
          }

          // Set the position of the marker using the place ID and location.
          marker.setPlace({
            placeId: place.place_id,
            location: place.geometry.location
          });
          marker.setVisible(true);

          infowindowContent.children['place-name'].textContent = place.name;
          infowindowContent.children['place-id'].textContent = place.place_id;
          infowindowContent.children['place-address'].textContent =
              place.formatted_address;
          infowindow.open(map, marker);
        });
      }
//nytimes

function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;

    $greeting.text('So, you want to live at ' + address + '?');


    // load streetview
    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';
    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');


    // load nytimes
 
    // YOUR CODE GOES HERE!


var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
url += '?' + $.param({
    'q': cityStr,
  'api-key': "d28cb3126eae332c6279f9dedf4bb830%3A10%3A64325990",
  'sort': "newest"
});



    $.getJSON( url, function( data ) {
  $nytHeaderElem.text('New York Times Articles About ' + cityStr);

  articles = data.response.docs;
  for (var i =0; i <articles.length; i++){
    var article = articles[i];
    $nytElem.append('<li class="article">' +
    '<a href="'+article.web_url+'">'+article.headline.main+'</a>'+
    '<p>'+article.snippet +'</p>'+
    '</li>');
  };

}).error(function(e){
        $nytHeaderElem.text('New YorK Times Articles Could Not Be Loaded ');
    });

var wikiUrl = 'http://en.wikipedia.org/w/api.php';
    wikiUrl += '?' + $.param({
        'action' : "opensearch",
        'search' : cityStr,
        'format' : "json",
        'callback' : "wikiCallback"

    });

    $.ajax({
        url: wikiUrl,
        dataType:"jsonp",
        success : function(response){
            var articleList = response[1];

            for (var i =0; i< articleList.length; i++){
                articleStr = articleList[i];
                var url  = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="'+url+'">'+ articleStr+'</a></li>');
            };
        }
    });

    return false;
};

$('#form-container').submit(loadData);

var ENDPOINT = 'search';
var LIMIT = 1;
var RATING = 'pg';

var $querysInput = $('.querys');
var $resultWrapper = $('.result');
var $loader = $('.loader');
var $inputWrapper = $('.input-wrapper');
var $clear = $('.clear');
var $button = $('.random');
var currentTimeout = undefined;

var querys = {
  text: null,
  offset: 0,
  request: function request() {
    return '' + BASE_URL + ENDPOINT + '?q=' + this.text + '&limit=' + LIMIT + '&rating=' + RATING + '&offset=' + this.offset + '&api_key=' + PUBLIC_KEY;
  },
  fetch: function fetch(callback) {
    $.getJSON(this.request()).success(function (data) {
      var results = data.data;

      if (results.length) {
        var url = results[0].images.downsized.url;
        console.log(results);
        callback(url);
      } else {
        callback('');
      }
    }).fail(function (error) {
      console.log(error);
    });
  }
};

function buildImg() {
  var src = arguments.length <= 0 || arguments[0] === undefined ? '//giphy.com/embed/xv3WUrBxWkUPC' : arguments[0];
  var classes = arguments.length <= 1 || arguments[1] === undefined ? 'gif hidden' : arguments[1];

  return '<img src="' + src + '" class="' + classes + '" alt="gif" />';
}

$clear.on('click', function (e) {
  $querysInput.val('');
  $inputWrapper.removeClass('active').addClass('empty');
  $('.gif').addClass('hidden');
  $loader.removeClass('done');
  $button.removeClass('active');
});

$button.on('click', function (e) {
  querys.offset = Math.floor(Math.random() * 25);

  querys.fetch(function (url) {
    if (url.length) {
      $resultWrapper.html(buildImg(url));

      $button.addClass('active');
    } else {
      $resultWrapper.html('<p class="no-results hidden">No Results found for <strong>' + querys.text + '</strong></p>');

      $button.removeClass('active');
    }

    $loader.addClass('done');
    currentTimeout = setTimeout(function () {
      $('.hidden').toggleClass('hidden');
    }, 1000);
  });
});

$querysInput.on('keyup', function (e) {
  var key = e.which || e.keyCode;
  querys.text = $querysInput.val();
  querys.offset = Math.floor(Math.random() * 25);

  if (currentTimeout) {
    clearTimeout(currentTimeout);
    $loader.removeClass('done');
  }

  currentTimeout = setTimeout(function () {
    currentTimeout = null;
    $('.gif').addClass('hidden');

    if (querys.text && querys.text.length) {
      $inputWrapper.addClass('active').removeClass('empty');

      querys.fetch(function (url) {
        if (url.length) {
          $resultWrapper.html(buildImg(url));

          $button.addClass('active');
        } else {
          $resultWrapper.html('<p class="no-results hidden">No Results found for <strong>' + querys.text + '</strong></p>');

          $button.removeClass('active');
        }

        $loader.addClass('done');
        currentTimeout = setTimeout(function () {
          $('.hidden').toggleClass('hidden');
        }, 1000);
      });
    } else {
      $inputWrapper.removeClass('active').addClass('empty');
      $button.removeClass('active');
    }
  }, 1000);
});


$('#randomButton').on('click', function(rand) {
  
    rand.preventDefault();                   
  // prevent default anchor behavior
    var goTo = this.getAttribute("href");
  //jQUERY animation
   $(this).animate({
          backgroundColor: "#aa0000",
          color: "#fff",
     
        }, 1000 );
  
 setTimeout(function(){
         window.open(goTo, '_blank');
    },1700); 
  
  })

$('#searchButton').on('click', function(collect) {
    collect= $('#searchInput').val();//collects the search input
    var url = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + collect + "&format=json&callback=?";//adds the search input to the api address. The link contains the list of results from the search input
  
  // the Following sets up the collection of search results through a json file 
$.ajax({
    type:"GET",
    url:url,
    async:false,
    dataType: "json",
    success: function(data){
        //erases past search results after CLICKING a new Search
      
      //The following interates through the list of search results from the url link and appends them to our site as new link and and description
      $("#output").html(""); 
      for(var i=0; i<data[1].length; i++){
      $('#output').append("<li><a href= "+data[3][i]+">"+data[1][i]+"</a><p>"+data[2][i]+"</p></li>");
     }
      },
    error: function(errorMessage){
      alert("Seems to be a Problem!");
    }
  });
  
  });

