module.exports = (fns) => {
  const startTime = 8;
  const endTime = 17;

  const startDate = new Date();
  const endDate = fns.addDays(startDate, 10);

  getIntervals = (start, end, shift) => {
    const result = [];

    while (!fns.isSameHour(start, end) || !fns.isSameMinute(start, end)) {
      result.push(start);
      start = fns.addMinutes(start, shift);
    }
    result.push(end);

    return result;
  };

  return fns
    .eachDayOfInterval({
      start: startDate,
      end: endDate,
    })
    .map((day) => {
      const start = fns.setMinutes(fns.setHours(day, startTime), 0);
      const end = fns.setMinutes(fns.setHours(day, endTime), 0);

      return getIntervals(start, end, 15)
        .slice(0, -1)
        .map((date) => {
          return {
            date,
            service: {
              duration: 15,
            },
          };
        });
    })
    .flat();
};
