
if (Meteor.isClient) {

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
    },
    replies: function () {
        return Replies.find({parentPost: this._id}, {sort: {createdAt: -1}});
    },
    replyCount: function () {
      return Replies.find({parentPost: this._id}).count();
    }
  });

  // In the client code, below everything else
  Template.Post.events({
  "click .delete": function () {
    Meteor.call("deleteReply", this._id);
  },
  "click .toggle-private": function () {
    Meteor.call("setPrivate", this._id, ! this.private);
  },
  "click #submitButton": function (event) {
    // This function is called when the new task form is submitted

    var text = $("#submitInput").val();

    Meteor.call("addReply", text, this._id);

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

}