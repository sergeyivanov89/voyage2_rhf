import * as React from "react";
import { Alert } from "reactstrap";

import { SubmitErrorCtx } from "../../..";

const SubmitError = () => {
  const error = React.useContext(SubmitErrorCtx);

  return (
    <Alert className="mt-3" color="danger" isOpen={!!error}>
      {error}
    </Alert>
  );
};

export default SubmitError;
