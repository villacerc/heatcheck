import * as Yup from 'yup'

const validationSchema = Yup.object({
  name: Yup.string('').required('Name is required')
})

export default validationSchema
