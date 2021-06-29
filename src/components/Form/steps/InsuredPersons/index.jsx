import * as React from "react";
import { Col, Row } from "reactstrap";
import { useFieldArray, useWatch } from "react-hook-form";

import Person from "./Person";
import Currency from "components/Currency";
import NextStepButton from "components/NextStepButton";
import { PremiumCtx } from "../..";
import { useWidth } from "hooks";
import { FORM_PATHS, RUSSIA } from "consts";

const InsuredPersons = () => {
  const { fields } = useFieldArray({ name: FORM_PATHS.TRAVELLERS });
  const countries = useWatch({ name: FORM_PATHS.COUNTRIES });
  const premium = React.useContext(PremiumCtx);
  const { down } = useWidth();

  const isRussia =
    countries.length === 1 && countries[0].country.code === RUSSIA;
  const isMobile = down("md");

  return (
    <>
      {fields.map(({ id }, idx, arr) => (
        <React.Fragment key={id}>
          <Row className="mt-3">
            <Col>Застрахованный №{idx + 1}</Col>
          </Row>
          <Person
            key={id}
            isRussia={isRussia}
            path={`${FORM_PATHS.TRAVELLERS}.${idx}`}
          />
          {idx < arr.length - 1 && <hr />}
        </React.Fragment>
      ))}
      <Row className="align-items-center">
        {isMobile && (
          <Col>
            <Currency
              className="text-primary font-weight-bold"
              value={premium}
            />
          </Col>
        )}
        <Col className="ml-auto" xs="auto">
          <NextStepButton color="primary" />
        </Col>
      </Row>
    </>
  );
};

export default InsuredPersons;
