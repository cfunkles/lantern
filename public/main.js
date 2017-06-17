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
            rentedItems: [],
            ratings: '',
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
        //change this depending what items user wants to see.
        equipmentArray: [],
        //for click listeners
        loggedIn: false,
        loginClicked: false,
        createAccountClicked: false,
        aboutClicked: false,
        storyClicked: false,
        addGearClicked: false,
        profileClicked: false,
        searchMade: false,
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
        clickSeeProfile: function() {
            if(this.profileClicked) {
                this.profileClicked = false;
                return;
            }
            this.profileClicked= true;
        },
        clickHome: function() {
            this.loginClicked = false;
            this.createAccountClicked = false;
            this.aboutClicked = false;
            this.storyClicked = false;
            this.searchMade = false;
        },
        clickHomeLoggedIn: function() {
            this.aboutClicked = false;
            this.storyClicked = false;
            this.addGearClicked = false;
            this.profileClicked = false;
            this.searchMade = false;
        },

        submitNewAccount: function(event) {
            event.preventDefault();
            if(this.matchPasswords) {
                console.log('passwords match!');
                var thatVm=this;
                $.post('/api/user/registration', this.signUpForm, function(res) {
                    if(res.success) {
                        console.log('account created and logged in!');
                        thatVm.getUserInfo();
                        for (var key in thatVm.signUpForm) {
                            thatVm.signUpForm[key] = '';
                        }
                        thatVm.signUpForm.agreedToTerms = false;
                        thatVm.passwordChecker = '';
                        thatVm.createAccountClicked = false;
                        thatVm.loginClicked = false;
                        thatVm.loggedIn = true;
                    } else {
                        //to do, make more dynamic controls for this response
                        console.log(res);
                    }
                });
            } else {
                console.log('passwords don\'t match');
            }
        },

        getUserInfo: function() {
            thatVm = this;
            $.get('api/user', function(user) {
                setUserInfo(user);
            });
        },

        setUserInfo: function(user) {
            for (let key in user) {
                this.userInfo[key] = user[key];
            }
        },


        submitLogin: function(event) {
            event.preventDefault();
            var thatVm = this;
            $.post('/api/user/login', this.loginForm, function(user) {
                if (user === 'login error') {
                    console.log('error logging in!');
                } else {
                    thatVm.loginForm.username = '';
                    thatVm.loginForm.password = '';
                    thatVm.loginClicked = false;
                    thatVm.createAccountClicked = false;
                    thatVm.loggedIn = true;
                    thatVm.setUserInfo(user);
                    thatVm.getEquipmentItemsForUser();
                }
            });
        },

        getEquipmentItemsForUser: function() {
            thatVm = this;
            $.get('/api/equipments', function(itemsArray) {
                thatVm.equipmentArray = itemsArray;
            });
        },

        submitNewEquipment: function(event) { 
            event.preventDefault();
            var thatVm = this;
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
                        thatVm.getEquipmentItemsForUser();
                        thatVm.clearForm(event);
                        thatVm.addGearClicked = false;
                    }
                    console.log('no success creating new item');
                },
            });
        },

        submitSearch: function() {
            thatVm = this;
            if (!this.searchCity) {
                $.get('/api/equipments/all', function(allArray) {
                    thatVm.equipmentArray = allArray;
                    thatVm.searchMade = true;
                });
            } else {
                $.get('/api/equipments/' + this.searchCity, function(searchArray) {
                    thatVm.equipmentArray = searchArray;
                    thatVm.searchMade = true;
                });
            }
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
    }
}); 

Vue.component('equipment-item', {
    template: `
        <div class="well itemComponent">
            <h3 class="center">{{item.brand}} {{item.name}} {{item.category}}</h3>
            <h3>Model: {{item.model}} Size: {{item.size}} in: {{item.condition}} condition</h3>
            <img class="equipmentImage" v-bind:src="'./images/' + item.imageFileName" alt="image of equipment">
            <p>{{item.description}}</p>
            <p>
                {{item.address}}<br>
                {{item.city}}<br>
                {{item.state}}<br>
                {{item.zip}}
            </p>
        </div>
    `,
    props : ['item'],
    data: function(){
        // we use a function for data on components so that each component gets unique data, not references to each other's data
        return {};
    },
    computed:{

    },
    methods:{

    },
});