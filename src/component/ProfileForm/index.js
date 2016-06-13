import xs from 'xstream'
import {compose, lt, prop, test} from 'ramda'

import Form from 'component/form/Form'
import {InputControl} from 'component/form'
import ImportantTip from 'component/ImportantTip'

const InfoBlock = () => ({
  DOM: xs.of(
    ImportantTip(`
Your email and phone number will only be shared
with organizers that you work with.
    `)
  ),
})

const validName = compose(lt(0), prop('length'), String)
const validEmail = compose(test(/.+@.+/), String)
const validPhone = compose(test(/\d+/), String)

const FullNameInput = sources =>
  InputControl({phrase$: xs.of('fullName'), ...sources, validation: validName, required: true})

const EmailInput = sources =>
  InputControl({phrase$: xs.of('emailAddress'), ...sources, validation: validEmail, type: 'email', required: true})

const PhoneInput = sources =>
  InputControl({phrase$: xs.of('phoneNumber'), ...sources, validation: validPhone, required: true})

const ProfileForm = sources => Form({...sources,
  controls$: xs.of([
    {field: 'fullName', control: FullNameInput},
    {control: InfoBlock},
    {field: 'email', control: EmailInput},
    {field: 'phone', control: PhoneInput},
  ]),
})

export default ProfileForm
