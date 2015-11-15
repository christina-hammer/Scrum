Teams = new Mongo.Collection("teams");
Rooms = new Mongo.Collection("rooms");
if (Meteor.isServer) {
  Meteor.publish("teams", function() {
    //for teamId in 
      //console.log(Meteor.users.find({_id: this.userId}));
    return Teams.find({owner: this.userId});
  });

  Meteor.publish("rooms", function () {
     return Rooms.find();
  });
}

if (Meteor.isClient) {
  
  Meteor.subscribe("teams");
  Meteor.subscribe("rooms");

  

  Template.body.helpers({
    teams: function () {
        // Return all of the teams
        return Teams.find({}, {sort: {createdAt: -1}});
      },
    posts: function(){
        // Return all of the teams
        return Rooms.find({}, {sort: {createdAt: -1}});      
    }
  });

  Template.body.events({
  "submit .new-team":function (event) {
    event.preventDefault();
    //set up the checked property to the opposite of its current value
    var team_name = event.target.inputTeamName.value;
    
   Meteor.call("addTeam", team_name);
  },
  "submit .new-post":function(event){
    event.preventDefault();

    var postContents = event.target.post.value;

    Meteor.call("setPost",postContents);

    event.target.post.value = "";
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

    Rooms.insert({
      posts:[{post:"Hello World"}]
    }, function(error, roomId){
          Teams.insert({
          teamName: teamName,
          createdAt: new Date(),
          owner: Meteor.userId(),
          roomId: roomId,
          members: [{member: Meteor.userId()}],
        }, function(error, teamid){
          console.log(teamid);
          console.log(error);
          /*Meteor.users.update(Meteor.userId(),{
            profile:[]
          });*/        
        });
        });
    console.log(Meteor.user());
      //One unique ID is 6nmGsw8Tf8vsei6bF
    
  },
  setPost: function (postContents){
    Rooms.insert({
      createdAt: new Date(),
      post : postContents
    });
  }
});