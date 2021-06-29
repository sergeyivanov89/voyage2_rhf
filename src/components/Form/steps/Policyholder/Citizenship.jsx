import * as React from "react";
import { Col, Row } from "reactstrap";
import { useFormContext, useFormState, useWatch } from "react-hook-form";
import get from "lodash.get";
import cloneDeep from "lodash.clonedeep";

import { SelectField } from "components/fields";
import { ProductDataCtx } from "App";
import { useSyncDocumentName } from "hooks";
import {
  FORM_PATHS,
  CITIZENSHIP_RU,
  DOCUMENT_TYPE_RUSSIAN_PASSPORT_OPTION,
  DOCUMENT_TYPE_FOREIGN_PASSPORT_OPTION,
} from "consts";

const Citizenship = () => {
  const { clearErrors, setValue } = useFormContext();
  const { touchedFields } = useFormState();
  const [lastName, firstName, middleName] = useWatch({
    name: [
      FORM_PATHS.POLICYHOLDER_LAST_NAME,
      FORM_PATHS.POLICYHOLDER_FIRST_NAME,
      FORM_PATHS.POLICYHOLDER_MIDDLE_NAME,
    ],
  });
  const productData = React.useContext(ProductDataCtx);
  const syncDocumentName = useSyncDocumentName(
    FORM_PATHS.POLICYHOLDER_DOCUMENT
  );

  const onChange = (e) => {
    const isRussia = e.target.value.code === CITIZENSHIP_RU.code;
    setValue(
      FORM_PATHS.POLICYHOLDER_DOCUMENT_TYPE,
      isRussia
        ? DOCUMENT_TYPE_RUSSIAN_PASSPORT_OPTION
        : DOCUMENT_TYPE_FOREIGN_PASSPORT_OPTION
    );
    setValue(FORM_PATHS.POLICYHOLDER_DOCUMENT_SERIES, "");
    setValue(FORM_PATHS.POLICYHOLDER_DOCUMENT_NUMBER, "");
    clearErrors([
      FORM_PATHS.POLICYHOLDER_DOCUMENT_SERIES,
      FORM_PATHS.POLICYHOLDER_DOCUMENT_NUMBER,
    ]);
    if (!isRussia) {
      setValue(FORM_PATHS.POLICYHOLDER_DOCUMENT_DOI, undefined);
      setValue(FORM_PATHS.POLICYHOLDER_DOCUMENT_ISSUED, undefined);
      clearErrors(FORM_PATHS.POLICYHOLDER_PHONE);
    }
    syncDocumentName();
  };

  const rules = { onChange };
  if (lastName || get(touchedFields, FORM_PATHS.POLICYHOLDER_LAST_NAME)) {
    rules.deps = rules.deps || [];
    rules.deps.push(FORM_PATHS.POLICYHOLDER_LAST_NAME);
  }
  if (firstName || get(touchedFields, FORM_PATHS.POLICYHOLDER_FIRST_NAME)) {
    rules.deps = rules.deps || [];
    rules.deps.push(FORM_PATHS.POLICYHOLDER_FIRST_NAME);
  }
  if (middleName || get(touchedFields, FORM_PATHS.POLICYHOLDER_MIDDLE_NAME)) {
    rules.deps = rules.deps || [];
    rules.deps.push(FORM_PATHS.POLICYHOLDER_MIDDLE_NAME);
  }

  const options = cloneDeep(productData.registers.skkCountries);

  return (
    <Row className="mt-3">
      <Col>
        <div className="mb-2">Гражданство</div>
        <SelectField
          name={FORM_PATHS.POLICYHOLDER_CITIZENSHIP}
          rules={rules}
          options={options}
        />
      </Col>
    </Row>
  );
};

export default Citizenship;
