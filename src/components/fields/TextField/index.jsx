import * as React from "react";
import { Input, InputGroup, InputGroupAddon } from "reactstrap";
import { useController } from "react-hook-form";

import ErrorTooltip from "../ErrorTooltip";
import { useUniqueId } from "hooks";

const TextField = ({
  append,
  className,
  disabled,
  disablePast,
  inputProps,
  parse,
  placeholder,
  prepend,
  readOnly,
  sanitazeOnBlur,
  staticValidate,
  trimOnBlur,
  type,
  ...useControllerProps
}) => {
  const {
    field: { ref, ...fieldProps },
    fieldState: { error },
  } = useController(useControllerProps);
  const id = useUniqueId();

  const [staticErrorMessage, setStaticErrorMessage] = React.useState("");

  const onBlur = (e) => {
    const { value } = e.target;

    if (trimOnBlur) {
      fieldProps.onChange(value.trim());
    }
    if (sanitazeOnBlur) {
      fieldProps.onChange(value.replace(/^[^A-ZА-Я]+|[^A-ZА-Я]+$/gi, ""));
    }

    fieldProps.onBlur(value);
    setStaticErrorMessage("");
  };

  const onChange = (e) => {
    const { value } = e.target;

    if (staticValidate) {
      const { pattern, message } = staticValidate;
      if (value && !pattern.test(value)) {
        return setStaticErrorMessage(message);
      } else {
        setStaticErrorMessage("");
      }
    }
    fieldProps.onChange(parse(value));
  };

  const onPast = (e) => {
    if (disablePast) {
      e.preventDefault();
    }
  };

  const input = (
    <Input
      autoComplete="off"
      disabled={disabled}
      innerRef={ref}
      invalid={!!error || !!staticErrorMessage}
      onPaste={onPast}
      placeholder={placeholder}
      readOnly={readOnly}
      type={type}
      {...inputProps}
      {...fieldProps}
      onBlur={onBlur}
      onChange={onChange}
    />
  );

  return (
    <ErrorTooltip
      className={className}
      message={staticErrorMessage || error?.message}
      target={id}
    >
      {append || prepend ? (
        <InputGroup id={id}>
          {prepend && (
            <InputGroupAddon addonType="prepend">{prepend}</InputGroupAddon>
          )}
          {input}
          {append && (
            <InputGroupAddon addonType="append">{append}</InputGroupAddon>
          )}
        </InputGroup>
      ) : (
        React.cloneElement(input, { id })
      )}
    </ErrorTooltip>
  );
};

TextField.defaultProps = {
  parse: (value) => value,
};

export default TextField;
