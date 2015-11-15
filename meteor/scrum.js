Teams = new Mongo.Collection("teams");
Rooms = new Mongo.Collection("rooms");
if (Meteor.isServer) {

  Meteor.publish("userData", function () {
    return Meteor.users.find({_id: this.userId});
});

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
  Meteor.subscribe("userData");
  

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


      var result = Teams.insert({
        teamName: teamName,
        createdAt: new Date(),
        owner: Meteor.userId(),
        members: [{member: Meteor.userId()}],
      }, function(error, teamid){
        console.log(teamid);
        console.log(error);
        /*Meteor.users.update(Meteor.userId(),{
          profile:[]
        });*/        
      });

    var user = Meteor.users.findOne({_id: Meteor.userId()});
   
    Meteor.users.update({_id: user._id}, {$addToSet: {"profile.user_teams": result}} );

  },
  setPost: function (postContents){
    Rooms.insert({
      createdAt: new Date(),
      post : postContents
    })
  
  }
});