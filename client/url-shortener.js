if (Meteor.isClient) {

  Template.content.username = function () {
    return Session.get("name") || "Anonymous";
  };

  // Session.set("name", "Bob"); // page updates automatically!

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

