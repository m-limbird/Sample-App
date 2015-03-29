// simple-todos.js
Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  // At the top of our client code
  Meteor.subscribe("tasks");

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













  Template.Post.helpers({
    isOwner: function () {
      return this.owner === Meteor.userId();
    },
    elapsedTime: function () {
      var timeString = "";
      var timeDesc = "";
      currentTime = new Date();
      elapsed = currentTime - this.createdAt; //time in milliseconds
      if (elapsed >= 86400000) {
        time = elapsed / 86400000;
        if (time.toFixed(0) == 1)
          timeDesc = " Day";
        else
          timeDesc = " Days";
        timeString = time.toFixed(0) + timeDesc;
      } else if (elapsed >= 3600000){
        time = elapsed / 3600000;
        if (time.toFixed(0) == 1)
          timeDesc = " Hour";
        else
          timeDesc = " Hours";
        timeString = time.toFixed(0) + timeDesc;
      } else if (elapsed >= 60000){
        time = elapsed / 60000;
        if (time.toFixed(0) == 1)
          timeDesc = " Minute";
        else
          timeDesc = " Minutes";
        timeString = time.toFixed(0) + timeDesc;
      } else if (elapsed >= 1000){
        time = elapsed / 1000;
        if (time.toFixed(0) == 1)
          timeDesc = " Second";
        else
          timeDesc = " Seconds";
        timeString = time.toFixed(0) + timeDesc;
      }  
      
      return timeString;
    },
    textDisplay: function () {
      var longString = "";
      if (this.text.length > 50)
        longString = this.text.substring(0,50) + "...";
      else
        longString = this.text;

      return longString;
    }
  });

  // In the client code, below everything else
  Template.Post.events({
  "click .toggle-checked": function () {
    // Set the checked property to the opposite of its current value
    Meteor.call("setChecked", this._id, ! this.checked);
  },
  "click .delete": function () {
    Meteor.call("deleteTask", this._id);
  },
  "click .toggle-private": function () {
    Meteor.call("setPrivate", this._id, ! this.private);
  },
  // "click #the-task": function () {
  //   Router.go('Post', {theTask: this._id});
  // }
  });










  Template.task.helpers({
    isOwner: function () {
      return this.owner === Meteor.userId();
    },
    elapsedTime: function () {
      var timeString = "";
      var timeDesc = "";
      currentTime = new Date();
      elapsed = currentTime - this.createdAt; //time in milliseconds
      if (elapsed >= 86400000) {
        time = elapsed / 86400000;
        if (time.toFixed(0) == 1)
          timeDesc = " Day";
        else
          timeDesc = " Days";
        timeString = time.toFixed(0) + timeDesc;
      } else if (elapsed >= 3600000){
        time = elapsed / 3600000;
        if (time.toFixed(0) == 1)
          timeDesc = " Hour";
        else
          timeDesc = " Hours";
        timeString = time.toFixed(0) + timeDesc;
      } else if (elapsed >= 60000){
        time = elapsed / 60000;
        if (time.toFixed(0) == 1)
          timeDesc = " Minute";
        else
          timeDesc = " Minutes";
        timeString = time.toFixed(0) + timeDesc;
      } else if (elapsed >= 1000){
        time = elapsed / 1000;
        if (time.toFixed(0) == 1)
          timeDesc = " Second";
        else
          timeDesc = " Seconds";
        timeString = time.toFixed(0) + timeDesc;
      }  
      
      return timeString;
    },
    textDisplay: function () {
      var longString = "";
      if (this.text.length > 290)
        longString = this.text.substring(0,290) + " --(continue)";
      else
        longString = this.text;

      return longString;
    }
  });

  // In the client code, below everything else
  Template.task.events({
  "click .toggle-checked": function () {
    // Set the checked property to the opposite of its current value
    Meteor.call("setChecked", this._id, ! this.checked);
  },
  "click .delete": function () {
    Meteor.call("deleteTask", this._id);
  },
  "click .toggle-private": function () {
    Meteor.call("setPrivate", this._id, ! this.private);
  },
  // "click #the-task": function () {
  //   Router.go('Post', {theTask: this._id});
  // }
  });


  // At the bottom of the client code
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });


}

// At the bottom of simple-todos.js, outside of the client-only block
Meteor.methods({
  addTask: function (text) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  deleteTask: function (taskId) {
    var task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }
    Tasks.remove(taskId);
  },
  setChecked: function (taskId, setChecked) {
    var task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error("not-authorized");
    }
    Tasks.update(taskId, { $set: { checked: setChecked} });
  },
  setPrivate: function (taskId, setToPrivate) {
    var task = Tasks.findOne(taskId);

    // Make sure only the task owner can make a task private
    if (task.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.update(taskId, { $set: { private: setToPrivate } });
  }
});

if (Meteor.isServer) {
  Meteor.publish("tasks", function () {
    return Tasks.find({
      $or: [
        { private: {$ne: true} },
        { owner: this.userId }
      ]
    });
  });
}

// Router.route('/', function () {
//   this.render('Home', {
//     data: function () { return Items.findOne({_id: this.params._id}); }
//   });
// });

Router.map(function(){
  this.route('App', {path: '/'});
  this.route('/Post/:_id', {
    name: 'Post',
    data: function(){
      return Tasks.findOne(this.params._id);
    }
  })
})