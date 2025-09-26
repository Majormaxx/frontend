import React, { useEffect, useMemo, useState } from "react";
import { Field, FieldArray, Form, Formik, FieldProps, getIn } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Button, Card, FormContainer, FormItem, Input, InputGroup, Select } from "@/components/ui";
import Addon from "@/components/ui/InputGroup/Addon";
import CustomAvatarAndUsername from "@/components/collabberry/custom-components/CustomRainbowKit/CustomAvatarAndUsername";
import PlaceholderAvatarAndUsername from "@/components/collabberry/custom-components/CustomRainbowKit/PlaceholderAvatarAndUsername";
import { HiPlus, HiTrash } from "react-icons/hi";
import { shortenAddress } from "@/components/collabberry/utils/shorten-address";
import { useContractService } from "@/services/ContractsService"
import SuccessDialog from "@/components/collabberry/custom-components/TransactionSuccessDialog";
import ErrorDialog from "@/components/collabberry/custom-components/TransactionErrorDialog";
import LoadingDialog from "@/components/collabberry/custom-components/LoadingDialog";
import { useChainService } from "@/services/ChainService";

const formatContributorLabel = (username: string, walletAddress: string) => {
    const shortenedAddress = shortenAddress(walletAddress, 20, 4);
    return `${username} - ${shortenedAddress}`;
};

type Contribution = {
    user: string;
    amount: number | string;
};

type FormModel = {
    contributions: Contribution[];
};

const fieldFeedback = (form: any, name: string) => {
    const error = getIn(form.errors, name);
    const touch = getIn(form.touched, name);
    return {
        errorMessage: error || "",
        invalid: touch && Boolean(error),
    };
};

const validationSchema = Yup.object().shape({
    contributions: Yup.array()
        .of(
            Yup.object().shape({
                user: Yup.string().required("User is required"),
                amount: Yup.number()
                    .typeError("Amount must be a number")
                    .min(1, "Contribution must be at least 1")
                    .max(1000000, "Max. 1,000,000")
                    .required("Contribution is required"),
            })
        )
        .test("unique-user", "Each contributor can only be selected once.", function (contributions) {
            if (!contributions) return true;
            const selectedUsers = contributions.map((c: Contribution) => c.user).filter((u) => u !== "");
            return new Set(selectedUsers).size === selectedUsers.length;
        }),
});

