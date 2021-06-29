import * as React from "react";
import Select from "react-select";
import { useController } from "react-hook-form";
import cn from "classnames";

import ErrorTooltip from "../ErrorTooltip";
import { useUniqueId } from "hooks";

const SelectField = ({
  className,
  disabled,
  format,
  formatOptionLabel,
  getOptionLabel,
  getOptionValue,
  isClearable,
  isMulti,
  isOptionDisabled,
  isSearchable,
  maxOptionCount,
  maxOptionCountMessage,
  menuPlacement,
  noOptionsMessage,
  options,
  placeholder,
  parse,
  processValueBeforeSelect,
  readOnly,
  reactSelectProps,
  ...useControllerProps
}) => {
  const {
    field: { value, ref, ...fieldProps },
    fieldState: { error },
  } = useController(useControllerProps);
  const id = useUniqueId();
  const [staticErrorMessage, setStaticErrorMessage] = React.useState("");

  const onChange = (value) => {
    let updatedValue = value;
    if (isMulti) {
      if (typeof processValueBeforeSelect === "function") {
        updatedValue = processValueBeforeSelect(value);
      }
      if (updatedValue.length > maxOptionCount) {
        setStaticErrorMessage(maxOptionCountMessage(maxOptionCount));
        updatedValue.splice(-1, 1);
      } else {
        setStaticErrorMessage("");
      }
    }
    updatedValue = parse(updatedValue);
    fieldProps.onChange(updatedValue);
  };

  const errorMessage = staticErrorMessage || error?.message;

  return (
    <ErrorTooltip
      ref={ref}
      className={className}
      message={errorMessage}
      tabIndex={-1}
      target={id}
    >
      <Select
        className={cn("SelectField", errorMessage && "SelectFieldError")}
        classNamePrefix="SelectFieldInner"
        formatOptionLabel={formatOptionLabel}
        getOptionLabel={getOptionLabel}
        getOptionValue={getOptionValue}
        id={id}
        isClearable={isClearable}
        isDisabled={disabled || readOnly}
        isMulti={isMulti}
        isOptionDisabled={isOptionDisabled}
        isSearchable={isSearchable}
        maxMenuHeight={200}
        menuPlacement={menuPlacement}
        noOptionsMessage={noOptionsMessage}
        onMenuOpen={() => setStaticErrorMessage("")}
        options={options}
        placeholder={placeholder}
        readOnly={readOnly}
        {...reactSelectProps}
        {...fieldProps}
        onChange={onChange}
        value={typeof format === "function" ? format(value) : value}
      />
    </ErrorTooltip>
  );
};

SelectField.defaultProps = {
  getOptionLabel: ({ name }) => name,
  getOptionValue: ({ code }) => code,
  maxOptionCount: 100,
  maxOptionCountMessage: (maxOptionCount) =>
    `Максимальное количество опций - ${maxOptionCount}`,
  noOptionsMessage: () => "Нет опций для выбора",
  parse: (value) => value,
};

export default SelectField;
