import * as React from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
} from "reactstrap";
import Highlighter from "react-highlight-words";
import { CancelToken, isCancel } from "axios";

import { UP, DOWN, BACKSPACE, ESC } from "./constants";
import { fetchApi } from "utils";

const InputControl = ({
  disabled,
  disablePast,
  dropDownMenuMaxHeight,
  fieldProps,
  id,
  invalid,
  inputProps,
  onInputChange,
  onOptionSelect,
  optionCodeFieldName,
  optionValueFieldName,
  placeholder,
  readOnly,
  regionId,
  value,
}) => {
  const [options, setOptions] = React.useState([]);
  const [activeOptionIndex, setActiveOptionIndex] = React.useState();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const cancelTokenSourceRef = React.useRef(null);

  const selectOption = (option) => {
    setActiveOptionIndex();
    onOptionSelect(option);
  };

  React.useEffect(() => {
    if (disabled || readOnly) {
      setIsDropdownOpen(false);
    }
  }, [disabled, readOnly]);

  const onChange = (e) => {
    const { value } = e.target;

    cancelTokenSourceRef.current?.cancel();

    onInputChange(value);

    if (!value) {
      setOptions([]);
      setIsDropdownOpen(false);
      return;
    }

    cancelTokenSourceRef.current = CancelToken.source();
    fetchApi(
      "Dadata.get",
      "B2C",
      { value, field: "addressCdi", regionId },
      cancelTokenSourceRef.current.token
    )
      .then((res) => {
        const options = res.data?.data || [];
        setOptions(options);
        setIsDropdownOpen(!!options.length);
      })
      .catch((err) => {
        if (!isCancel(err)) {
          console.error(err);
        }
      });
  };

  const onBlur = (e) => onInputChange(e.target.value.trim());

  const onKeyDown = (e) => {
    const { key, keyCode } = e;

    if (isDropdownOpen) {
      if (keyCode === ESC) {
        setIsDropdownOpen(false);
      }

      if (keyCode === UP) {
        e.preventDefault();
        setActiveOptionIndex((idx) =>
          idx === undefined || idx === 0 ? options.length - 1 : idx - 1
        );
      }

      if (keyCode === DOWN) {
        e.preventDefault();
        setActiveOptionIndex((idx) =>
          idx === undefined || idx === options.length - 1 ? 0 : idx + 1
        );
      }

      if (key === "Enter") {
        selectOption(options[activeOptionIndex]);
        setIsDropdownOpen(false);
      }
    } else if (options.length) {
      if (keyCode === BACKSPACE) {
        setIsDropdownOpen(true);
      }

      if (keyCode === UP || keyCode === DOWN) {
        e.preventDefault();
        setIsDropdownOpen(true);
      }
    }
  };

  const onPast = (e) => {
    if (disablePast) {
      e.preventDefault();
    }
  };

  const onDropdownToggle = () => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    } else if (options.length) {
      setIsDropdownOpen(true);
    }
  };

  return (
    <Dropdown id={id} isOpen={isDropdownOpen} toggle={onDropdownToggle}>
      <DropdownToggle className="position-relative" tag="div">
        <Input
          autoComplete="off"
          disabled={disabled}
          invalid={invalid}
          onKeyDown={onKeyDown}
          onPaste={onPast}
          placeholder={placeholder}
          readOnly={readOnly}
          {...inputProps}
          {...fieldProps}
          onBlur={onBlur}
          onChange={onChange}
          value={value}
        />
      </DropdownToggle>
      <DropdownMenu
        className="w-100"
        modifiers={{
          setMaxHeight: {
            enabled: true,
            order: 890,
            fn: (data) => ({
              ...data,
              styles: {
                ...data.styles,
                maxHeight: dropDownMenuMaxHeight,
                overflow: "auto",
              },
            }),
          },
        }}
      >
        {options.map((el, idx) => (
          <DropdownItem
            key={`${el[optionCodeFieldName]} ${el[optionValueFieldName]}`}
            active={idx === activeOptionIndex}
            className="text-wrap"
            onClick={() => selectOption(el)}
            tag="div"
          >
            <Highlighter
              autoEscape
              highlightStyle={{
                padding: 0,
                color: "inherit",
                backgroundColor: "transparent",
                fontWeight: "bold",
              }}
              searchWords={value.split(" ")}
              textToHighlight={el[optionValueFieldName]}
            />
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default InputControl;
