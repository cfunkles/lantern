var mainAppVue = new Vue({
    el: '#app',
    data: {
        searchCity: '',
        signUpForm: {
            username: '',
            password: '',
            name: '',
            state: '',
            email: '',
            canSetUpGear: false,
            agreedToTerms: false,
        },


        passwordChecker: '',


        loginForm: {
            username: '',
            password: '',
        },

        //info grabbed users objectID upon login
        userInfo: {
            username: '',
            name: '',
            state: '',
            email: '',
            ratings: '',
            canSetUpGear: false,
            messages: [],
        },

        //used for keeping info that gets submitted to database uppon creation
        equipmentItem: {
            name: '',
            brand: '',
            model: '',
            size: '',
            category: '',
            condition: '',
            description: '',
            pickUpLocation: {
                address: '',
                city: '',
                state: '',
                zip:  '',
            },
            usersRenting: [{userId: 'userId', date: 'date'}],
            canSetUpGear: false,
            gearReview: [],//going to fill this array with objects the have rating number and comments
            ownerId: '',
            imageFileName: '',
        },


        //change this depending what items user wants to see.
        equipmentArray: [],


        //for click listeners
        loggedIn: false,
        loginClicked: false,
        createAccountClicked: false,
        aboutClicked: false,
        storyClicked: false,
        addGearClicked: false,
        userClicked: false,
        ownedClicked: false,
        rentedClicked: false,
        home: true,
        searchMade: false,
        messagesClicked: false,
    },



    computed: {
        //checks two password inputs for equalness. returns boolean when evaluated
        checkPasswords: function() {
            //only use password length validation check in production mode
            if(this.signUpForm.password === this.passwordChecker && this.signUpForm.password.length > 7) {
                return true;
            }
            else { 
                console.log('false');
                return false; 
            }
        },
        displayMessages: function() {
            var messages = '';
            for (var message in this.userInfo.messages) {
                messages += this.userInfo.messages[message].message + ', ';
            }
            return messages;
        }
    },


    methods: {
        //click listeners
        clickLogin: function() {
            if(this.loginClicked) {
                this.clickHome();
                return;
            }
            this.loginClicked = true;
            this.aboutClicked = false;
            this.storyClicked = false;
            this.createAccountClicked = false;
            this.searchMade = false;
            this.home = false;
        },
        clickCreateAccount: function() {
            if(this.createAccountClicked) {
                this.clickHome();
                return;
            }
            this.createAccountClicked = true;
            this.loginClicked = false;
            this.aboutClicked = false;
            this.storyClicked = false;
            this.searchMade = false;
            this.home = false;
        },
        clickUser: function() {
            if (this.userClicked) {
                this.clickHomeLoggedIn();
                return;
            }
            this.getUserInfo();
            this.userClicked = true;
            this.aboutClicked = false;
            this.storyClicked = false;
            this.addGearClicked = false;
            this.ownedClicked = false;
            this.rentedClicked = false;
            this.searchMade = false;
            this.home = false;
        },
        clickNavAbout: function() {
            if(this.aboutClicked) {
                this.clickHome();
                this.clickHomeLoggedIn();
                return;
            }
            this.aboutClicked = true;
            this.storyClicked = false;
            this.addGearClicked = false;
            this.ownedClicked = false;
            this.rentedClicked = false;
            this.loginClicked = false;
            this.createAccountClicked = false;
            this.searchMade = false;
            this.userClicked = false;
            this.home = false;
        },
        clickNavStory: function() {
            if(this.storyClicked) {
                this.clickHome();
                this.clickHomeLoggedIn();
                return;
            }
            this.storyClicked = true;
            this.aboutClicked = false;
            this.ownedClicked = false;
            this.rentedClicked = false;
            this.addGearClicked =false;
            this.loginClicked = false;
            this.userClicked = false;
            this.createAccountClicked = false;
            this.searchMade = false;
            this.home = false;
        },
        clickAddItem: function() {
            if(this.addGearClicked) {
                this.clickHomeLoggedIn();
                return;
            }
            this.addGearClicked = true;
            this.storyClicked = false;
            this.aboutClicked = false;
            this.ownedClicked = false;
            this.userClicked = false;
            this.rentedClicked = false;
            this.searchMade = false;
            this.home = false;
        },
        clickOwned: function() {
            if(this.ownedClicked) {
                this.clickHomeLoggedIn();
                return;
            }
            this.getOwnedItems();
            this.ownedClicked= true;
            this.rentedClicked = false;
            this.addGearClicked = false;
            this.storyClicked = false;
            this.userClicked = false;
            this.aboutClicked = false;
            this.searchMade = false;
            this.home = false;
        },
        clickRented: function() {
            if(this.rentedClicked) {
                this.clickHomeLoggedIn();
                return;
            }
            this.getRentedItems();
            this.rentedClicked = true;
            this.ownedClicked = false;
            this.addGearClicked = false;
            this.storyClicked = false;
            this.userClicked = false;
            this.aboutClicked = false;
            this.searchMade = false;
            this.home = false;
        },
        clickHome: function() {
            this.home = true;
            this.loginClicked = false;
            this.createAccountClicked = false;
            this.aboutClicked = false;
            this.storyClicked = false;
            this.searchMade = false;
        },
        clickHomeLoggedIn: function() {
            this.home = true;
            this.aboutClicked = false;
            this.storyClicked = false;
            this.addGearClicked = false;
            this.ownedClicked = false;
            this.rentedClicked = false;
            this.searchMade = false;
            this.userClicked = false;
        },
        clickMessages: function() {
            if(this.messagesClicked) {
                this.messagesClicked = false;
                return;
            }
            this.messagesClicked = true;
        },


        //Function for new users who sign up
        submitNewAccount: function(event) {
            event.preventDefault();
            if(this.checkPasswords) {
                console.log('passwords match!');
                var thatVm=this;
                $.post('/api/user/registration', this.signUpForm, function(res) {
                    if(res.success) {
                        console.log('account created and logged in!');
                        thatVm.getUserInfo();
                        for (var key in thatVm.signUpForm) {
                            thatVm.signUpForm[key] = '';
                        }
                        thatVm.signUpForm.canSetUpGear = false;
                        thatVm.signUpForm.agreedToTerms = false;
                        thatVm.passwordChecker = '';
                        thatVm.createAccountClicked = false;
                        thatVm.loginClicked = false;
                        thatVm.loggedIn = true;
                        thatVm.home = true;
                    } else {
                        //to do, make more dynamic controls for this response
                        alert("Username taken");
                        console.log(res);
                    }
                });
            } else {
                alert('Passwords do no match or don\'t meet requirements');
            }
        },


        //runs when user registers
        getUserInfo: function() {
            var thatVm = this;
            $.get('/api/user', function(user) {
                thatVm.setUserInfo(user);
            });
        },

        //runs when user logs in and registers
        setUserInfo: function(user) {
            for (let key in user) {
                this.userInfo[key] = user[key];
            }
        },

        //run when clicking submit on log in form
        submitLogin: function(event) {
            //to do, still fix live site prevent VM loggin when not successfull.
            event.preventDefault();
            var thatVm = this;
            $.ajax({
                url: '/api/user/login',
                method: 'POST',
                data: this.loginForm, 
                success: function(user) {
                    console.log(user);
                    thatVm.loginForm.username = '';
                    thatVm.loginForm.password = '';
                    thatVm.loginClicked = false;
                    thatVm.createAccountClicked = false;
                    thatVm.loggedIn = true;
                    thatVm.home = true;
                    thatVm.setUserInfo(user);
                    thatVm.getOwnedItems();
                },
                error: function (xhr, textStatus, thrownError) {
                    alert(xhr.responseText);
                    console.log(thrownError);
                    thatVm.loginForm.username = '';
                    thatVm.loginForm.password = '';
                }
            });
        },

        //runs when clicking shared items button
        getOwnedItems: function() {
            thatVm = this;
            $.get('/api/equipments/userowned', function(itemsArray) {
                thatVm.equipmentArray = itemsArray;
            });
        },

        //runs when clicking rented items button
        getRentedItems: function() {
            thatVm = this;
            $.get('/api/equipments/usercheckouts', function(itemsArray) {
                thatVm.equipmentArray = itemsArray;
            });
        },

        //runs on submit of new item submission
        submitNewEquipment: function(event) { 
            event.preventDefault();
            var thatVm = this;
            this.equipmentItem.canSetUpGear = this.userInfo.canSetUpGear;
            var formData = new FormData();
            for (var key in this.equipmentItem) {
                //this doesn't send the adress as an object
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
                        thatVm.getOwnedItems();
                        thatVm.clearForm(event);
                        thatVm.addGearClicked = false;
                        thatVm.home = true;
                        return;
                    }
                },
            });
        },

        //runs when submit selected
        submitSearch: function() {
            thatVm = this;
            //for inputing empty search string
            if (!this.searchCity) {
                $.get('/api/equipments/all', function(allArray) {
                    thatVm.equipmentArray = allArray;
                    thatVm.searchMade = true;
                    thatVm.home = false;
                });
            } else {
                //for searching anything else typed in input
                $.get('/api/equipments/' + this.searchCity, function(searchArray) {
                    thatVm.equipmentArray = searchArray;
                    thatVm.searchMade = true;
                    thatVm.home = false;
                });
            }
        },

        //method for reset buttons
        clearForm: function(event) {
            event.preventDefault();
            //clears the signUpForm
            for (let key in this.signUpForm) {
                if(this.signUpForm[key] === this.signUpForm.canSetUpGear) {
                    this.signUpForm.canSetUpGear = false;
                } else {
                    this.signUpForm[key] = '';
                    this.passwordChecker = '';
                }
            }
            //clears the equipment form
            for (let key in this.equipmentItem) {
                var g;
                if (this.equipmentItem[key] === this.equipmentItem.canSetUpGear) {
                    g = 'this is the easter egg!, Congrats on finding it!';
                } else if (this.equipmentItem[key] === this.equipmentItem.pickUpLocation) {
                    for (let key in this.equipmentItem.pickUpLocation) {
                        this.equipmentItem.pickUpLocation[key] = '';
                    }
                } else {
                    this.equipmentItem[key] = '';
                }
            }
        },
    }
}); 