import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cn from "classnames";
import get from "lodash.get";
import * as React from "react";
import { useFormContext } from "react-hook-form";
import { Col, Row } from "reactstrap";

import { DataCtx as CalcDataCtx } from "../CalculationProvider";
import { FORM_PATHS } from "consts";

const Additionals = () => {
  const calcData = React.useContext(CalcDataCtx);

  const { getValues } = useFormContext();

  const values = getValues();
  const programCode = get(values, FORM_PATHS.PROGRAM_CODE);
  const calcDataItemByProgram = calcData.find(
    (el) => el.program.code === programCode
  );
  const { covers, options } = calcDataItemByProgram.logic.results.data;

  const renderedCovers = Object.values(covers).filter(
    ({ code }) => code !== "medical"
  );
  const renderedOptions = options.filter(({ code }) => code !== "sportK");

  const tripCancelProgramCode = covers.tripCancel?.program.code;
  if (tripCancelProgramCode === "O6" || tripCancelProgramCode === "O6RUR") {
    renderedOptions.unshift({
      code: "tripCancel",
      name: "Задержка/отмена рейса",
    });
  }

  const hasCovers = !!renderedCovers.length;
  const hasOptions = !!renderedOptions.length;

  if (!hasCovers && !hasOptions) {
    return (
      <div className="mt-1 small text-muted">Без дополнительной защиты</div>
    );
  }

  return (
    <div className="mt-1 small text-muted">
      <Row md={2} noGutters xs={1}>
        {hasCovers && (
          <Col className={cn(hasOptions && "pr-md-1")}>
            <div>Дополнения:</div>
            {renderedCovers.map(({ code, name }) => (
              <div key={code}>
                <FontAwesomeIcon className="text-primary" icon={faCheck} />{" "}
                {name}
              </div>
            ))}
          </Col>
        )}

        {hasOptions && (
          <Col className={cn(hasCovers && "mt-1 mt-md-0 pl-md-1")}>
            <div>Опции:</div>
            {renderedOptions.map(({ code, name }) => (
              <div key={code}>
                <FontAwesomeIcon className="text-primary" icon={faCheck} />{" "}
                {name}
              </div>
            ))}
          </Col>
        )}
      </Row>
    </div>
  );
};

export default Additionals;
