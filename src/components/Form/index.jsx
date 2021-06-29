import * as React from "react";
import { Container } from "reactstrap";
import { FormProvider, useForm } from "react-hook-form";
import get from "lodash.get";
import set from "lodash.set";

import CalculationProvider from "./CalculationProvider";
import Stepper from "components/Stepper";
import {
  Additionals,
  Calculation,
  InsuredPersons,
  Policyholder,
  Purchase,
} from "./steps";
import {
  AdditionalsBrief,
  CalculationBrief,
  InsuredPersonsBrief,
  PolicyholderBrief,
} from "./briefs";
import Sidebar from "./Sidebar";
import { CurrentDateTimeCtx, ProductDataCtx } from "App";
import {
  fetchApi,
  getMaxBeginDate,
  getMaxPolicyholderDob,
  getMaxTravellerDob,
  getMinPolicyholderDob,
  getMinTravellerDob,
  getPremiumByProgram,
  parseToUTC,
} from "utils";
import defaultValues from "defaultValues";
import { resolver } from "resolver";
import { FORM_PATHS, PREMIUM_THRESHOLD } from "consts";

export const MaxBeginDateCtx = React.createContext();
export const MaxPolicyholderDobCtx = React.createContext();
export const MaxTravellerDobCtx = React.createContext();
export const MinPolicyholderDobCtx = React.createContext();
export const MinTravellerDobCtx = React.createContext();
export const PremiumCtx = React.createContext();
export const IsPremiumBigCtx = React.createContext();
export const SyncPremiumCtx = React.createContext();
export const SubmitErrorCtx = React.createContext();

