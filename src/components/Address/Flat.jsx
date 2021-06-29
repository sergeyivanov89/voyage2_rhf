import { useWatch } from "react-hook-form";

import { TextField } from "components/fields";

const Flat = ({ path }) => {
  const cdiDataFlat = useWatch({ name: `${path}.addressCdi.cdiData.flat` });

  return (
    <TextField name={`${path}.flat`} defaultValue="" disabled={!!cdiDataFlat} />
  );
};

export default Flat;
