Teams = new Mongo.Collection("teams");

if (Meteor.isServer) {
  Meteor.publish("teams", function() {
    return Teams.find();
  });
}

if (Meteor.isClient) {
  
  Meteor.subscribe("teams");

  Meteor.call("addTeam", "Alex and Kit dream town, population 2");

  Template.body.helpers({
    teams: function () {
        // Return all of the teams
        return Teams.find({}, {sort: {createdAt: -1}});
      }
  });
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}


 Meteor.methods({
  addTeam: function (teamName) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Teams.insert({
      teamName: teamName,
      createdAt: new Date(),
      owner: Meteor.userId(),
      users: [{user:Meteor.userId()}]
    });
  }
});