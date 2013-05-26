Handlebars.registerHelper('truncate', function(string, size) {
  if (string.length <= size) {
    return string;
  }
  return string.substring(0, size) + '...';
});

Handlebars.registerHelper('toDate', function(timestamp, size) {
  var date = new Date();
  date.setTime(timestamp);

  return date.toLocaleDateString() + ' - ' + date.toLocaleTimeString()
});
