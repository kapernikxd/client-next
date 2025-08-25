import moment from "moment";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import { RangePickerProps } from "antd/lib/date-picker";

dayjs.extend(customParseFormat);

export const getTimeAgo = (time: string) =>
  time ? moment(time).fromNow() : null;
export const getDateShow = (date: string) =>
  date ? moment(date).format("YYYY-MM-DD HH:mm:ss") : null;

export const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  return current && current < dayjs().startOf("day"); // блокировать даты до начала сегодняшнего дня
};
