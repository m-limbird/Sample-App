// At the bottom of simple-todos.js, outside of the client-only block
Meteor.methods({
  addQuestion: function (text, tag) {
    // Make sure the user is logged in before inserting a question
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Questions.insert({
      tag: tag,
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  addReply: function (text, questionId) {
    // Make sure the user is logged in before inserting a question
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Replies.insert({
      parentPost: questionId,
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  deleteQuestion: function (questionId) {
    var question = Questions.findOne(questionId);
    if (question.private && question.owner !== Meteor.userId()) {
      // If the question is private, make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }
    Questions.remove(questionId);
  },
  deleteReply: function (questionId) {
    var reply = Replies.findOne(questionId);
    if (reply.owner !== Meteor.userId()) {
      // If the question is private, make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }
    Replies.remove(questionId);
  },
  setChecked: function (questionId, setChecked) {
    var question = Questions.findOne(questionId);
    if (question.private && question.owner !== Meteor.userId()) {
      // If the question is private, make sure only the owner can check it off
      throw new Meteor.Error("not-authorized");
    }
    Questions.update(questionId, { $set: { checked: setChecked} });
  },
  setPrivate: function (questionId, setToPrivate) {
    var question = Questions.findOne(questionId);

    // Make sure only the question owner can make a question private
    if (question.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Questions.update(questionId, { $set: { private: setToPrivate } });
  }

});

if (Meteor.isServer) {
  Meteor.publish("questions", function () {
    return Questions.find({
      $or: [
        { private: {$ne: true} },
        { owner: this.userId }
      ]
    });
  });

  Meteor.publish("replies", function () {
    return Replies.find({});
  });
}


Router.map(function(){
  this.route('App', {path: '/'});
  this.route('/Post/:_id', {
    name: 'Post',
    data: function(){
      questionId: this.params._id;
      return Questions.findOne(this.params._id);
    }
  });
  this.route('/Me/:userId', {
    name: 'Me',
    data: function(){
      userId: this.params.userId;
      return userId;
    }
  });
  this.route('/Search', {
    name: 'Search',
    path: '/Search',
    data: function(){
      Session.set("filter",1);
    }
  });
})