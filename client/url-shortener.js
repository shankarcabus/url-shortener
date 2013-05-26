Meteor.Router.add({
  '/:_id': { to: function(id) {
    url = Urls.find({shortUrl: id}).fetch();
    if (url.length) {
      window.location = url[0].originalUrl;
    }
  }}
});

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

Handlebars.registerHelper('truncate', function(string, size) {
  if (string.length <= size) {
    return string;
  }
  return string.substring(0, size) + '...';
});

Handlebars.registerHelper('toDate', function(timestamp, size) {
  var date = new Date();
  date.setTime(timestamp);

  return date.toLocaleDateString() + ' - ' + date.toLocaleTimeString()
});

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

    var now = Date.now();

    var originalUrl = $(".main-field input").val();
    var shortUrl = encodeTime(now);
    var $urlBox = $(".short-url-box");

    $urlBox.removeClass('loaded').addClass('loading');

    Urls.insert({
      user: Meteor.user()? Meteor.userId() : '',
      originalUrl: originalUrl,
      shortUrl: shortUrl,
      date: now
    });

    $urlBox.removeClass('loading').addClass('loaded');
    $urlBox.find('.short-url').text(Meteor.absoluteUrl()+shortUrl).select();

    return false;
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
