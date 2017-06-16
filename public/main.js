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
            equipmentItems: [],//an array of objects with one property being a boolean value of item checked out.
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
            category: '',
            condition: '',
            description: '',
            datesAvailible: '',
            pickUpLocation: {
                address: '',
                city: '',
                state: '',
                zip:  '',
            },
            gearReview: [],//going to fill this array with objects the have rating number and comments
            ownerId: '',
            imageFileName: '',
        },

        //for click listeners
        loggedIn: false,
        loginClicked: false,
        createAccountClicked: false,
        aboutClicked: false,
        storyClicked: false,
        addGearClicked: false,
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
        clickAddItem: function() {
            if(this.addGearClicked) {
                this.addGearClicked = false;
                return;
            }
            this.addGearClicked = true;
        },


        submitNewAccount: function(event) {
            event.preventDefault();
            if(this.matchPasswords) {
                console.log('passwords match!');
                var thatVm=this;
                $.post('/api/user', this.signUpForm, function(res) {
                    if(res.success) {
                        console.log('account created and logged in!');
                        console.log(res);
                        for (var key in thatVm.signUpForm) {
                            thatVm.signUpForm[key] = '';
                        }
                        thatVm.signUpForm.agreedToTerms = false;
                        thatVm.passwordChecker = '';
                        thatVm.createAccountClicked = false;
                        thatVm.loginClicked = false;
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
            var formData = new FormData();
            for (var key in this.equipmentItem) {
                if(this.equipmentItem[key] === this.equipmentItem.pickUpLocation) {
                    for (let key in this.equipmentItem.pickUpLocation) {
                        formData.append(key, this.equipmentItem.pickUpLocation[key]);
                    } 
                } else {
                    formData.append(key, this.equipmentItem[key]);
                }
            }
            var fileInputElement = document.getElementById('newEquipmentImage');
            formData.append("gearImage", fileInputElement.files[0]);
            $.ajax({
                url: '/api/equipments',
                method: 'POST', 
                contentType: false,
                processData: false,
                data: formData, 
                success: function(res) {
                    if(res.success) {
                        thatVm.clearForm(event);
                        thatVm.addGearClicked = false;
                        console.log(res);
                    }
                },
            });
        },


        //method for reset buttons
        clearForm: function(event) {
            event.preventDefault();
            for (let key in this.signUpForm) {
                this.signUpForm[key] = '';
            }
            for (let key in this.equipmentItem) {
                if(this.equipmentItem[key] === this.equipmentItem.pickUpLocation) {
                    for (let key in this.equipmentItem.pickUpLocation) {
                        this.equipmentItem.pickUpLocation[key] = '';
                    }
                } else {
                    this.equipmentItem[key] = '';
                }
            }
        },


        
        searchNewEquipment: function(event) {
            event.preventDefault();
        }
    }
}); 