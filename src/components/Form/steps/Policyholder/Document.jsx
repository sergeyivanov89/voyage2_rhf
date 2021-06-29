import * as React from "react";
import { Col, Row } from "reactstrap";
import { useWatch } from "react-hook-form";

import {
  DateField,
  MaskedField,
  SelectField,
  TextField,
} from "components/fields";
import { CurrentDateTimeCtx } from "App";
import { useSyncDocumentName } from "hooks";
import { getMaxDocumentDoi, getMinDocumentDoi, parseToUTC } from "utils";
import {
  FORM_PATHS,
  DOCUMENT_TYPE_RUSSIAN_PASSPORT_OPTION,
  DOCUMENT_TYPE_FOREIGN_PASSPORT_OPTION,
  REGEX_VALIDATION,
} from "consts";

const Document = () => {
  const [policyholderDob, typeCode, typeName] = useWatch({
    name: [
      FORM_PATHS.POLICYHOLDER_DOB,
      FORM_PATHS.POLICYHOLDER_DOCUMENT_TYPE_CODE,
      FORM_PATHS.POLICYHOLDER_DOCUMENT_TYPE_NAME,
    ],
  });
  const currentDateTime = React.useContext(CurrentDateTimeCtx);
  const syncDocumentName = useSyncDocumentName(
    FORM_PATHS.POLICYHOLDER_DOCUMENT
  );

  const seriesProps = {
    name: FORM_PATHS.POLICYHOLDER_DOCUMENT_SERIES,
    defaultValue: "",
    rules: { onChange: syncDocumentName },
    placeholder: "Серия",
  };
  const numberProps = {
    name: FORM_PATHS.POLICYHOLDER_DOCUMENT_NUMBER,
    defaultValue: "",
    rules: { onChange: syncDocumentName },
    placeholder: "Номер",
  };

  const isPassportRussian =
    typeCode === DOCUMENT_TYPE_RUSSIAN_PASSPORT_OPTION.code;
  const isPassportForeign =
    typeCode === DOCUMENT_TYPE_FOREIGN_PASSPORT_OPTION.code;

  const maxDoi = getMaxDocumentDoi(currentDateTime);
  const minDoi = getMinDocumentDoi(policyholderDob);

  return (
    <Row form>
      <Col className="mb-3" md={4}>
        <div className="mb-2">Тип документа</div>
        <SelectField
          name={FORM_PATHS.POLICYHOLDER_DOCUMENT_TYPE}
          disabled
          options={[
            DOCUMENT_TYPE_RUSSIAN_PASSPORT_OPTION,
            DOCUMENT_TYPE_FOREIGN_PASSPORT_OPTION,
          ]}
        />
      </Col>
      <Col md={8} xs={12}>
        <div className="mb-2">{typeName}</div>
        <Row form md={2} xs={1}>
          <Col className="mb-3">
            {isPassportRussian && (
              <MaskedField
                {...seriesProps}
                mask={[/\d/, /\d/, /\d/, /\d/]}
                placeholderChar="✻"
              />
            )}
            {isPassportForeign && (
              <TextField
                {...seriesProps}
                inputProps={{ maxLength: 8 }}
                staticValidate={REGEX_VALIDATION.FOREIGN_PASSPORT_SERIES}
              />
            )}
          </Col>
          <Col className="mb-3">
            {isPassportRussian && (
              <MaskedField
                {...numberProps}
                mask={[/\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                placeholderChar="✻"
              />
            )}
            {isPassportForeign && (
              <TextField
                {...numberProps}
                inputProps={{ maxLength: 10 }}
                staticValidate={REGEX_VALIDATION.FOREIGN_PASSPORT_NUMBER}
              />
            )}
          </Col>
        </Row>
      </Col>
      {isPassportRussian && (
        <>
          <Col className="mb-3" md={4}>
            <div className="mb-2">Дата выдачи</div>
            <DateField
              name={FORM_PATHS.POLICYHOLDER_DOCUMENT_DOI}
              defaultValue=""
              rules={{ onChange: syncDocumentName }}
              defaultDate={maxDoi}
              maxDate={maxDoi}
              minDate={minDoi}
              parse={parseToUTC}
            />
          </Col>
          <Col className="mb-3" md={8}>
            <div className="mb-2">Кем выдан</div>
            <TextField
              name={FORM_PATHS.POLICYHOLDER_DOCUMENT_ISSUED}
              defaultValue=""
              rules={{ onChange: syncDocumentName }}
              staticValidate={REGEX_VALIDATION.PASSPORT_ISSUED}
            />
          </Col>
        </>
      )}
    </Row>
  );
};

export default Document;
