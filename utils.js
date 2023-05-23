const fns = require("date-fns");

const isSameTime = (date1, date2) => {
  const sameDay = fns.isSameDay(new Date(date1), new Date(date2));
  const sameHour = fns.isSameHour(new Date(date1), new Date(date2));
  const sameMinute = fns.isSameMinute(new Date(date1), new Date(date2));

  return sameDay && sameHour && sameMinute;
};

const getMinutesByInterval = (interval) => {
  const duration = fns.intervalToDuration(interval);
  const minutes = (duration.minutes ?? 0) + (duration.hours ?? 0) * 60;

  return minutes;
};

const roundToNearestQuarterHour = (date) => {
  const minutes = date.getMinutes();
  const remainder = minutes % 15;

  if (remainder === 0) {
    return date;
  }
  const roundedMinutes = 15 - remainder;
  const newDate = new Date(date.getTime() + roundedMinutes * 60000);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);

  return newDate;
};

const toSameDate = (toDate, date) => {
  return fns.setYear(
    fns.setMonth(fns.setDate(toDate, fns.getDate(date)), fns.getMonth(date)),
    fns.getYear(date)
  );
};

const getFreeTimeRangesGPT = (worktime, cards, date) => {
  cards = cards.sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );
  const workStart = toSameDate(new Date(worktime.start), date);
  const workEnd = toSameDate(new Date(worktime.end), date);
  const now = fns.isToday(date) ? new Date() : workStart;

  if (!cards.length) {
    const start = roundToNearestQuarterHour(now);
    const end = workEnd;

    return [{ start, end }];
  }

  // If the current time is after the work end time, there are no free time ranges
  if (now >= workEnd) {
    return [];
  }

  // If the current time is before the work start time, set it to the work start time
  if (now < workStart) {
    now.setTime(workStart.getTime());
  }

  const freeTimeRanges = [];

  // Iterate through the cards and find the gaps between them
  for (let i = 0; i < cards.length; i++) {
    const cardStart = new Date(cards[i].start);
    const cardEnd = new Date(cards[i].end);

    // If the card ends before the current time, skip it
    if (cardEnd <= now) {
      continue;
    }

    // If the card starts after the current time, add a free time range before it
    if (cardStart > now) {
      const start = roundToNearestQuarterHour(new Date(now));
      const end = new Date(cardStart);

      if (!isSameTime(start, end)) {
        freeTimeRanges.push({
          start: roundToNearestQuarterHour(new Date(now)),
          end: new Date(cardStart),
        });
      }
    }

    // Update the current time to the end of the card
    now.setTime(cardEnd.getTime());
  }

  // If there is free time after the last card, add it to the free time ranges
  if (now < workEnd) {
    const minutes = getMinutesByInterval({ start: now, end: workEnd });

    if (minutes >= 15 && minutes % 15 === 0) {
      freeTimeRanges.push({ start: new Date(now), end: new Date(workEnd) });
    }
  }

  return freeTimeRanges;
};

const randomFromArray = (array) =>
  array[Math.floor(Math.random() * array.length)];

const calculateOccupancyPercentage = (cards, worktime) => {
  const workdayDuration = getMinutesByInterval(worktime);
  let occupiedDuration = 0;

  cards.forEach((card) => {
    const cardDuration = card.services.reduce((a, b) => a + b.duration, 0);
    occupiedDuration += cardDuration;
  });

  const occupancy = (occupiedDuration / workdayDuration) * 100;

  return Math.round(occupancy);
};

const calculateTotalPrice = (cards) => {
  let totalPrice = 0;
  cards.forEach((card) => {
    card.services.forEach((service) => {
      totalPrice += service.price;
    });
  });
  return totalPrice;
};

const randomDateInRange = (startDate, endDate) => {
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();
  const randomTime = startTime + Math.random() * (endTime - startTime);
  const date = new Date(randomTime);
  const result = roundToNearestQuarterHour(date);
  return result;
};

const random = (min, max) => Math.floor(Math.random() * (max + 1 - min) + min);
const shuffleArray = (array) => array?.sort(() => 0.5 - Math.random()) || [];
const getNRandomsFromArray = (array, n) => {
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, n);
};
const getIntervals = (start, end, shift) => {
  const result = [];

  while (!fns.isSameHour(start, end) || !fns.isSameMinute(start, end)) {
    result.push(start);
    start = fns.addMinutes(start, shift);
  }
  result.push(end);

  return result;
};
const timeArrayToSegments = (array) =>
  array
    .map((date, index) => ({
      start: date,
      end: array[index + 1],
    }))
    .slice(0, array.length - 1);

const removeInArray = (arr, index, count) => {
  for (let i = 1; i <= count; i++) {
    delete arr[index + i];
  }
};

const getFullDuration = (services) =>
  services.length
    ? services.reduce((sum, service) => sum + service.duration, 0)
    : 0;

const getPossibleSegments = (space, duration) => {
  const segments = [];

  // iterate over all possible card start times within the time space
  for (
    let i = space.start;
    i <= space.end;
    i = new Date(i.getTime() + 15 * 60 * 1000)
  ) {
    const segmentEnd = new Date(i.getTime() + duration * 60 * 1000);

    // if the card fits within the current segment, add it to the array
    if (segmentEnd <= space.end) {
      segments.push({ start: i, end: segmentEnd });
    }
  }

  return segments;
};

module.exports = {
  getFreeTimeRangesGPT,
  randomFromArray,
  calculateOccupancyPercentage,
  calculateTotalPrice,
  roundToNearestQuarterHour,
  randomDateInRange,
  random,
  getNRandomsFromArray,
  getIntervals,
  timeArrayToSegments,
  removeInArray,
  getFullDuration,
  shuffleArray,
  getPossibleSegments,
};
