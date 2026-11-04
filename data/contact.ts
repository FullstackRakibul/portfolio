// The floating contact button (components/FloatingContact.vue). Edit the links here.
// An empty string hides that action, so no dead link ever ships.

import { CONTACT } from './portfolio'

export const FLOATING_CONTACT = {
  /** Text on the collapsed pill. */
  label: 'Book a Call',
  /** Circular photo on the collapsed pill. */
  avatar: '/assets/img/rakibul-hasan-passport-image.jpg',
  /** Send email: the address used across the site. */
  email: CONTACT.email,
  /** Book a call: e.g. 'https://cal.com/your-name' or a Calendly link. Empty = hidden. */
  booking: '',
  /** Chat: e.g. 'https://wa.me/8801XXXXXXXXX' or 'https://t.me/your-name'. Empty = hidden. */
  chat: '',
}
