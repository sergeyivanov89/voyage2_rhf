import React from "react";
import { Col, Row } from "reactstrap";
import { useWatch } from "react-hook-form";
import { format } from "date-fns";

import Dates from "./Dates";
import { getFormattedSum, parseFromUTC } from "utils";
import { FORM_PATHS } from "consts";

const Calculation = () => {
  const [
    countryList,
    currencyCode,
    isOptionSportEnabled,
    limit,
    travellers,
    tripTypeName,
  ] = useWatch({
    name: [
      FORM_PATHS.COUNTRY_LIST,
      FORM_PATHS.CURRENCY_CODE,
      FORM_PATHS.OPTION_SPORT,
      FORM_PATHS.LIMIT_CODE,
      FORM_PATHS.TRAVELLERS,
      FORM_PATHS.TRIP_TYPE_NAME,
    ],
  });

  const travellerCount = travellers.length;

  return (
    <div className="mt-1 small text-muted">
      <Row md={2} noGutters xs={1}>
        <Col className="pr-md-1">Количество путешественников:</Col>
        <Col className="pl-md-1 text-primary">{travellerCount}</Col>
      </Row>

      <Row className="border-top mt-1" noGutters md={2} xs={1}>
        <Col className="pr-md-1">
          {travellerCount > 1
            ? "Даты рождения путешественников:"
            : "Дата рождения путешественника:"}
        </Col>
        <Col className="pl-md-1 text-primary">
          {travellers.map(({ dob }, idx) => (
            <React.Fragment key={idx}>
              {format(parseFromUTC(dob), "dd.MM.yyyy")}
              {idx < travellerCount - 1 && ", "}
            </React.Fragment>
          ))}
        </Col>
      </Row>

      <Row className="border-top mt-1" md={2} noGutters xs={1}>
        <Col className="pr-md-1">Тип поездки:</Col>
        <Col className="pl-md-1 text-primary">{tripTypeName}</Col>
      </Row>

      <Row className="border-top mt-1" md={2} noGutters xs={1}>
        <Col className="pr-md-1">Сумма страховой защиты:</Col>
        <Col className="pl-md-1 text-primary">
          {getFormattedSum(limit, { currency: currencyCode })}
        </Col>
      </Row>

      <Dates />

      <Row className="border-top mt-1" md={2} noGutters xs={1}>
        <Col className="pr-md-1">Защита при активном отдыхе:</Col>
        <Col className="pl-md-1 text-primary">
          {isOptionSportEnabled ? "нужна" : "не нужна"}
        </Col>
      </Row>

      <Row className="border-top mt-1" md={2} noGutters xs={1}>
        <Col className="pr-md-1">Территория покрытия:</Col>
        <Col className="pl-md-1 text-primary">{countryList}</Col>
      </Row>
    </div>
  );
};

export default Calculation;
