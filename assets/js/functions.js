function formatDate(date) {
  var format_date = new Date(date);
  var date_str = format_date.toDateString();

  var hours = format_date.getHours();
  var minutes = format_date.getMinutes()

  if (minutes < 10) {
    minutes = '0' + minutes;
  }

  var suffix = 'AM';
  if (hours >= 12) {
    suffix = 'PM';
    hours = hours - 12;
  }
  if (hours == 0) {
    hours = 12;
  }
  return (date_str + ', '+ hours + ':' + minutes + ' ' + suffix);
};