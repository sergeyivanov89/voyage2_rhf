import { format } from "date-fns";
import { useWatch } from "react-hook-form";
import { Col, Row } from "reactstrap";

import { FORM_PATHS } from "consts";
import { getNoun, parseFromUTC } from "utils";

const Dates = () => {
  const [arrival, beginDate, tripLength, tripPeriodCode, tripTypeCode] =
    useWatch({
      name: [
        FORM_PATHS.ARRIVAL,
        FORM_PATHS.BEGIN_DATE,
        FORM_PATHS.TRIP_LENGTH,
        FORM_PATHS.TRIP_PERIOD_CODE,
        FORM_PATHS.TRIP_TYPE_CODE,
      ],
    });

  const formattedBeginDate = format(parseFromUTC(beginDate), "dd.MM.yyyy");

  let label, value;

  switch (tripTypeCode) {
    case "single": {
      const formattedArrival = format(parseFromUTC(arrival), "dd.MM.yyyy");
      const daysNoun = getNoun(tripLength, "день", "дня", "дней");
      label = "Даты поездки:";
      value = `${formattedBeginDate} - ${formattedArrival} (${tripLength} ${daysNoun} в поездке)`;
      break;
    }

    case "multiple": {
      const [dayCount, totalDayCount] = tripPeriodCode.split("_");
      const daysNoun = getNoun(dayCount, "день", "дня", "дней");
      label = "Дата начала действия полиса:";
      value = `${formattedBeginDate} (${dayCount} ${daysNoun} из ${totalDayCount})`;
      break;
    }

    default:
  }

  return (
    <Row className="border-top mt-1" md={2} noGutters xs={1}>
      <Col className="pr-md-1">{label}</Col>
      <Col className="pl-md-1 text-primary">{value}</Col>
    </Row>
  );
};

export default Dates;
