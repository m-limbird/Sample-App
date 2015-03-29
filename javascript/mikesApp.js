Tasks = new Mongo.Collection("tasks");
Replies = new Mongo.Collection("replies");

if (Meteor.isClient) {
  // At the top of our client code
  Meteor.subscribe("tasks");
  Meteor.subscribe("replies");

  // Replace the existing Template.body.helpers
  Template.App.helpers({
    tasks: function () {
      if (Session.get("hideCompleted")) {
        // If hide completed is checked, filter tasks
        return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
      } else {
        // Otherwise, return all of the tasks
        return Tasks.find({}, {sort: {createdAt: -1}});
      }
    },
    hideCompleted: function () {
      return Session.get("hideCompleted");
    },

    // Add to Template.body.helpers
    incompleteCount: function () {
      return Tasks.find({checked: {$ne: true}}).count();
    }
});

  // Inside the if (Meteor.isClient) block, right after Template.body.helpers:
  Template.App.events({
  "click #submitButton": function (event) {
    // This function is called when the new task form is submitted

    var text = $("#submitInput").val();

    Meteor.call("addTask", text);

    // Clear form
    $("#submitInput").val("");

    // Prevent default form submit
    return false;
  },
  // Add to Template.body.events
  "change .hide-completed input": function (event) {
    Session.set("hideCompleted", event.target.checked);
  }
  });


  // At the bottom of the client code
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });


}