Groups = new Meteor.Collection("groups");
Messages = new Meteor.Collection("messages");

Groups.allow({
	insert: function (userId, group) {
		return true;
	}
});

Messages.allow({
	insert: function (userId, message) {
		return true;
	}
});

if (Meteor.isClient) {
	Template.mainPage.groups = function () {
		return Groups.find({}, { sort: { name: 1 } });
	};

	Template.mainPage.warning = function () {
		if (Meteor.user()) {
			if (!Meteor.user().username) {
				return "It is recommended that you don't sign in only with the default accounts system, because your email will be displayed whenever you post something."
			}
		}
	}

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
		"click button.cgroup": function () {
			var tval = document.getElementsByName("gname")[0].value;
			Groups.insert({ name: tval });
			document.getElementsByName("gname")[0].value = "";
		},
		"click button.pmessage": function () {
			var tval = document.getElementsByName("message")[0].value;
			if (Meteor.user()) {
				if (Meteor.user().username) {
					Messages.insert({ message: tval, from: Meteor.user().username, group: Session.get("current_group") });
				} else {
					Messages.insert({ message: tval, from: Meteor.user().emails[0].address, group: Session.get("current_group") });
				}
			} else {
				Messages.insert({ message: tval, from: "anonymous", group: Session.get("current_group") });
			}
			document.getElementsByName("message")[0].value = "";
		}
	});
}

if (Meteor.isServer) {
	Meteor.startup(function () {});
}
