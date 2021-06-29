import * as React from "react";

const useUniqueId = () => {
  const id = React.useId();
  return id.slice(1, -1);
};

export default useUniqueId;
