var mainAppVue = new Vue({
    el: '#app',
    data: {
        loginClicked: false,
        createAccountClicked: false,
        signUpForm: {
            // passwordsMatch: false,
            username: 'Chuckles',
            passwordInputOne: 'asdf',
            passwordInputTwo: 'asdf',
            state: 'co',
            age: '2',
            email: 'chuck',
            agreedToTerms: true,
        },
        login: {
            title: '<h2>How to get started</h2>',
            first: '<li>Set up your user account with a username and password. This user account will allow you to be a Sharer and an Explorer. You will need to agree to the terms of being both a Sharer and an Explorer.</li>',
            second: '<li>1.	As a Sharer, take pictures of your equipment packed and set-up. Create a posting of your equipment with model information, instructions, location, availability, and condition.</li>',
            third: '<li>As an Explorer, search for the equipment based on location, equipment, and/or availability.</li>'
        },
        about: "About The idea baby for Lantern came about after my wife and I decided we wanted to visit San Francisco. We realized we had enough frequent flyer miles to fly to San Francisco from our home in Colorado. Unfortunately, when we looked at hotel costs we realized we could not afford the trip after a rental car and food expenses. If only we could camp near San Francisco we would save the cost of hotels and breakfast. We are avid campers in Colorado and with all the necessary gear (plus a little extra!). But how do you bring all your camping gear on a plane without all the extra fees. This is where the Lantern idea was born. What if we could rent camping gear from someone in San Francisco and camp near San Francisco? Could we rent out our extra camping stuff when we are not using it? Could we share our outdoor expertise with people visiting Colorado? And the lantern was lit!",
        What: "What is Lantern? We want everyone to explore the outdoors, even if you do not have the equipment. This is where the kindergarten lesson of “sharing is caring” comes into play. At Lantern, a Sharer posts outdoor equipment they have to share with Explorers. For example, you have an extra tent in good condition that you never use. You can post it on Lantern, and another outdoor enthusiast visiting your region can rent it for the weekend. An Explorer searches for what equipment they will need based on location, availability, and/or type of equipment. The Sharer sets the price for the rental and how the equipment rental will occur. When an Explorer rents the equipment a hold will be placed for the value of the equipment, once the equipment is returned in good condition the hold will be removed and online the price of the rental will be charged." 
    },
    computed: {
        matchPasswords: function() {
            if(this.signUpForm.passwordInputOne === this.signUpForm.passwordInputTwo) {
                return true;
            }
            else { return false }
        }
    },
    methods: {
        clickLogin: function() {
            if(this.loginClicked) {
                this.loginClicked = false;
                return;
            }
            this.loginClicked = true;
        },
        clickCreateAccount: function() {
            if(this.createAccountClicked) {
                this.createAccountClicked = false;
                return;
            }
            this.createAccountClicked = true;
        },
        submitNewAccount: function(event) {
            event.preventDefault();
            console.log('this ran!');
            if(this.matchPasswords) {
                console.log('passwords match!');
                $.post('/api/user', this.signUpForm, function(res) {
                    if(res) {
                        console.log('account created and logged in!');
                    } else {
                        console.log(res);
                    }
                });
            } else {
                console.log('passwords don\'t match');
            }
        }
    }
}); 