import {FormItem,FormContainer,Input, Button, Alert, Spinner,} from '@/components/ui'
import { apiUpdateOrganizationSettings } from '@/services/OrgService'
import { Field, Form, Formik } from 'formik'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import * as Yup from 'yup'
import { RootState } from '@/store'
import { OrganizationData } from '@/@types/auth'
import SuccessDialog from '@/components/collabberry/custom-components/TransactionSuccessDialog'
import ErrorDialog from '@/components/collabberry/custom-components/TransactionErrorDialog'
import LoadingDialog from '@/components/collabberry/custom-components/LoadingDialog'
import { useChainService } from '@/services/ChainService'
import ChainSelector from '@/components/collabberry/custom-components/ChainSelector'
import RecognitionModeSelector from '@/components/collabberry/custom-components/RecognitionModeSelector'
import { ethers } from 'ethers'
import { RecognitionMode } from '@/@types/payouts'

const validationSchema = Yup.object().shape({
    chain: Yup.string().required('Chain is required'),
    safeAddress: Yup.string()
        .required('Safe Address is required')
        .test('is-address', 'Invalid address format', (value) =>
            ethers.isAddress(value)
        ),
    stablecoinAddress: Yup.string()
        .required('Stablecoin Address is required')
        .test('is-address', 'Invalid address format', (value) =>
            ethers.isAddress(value)
        ),
    recognitionTokenAddress: Yup.string()
        .required('Recognition Token Address is required')
        .test('is-address', 'Invalid address format', (value) =>
            ethers.isAddress(value)
        ),
    recognitionMode: Yup.string().oneOf(['hours-based', 'discretionary'] as const).required('Recognition Mode is required'),
    chainId: Yup.number(),
})

/**
 * Renders a form for configuring organization payout settings, including chain, Safe address, and token information.
 * It handles form validation, submission, and displays success or error feedback to the user.
 */
const PayoutsForm = () => {
    const [dialogVisible, setDialogVisible] = useState(false)
    const [errorDialogVisible, setErrorDialogVisible] = useState(false)
    const [loadingDialog, setLoadingDialog] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const { network, blockExplorer } = useChainService()

    const organization = useSelector((state: RootState) => state.auth.org) as OrganizationData

    const initialValues = {
        chain: organization?.chain || '',
        safeAddress: organization?.safeAddress || '',
        stablecoinAddress: organization?.stablecoinAddress || '',
        recognitionTokenAddress: organization?.recognitionTokenAddress || '',
        recognitionMode: organization?.recognitionMode || 'discretionary' as RecognitionMode,
        chainId: organization?.chainId || 0,
    }

    /**
     * Handles the form submission, sending the updated settings to the API.
     * It displays loading, success, or error dialogs based on the API response.
     * @param values - The form values.
     * @param setSubmitting - A function to set the form's submitting state.
     */
    const onFormSubmit = async (
        values: {
            chain: string
            safeAddress: string
            stablecoinAddress: string
            recognitionTokenAddress: string
            recognitionMode: RecognitionMode
            chainId: number
        },
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setLoadingDialog(true)
        try {
            const data: Partial<OrganizationData> = {
                chain: values.chain as 'arbitrum' | 'sepolia',
                safeAddress: values.safeAddress,
                stablecoinAddress: values.stablecoinAddress,
                recognitionTokenAddress: values.recognitionTokenAddress,
                recognitionMode: values.recognitionMode,
                chainId: values.chainId,
            }
            const result = await apiUpdateOrganizationSettings(data)
            if (result.status < 300) {
                setDialogVisible(true)
            } else {
                setErrorMessage('Failed to update settings.')
                setErrorDialogVisible(true)
            }
        } catch (error) {
            setErrorMessage('An error occurred.')
            setErrorDialogVisible(true)
        } finally {
            setLoadingDialog(false)
            setSubmitting(false)
        }
    }

    const handleDialogClose = () => {
        setDialogVisible(false)
    }

    const handleErrorDialogClose = () => {
        setErrorDialogVisible(false)
    }

    return (
        <div>
            <SuccessDialog
                dialogVisible={dialogVisible}
                txHash={''}
                blockExplorer={blockExplorer}
                txNetwork={network}
                dialogMessage="Yay! Your settings have been updated."
                handleDialogClose={handleDialogClose}
            ></SuccessDialog>
            <ErrorDialog
                dialogVisible={errorDialogVisible}
                errorMessage={errorMessage}
                handleDialogClose={handleErrorDialogClose}
            ></ErrorDialog>
            <LoadingDialog
                dialogVisible={loadingDialog}
                message={'This might take a while, so please be patient.'}
                title="Updating Settings..."
                handleDialogClose={() => null}
            />
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    onFormSubmit(values, setSubmitting)
                }}
            >
                {({ errors, touched, isSubmitting, setFieldValue, values }) => (
                    <Form>
                        <FormContainer>
                            <FormItem
                                label="Chain"
                                invalid={errors.chain && touched.chain}
                                errorMessage={errors.chain}
                            >
                                <ChainSelector
                                    value={values.chain}
                                    onChange={(option) => {
                                        setFieldValue('chain', option.value)
                                        setFieldValue('chainId', option.chainId)
                                    }}
                                />
                            </FormItem>
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
                                label="Recognition Mode"
                                invalid={errors.recognitionMode && touched.recognitionMode}
                                errorMessage={errors.recognitionMode}
                            >
                                <RecognitionModeSelector
                                    value={values.recognitionMode}
                                    onChange={(option) => {
                                        setFieldValue('recognitionMode', option.value)
                                    }}
                                />
                            </FormItem>
                            <FormItem
                                label="Stablecoin Address"
                                invalid={errors.stablecoinAddress && touched.stablecoinAddress}
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