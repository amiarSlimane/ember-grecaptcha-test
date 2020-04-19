import Controller from '@ember/controller';
import { action } from '@ember/object'

export default class ApplicationController extends Controller {

  @action
  onCaptchaResolved(reCaptchaResponse) {
    this.get('model').set('reCaptchaResponse', reCaptchaResponse);
    // You should then save your model and the server would validate reCaptchaResponse
    // ...
    console.log('reCaptchaResponse', reCaptchaResponse)
  }

  @action
  onCaptchaExpired() {
    // your custom logic here
    console.log('onCaptchaExpired')

  }
}
