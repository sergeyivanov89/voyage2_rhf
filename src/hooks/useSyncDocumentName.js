import * as React from "react";
import { useFormContext } from "react-hook-form";
import get from "lodash.get";
import { format } from "date-fns";

const useSyncDocumentName = (path) => {
  const { getValues, setValue } = useFormContext();

  return React.useCallback(() => {
    const formValues = getValues();
    const { doi, issued, number, seria } = get(formValues, path);

    let name = "";
    if (seria) {
      name += seria + " ";
    }
    if (number) {
      name += number;
    }
    const isDoiNumber = typeof doi === "number";
    if (isDoiNumber || issued) {
      name += ", выдан";
      if (issued) {
        name += " " + issued;
        if (isDoiNumber) {
          name += ",";
        }
      }
      if (isDoiNumber) {
        name += " " + format(doi, "dd.MM.yyyy");
      }
    }

    setValue(`${path}.name`, name);

    return name;
  }, [getValues, path, setValue]);
};

export default useSyncDocumentName;
