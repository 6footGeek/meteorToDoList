Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {

    //set up task
    Template.body.helpers({
        tasks: function() {


            if (Session.get("hideCompleted")) {
                //figure out if hide is checked
                return Tasks.find({
                    checked: {
                        $ne: true
                    }
                }, {
                    sort: {
                        createdAt: -1
                    }
                });
            } else {

                //return tasks and sort them by creation date
                return Tasks.find({}, {
                    sort: {
                        createdAt: -1
                    }
                });
            }
        },
        hideCompleted: function() {
            return Session.get("hideCompleted");
        },
        incompleteCount: function() {
        	return Tasks.find({checked: {$ne: true}}).count();
        }
    });


    Template.body.events({
        'submit .new-task': function(event) {
            var text = event.target.text.value;
            Tasks.insert({
                text: text, //text variable above
                createdAt: new Date(), // current time
                owner: Meteor.userId(), 
                username: Meteor.user().username || Meteor.user().services.twitter.screenName // add or for twitter if logged in with twitter
            });

            //clear form
            event.target.text.value = "";

            //prevent default form submit
            return false;
        },
        //#3
        'change .hide-completed input': function(event) {
            Session.set("hideCompleted", event.target.checked);
        }
    });


    Template.task.events({
        //#1
        'click .toggle-checked': function() {
            //set the checked property to the oppo of its current value
            Tasks.update(this._id, {
                $set: {
                    checked: !this.checked
                }
            });
        },
        //#2
        'click .delete': function() {
            Tasks.remove(this._id);
        }

    });


//config all the accounts!
Accounts.ui.config({
	passwordSignupFields: 'USERNAME_ONLY'
});


}
