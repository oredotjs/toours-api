/* eslint-disable */
import axios from 'axios';
const stripe =Stripe('pk_test_51LXl30ADgyYVQIQjEcB3Y7sz2RQhLfjCXQSbjiLT7qGpmEizOAxrs03sbUFzjq8f9VxipOr9JCmr43yJeu8xlPEI00f2PmrELd')

export const bookTour = tour => {
    //get checkout session from stripe Api
  const session = await axios(`http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tour.id}`);
  cponsole.log(session);
    //create checkout form + change credit card to test card
}
