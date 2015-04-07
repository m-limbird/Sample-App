
if (Meteor.isClient) {

  Template.question.helpers({
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
    },
    tagDisplay: function () {
      return this.tag;
    },
    replyCount: function () {
      return Replies.find({parentPost: this._id}).count();
    },
    getUser: function (){
      return Meteor.userId();
    }
  });

  // In the client code, below everything else
  Template.question.events({
  "click .toggle-checked": function () {
    // Set the checked property to the opposite of its current value
    Meteor.call("setChecked", this._id, ! this.checked);
  },
  "click .delete": function () {
    Meteor.call("deleteQuestion", this._id);
  },
  "click .toggle-private": function () {
    Meteor.call("setPrivate", this._id, ! this.private);
  },

  });

}