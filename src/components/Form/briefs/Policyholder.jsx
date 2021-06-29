import React from "react";
import { Col, Row } from "reactstrap";
import { useWatch } from "react-hook-form";
import { format } from "date-fns";

import { getFullAddress, parseFromUTC } from "utils";
import { FORM_PATHS } from "consts";

const Policyholder = () => {
  const [dob, email, flatAddress, isCoverEstateOn, name, phone] = useWatch({
    name: [
      FORM_PATHS.POLICYHOLDER_DOB,
      FORM_PATHS.POLICYHOLDER_EMAIL,
      FORM_PATHS.FLAT,
      FORM_PATHS.COVER_ESTATE_ON,
      FORM_PATHS.POLICYHOLDER_NAME,
      FORM_PATHS.POLICYHOLDER_PHONE,
    ],
  });

  return (
    <div className="mt-1 small text-muted">
      <Row md={2} noGutters xs={1}>
        <Col className="pr-md-1">ФИО:</Col>
        <Col className="pl-md-1 text-primary">{name}</Col>
      </Row>

      <Row className="border-top mt-1" noGutters md={2} xs={1}>
        <Col className="pr-md-1">Дата рождения:</Col>
        <Col className="pl-md-1 text-primary">
          {format(parseFromUTC(dob), "dd.MM.yyyy")}
        </Col>
      </Row>

      <Row className="border-top mt-1" noGutters md={2} xs={1}>
        <Col className="pr-md-1">E-mail:</Col>
        <Col className="pl-md-1 text-primary">{email}</Col>
      </Row>

      <Row className="border-top mt-1" noGutters md={2} xs={1}>
        <Col className="pr-md-1">Телефон:</Col>
        <Col className="pl-md-1 text-primary">{phone}</Col>
      </Row>

      {isCoverEstateOn && (
        <Row className="border-top mt-1" noGutters md={2} xs={1}>
          <Col className="pr-md-1">Адрес застрахованной квартиры:</Col>
          <Col className="pl-md-1 text-primary">
            {getFullAddress(flatAddress)}
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Policyholder;
