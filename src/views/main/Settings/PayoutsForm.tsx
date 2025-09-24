import {
    FormItem,
    FormContainer,
    Input,
    Button,
    Alert,
    Spinner,
} from '@/components/ui'
import { apiUpdateOrganizationSettings } from '@/services/OrgService'
import { Field, Form, Formik } from 'formik'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import * as Yup from 'yup'
import { RootState } from '@/store'
import { OrganizationData } from '@/@types/auth'

const validationSchema = Yup.object().shape({
    safeAddress: Yup.string().required('Safe Address is required'),
    stablecoinAddress: Yup.string().required('Stablecoin Address is required'),
    recognitionTokenAddress: Yup.string().required('Recognition Token Address is required'),
})

const PayoutsForm = () => {
    const [message, setMessage] = useState('')

    const organization = useSelector((state: RootState) => state.auth.org)

    const initialValues = {
        safeAddress: organization?.safeAddress || '',
        stablecoinAddress: organization?.stablecoinAddress || '',
        recognitionTokenAddress: organization?.recognitionTokenAddress || '',
    }

    const onFormSubmit = async (
        values: {
            safeAddress: string
            stablecoinAddress: string
            recognitionTokenAddress: string
        },
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setMessage('')
        try {
            const data: Partial<OrganizationData> = {
                safeAddress: values.safeAddress,
                stablecoinAddress: values.stablecoinAddress,
                recognitionTokenAddress: values.recognitionTokenAddress,
            }
            const result = await apiUpdateOrganizationSettings(data)
            if (result.status === 'success') {
                setMessage('Settings updated successfully.')
            } else {
                setMessage('Failed to update settings.')
            }
        } catch (error) {
            setMessage('An error occurred.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div>
            {message && (
                <Alert showIcon className="mb-4" type={message.includes('successfully') ? 'success' : 'danger'}>
                    {message}
                </Alert>
            )}
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    onFormSubmit(values, setSubmitting)
                }}
            >
                {({ errors, touched, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <FormItem
                                label="Safe Address"
                                invalid={errors.safeAddress && touched.safeAddress}
                                errorMessage={errors.safeAddress}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="safeAddress"
                                    placeholder="Enter Safe Address"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Stablecoin Address"
                                invalid={
                                    errors.stablecoinAddress &&
                                    touched.stablecoinAddress
                                }
                                errorMessage={errors.stablecoinAddress}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="stablecoinAddress"
                                    placeholder="Enter Stablecoin Address"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Recognition Token Address"
                                invalid={
                                    errors.recognitionTokenAddress &&
                                    touched.recognitionTokenAddress
                                }
                                errorMessage={errors.recognitionTokenAddress}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="recognitionTokenAddress"
                                    placeholder="Enter Recognition Token Address"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem>
                                <Button
                                    variant="solid"
                                    type="submit"
                                    loading={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <Spinner />
                                    ) : (
                                        'Save Settings'
                                    )}
                                </Button>
                            </FormItem>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default PayoutsForm