Teams = new Mongo.Collection("teams");

if (Meteor.isServer) {

  Meteor.publish("userData", function () {
    return Meteor.users.find({_id: this.userId});
});

  Meteor.publish("teams", function() {
    return Teams.find({owner: this.userId});
  });

}

if (Meteor.isClient) {
  
  Meteor.subscribe("teams");
  Meteor.subscribe("userData");
  

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
    var result = Teams.insert({
      teamName: teamName,
      createdAt: new Date(),
      owner: Meteor.userId(),
      members: [{user:Meteor.userId()}]

    });
    //console.log(result);

    var user = Meteor.users.findOne({_id: Meteor.userId()});
   
   Meteor.users.update({_id: user._id}, {$addToSet: {"profile.user_teams": result}} );
    

  }
});