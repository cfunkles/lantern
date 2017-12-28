Vue.component('sign-up-form', {
    template: `
        <form class="well form-horizontal" v-if="createAccountClicked" v-on:submit="submitNewAccount">
            <h2 class="center">Sign Up!</h2>
            <div class="form-group">
                <label class="control-label col-sm-4" for="username">Username: </label>
                <div class="col-sm-8">
                    <input class="form-control" v-model="signUpForm.username" type="text" placeholder="OutdoorDude" id="username" required>
                </div>
            </div>
            <div class="form-group {has-success: matchPasswords}">
                <label class="control-label col-sm-4" for="password">Password: </label>
                <div class="col-sm-8">
                    <input class="form-control" v-model="signUpForm.password" type="password" placeholder="Ex@mplepassword" id="password" required>
                </div>
            </div>
            <div class="form-group {has-success: matchPasswords}">
                <label class="control-label col-sm-4" for="passwordChecker">Re-Enter Password: </label>
                <div class="col-sm-8">
                    <input class="form-control" v-model="passwordChecker" type="password" placeholder="Ex@mplepassword" id="paswordChecker" required>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-4" for="fullName">First and Last Name: </label>
                <div class="col-sm-8">
                    <input class="form-control" v-model="signUpForm.name" type="text" placeholder="Bear Grylls" id="fullName" required>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-4" for="state">State of Residence: </label>
                <div class="col-sm-8">
                    <select class="form-control" v-model="signUpForm.state" id="state" required>
                        <option value="" disabled selected>--</option>
                        <option value="AL">Alabama</option>
                        <option value="AK">Alaska</option>
                        <option value="AZ">Arizona</option>
                        <option value="AR">Arkansas</option>
                        <option value="CA">California</option>
                        <option value="CO">Colorado</option>
                        <option value="CT">Connecticut</option>
                        <option value="DE">Delaware</option>
                        <option value="DC">District Of Columbia</option>
                        <option value="FL">Florida</option>
                        <option value="GA">Georgia</option>
                        <option value="HI">Hawaii</option>
                        <option value="ID">Idaho</option>
                        <option value="IL">Illinois</option>
                        <option value="IN">Indiana</option>
                        <option value="IA">Iowa</option>
                        <option value="KS">Kansas</option>
                        <option value="KY">Kentucky</option>
                        <option value="LA">Louisiana</option>
                        <option value="ME">Maine</option>
                        <option value="MD">Maryland</option>
                        <option value="MA">Massachusetts</option>
                        <option value="MI">Michigan</option>
                        <option value="MN">Minnesota</option>
                        <option value="MS">Mississippi</option>
                        <option value="MO">Missouri</option>
                        <option value="MT">Montana</option>
                        <option value="NE">Nebraska</option>
                        <option value="NV">Nevada</option>
                        <option value="NH">New Hampshire</option>
                        <option value="NJ">New Jersey</option>
                        <option value="NM">New Mexico</option>
                        <option value="NY">New York</option>
                        <option value="NC">North Carolina</option>
                        <option value="ND">North Dakota</option>
                        <option value="OH">Ohio</option>
                        <option value="OK">Oklahoma</option>
                        <option value="OR">Oregon</option>
                        <option value="PA">Pennsylvania</option>
                        <option value="RI">Rhode Island</option>
                        <option value="SC">South Carolina</option>
                        <option value="SD">South Dakota</option>
                        <option value="TN">Tennessee</option>
                        <option value="TX">Texas</option>
                        <option value="UT">Utah</option>
                        <option value="VT">Vermont</option>
                        <option value="VA">Virginia</option>
                        <option value="WA">Washington</option>
                        <option value="WV">West Virginia</option>
                        <option value="WI">Wisconsin</option>
                        <option value="WY">Wyoming</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-4" for="email">Email: </label>
                <div class="col-sm-8">
                    <input class="form-control" v-model="signUpForm.email" type="email" placeholder="beargrs@wild.com" id="email" required>
                </div>
            </div>
            <div class="form-group">
                <div class="col-sm-offset-4 col-sm-8">
                    <div class="checkbox">
                        <label for="makeCamp"><input v-model="signUpForm.canSetUpGear" type="checkbox" id="makeCamp">
                            As a Sharer, are you willing to set up a campsite? <a href="#">More Information</a>
                        </label>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <div class="col-sm-offset-4 col-sm-8">
                    <div class="checkbox">
                    <label for="acceptTerms"><input v-model="signUpForm.agreedToTerms" type="checkbox" id="acceptTerms" required>
                        By clicking Submit you agree to our <a href="#">terms</a>
                    </label>
                </div>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-offset-4" for="resetRegistration">Reset sign up form: 
                    <button type='notSubmit' v-on:click="clearForm" id="resetRegistration" class="btn btn-warning">Reset</button>
                </label>
            </div>
            <div class="form-group center">
                <button type="submit" class="btn btn-primary" id="submitRegistration">Submit</button>
            </div>
        </form>
    `
});