import * as React from "react";
import { useWatch } from "react-hook-form";

import { PaymentField } from "components/fields";
import SubmitError from "./SubmitError";
import SubmitButton from "./SubmitButton";
import { ProductDataCtx } from "App";
import { FORM_PATHS } from "consts";

const Payment = ({ disabled }) => {
  const name = useWatch({ name: FORM_PATHS.PAYMENT_INSTRUMENT_NAME });
  const { payInstruments } = React.useContext(ProductDataCtx);

  const showInstruments = payInstruments.length > 1;

  const submitBlock = <SubmitButton disabled={disabled || !name} />;

  return showInstruments ? (
    <div className="mt-3">
      <div>
        {name ? (
          <>
            Оплата через сервис <b>{name}</b>
          </>
        ) : (
          "Выберите сервис оплаты:"
        )}
      </div>
      <PaymentField
        name={FORM_PATHS.PAYMENT_INSTRUMENT}
        options={payInstruments}
      />
      <SubmitError />
      <hr />
      {submitBlock}
    </div>
  ) : (
    submitBlock
  );
};

export default Payment;
