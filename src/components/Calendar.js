import React from "react";
import startOfMonth from "date-fns/start_of_month";
import endOfMonth from "date-fns/end_of_month";
import eachDay from "date-fns/each_day";
import format from "date-fns/format";
import getYear from "date-fns/get_year";
import getMonth from "date-fns/get_month";
import { map, groupBy } from "lodash";

const Calendar = ({ defaultDate, maxDate, minDate }) => {
  const start = startOfMonth(minDate);
  const end = endOfMonth(maxDate);
  const days = eachDay(start, end);
  const years = groupBy(days, getYear);
  return (
    <div>
      {days.map(day => <span key={day.valueOf()}>{format(day, "ddd")}</span>)}
    </div>
  );
};

export default Calendar;
