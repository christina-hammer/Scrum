Teams = new Mongo.Collection("teams");

if (Meteor.isServer) {
  Meteor.publish("teams", function() {
    return Teams.find({owner: this.userId});
  });
}

if (Meteor.isClient) {
  
  Meteor.subscribe("teams");

  

  Template.body.helpers({
    teams: function () {
        // Return all of the teams
        return Teams.find({}, {sort: {createdAt: -1}});
      }
  });

  Template.body.events({
  "submit form":function (event) {
    event.preventDefault();
    //set up the checked property to the opposite of its current value
    var team_name = event.target.inputTeamName.value;
    
   Meteor.call("addTeam", team_name);
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