import * as React from "react";
import { Col, Row } from "reactstrap";
import { useFormState, useWatch } from "react-hook-form";
import { startOfDay, subYears } from "date-fns";
import get from "lodash.get";

import { DateField, PhoneField, TextField } from "components/fields";
import { CurrentDateTimeCtx } from "App";
import { MaxPolicyholderDobCtx, MinPolicyholderDobCtx } from "../..";
import { useSyncFullName } from "hooks";
import { capitalizeName, parseToUTC } from "utils";
import { FORM_PATHS, DEFAULT_POLICYHOLDER_AGE, REGEX_VALIDATION } from "consts";

const Person = () => {
  const { touchedFields } = useFormState();
  const [emailConfirm, citizenshipCode, documentDoi] = useWatch({
    name: [
      FORM_PATHS.POLICYHOLDER_EMAIL_CONFIRM,
      FORM_PATHS.POLICYHOLDER_CITIZENSHIP_CODE,
      FORM_PATHS.POLICYHOLDER_DOCUMENT_DOI,
    ],
  });
  const currentDateTime = React.useContext(CurrentDateTimeCtx);
  const maxDob = React.useContext(MaxPolicyholderDobCtx);
  const minDob = React.useContext(MinPolicyholderDobCtx);

  const syncFullName = useSyncFullName(FORM_PATHS.POLICYHOLDER);

  const isRussia = citizenshipCode === "643";
  const staticValidate = REGEX_VALIDATION[isRussia ? "RU" : "RU_EN"];
  const nameFieldProps = {
    rules: { onChange: syncFullName },
    parse: capitalizeName,
    staticValidate,
    trimOnBlur: true,
  };

  const defaultDob = startOfDay(
    subYears(currentDateTime, DEFAULT_POLICYHOLDER_AGE)
  );

  let dobRules, emailRules;
  if (documentDoi || get(touchedFields, FORM_PATHS.POLICYHOLDER_DOCUMENT_DOI)) {
    dobRules = { deps: FORM_PATHS.POLICYHOLDER_DOCUMENT_DOI };
  }
  if (
    emailConfirm ||
    get(touchedFields, FORM_PATHS.POLICYHOLDER_EMAIL_CONFIRM)
  ) {
    emailRules = { deps: FORM_PATHS.POLICYHOLDER_EMAIL_CONFIRM };
  }

  return (
    <>
      <Row className="mt-3" form>
        <Col md={4} className="mb-3">
          <div className="mb-2">Фамилия</div>
          <TextField
            name={FORM_PATHS.POLICYHOLDER_LAST_NAME}
            {...nameFieldProps}
          />
        </Col>
        <Col md={4} className="mb-3">
          <div className="mb-2">Имя</div>
          <TextField
            name={FORM_PATHS.POLICYHOLDER_FIRST_NAME}
            {...nameFieldProps}
          />
        </Col>
        <Col md={4} className="mb-3">
          <div className="mb-2">Отчество</div>
          <TextField
            name={FORM_PATHS.POLICYHOLDER_MIDDLE_NAME}
            {...nameFieldProps}
          />
        </Col>
        <Col md={4} className="mb-3">
          <div className="mb-2">Дата рождения</div>
          <DateField
            name={FORM_PATHS.POLICYHOLDER_DOB}
            rules={dobRules}
            defaultDate={defaultDob}
            maxDate={maxDob}
            minDate={minDob}
            parse={parseToUTC}
          />
        </Col>
        <Col md={4} className="mb-3">
          <div className="mb-2">Мобильный телефон</div>
          <PhoneField
            name={FORM_PATHS.POLICYHOLDER_PHONE}
            placeholder="+7(___)___-__-__"
          />
        </Col>
      </Row>
      <Row form>
        <Col md={4} className="mb-3">
          <div className="mb-2">E-mail</div>
          <TextField
            name={FORM_PATHS.POLICYHOLDER_EMAIL}
            rules={emailRules}
            type="email"
          />
        </Col>
        <Col md={8} className="mb-3">
          <div className="mb-2">Подтвердите e-mail</div>
          <Row form>
            <Col md={6}>
              <TextField
                name={FORM_PATHS.POLICYHOLDER_EMAIL_CONFIRM}
                disablePast
                type="email"
              />
            </Col>
            <Col md={6} className="small font-italic">
              Страховой полис будет выслан на указанный <nobr>e-mail</nobr>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default Person;
