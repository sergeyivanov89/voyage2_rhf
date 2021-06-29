import { useWatch } from "react-hook-form";

import { getNoun } from "utils";
import { FORM_PATHS } from "consts";

const TripLengthInfo = () => {
  const tripLength = useWatch({ name: FORM_PATHS.TRIP_LENGTH });

  const dayCountDisplay = `${tripLength} ${getNoun(
    tripLength,
    "день",
    "дня",
    "дней"
  )} в поездке`;

  return (
    <>
      <div className="h4">{dayCountDisplay}</div>
      <div className="small font-italic">
        Срок действия полиса будет увеличен на дополнительные 15 дней. При этом
        стоимость полиса и количество застрахованных дней останутся без
        изменений - {dayCountDisplay}. Так сделано в соответствии с требованиями
        визового кодекса и на случай, если у вас сместятся даты поездки.
      </div>
    </>
  );
};

export default TripLengthInfo;
