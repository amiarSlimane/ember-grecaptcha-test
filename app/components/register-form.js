import Component from '@glimmer/component';
//import ENV from './../../config/environment';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class RegisterForm extends Component {

	googleRecaptcha = null;
//	siteKey = ENV.gRecaptcha.siteKey;
	@tracked username;
	@tracked password;
	@tracked confirmPassword;

	// Add a new register action to the component to handle the onsubmit method of our 
	// register-form.
	@action
	register(ev) {
		
		// Prevent the form's default action.
		ev.preventDefault();

		// Call the form's onsubmit method and pass in the component's values.
		this.args.register({
			username: this.username,
			password: this.password,
			confirmPassword: this.confirmPassword,
			reCaptchaResponse: this.reCaptchaResponse, // This returns undefined
			googleRecaptcha: this.googleRecaptcha
		});
	}

	// Add a onCaptchaResolved action to the component that will handle the captcha resolved. 
	// This is called when the reCaptcha has been resolved and we know it is not a bot submitting the register-form.
	@action
	onCaptchaResolved(reCaptchaResponse) {

		// Set the reCaptchaResponse to the value passed in reCaptchaResponse.  This can be checked in the 
		// register.js controller and if the property does not exist or it is null or it is blank we can 
		// prevent the new client from registering until the recpatcha has been resolved.
		this.setProperties({
			reCaptchaResponse: reCaptchaResponse
		});
	}

	// When the recaptcha expires any previous recaptcha response should be invalidated so we do not allow old expired 
	// responses to be used.  Set the reCaptchaResponse property to a blank string so the controller will know any
	// previous successful recaptcha response is no longer valid.
	@action
	onCaptchaExpired()
	{
		this.setProperties({
			reCaptchaResponse: ''
		});
	}
}