const MaterialContribution: React.FC = () => {
    const organization = useSelector((state: RootState) => state.auth.org);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [materialWeight, setMaterialWeight] = useState<number>(1);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [errrorDialogVisible, setErrorDialogVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [txHash, setTxHash] = useState<string | null>(null);
    // const { network, blockExplorer } = environment;
    const { network, blockExplorer } = useChainService()
    const { getMaterialWeight, batchMint, ethersSigner } = useContractService();

    const contributorsFromOrg = organization?.contributors || [];

    const contributorOptions = useMemo(() => {
        return contributorsFromOrg.map((contributor: any) => ({
            ...contributor,
            value: contributor.walletAddress,
            label: formatContributorLabel(contributor.username, contributor.walletAddress),
        }));
    }, [contributorsFromOrg]);

    const initialValues: FormModel = {
        contributions: [{ user: "", amount: "" }],
    };

    const onSubmit = async (values: FormModel) => {
        if (!organization?.teamPointsContractAddress) return;
        setLoading(true);
        try {
            const recipients = values.contributions.map((c) => c.user);
            const materialContributions = values.contributions.map((c) => {
                return Number(c.amount)
            });
            const timeContributions = values.contributions.map(() => 0);
            const response = await batchMint(
                organization.teamPointsContractAddress,
                recipients,
                materialContributions,
                timeContributions
            );

            if (response?.status === 'success') {
                setTxHash(response?.data?.transactionHash || '');
                setLoading(false);
                setDialogVisible(true);
            } else {
                setLoading(false);
                setErrorDialogVisible(true);
                setErrorMessage(response?.message || "An error occurred while minting the tokens.");
            }
        } catch (error: any) {
            setLoading(false);
            setErrorDialogVisible(true);
            setErrorMessage(error?.message || "An error occurred while minting the tokens.");
        }
        setLoading(false);
    };

    const handleDialogClose = () => {
        setDialogVisible(false);
        setTxHash(null);
    };

    useEffect(() => {
        const fetchMaterialWeight = async () => {
            if (organization?.teamPointsContractAddress && ethersSigner) {
                setFetchLoading(true);
                const response = await getMaterialWeight(organization.teamPointsContractAddress);
                if (response.status === 'success' && response.data) {
                    const { multiplier } = response.data;
                    const humanReadableMaterialWeight = Number(multiplier) / 1000;
                    setMaterialWeight(humanReadableMaterialWeight);
                    setFetchLoading(false);
                } else {
                    setFetchLoading(false);
                }
            }
        };

        fetchMaterialWeight();
    }, [organization.teamPointsContractAddress, ethersSigner]);



    return (
        <>
            <h1>Material Contribution</h1>
            <SuccessDialog
                dialogVisible={dialogVisible}
                txHash={txHash || ''}
                blockExplorer={blockExplorer}
                txNetwork={network}
                dialogMessage="Yay! The tokens have been minted successfully."
                handleDialogClose={handleDialogClose}>
            </SuccessDialog>
            <ErrorDialog dialogVisible={errrorDialogVisible}
                errorMessage={errorMessage || ''}
                handleDialogClose={() => setErrorDialogVisible(false)}   >
            </ErrorDialog>
            <LoadingDialog dialogVisible={loading}
                message={'You will be promped to sign a transaction. This might take a while, so please be patient.'}
                title="Minting Tokens..."
                handleDialogClose={() => null}   >
            </LoadingDialog>
            <Card className="mt-4 w-full xl:w-3/4">
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                    {({ values, errors, touched }) => (
                        <Form>
                            <FormContainer>
                                <FieldArray name="contributions">
                                    {({ push, remove, form }) => {
                                        // Compute already selected users from all rows.
                                        const selectedUsers = values.contributions.map((c: Contribution) => c.user);
                                        return (
                                            <div className="flex flex-col gap-4">
                                                {values.contributions &&
                                                    values.contributions.length > 0 &&
                                                    values.contributions.map((contribution, index) => {

                                                        const userFeedback = fieldFeedback(form, `contributions[${index}].user`);
                                                        const amountFeedback = fieldFeedback(form, `contributions[${index}].amount`);

                                                        return (
                                                            <div key={index} >
                                                                <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                                                                    <FormItem
                                                                        label="Contributor"
                                                                        invalid={userFeedback.invalid}
                                                                        errorMessage={userFeedback.errorMessage}
                                                                        className="mb-1 w-full flex-1 lg:w-2/3"
                                                                    >
                                                                        <Field name={`contributions[${index}].user`}>
                                                                            {({ field, form }: FieldProps) => {
                                                                                const options = contributorOptions.map((option: any) => ({
                                                                                    ...option,
                                                                                    isDisabled:
                                                                                        option.value !== field.value && selectedUsers.includes(option.value),
                                                                                }));

                                                                                return (
                                                                                    <InputGroup className='w-full'>
                                                                                        <Select
                                                                                            placeholder="Select contributor..."
                                                                                            className="w-4/5"
                                                                                            field={field}
                                                                                            form={form}
                                                                                            options={options}
                                                                                            value={options.filter((option: any) => option.value === field.value)}
                                                                                            onChange={(selectedOption: any) =>
                                                                                                form.setFieldValue(field.name, selectedOption?.value)
                                                                                            }
                                                                                        />
                                                                                        <Addon className="hidden w-1/5 min-w-[130px] md:flex">
                                                                                            {contributorsFromOrg.some(
                                                                                                (orgContributor: any) => orgContributor.walletAddress === field.value
                                                                                            ) ? (
                                                                                                (() => {
                                                                                                    const orgContributor = contributorsFromOrg.find(
                                                                                                        (orgContributor: any) => orgContributor.walletAddress === field.value
                                                                                                    );
                                                                                                    return (
                                                                                                        <div className="px-1">
                                                                                                            <CustomAvatarAndUsername
                                                                                                                imageUrl={orgContributor?.profilePicture}
                                                                                                                userName={orgContributor?.username}
                                                                                                                avatarSize={20}
                                                                                                            />
                                                                                                        </div>
                                                                                                    );
                                                                                                })()
                                                                                            ) : (
                                                                                                <div className="px-1">
                                                                                                    <PlaceholderAvatarAndUsername avatarSize={20} />
                                                                                                </div>
                                                                                            )}
                                                                                        </Addon>
                                                                                    </InputGroup>
                                                                                );
                                                                            }}
                                                                        </Field>
                                                                    </FormItem>
                                                                    <div className="flex w-full min-w-[230px] flex-row items-center gap-4 lg:w-1/3" >
                                                                        <FormItem
                                                                            label="Material Contribution"
                                                                            invalid={amountFeedback.invalid}
                                                                            errorMessage={amountFeedback.errorMessage}
                                                                            className="mb-1 w-3/4"
                                                                        >
                                                                            <Field
                                                                                name={`contributions[${index}].amount`}
                                                                                placeholder="Enter amount"
                                                                                type="number"
                                                                                prefix="$"
                                                                                component={Input}
                                                                            />
                                                                        </FormItem>
                                                                        <div className="mt-6 w-1/4">
                                                                            <Button
                                                                                shape="circle"
                                                                                size="sm"
                                                                                variant="twoTone"
                                                                                color="pink-600"
                                                                                icon={<HiTrash />}
                                                                                onClick={() => remove(index)}
                                                                                disabled={values.contributions.length === 1}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {contribution.user && contribution.amount && (
                                                                    <div className="mt-2 text-sm text-gray-500">
                                                                        For a material contribution of {`$${contribution.amount}`}, {contributorOptions.find(option => option.value === contribution.user)?.label.split(' - ')[0]} will receive {Number(contribution.amount) * materialWeight} Team Points.
                                                                    </div>

                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                <div className="flex flex-col items-end gap-4">
                                                    <div className='mt-2 flex w-full flex-row items-center justify-start'>
                                                        <Button
                                                            type="button"
                                                            icon={<HiPlus className="text-berrylavender-500" />}
                                                            onClick={() => {
                                                                push({ user: "", amount: "" });
                                                            }}
                                                        >
                                                            Add Contributor
                                                        </Button>
                                                    </div>
                                                    <Button
                                                        type="submit"
                                                        variant="solid"
                                                        disabled={Object.keys(errors).length > 0 || Object.keys(touched).length === 0}
                                                    >
                                                        Submit
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    }}
                                </FieldArray>
                            </FormContainer>
                        </Form>
                    )}
                </Formik>
            </Card>
        </>
    );
};

export default MaterialContribution;