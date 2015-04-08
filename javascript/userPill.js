if (Meteor.isClient) {

	Template.userPill.helpers({

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
    }

	});


}