Groups = new Meteor.Collection("groups");
Messages = new Meteor.Collection("messages");

if (Meteor.isClient) {
  Template.mainPage.groups = function () {
    return Groups.find({}, { sort: { name: 1 } });
  };

  Template.group.selected = function () {
    if (Session.equals("current_group", this._id)) {
	  return "selected";
	} else {
	  return "";
	}
  };

  Template.group.events({
    "click": function () {
	  Session.set("current_group", this._id);
	}
  });

  Template.mainPage.messages = function () {
    return Messages.find({ group: Session.get("current_group") });
  };

  Template.mainPage.group = function () {
    return Groups.findOne(Session.get("current_group"));
  };

  Template.mainPage.events({
    "click input.cgroup": function () {
	  var tval = document.getElementsByName("gname")[0].value;
	  Groups.insert({name: tval});
	  document.getElementsByName("gname")[0].value = "";
	},
	"click input.pmessage": function () {
	  var tval = document.getElementsByName("message")[0].value;
	  if (tval != "") { Messages.insert({ group: Session.get("current_group"), message: tval, from: "ajay" }); }
	  document.getElementsByName("message")[0].value = "";
	}
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
