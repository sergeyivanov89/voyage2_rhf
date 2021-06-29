import { Col, Row } from "reactstrap";
import { useWatch } from "react-hook-form";
import { format } from "date-fns";
import cn from "classnames";

import { parseFromUTC } from "utils";
import { FORM_PATHS } from "consts";

const InsuredPersons = () => {
  const travellers = useWatch({ name: FORM_PATHS.TRAVELLERS });

  return (
    <div className="mt-1 small text-muted">
      {travellers.map(({ dob, name }, idx) => (
        <Row
          key={idx}
          className={cn(idx > 0 && "border-top mt-1")}
          md={2}
          noGutters
          xs={1}
        >
          <Col className="pr-md-1">Застрахованный №{idx + 1}:</Col>
          <Col className="pl-md-1">
            <span className="text-primary">{name}</span>, д.р.{" "}
            <span className="text-primary">
              {format(parseFromUTC(dob), "dd.MM.yyyy")}
            </span>
          </Col>
        </Row>
      ))}
    </div>
  );
};

export default InsuredPersons;
