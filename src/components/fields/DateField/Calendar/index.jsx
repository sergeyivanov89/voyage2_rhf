import { ViewDays, ViewMonths, ViewYears } from "./views";
import { useDateField } from "..";

const Calendar = () => {
  const { viewMode } = useDateField();

  return (
    <div className="p-2" onMouseDown={(e) => e.preventDefault()}>
      {viewMode === "days" && <ViewDays />}
      {viewMode === "months" && <ViewMonths />}
      {viewMode === "years" && <ViewYears />}
    </div>
  );
};

export default Calendar;
