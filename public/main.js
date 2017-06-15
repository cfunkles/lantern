var mainAppVue = new Vue({
    el: '#app',
    data: {
        //for showing login
        loginClicked: false,
        //for showing account creation
        createAccountClicked: false,
        // sign Up for from
        signUpForm: {
            username: '',
            password: '',
            name: '',
            state: '',
            email: '',
            agreedToTerms: false,
        },
        loginForm: {
            username: '',
            password: '',
        },
        passwordChecker: '',
        loggedIn: false,
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
        //shows login form
        clickLogin: function() {
            if(this.loginClicked) {
                this.loginClicked = false;
                return;
            }
            this.loginClicked = true;
        },
        //shows create account form
        clickCreateAccount: function() {
            if(this.createAccountClicked) {
                this.createAccountClicked = false;
                return;
            }
            this.createAccountClicked = true;
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
                        thatVm.loggedIn = true;
                    } else {
                        console.log(res);
                    }
                });
            } else {
                console.log('passwords don\'t match');
            }
        },
        submitLogin: function() {
            var thatVm = this;
            $.get('/api/user/' + this.loginForm.username + '/' + this.loginForm.password, function(user) {
                if (user === 'login error') {
                    console.log('error logging in!');
                } else {
                    thatVm.loginForm.username = '';
                    thatVm.loginForm.password = '';
                    thatVm.loginClicked = false;
                    thatVm.loggedIn = true;
                    console.log(user);
                }
            });
        }
    }
}); 