var num = 0;
var hiddenPlayer = $('#hidden-player');
var player = $('#player');
var title = $('.song-title');
var cover = $('.coverr');

function secondsTimeSpanToHMS(s) {
  var h = Math.floor(s / 3600);
  s -= h * 3600;
  var m = Math.floor(s / 60);
  s -= m * 60;
  return h + ":" + (m < 10 ? '0' + m : m) + ":" + (s < 10 ? '0' + s : s);
};


let videoURL = null;
$('#videoInput').change(() => {
  function getUrlParameter(url, name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(url);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };

  videoURL = getUrlParameter($('#videoInput').val(), 'v');

  player.loadVideoById(videoURL, 0, "large");


});

// Change Songs Here
songs = [{
  src: "assets/songs/example.mp3",
  title: "Waiting for the rain",
  coverart: "assets/img/music/01.jpg"
},
  // {
  //   src: "assets/songs/Example.mp3",
  //   title: "Ran D - Zombie",
  //   coverart: "assets/img/music/02.jpg"
  // }, {
  //   src: "assets/songs/Other Example.mp3",
  //   title: "Avenged Sevenfold - Carry On",
  //   coverart: "assets/img/music/03.jpg"
  // },
];

var initSongSrc = songs[0].src;
var initSongTitle = songs[0].title;
var initSongCover = songs[0].coverart;
var items = songs.length - 1;

function updatePlayerMetadata() {
  title.html(player.getVideoData().title);
  cover.attr('src', "https://img.youtube.com/vi/" + player.getVideoData().video_id + "/maxresdefault.jpg");
}

function onPlayerReady(e) {
  updatePlayerMetadata()
}

hiddenPlayer.attr("src", initSongSrc);
title.html(initSongTitle);
cover.attr('src', initSongCover);

$('.next').on('click', function () {
  var songOrder = hiddenPlayer.attr('order');

  if (items == songOrder) {
    // num = 0;
    // var songSrc = songs[0].src;
    // var songTitle = songs[0].title;
    // var songCover = songs[0].coverart;
    // hiddenPlayer.attr('order', '0');
    // hiddenPlayer.attr('src', songSrc).trigger('play');
    // title.html(songTitle);
    // cover.attr('src', songCover);
  } else {
    // console.log(songOrder);
    // num += 1;
    // var songSrc = songs[num].src;
    // var songTitle = songs[num].title;
    // var songCover = songs[num].coverart;
    // hiddenPlayer.attr('src', songSrc).trigger('play');
    // title.html(songTitle);
    // cover.attr('src', songCover);
    // hiddenPlayer.attr('order', num);
  }
});

$('.prev').on('click', function () {
  var songOrder = hiddenPlayer.attr('order');

  if (songOrder == 0) {
    num = items;
    var songSrc = songs[items].src;
    var songTitle = songs[items].title;
    var songCover = songs[items].coverart;
    hiddenPlayer.attr('order', items);
    hiddenPlayer.attr('src', songSrc).trigger('play');
    title.html(songTitle);
    cover.attr('src', songCover);
  } else {
    num -= 1;
    var songSrc = songs[num].src;
    var songTitle = songs[num].title;
    var songCover = songs[num].coverart;
    hiddenPlayer.attr('src', songSrc).trigger('play');
    title.html(songTitle);
    cover.attr('src', songCover);
    hiddenPlayer.attr('order', num);
  }
});

$("#playmusic").click(function () {
  player.playVideo();
  $("#playmusic").hide();
  $("#pause").show().addClass('active');
});

$("#pause").click(function () {
  player.pauseVideo();
  $("#playmusic").show();
  $("#pause").hide();
});

let timeUpdateInterval = null;

function onPlayerStateChange(e) {
  switch (e.data) {
    case YT.PlayerState.PLAYING:
      timeUpdateInterval = setInterval(onTimeUpdate, 100);
      break;

    case YT.PlayerState.UNSTARTED:
      updatePlayerMetadata();
      break;

    default:
      clearInterval(timeUpdateInterval);
      console.log(e.data)
      break;
  }
}

function onTimeUpdate() {

  $('#ytseekBar').attr("value", player.getCurrentTime() / player.getDuration());

  $("#playmusic").hide();
  $("#pause").show();
  $('#ytseekBar').css('cursor', 'pointer');

  $('#ytseekBar').on('click', function (e) {
    var parentOffset = $(this).parent().offset();
    var relX = e.pageX - parentOffset.left;

    // get relative X location of click
    var seekLocation = relX * 100 / this.offsetWidth;

    // quantize to be out of 100
    player.seekTo(player.getDuration() * parseInt(seekLocation) / 100);
  });

  if (player.getCurrentTime() == player.getDuration()) {
    $('.next').trigger('click');
  }

}

$("#mute").click(function () {
  player.unMute();
  $("#mute").hide();
  $("#sound").show();
});

$("#sound").click(function () {
  player.mute();
  $("#mute").show();
  $("#sound").hide();
});