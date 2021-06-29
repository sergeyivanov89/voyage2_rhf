import * as React from "react";
import { Alert, CustomInput } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

import Payment from "./Payment";
import { PremiumCtx } from "../..";
import { useUniqueId } from "hooks";

const Purchase = () => {
  const [acceptChecked, setAcceptChecked] = React.useState(false);
  const premium = React.useContext(PremiumCtx);
  const checkboxId = useUniqueId();

  const isPremiumGreat = premium > 250_000;

  const onAcceptCheck = (e) => setAcceptChecked(e.target.checked);

  return (
    <>
      <Alert
        className="align-items-center border d-flex my-3"
        color="light"
        isOpen={isPremiumGreat}
      >
        <FontAwesomeIcon
          className="text-primary"
          icon={faInfoCircle}
          size="3x"
        />
        <div className="font-weight-light h5 ml-3 mb-0">
          Для оплаты полиса с выбранными условиями страхования просьба
          обратиться в{" "}
          <a href="https://www.rgs.ru/karta-ofisov?type=sale" target="_parent">
            ближайший офис РГС
          </a>
          .
        </div>
      </Alert>

      {!isPremiumGreat && (
        <>
          <CustomInput
            checked={acceptChecked}
            className="mt-3"
            id={checkboxId}
            label="Я подтверждаю, что ознакомлен и согласен с Условиями страхования и даю Согласие на обработку персональных данных"
            onChange={onAcceptCheck}
            type="checkbox"
          />
          <Payment disabled={!acceptChecked} />
        </>
      )}
    </>
  );
};

export default Purchase;
