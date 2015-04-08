
if (Meteor.isClient) {

  Template.Search.helpers({
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
    settings: function() {
      var filter = Session.get("filter");
      if(filter === 1)
        return {
          position: "bottom",
          limit: 5,
          rules: [
            {
              token: '',
              collection: Questions,
              field: "tag",
              template: Template.userPill
            },
          ]
        };
      if(filter === 2)
        return {
          position: "bottom",
          limit: 5,
          rules: [
            {
              token: '',
              collection: Questions,
              field: "createdAt",
              template: Template.userPill
            },
          ]
        };
      if(filter === 3)
        return {
          position: "bottom",
          limit: 5,
          rules: [
            {
              token: '',
              collection: Questions,
              field: "text",
              template: Template.userPill
            },
          ]
        };
    },
    searchingTags: function () {
      if (Session.get("filter") === 1)
        return true;
      else
        return false;
    },
    searchingDates: function () {
      if (Session.get("filter") === 2)
        return true;
      else
        return false;
    },
    searchingText: function (){
      if (Session.get("filter") === 3)
        return true;
      else
        return false;
    },
    textDisplay: function () {
      var longString = "";
      if (this.text.length > 50)
        longString = this.text.substring(0,50) + "...";
      else
        longString = this.text;

      return longString;
    },
    search: function () {
      var searchTag = Session.get("searchTag");
      var filter = Session.get("filter");
      if(filter === 1){
        if (searchTag === "")
          return Questions.find({ tag: searchTag });
        return Questions.find({ tag: {$regex : searchTag, $options:"i"} });
      }
      else if (filter === 2){
        if (searchTag === "")
          return Questions.find({ createdAt: searchTag });
        return Questions.find({ createdAt: {$regex : searchTag, $options:"i"} });
      }
      else
        if (searchTag === "")
          return Questions.find({ text: searchTag });
        return Questions.find({ text: {$regex : searchTag, $options:"i"} });
    },
    replies: function () {
        return Replies.find({parentPost: this._id}, {sort: {createdAt: -1}});
    },
    replyCount: function () {
      return Replies.find({parentPost: this._id}).count();
    },
    getFilter: function (){
      return Session.get("filter");
    },
    getResults: function () {
      var searchTag = Session.get("searchTag");
      var filter = Session.get("filter");
      if(filter === 1){
        if (searchTag === "")
          return Questions.find({ tag: searchTag }).count();
        return Questions.find({ tag: {$regex : searchTag, $options:"i"} }).count();
      }
      else if (filter === 2){
        if (searchTag === "")
          return Questions.find({ createdAt: searchTag }).count();
        return Questions.find({ createdAt: {$regex : searchTag, $options:"i"} }).count();
      }
      else
        if (searchTag === "")
          return Questions.find({ text: searchTag }).count();
        return Questions.find({ text: {$regex : searchTag, $options:"i"} }).count();
    },
    getUser: function (){
      return Meteor.userId();
    }
  });

  // In the client code, below everything else
  Template.Search.events({
  "click .delete": function () {
    Meteor.call("deleteReply", this._id);
  },
  "click .toggle-private": function () {
    Meteor.call("setPrivate", this._id, ! this.private);
  },
  "click #submitButton": function (event) {
    // This function is called when the new question form is submitted

    var text = $("#submitInput").val();

    Meteor.call("addReply", text, this._id);

    // Clear form
    $("#submitInput").val("");

    // Prevent default form submit
    return false;
  },
  
  "click #first": function(event) {
    $("#first").css({"background-color":"#3276B1", "color":"white"});
    $("#second").css({"background-color": "#FFF", "color":"black"});
    $("#third").css({"background-color": "#FFF", "color":"black"});
    Session.set("filter", 1);
  },

  "click #second": function(event) {
    $("#first").css({"background-color": "#FFF", "color":"black"});
    $("#second").css({"background-color":"#3276B1", "color":"white"});
    $("#third").css({"background-color": "#FFF", "color":"black"});
    Session.set("filter", 2);
  },

  "click #third": function(event) {
    $("#first").css({"background-color": "#FFF", "color":"black"});
    $("#second").css({"background-color": "#FFF", "color":"black"});
    $("#third").css({"background-color":"#3276B1", "color":"white"});
    Session.set("filter", 3);
  },

  // Add to Template.body.events
  "change .hide-completed input": function (event) {
    Session.set("hideCompleted", event.target.checked);
  },

    // Add to Template.body.events
  "keyup #search-field-tag": function (event) {
    var findTag = $("#search-field-tag").val();
    Session.set("searchTag", findTag );
  },

  "keyup #search-field-date": function (event) {
    var findTag = $("#search-field-date").val();
    Session.set("searchTag", findTag );
  }, 

  "keyup #search-field-text": function (event) {
    var findTag = $("#search-field-text").val();
    Session.set("searchTag", findTag );
  }, 

  "autocompleteselect input": function(event, template, doc) {
    var filter = Session.get("filter");
    if (filter === 1){
      var findTag = $("#search-field-tag").val();
      Session.set("searchTag", findTag );
    }
    if (filter === 2){
      var findTag = $("#search-field-date").val();
      Session.set("searchTag", findTag );
    }
    if (filter === 3){
      var findTag = $("#search-field-text").val();
      Session.set("searchTag", findTag );
    }
  }

  });

}

