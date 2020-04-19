import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class Register extends Controller {

	// Inject the needed services.
	//@service('ajax') ajaxService;
 
	// Create a register action that will take in the attributes from the register-form component.
	@action
	register(attrs) {

		// Do a quick form input validation.
		if(attrs.username == undefined || attrs.username == null || attrs.username == '') {

			// Set the errors property.  This will allow the errors to be shown in the UI.
			this.set('errors', [{
				detail: "The user name cannot be blank.  Registration was not successful.",
				status: 1000,
				title: 'Registration Failed'
			}]);

			// Set the attributes of the model to what was originally passed so they do not need to be filled out again.
			this.set('model', attrs);
		}
		else if(attrs.password == undefined || attrs.password == null || attrs.password == '' ||
			attrs.confirmPassword == undefined || attrs.confirmPassword == null || attrs.confirmPassword == '' ||
			attrs.password != attrs.confirmPassword) 
		{

			// Set the errors property.  This will allow the errors to be shown in the UI.
			this.set('errors', [{
				detail: "The password and confirm password must be the same and their values and cannot be blank.  Registration was not successful.",
				status: 1000,
				title: 'Registration Failed'
			}]);

			// Set the attributes of the model to what was originally passed so they do not need to be filled out again.
			this.set('model', attrs);
		}
		else if(attrs.reCaptchaResponse == undefined || attrs.reCaptchaResponse == null || attrs.reCaptchaResponse == '') {

			// If this part of the code is reached it means the recaptcha has not been resolved.  Create the error and
			// notifiy the user.  Set the errors property.  This will allow the registration errors to be shown in the UI.
			this.set('errors', [{
				detail: "Please resolve the reCAPTCHA by clicking on the checkbox marked I'm not a robot.",
				status: 1000,
				title: 'Registration Failed'
			}]);

			// Set the attributes of the model to what was originally passed so they do not need to be filled out again.
			this.set('model', attrs);
		}
		else {

			// If we get this far all is good to register the new client.  Make the ajax call to the backend to register the 
			// new client.  We do not go through the store to create a register model in the store and then execute the save() 
			// method to make a call to the backend API.  Rather we make an ajax call because we do not need a register object 
			// saved in the store.
			this.ajaxService.request(this.store.adapterFor('application').get('host') + "/clients/register", {
				method: 'POST',
				data: JSON.stringify({ 
					data: {
						attributes: {
							"username" : attrs.username,
							"password" : attrs.password,
							"confirm-password" : attrs.confirmPassword
						},
						type: 'registers'
					}
				}),
				headers: {
					'Content-Type': 'application/vnd.api+json',
					'Accept': 'application/vnd.api+json'
				}
			})
				.then(() => {

					// Reset the recaptcha.
					attrs.googleRecaptcha.resetReCaptcha();

					// Transistion to the register-success route.
					this.transitionToRoute('clients.register-success');
				})
				.catch((ex) => {

					// Reset the recaptcha.
					attrs.googleRecaptcha.resetReCaptcha();

					// Set the errors property to the errors held in the ex.payload.errors.  This will allow the registration errors 
					// to be shown in the UI.
					this.set('errors', ex.payload.errors);

					// Set the attributes of the model to what was originally passed so they do not need to be filled out again.
					this.set('model', attrs);
				});
		}
	}
}
