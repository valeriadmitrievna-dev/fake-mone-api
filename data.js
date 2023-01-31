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

  timeArrayToSegments = (array) =>
    array
      .map((date, index) => ({
        start: date,
        end: array[index + 1],
      }))
      .slice(0, array.length - 1);

  return fns
    .eachDayOfInterval({
      start: startDate,
      end: endDate,
    })
    .map((day) => {
      const start = fns.setMinutes(fns.setHours(day, startTime), 0);
      const end = fns.setMinutes(fns.setHours(day, endTime), 0);

      return timeArrayToSegments(getIntervals(start, end, 15))
        .map((seg, index, arr) => {
          const chance = Math.random();
          if (chance <= 0.1 && index < arr.length - 4) {
            delete arr[index + 1];
            delete arr[index + 2];
            delete arr[index + 3];
            return {
              date: new Date(seg.start),
              service: {
                duration: 60,
              },
            };
          } else if (chance <= 0.5 && index < arr.length - 3) {
            delete arr[index + 1];
            delete arr[index + 2];
            return {
              date: new Date(seg.start),
              service: {
                duration: 45,
              },
            };
          } else if (chance <= 0.75 && index < arr.length - 2) {
            delete arr[index + 1];
            return {
              date: new Date(seg.start),
              service: {
                duration: 30,
              },
            };
          } else
            return {
              date: new Date(seg.start),
              service: {
                duration: 15,
              },
            };
        })
        .filter((c) => c);
    })
    .flat();
};
