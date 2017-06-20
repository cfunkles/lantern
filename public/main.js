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
            datesCheckedOut: [],
            pickUpLocation: {
                address: '',
                city: '',
                state: '',
                zip:  '',
            },
            gearReview: [],//going to fill this array with objects the have rating number and comments
            ownerId: '',
            objectId: '',
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
        home: true,
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
                this.clickHome();
                return;
            }
            this.loginClicked = true;
            this.aboutClicked = false;
            this.storyClicked = false;
            this.createAccountClicked = false;
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
            this.profileClicked = false;
            this.loginClicked = false;
            this.createAccountClicked = false;
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
            this.profileClicked = false;
            this.addGearClicked =false;
            this.loginClicked = false;
            this.createAccountClicked = false;
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
            this.profileClicked = false;
            this.home = false;
        },
        clickSeeProfile: function() {
            if(this.profileClicked) {
                this.clickHomeLoggedIn();
                return;
            }
            this.profileClicked= true;
            this.addGearClicked = false;
            this.storyClicked = false;
            this.aboutClicked = false;
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
                        thatV.home = true;
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
                    thatVm.home = true;
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
                    thatVm.home = false;
                });
            } else {
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
            <h3 class="center">{{item.name}} {{item.brand}} {{item.model}}</h3>
            <p><img class="equipmentImage" v-bind:src="'./images/' + item.imageFileName" alt="image of equipment"> </p>
            <p>Condition: {{item.condition}}</p>
            <p>Size: {{item.size}}</p>
            <p>Category: {{item.category}}</p>
            <p>Description from the Sharer: {{item.description}}</p>
            <p> Location of Item: 
                {{item.address}}, {{item.city}}, {{item.state}}, {{item.zip}}</p>
            <input v-model="selectedDate" type="date" min="2017-06-17" max="2018-10-01">
            <button class="btn btn-info" v-on:click="checkavailibility(item._id)">Check Availibility</button>
            <button class="btn btn-warning" v-on:click="checkout(item._id)">Check out Item</button>
            <p v-if="availible">Item availible</p>
            <p v-if="notAvailible">Item not Availible</p>
            <p v-if="rented">Success! Item was checked out for {{selectedDate}}</p>
            <p v-if="empty">Nothing Selected! Enter Date</p>
        </div>
    `,
    props : ['item'],
    data: function(){
        // we use a function for data on components so that each component gets unique data, not references to each other's data
        return {
            selectedDate: '',
            availible: false,
            notAvailible: false,
            rented: false,
            //to do find way to not show rented when date has changed
            empty: false,
        };
    },
    computed:{

    },
    methods:{
        //loops the date array to find availiblity.
        checkavailibility: function(itemId) {
            thatVm = this;
            if(this.selectedDate) {
                $.get('/api/equipments/dates/' + itemId, function(item) {
                    console.log(thatVm.selectedDate);
                    for (var date in item.datesCheckedOut) {
                        if (thatVm.selectedDate === item.datesCheckedOut[date]) {
                            console.log('item not availible');
                            thatVm.notAvailible = true;
                            thatVm.availible = false;
                            thatVm.empty = false;
                            thatVm.rented = false;
                            return;
                        }
                    }
                    thatVm.notAvailible = false;
                    thatVm.availible = true;
                    thatVm.rented = false;
                    thatVm.empty = false;
                    console.log('availible');
                });
            } else {
                thatVm.empty = true;
                thatVm.availible = false;
                thatVm.notAvailible = false;
                thatVm.rented = false;
            }
        },

        //adds the date to the date array of item
        checkout: function(itemId) {
            thatVm = this;
            console.log(itemId);
            $.post('/api/equipments/dates', {date: this.selectedDate, objectId: itemId}, function(confirmation) {
                //add style to handle not being logged in.
                if(confirmation.duplicated) {
                    console.log('unavailible');
                    thatVm.notAvailible = true;
                    thatVm.availible = false;
                    thatVm.empty = false;
                    thatVm.rented = false;
                    return;
                }
                if(confirmation.success) {
                    console.log('checked out');
                    thatVm.rented = true;
                    thatVm.notAvailible = false;
                    thatVm.empty = false;
                    return;
                }
                thatVm.empty = true;
                thatVm.rented = false;
                thatVm.notAvailible = false;
                thatVm.availible = false;
                console.log(confirmation);
            });
        },
    },
});