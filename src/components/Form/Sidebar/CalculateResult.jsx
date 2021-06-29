import * as React from "react";
import { useFormContext } from "react-hook-form";
import get from "lodash.get";

import Currency from "components/Currency";
import Sconto from "./Sconto";
import ProgramCheckbox from "./ProgramCheckbox";
import { PremiumCtx, SyncPremiumCtx } from "..";
import { DataCtx } from "../CalculationProvider";
import { useStepper } from "components/Stepper";
import { FORM_PATHS, COVER_NAMES } from "consts";

const CalculateResult = () => {
  const { getValues, setValue } = useFormContext();
  const data = React.useContext(DataCtx);
  const premium = React.useContext(PremiumCtx);
  const syncPremium = React.useContext(SyncPremiumCtx);
  const { currentStepIndex, goToStep, stepCount } = useStepper();

  const onCheck = (program) => () => {
    setValue(FORM_PATHS.PROGRAM, program);

    const { isPremiumBig } = syncPremium(data, program.code);
    if (currentStepIndex === stepCount - 1 && isPremiumBig) {
      goToStep(3);
    }
  };

  const programCode = get(getValues(), FORM_PATHS.PROGRAM_CODE);
  const dataItemByProgram = data.find((el) => el.program.code === programCode);
  const { covers, options } = dataItemByProgram.logic.results.data;

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

  return (
    <>
      <div className="logicPanelName mb-2">
        Выберите программу
        <br />
        (Covid-19 включен)
      </div>
      {data.map(({ program, logic }) => (
        <ProgramCheckbox
          key={program.code}
          checked={program.code === programCode}
          label={program.name}
          onChange={onCheck(program)}
          premium={logic.results.risks.medical.data.premiumRUR}
        />
      ))}
      {!!renderedCovers.length && (
        <>
          <div className="small">Дополнения</div>
          {renderedCovers.map(({ code, name, premiumRUR }) => (
            <div
              key={code}
              className="d-flex justify-content-between small text-primary font-italic"
            >
              <div className="pr-2">+ {COVER_NAMES[code] || name}</div>
              <div className="pl-2 text-nowrap">{premiumRUR} руб.</div>
            </div>
          ))}
        </>
      )}
      {!!renderedOptions.length && (
        <>
          <div className="small mt-2">Опции</div>
          {renderedOptions.map(({ code, name }) => (
            <div key={code} className="small text-primary font-italic">
              + {name}
            </div>
          ))}
        </>
      )}
      <div className="logicPanelTotal d-flex justify-content-between mt-2">
        <div className="pr-2">Итого:</div>
        <Currency
          className="pl-2 h5 text-primary text-nowrap font-weight-bold"
          value={premium}
        />
      </div>
      <Sconto />
    </>
  );
};

export default CalculateResult;
