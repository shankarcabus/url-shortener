// Urls = new Meteor.Collection("urls");

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
  'click #giveme': function(e){

    var originalUrl = $(".main-field input").val();
    var shortUrl = "htpp://url-shortener.meteor.com/XXXX"

    if (Meteor.user()) {
      Urls.insert({
        user: Meteor.userId(),
        originalUrl: originalUrl,
        shortUrl: shortUrl,
        date: Date.now()
      });
    }

    $(".short-url").show();
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
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
