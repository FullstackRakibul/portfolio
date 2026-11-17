// The floating "Ask Calcifer" button (components/FloatingContact.vue) and the links Calcifer hands out
// (data/calcifer.ts). An empty string hides that link, so no dead link ever ships.

export const FLOATING_CONTACT = {
  /** Text on the collapsed pill. */
  label: 'Ask Calcifer',
  /** Book a call: e.g. 'https://cal.com/your-name' or a Calendly link. Empty = Calcifer points to email. */
  booking: '',
  /** Chat: e.g. 'https://wa.me/8801XXXXXXXXX' or 'https://t.me/your-name'. Empty = hidden. */
  chat: '',
}
