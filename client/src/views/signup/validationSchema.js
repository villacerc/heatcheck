import * as Yup from 'yup'

const validationSchema = Yup.object({
  displayName: Yup.string('Enter a name').required('Display name is required'),
  email: Yup.string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string('')
    .min(5, 'Password must contain at least 5 characters')
    .required('Enter your password'),
  confirmPassword: Yup.string('Enter your password')
    .required('Confirm your password')
    .oneOf([Yup.ref('password')], 'Password does not match')
})

export default validationSchema