const Form = () => {
  const [payment, setPaymet] = React.useState(false);
  const [stepIndex, setStepIndex] = React.useState(0);
  const [premium, setPremium] = React.useState();
  const [isPremiumBig, setIsPremiumBig] = React.useState();
  const [submitError, setSubmitError] = React.useState();
  const currentDateTime = React.useContext(CurrentDateTimeCtx);
  const {
    maquette,
    registers: { insConditions, subjectsRF, voyage2EstateTypes },
  } = React.useContext(ProductDataCtx);

  const initialValues = React.useMemo(() => {
    const result = {
      ...maquette,
      insConditions,
      ...defaultValues,
    };
    const { covers, options } = insConditions;
    const { luggageN } = covers.find(({ code }) => code === "luggage");

    set(result, `${FORM_PATHS.TRAVELLERS}.0`, {
      dob: "",
      insVariant: { luggageN },
    });
    set(result, FORM_PATHS.COVER_ESTATE_TYPE, voyage2EstateTypes[0]);
    covers.forEach(({ code }) =>
      set(result, `${FORM_PATHS.COVERS}.${code}.on`, code === "medical")
    );
    options
      .filter(({ code }) => code !== "sportK" && code !== "quarantineK")
      .forEach(({ code }) =>
        set(result, `${FORM_PATHS.OPTIONS}.${code}`, false)
      );

    return result;
  }, [insConditions, maquette, voyage2EstateTypes]);

  const maxBeginDate = React.useMemo(
    () => getMaxBeginDate(currentDateTime),
    [currentDateTime]
  );
  const maxBeginDateUTC = React.useMemo(
    () => parseToUTC(maxBeginDate),
    [maxBeginDate]
  );
  const maxPolicyholderDob = React.useMemo(
    () => getMaxPolicyholderDob(currentDateTime),
    [currentDateTime]
  );
  const maxPolicyholderDobUTC = React.useMemo(
    () => parseToUTC(maxPolicyholderDob),
    [maxPolicyholderDob]
  );
  const maxTravellerDob = React.useMemo(
    () => getMaxTravellerDob(currentDateTime),
    [currentDateTime]
  );
  const maxTravellerDobUTC = React.useMemo(
    () => parseToUTC(maxTravellerDob),
    [maxTravellerDob]
  );
  const minPolicyholderDob = React.useMemo(
    () => getMinPolicyholderDob(currentDateTime),
    [currentDateTime]
  );
  const minPolicyholderDobUTC = React.useMemo(
    () => parseToUTC(minPolicyholderDob),
    [minPolicyholderDob]
  );
  const minTravellerDob = React.useMemo(
    () => getMinTravellerDob(currentDateTime),
    [currentDateTime]
  );
  const minTravellerDobUTC = React.useMemo(
    () => parseToUTC(minTravellerDob),
    [minTravellerDob]
  );

  const methods = useForm({
    mode: "all",
    defaultValues: initialValues,
    resolver,
    context: {
      currentDateTime,
      isPremiumBig,
      maxBeginDate: maxBeginDate.getTime(),
      maxBeginDateUTC,
      maxPolicyholderDob: maxPolicyholderDob.getTime(),
      maxPolicyholderDobUTC,
      maxTravellerDob: maxTravellerDob.getTime(),
      maxTravellerDobUTC,
      minPolicyholderDob: minPolicyholderDob.getTime(),
      minPolicyholderDobUTC,
      minTravellerDob: minTravellerDob.getTime(),
      minTravellerDobUTC,
      regions: subjectsRF,
      stepIndex,
    },
  });

  const onSubmit = (values) => {
    if (payment) {
      return;
    }

    setPaymet(true);

    fetchApi("Product.save", "B2C", { data: values })
      .then((res) => {
        const { data, success, error } = res.data;
        if (!success) {
          throw new Error(error || "Save request failed.");
        }
        setSubmitError("");
        return data;
      })
      .then((result) => {
        if (result.success && result.payUrl) {
          window.parent.postMessage(
            `__resolute__{"url":"${result.payUrl}"}`,
            "*"
          );
        } else {
          setPaymet(false);
        }
      })
      .catch((err) => {
        const message =
          (err.response
            ? err.response.data.error
            : err.request
            ? err.request.statusText
            : err.message) || "Save request failed.";
        setSubmitError(message);
        setPaymet(false);
        console.error(err);
      });
  };

  const { getValues, setValue } = methods;

  const syncPremium = (calcData, programCode) => {
    const premium = getPremiumByProgram(calcData, programCode);
    const isPremiumBig = premium && premium > PREMIUM_THRESHOLD;

    setPremium(premium);
    setIsPremiumBig(isPremiumBig);

    if (!isPremiumBig) {
      const flatSame = get(getValues(), FORM_PATHS.FLAT_SAME);
      if (flatSame) {
        setValue(FORM_PATHS.FLAT_SAME, false);
      }
    }

    return { isPremiumBig, premium };
  };

  return (
    <FormProvider {...methods}>
      <MaxBeginDateCtx.Provider value={maxBeginDate}>
        <MaxPolicyholderDobCtx.Provider value={maxPolicyholderDob}>
          <MaxTravellerDobCtx.Provider value={maxTravellerDob}>
            <MinPolicyholderDobCtx.Provider value={minPolicyholderDob}>
              <MinTravellerDobCtx.Provider value={minTravellerDob}>
                <PremiumCtx.Provider value={premium}>
                  <IsPremiumBigCtx.Provider value={isPremiumBig}>
                    <SyncPremiumCtx.Provider value={syncPremium}>
                      <SubmitErrorCtx.Provider value={submitError}>
                        <CalculationProvider>
                          <Container
                            onSubmit={methods.handleSubmit(onSubmit)}
                            tag="form"
                          >
                            <Stepper
                              onStepChange={setStepIndex}
                              sidebar={Sidebar}
                            >
                              <Calculation
                                brief={CalculationBrief}
                                title="Расчёт"
                              />
                              <Additionals
                                brief={AdditionalsBrief}
                                title="Популярные опции и дополнения"
                              />
                              <InsuredPersons
                                brief={InsuredPersonsBrief}
                                title="Застрахованные лица"
                              />
                              <Policyholder
                                brief={PolicyholderBrief}
                                title="Страхователь"
                              />
                              <Purchase title="Оплата" />
                            </Stepper>
                          </Container>
                        </CalculationProvider>
                      </SubmitErrorCtx.Provider>
                    </SyncPremiumCtx.Provider>
                  </IsPremiumBigCtx.Provider>
                </PremiumCtx.Provider>
              </MinTravellerDobCtx.Provider>
            </MinPolicyholderDobCtx.Provider>
          </MaxTravellerDobCtx.Provider>
        </MaxPolicyholderDobCtx.Provider>
      </MaxBeginDateCtx.Provider>
    </FormProvider>
  );
};

export default Form;
