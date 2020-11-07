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

hiddenPlayer.attr("src", initSongSrc);
title.html(initSongTitle);
cover.attr('src', initSongCover);

$('.next').on('click', function () {
  var songOrder = hiddenPlayer.attr('order');

  if (items == songOrder) {
    num = 0;
    var songSrc = songs[0].src;
    var songTitle = songs[0].title;
    var songCover = songs[0].coverart;
    hiddenPlayer.attr('order', '0');
    hiddenPlayer.attr('src', songSrc).trigger('play');
    title.html(songTitle);
    cover.attr('src', songCover);
  } else {
    console.log(songOrder);
    num += 1;
    var songSrc = songs[num].src;
    var songTitle = songs[num].title;
    var songCover = songs[num].coverart;
    hiddenPlayer.attr('src', songSrc).trigger('play');
    title.html(songTitle);
    cover.attr('src', songCover);
    hiddenPlayer.attr('order', num);
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
  hiddenPlayer[0].play();
  player.playVideo();
  $("#playmusic").hide();
  $("#pause").show().addClass('active');
});

$("#pause").click(function () {
  hiddenPlayer[0].pause();
  player.pauseVideo();
  $("#playmusic").show();
  $("#pause").hide();
});

hiddenPlayer.on('timeupdate', function () {
  var songLength = secondsTimeSpanToHMS(this.duration)
  var songLengthParse = songLength.split(".")[0];

  var songCurrent = secondsTimeSpanToHMS(this.currentTime)
  var songCurrentParse = songCurrent.split(".")[0];
  $('#seekBar').attr("value", this.currentTime / this.duration);

  if (!hiddenPlayer[0].paused) {
    $("#playmusic").hide();
    $("#pause").show();
    $('#seekBar').css('cursor', 'pointer');
    $('#seekBar').on('click', function (e) {
      var parentOffset = $(this).parent().offset();
      var relX = e.pageX - parentOffset.left;

      // get relative X location of click
      var seekLocation = relX * 100 / this.offsetWidth;

      // quantize to be out of 100
      var second = hiddenPlayer[0].duration * parseInt(seekLocation) / 100;
      hiddenPlayer[0].currentTime = second;

      player.seekTo(player.getDuration() * parseInt(seekLocation) / 100);
    })
  }

  if (this.currentTime == this.duration) {
    $('.next').trigger('click');
  }
});

$("#mute").click(function () {
  hiddenPlayer[0].volume = 1;
  $("#mute").hide();
  $("#sound").show();
});

$("#sound").click(function () {
  hiddenPlayer[0].volume = 0;
  $("#mute").show();
  $("#sound").hide();
});