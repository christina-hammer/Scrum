Teams = new Mongo.Collection("teams");
Posts = new Mongo.Collection("rooms");
if (Meteor.isServer) {

  Meteor.publish("userData", function () {
    return Meteor.users.find({_id: this.userId});
});

  Meteor.publish("teams", function() {
    //for teamId in 
      //console.log(Meteor.users.find({_id: this.userId}));
    return Teams.find({owner: this.userId});
  });


  Meteor.publish("posts", function () {
     return Posts.find();
  });

}

if (Meteor.isClient) {
  
  Meteor.subscribe("teams");

  Meteor.subscribe("posts");
  Meteor.subscribe("userData");
  

  Template.body.helpers({
    teams: function () {
        // Return all of the teams
        
        return Teams.find({}, {sort: {createdAt: -1}});

      },
    posts: function(){
        // Return all of the teams
        return Posts.find({}, {sort: {createdAt: -1}});      
    }
  });

  Template.body.events({
    "submit .new-team":function (event) {
      event.preventDefault();
      //set up the checked property to the opposite of its current value
      var team_name = event.target.inputTeamName.value;
      
     Meteor.call("addTeam", team_name);
    event.target.inputTeamName.value = "";
    },
    "submit .new-post":function(event){
      event.preventDefault();

      var postContents = event.target.post.value;

      Meteor.call("setPost",postContents);

      event.target.post.value = "";
    }
   
  });

   Template.team.helpers({

    isOwner: function () {

      return this.owner === Meteor.userId();

    },
    isMember: function () {
      if (! Meteor.userId()) {
        throw new Meteor.Error("not-authorized");
      }
      
      var team_members = _.values(this.members);
      //console.log(team_members.);
      //var member_found = "false";
      for (var i in team_members) {
        console.log(team_members[i].user);
        console.log(Meteor.userId());
        if (team_members[i].user === Meteor.userId() ) {
          return "true";

        }
      };
      return "false";
    }


  });
  Template.team.events({
     "submit .new-member":function(event) {
      event.preventDefault();
      var member_name = event.target.new_member.value;

      Meteor.call("addMember", member_name, this._id);
      event.target.new_member.value = "";
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
    Posts.insert({
      createdAt: new Date(),
      post : postContents
    })
  
  },
 addMember: function(memberName, teamId) {
    var team = Teams.findOne(teamId);
    var member = Meteor.users.find({username: memberName});
    Teams.update(teamId, {$addToSet: {"members": member._id}} );

  }
});