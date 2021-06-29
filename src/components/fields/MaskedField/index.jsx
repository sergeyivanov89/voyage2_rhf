import { Input } from "reactstrap";
import MaskedInput from "react-text-mask";
import { useController } from "react-hook-form";

import ErrorTooltip from "../ErrorTooltip";
import { useUniqueId } from "hooks";

const MaskedField = ({
  className,
  disabled,
  inputMode,
  inputProps,
  mask,
  parse,
  pipe,
  placeholder,
  placeholderChar,
  readOnly,
  ...useControllerProps
}) => {
  const {
    field: { ref, ...fieldProps },
    fieldState: { error },
  } = useController(useControllerProps);
  const id = useUniqueId();

  const onBlur = (e) => {
    const regexp = new RegExp(`[${placeholderChar}]`);
    fieldProps.onChange(regexp.test(e.target.value) ? "" : e);
    fieldProps.onBlur();
  };

  const onChange = (e) => fieldProps.onChange(parse(e.target.value));

  return (
    <ErrorTooltip
      ref={ref}
      className={className}
      message={error?.message}
      tabIndex={-1}
      target={id}
    >
      <MaskedInput
        keepCharPositions
        mask={mask}
        pipe={pipe}
        placeholderChar={placeholderChar}
        {...inputProps}
        {...fieldProps}
        onBlur={onBlur}
        onChange={onChange}
        render={(ref, props) => (
          <Input
            autoComplete="off"
            disabled={disabled}
            id={id}
            innerRef={ref}
            invalid={!!error}
            placeholder={placeholder}
            readOnly={readOnly}
            {...props}
          />
        )}
      />
    </ErrorTooltip>
  );
};

MaskedField.defaultProps = {
  parse: (value) => value,
};

export default MaskedField;
