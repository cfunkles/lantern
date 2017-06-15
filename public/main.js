var mainAppVue = new Vue({
    el: '#app',
    data: {
        signUpForm: {
            username: '',
            password: '',
            name: '',
            state: '',
            email: '',
            agreedToTerms: false,
        },
        passwordChecker: '',

        loginForm: {
            username: '',
            password: '',
        },

        userInfo: {
            username: '',
            name: '',
            state: '',
            email: '',
            numberOfPieces: '',
            equipmentItems: [],
            rentedItems: [],
            sharerRating: '',
            explorerReviews: [],
            canSetUpGear: false,
        },

        equipmentItem: {
            name: '',
            brand: '',
            model: '',
            size: '',
            category: {
                shelter: false,
                kitchen: false,
                containers: false,
                lighting: false,
                sleeping: false,
                other: false,
            },
            condition: {
                new: false,
                likeNew: false,
                slightlyUsed: false,
                fair: false,
            },
            description: '',
            datesAvailible: '',
            pickUpLocation: {
                address: '',
                city: '',
                state: '',
                zip:  '',
            },
            gearReview: [],
            lanternRating: [],
            ownerId: 'objectId',
            // image: '',
        },

        //for click listeners
        loggedIn: false,
        loginClicked: false,
        createAccountClicked: false,
        aboutClicked: false,
        storyClicked: false,
    },



    computed: {
        //checks two password inputs for equalness. returns boolean when evaluated
        matchPasswords: function() {
            if(this.signUpForm.password === this.signUpForm.passwordChecker) {
                //add this feature later
                // if(password.length > 10) {
                //     return true;
                // }
                return true;
            }
            else { return false; }
        }
    },


    methods: {
        //click listeners
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
        clickNavAbout: function() {
            if(this.aboutClicked) {
                this.aboutClicked = false;
                return;
            }
            this.aboutClicked = true;
        },
        clickNavStory: function() {
            if(this.storyClicked) {
                this.storyClicked = false;
                return;
            }
            this.storyClicked = true;
        },


        //submits new user form. update error handeling stuff still
        submitNewAccount: function(event) {
            event.preventDefault();
            if(this.matchPasswords) {
                console.log('passwords match!');
                var thatVm=this;
                $.post('/api/user', this.signUpForm, function(res) {
                    if(res) {
                        console.log('account created and logged in!');
                        console.log(res);
                        thatVm.signUpForm.username = '';
                        thatVm.signUpForm.password = '';
                        //why is name not blue?
                        thatVm.signUpForm.name = '';
                        thatVm.signUpForm.state = '';
                        thatVm.signUpForm.email = '';
                        thatVm.signUpForm.agreedToTerms = false;
                        thatVm.passwordChecker = '';
                        thatVm.createAccountClicked = false;
                        thamVm.loginClicked = false;
                        thatVm.loggedIn = true;
                    } else {
                        console.log(res);
                    }
                });
            } else {
                console.log('passwords don\'t match');
            }
        },
        submitLogin: function(event) {
            event.preventDefault();
            var thatVm = this;
            $.get('/api/user/' + this.loginForm.username + '/' + this.loginForm.password, function(user) {
                if (user === 'login error') {
                    console.log('error logging in!');
                } else {
                    thatVm.loginForm.username = '';
                    thatVm.loginForm.password = '';
                    thatVm.loginClicked = false;
                    thatVm.createAccountClicked = false;
                    thatVm.loggedIn = true;
                    console.log(user);
                }
            });
        },
        submitNewEquipment: function(event) { 
            event.preventDefault();
            var thatVm = this;
            $.post('/api/equipments', this.equipmentItem, function(res) {
                if(res) {
                    console.log('item created!');
                    console.log(res);
                    thatVm.equipmentItem = '';
                } else {
                    console.log(res);
                    console.log('item not created');
                }
            });
        }
    }
}); 