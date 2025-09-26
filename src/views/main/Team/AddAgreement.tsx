import React, { useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  FormContainer,
  FormItem,
  Input,
  Tooltip,
} from "@/components/ui";
import {
  apiCreateContributorAgreement,
  apiEditContributorAgreement,
} from "@/services/OrgService";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import {
  handleSuccess,
} from "@/components/collabberry/helpers/ToastNotifications";
import { Contributor } from "@/models/Organization.model";
import CustomRangeSlider from "@/components/collabberry/custom-components/CustomFields/CustomRangeSlider";
import {
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi";
import { fieldRequired } from "@/components/collabberry/helpers/validations";
import { refreshOrganizationData } from "@/services/LoadAndDispatchService";
import { use } from "i18next";
import { useHandleError } from "@/services/HandleError";

const validationSchema = Yup.object().shape({
  roleName: Yup.string().required(fieldRequired),
  responsibilities: Yup.string().required(fieldRequired),
  marketRate: Yup.number().required(fieldRequired).min(1, "Market rate must be at least 1"),
  commitment: Yup.number()
    .min(1, "Commitment must be at least 1%")
    .required(fieldRequired),
  fiatRequested: Yup.number()
    .required(fieldRequired)
    .max(Yup.ref("marketRate"), "Cannot be higher than the market rate.")
    .min(0, "Monetary compensation must be at least 0")
    .test(
      "is-less-than-market-rate-commitment",
      "Cannot be higher than total compensation",
      function (value) {
        const { marketRate, commitment } = this.parent;
        return (
          (value ?? 0) === null ||
          (value ?? 0) <= marketRate * (commitment / 100)
        );
      }
    ),
});

interface FormData {
  roleName: string;
  responsibilities: string;
  marketRate: number | string;
  commitment: number;
  fiatRequested: number | string;
}

interface AddAgreementFormProps {
  contributor: Contributor | null;
  handleClose: () => void;
}

const AddAgreementForm: React.FC<AddAgreementFormProps> = ({
  contributor,
  handleClose,
}) => {
  const dispatch = useDispatch();
  const handleError = useHandleError();
  const organization = useSelector((state: RootState) => state.auth.org);
  const hasAgreement = useMemo(() => {
    return contributor?.agreement && contributor.agreement.id;
  }, [contributor]);

  const initialData: FormData = hasAgreement
    ? {
      roleName: contributor?.agreement?.roleName ?? "",
      responsibilities: contributor?.agreement?.responsibilities ?? "",
      marketRate: contributor?.agreement?.marketRate ?? "",
      commitment: contributor?.agreement?.commitment ?? 0,
      fiatRequested: contributor?.agreement?.fiatRequested ?? "",
    }
    : {
      roleName: "",
      responsibilities: "",
      marketRate: "",
      commitment: 50,
      fiatRequested: "",
    };

  const formik = useFormik({
    initialValues: initialData,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (contributor) {
        const { id } = contributor;
        formik.setSubmitting(true);
        const {
          roleName,
          responsibilities,
          marketRate,
          commitment,
          fiatRequested,
        } = values;

        const body = {
          userId: id,
          roleName,
          responsibilities,
          marketRate,
          commitment,
          fiatRequested,
        };

        if (hasAgreement) {
          try {
            const response = await apiEditContributorAgreement(body, contributor?.agreement?.id as string);
            if (response?.data) {
              refreshOrganizationData(organization?.id as string, dispatch, handleError);
            }
            handleSuccess(`Agreement for ${contributor.username} has been updated.`);
            formik.setSubmitting(false);
            handleClose();
          } catch (error: any) {
            handleError(error);
            formik.setSubmitting(false);
            handleClose();
          }
        } else {
          try {
            const response = await apiCreateContributorAgreement(body);
            if (response?.data) {
              refreshOrganizationData(organization?.id as string, dispatch, handleError);
            }
            handleSuccess(`Agreement for ${contributor.username} has been added.`);
            formik.setSubmitting(false);
            handleClose();
          } catch (error: any) {
            handleError(error);
            formik.setSubmitting(false);
            handleClose();
          }
        }

      }
    },
  });

  return (
    <>
      {contributor && (
        <>
          <FormContainer
            className="max-h-[420px] overflow-y-auto xl:max-h-[750px]"
          >
            <h2 className="mb-4 mt-4 text-2xl font-bold">
              {hasAgreement ? 'Edit ' : 'Add '} Agreement for {contributor?.username}
            </h2>
            <FormItem
              label="Role"
              asterisk
              invalid={!!formik.errors.roleName && formik.touched.roleName}
              errorMessage={formik.errors.roleName}
            >
              <Input
                name="roleName"
                onChange={formik.handleChange}
                invalid={!!formik.errors.roleName && formik.touched.roleName}
                onBlur={formik.handleBlur}
                value={formik.values.roleName}
              />
            </FormItem>
            <FormItem
              label="Responsibilities"
              asterisk
              invalid={
                !!formik.errors.responsibilities && formik.touched.responsibilities
              }
              errorMessage={formik.errors.responsibilities}
            >
              <Input
                name="responsibilities"
                invalid={
                  !!formik.errors.responsibilities &&
                  formik.touched.responsibilities
                }
                textArea
                rows={3}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.responsibilities}
              />
            </FormItem>
            <FormItem
              label="Commitment"
              asterisk
              invalid={!!formik.errors.commitment && formik.touched.commitment}
              errorMessage={formik.errors.commitment}

            >
              <CustomRangeSlider
                field="commitment"
                setFieldValue={formik.setFieldValue}
                value={formik.values.commitment}
              />
            </FormItem>
            <div className="mb-4 flex items-center">
              <span className="font-bold">Compensation</span>
              <Tooltip
                title={
                  <div>
                    <div className="mb-2 font-bold text-gray-300">
                      Calculation Example
                    </div>
                    <div className="font-normal text-gray-300">
                      <div>
                        Total Compensation = Market Rate ($3,000.00) * Commitment
                        (75%) = $2,250.00
                      </div>
                      <div>
                        Points/Tokens Compensation = Total Compensation ($2,250.00)
                        - Monetary Compensation ($500.00) = $1,750.00
                      </div>
                      <div>Monetary Compensation = $500.00</div>
                    </div>
                  </div>
                }
              >
                <div className="group relative text-berrylavender-400">
                  <HiOutlineQuestionMarkCircle className="ml-1 cursor-pointer text-lg" />{" "}
                </div>
              </Tooltip>
            </div>
            <div className="mb-4 flex flex-row items-center justify-start gap-1 rounded-lg bg-berrylavender-100 p-2 dark:bg-berrylavender-700">
              <div className="font-semibold text-berrylavender-700 dark:text-white">
                {formik.values.commitment &&
                  !formik.errors.commitment &&
                  formik.values.marketRate &&
                  !formik.errors.marketRate
                  ? `Based on the commitment and market rate, the total compensation is $${(
                    +formik.values.marketRate *
                    (formik.values.commitment / 100)
                  ).toFixed(0)}.`
                  : "Please input commitment and market rate to calculate the total compensation."}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormItem
                asterisk
                label="Market Rate (per month)"
                invalid={!!formik.errors.marketRate && formik.touched.marketRate}
                errorMessage={formik.errors.marketRate}
              >
                <Input
                  name="marketRate"
                  type="number"
                  prefix="$"
                  invalid={!!formik.errors.marketRate && formik.touched.marketRate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.marketRate}
                />
              </FormItem>
              <FormItem
                label="Monetary Compensation (per month)"
                asterisk
                invalid={
                  !!formik.errors.fiatRequested && formik.touched.fiatRequested
                }
                errorMessage={formik.errors.fiatRequested}
              >
                <Input
                  name="fiatRequested"
                  type="number"
                  invalid={
                    !!formik.errors.fiatRequested && formik.touched.fiatRequested
                  }
                  prefix="$"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.fiatRequested}
                />
              </FormItem>
            </div>
          </FormContainer>
          <div className="mt-4 flex justify-end gap-4">
            <Button type="button" onClick={() => handleClose()}>
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={() => formik.handleSubmit()}
              disabled={!formik.isValid || formik.isSubmitting}
            >
              Save
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default AddAgreementForm;
