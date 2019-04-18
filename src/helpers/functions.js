import moment from "moment";

export function formatDate(date) {
  if (moment(date).diff(Date.now(), "days") < 15) {
    return moment(date).fromNow();
  } else {
    return moment(date).format("d MMMM YYYY");
  }
}
