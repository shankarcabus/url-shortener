Meteor.Router.add({
  '/:_id': { to: function(id) {
    url = Urls.find({shortUrl: id}).fetch();
    if (url.length) {
      window.location = url[0].originalUrl;
    }
  }}
});

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.indexOf(str) == 0;
  };
}

Number.prototype.toBase = function (base) {
  var symbols = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
    decimal = this,
    conversion = "";
  // Base may not be greater than symbols neither less than 2
  if (base > symbols.length || base < 2) {
    return false;
  }
  // Using the method of successive divisions
  while (decimal > 0) {
    // Quotient of division
    var quotient = Math.floor(decimal / base)
    // Remainder of division
    var remainder = decimal - (base * quotient)
    // Prepend the symbol
    conversion = symbols[remainder] + conversion;
    decimal = quotient;
  }
  return conversion;
}

var encodeTime = function(timestamp){
  var base = 62;
  return (Math.floor(timestamp)).toBase(base)
}

var isUrl= function(url){
  var urlRegex = /(https?:\/\/[^\s\(\)]+)|(w{3}(\.\w+){2,}((\/|\?)[^\s\(\)]*)?)|((((?:\b)\w{1,2}(?=\.))|[^w\W]{3}|\w{4,})(\.\w+)+(\/|\?)[^\s\(\)]*)/i;
  return urlRegex.test(url);
}

Accounts.ui.config({
  requestPermissions: {
    facebook: ['user_likes'],
    github: ['user', 'repo']
  },
  requestOfflineToken: {
    google: true
  },
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});

Template.field.events({
  'click #giveme': function(){

    var originalUrl = $('.main-field input').val(),
      $urlBox = $('.short-url-box'),
      $mainField = $('.main-field'),
      now = Date.now(),
      shortUrl = encodeTime(now);

    $mainField.removeClass('invalid');
    $urlBox.removeClass('loaded');

    if (isUrl(originalUrl)) {

      // Adds 'http://' to original URL when there isn't
      if (!(originalUrl.startsWith('http://') || originalUrl.startsWith('https://'))) {
        originalUrl = 'http://'+originalUrl;
      }

      $urlBox.addClass('loading');

      Urls.insert({
        user: Meteor.user()? Meteor.userId() : '',
        originalUrl: originalUrl,
        shortUrl: shortUrl,
        date: now
      });

      $urlBox.removeClass('loading').addClass('loaded');
      $urlBox.find('.short-url').text(Meteor.absoluteUrl()+shortUrl).select();

      return false;
    }

    $mainField.addClass('invalid');

  },

  'click .short-url-box': function(){
    $('.short-url').select();
  }
});

if (Meteor.isClient) {
  Template.list.urls = function(){
    return Urls.find({
      user: Meteor.userId()
    },
    {
      sort: {date: -1}}
    );
  }

  Template.list.absoluteUrl = function(){
    return Meteor.absoluteUrl();
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
