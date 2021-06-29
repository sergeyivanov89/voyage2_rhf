import * as React from "react";
import { Col, Row } from "reactstrap";
import { useFormContext, useWatch } from "react-hook-form";
import get from "lodash.get";

import { CheckboxField } from "components/fields";
import Citizenship from "./Citizenship";
import Person from "./Person";
import Document from "./Document";
import Address from "components/Address";
import NextStepButton from "components/NextStepButton";
import { IsPremiumBigCtx } from "../..";
import { FORM_PATHS } from "consts";

const Policyholder = () => {
  const { getValues, setValue } = useFormContext();
  const [isCoverEstateOn, flatSame] = useWatch({
    name: [FORM_PATHS.COVER_ESTATE_ON, FORM_PATHS.FLAT_SAME],
  });
  const isPremiumBig = React.useContext(IsPremiumBigCtx);

  const onFlatSameChange = (e) => {
    const checked = e.target.value;
    if (checked) {
      const { addressCdi, flat, region } = get(
        getValues(),
        FORM_PATHS.POLICYHOLDER_ADDRESS
      );
      setValue(`${FORM_PATHS.FLAT}.addressCdi`, addressCdi);
      setValue(`${FORM_PATHS.FLAT}.flat`, flat);
      setValue(`${FORM_PATHS.FLAT}.region`, region);
    } else {
      setValue(`${FORM_PATHS.FLAT}.addressCdi`, null);
      setValue(`${FORM_PATHS.FLAT}.flat`, undefined);
      setValue(`${FORM_PATHS.FLAT}.region`, null);
    }
  };

  return (
    <>
      {!isCoverEstateOn && <Citizenship />}
      <Person />
      {isPremiumBig && (
        <>
          <Document />
          <Address
            addressCdiLabel="Адрес регистрации/Место пребывания Cтрахователя"
            path={FORM_PATHS.POLICYHOLDER_ADDRESS}
          />
        </>
      )}
      {isCoverEstateOn && (
        <>
          {isPremiumBig && (
            <>
              <hr />
              <CheckboxField
                name={FORM_PATHS.FLAT_SAME}
                defaultValue={false}
                rules={{ onChange: onFlatSameChange }}
                label="Адрес застрахованной квартиры совпадает с адресом регистрации Страхователя"
                type="switch"
              />
            </>
          )}
          {!flatSame && (
            <Address
              addressCdiLabel="Адрес застрахованной квартиры"
              path={FORM_PATHS.FLAT}
            />
          )}
        </>
      )}
      <Row>
        <Col className="ml-auto" xs="auto">
          <NextStepButton color="primary" />
        </Col>
      </Row>
    </>
  );
};

export default Policyholder;
