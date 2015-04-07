Questions = new Mongo.Collection("questions");
Replies = new Mongo.Collection("replies");

if (Meteor.isClient) {
  // At the top of our client code
  Meteor.subscribe("questions");
  Meteor.subscribe("replies");

  // Replace the existing Template.body.helpers
  Template.App.helpers({
    questions: function () {
      if (Session.get("hideCompleted")) {
        // If hide completed is checked, filter questions
        return Questions.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
      } else {
        // Otherwise, return all of the questions
        return Questions.find({}, {sort: {createdAt: -1}});
      }
    },
    hideCompleted: function () {
      return Session.get("hideCompleted");
    },

    // Add to Template.body.helpers
    incompleteCount: function () {
      return Questions.find({checked: {$ne: true}}).count();
    },
    getUser: function (){
      return Meteor.userId();
    }
});

  // Inside the if (Meteor.isClient) block, right after Template.body.helpers:
  Template.App.events({
  "click #submitButton": function (event) {
    // This function is called when the new questions form is submitted

    var text = $("#submitInput").val();
    var tag = $("#question-tag").val();

    Meteor.call("addQuestion", text, tag);

    // Clear form
    $("#submitInput").val("");
    $("#question-tag").val("");

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