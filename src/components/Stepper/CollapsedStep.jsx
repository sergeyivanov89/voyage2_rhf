import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import cn from "classnames";

import { useStepper } from ".";
import styles from "./Stepper.module.scss";

const CollapsedStep = ({ brief, index, isLast, isPrevious, title }) => {
  const { goToStep } = useStepper();

  const expand = () => {
    if (isPrevious) {
      goToStep(index, false);
    }
  };

  return (
    <>
      <div className="align-items-center d-flex justify-content-between">
        <div
          className={cn(
            "WizardSectionTitle align-items-center d-inline-flex font-weight-light h5 mb-0 text-primary",
            { [styles.collapsedStepPreviousTitle]: isPrevious }
          )}
          onClick={expand}
        >
          <div
            className={cn({
              [styles.collapsedStepPreviousTitleText]: isPrevious,
            })}
          >
            {title}
          </div>
          {isPrevious && (
            <FontAwesomeIcon className="ml-2" icon={faChevronDown} size="xs" />
          )}
        </div>
        {isPrevious && (
          <div
            className={cn(
              "d-none d-md-block small text-secondary font-italic",
              styles.collapsedStepPreviousEdit
            )}
            onClick={expand}
          >
            изменить
          </div>
        )}
      </div>
      {!!brief &&
        isPrevious &&
        React.createElement(brief, { className: "wizardBrief" })}
      {!isLast && <hr />}
    </>
  );
};

export default CollapsedStep;
