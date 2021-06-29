import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckDouble } from "@fortawesome/free-solid-svg-icons";
import { useController } from "react-hook-form";
import cn from "classnames";

import styles from "./styles.module.scss";

const PaymentField = ({ options, ...useControllerProps }) => {
  const {
    field: { onChange, value },
  } = useController(useControllerProps);

  const onItemClick = (item) => () => {
    if (item.enable) {
      onChange(item);
    }
  };

  const items = options.reduce((acc, currVal) => {
    const itemCategory = currVal.category || { code: "other", name: "Другой" };
    let categoryIndex = -1;
    for (let i = 0; i < acc.length; i++) {
      if (itemCategory.code === acc[i].code) {
        categoryIndex = i;
        break;
      }
    }
    if (categoryIndex !== -1) {
      acc[categoryIndex].items.push(currVal);
    } else {
      acc.push({
        code: currVal.category?.code,
        name: currVal.category?.name,
        items: [currVal],
      });
    }
    return acc;
  }, []);

  return items.map((el) => (
    <div key={el.code}>
      <div className="my-2 text-muted">{el.name}</div>
      <div className="d-flex">
        {el.items.map((el) => {
          const selected = el.code === value?.code;
          return (
            <div
              key={el.code}
              onClick={onItemClick(el)}
              className={cn(
                "border cursor-pointer embed-responsive embed-responsive-16by9 mr-2 position-relative user-select-none",
                selected && "border-primary rounded-lg",
                styles.wrapper
              )}
            >
              {selected && (
                <div
                  className={cn("position-absolute text-primary", styles.check)}
                >
                  <FontAwesomeIcon icon={faCheckDouble} />
                </div>
              )}
              <div
                className={cn(
                  "align-items-center d-flex embed-responsive-item justify-content-center",
                  styles.image
                )}
                style={{
                  backgroundImage: `url("${el.icon}")`,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  ));
};

export default PaymentField;
