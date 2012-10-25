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
            if (tval != "" && !Groups.findOne({ name: tval })) { Groups.insert({ name: tval }); }
            document.getElementsByName("gname")[0].value = "";
        },
        "click button.pmessage": function () {
            var tval = document.getElementsByName("message")[0].value;
            if (Meteor.user()) {
                if (Meteor.user().profile.name && tval != "") {
                    Messages.insert({ message: tval, from: Meteor.user().profile.name, group: Session.get("current_group") });
                } else if(tval != "") {
                    Messages.insert({ message: tval, from: Meteor.user().emails[0].address, group: Session.get("current_group") });
                }
            } else if(tval != "") {
                Messages.insert({ message: tval, from: "anonymous", group: Session.get("current_group") });
            }
            document.getElementsByName("message")[0].value = "";
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {});
}
