const getMMDDYYYYDate = () => {
  const date = new Date();

  const sdf = new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  const parts = sdf.formatToParts(new Date(date));
  const formattedDate = `${parts[0].value}/${parts[2].value}/${parts[4].value}`;
  return formattedDate;
}

module.exports = {
     getMMDDYYYYDate
}