const _ = require("lodash");
const { faker } = require("@faker-js/faker");
faker.setLocale("ru");
faker.locale = "ru";
const fns = require("date-fns");

const durations = [15, 30, 45, 60, 90, 120, 150, 180];
const purposes = [
  "Парикмахер-стилист",
  "Мастер маникюра и педикюра",
  "Косметолог",
  "Визажист",
  "Массажист",
  "Мастер-универсал",
];

const CLIENTS = 100;
const MASTERS = 24;
const SERVICES = 40;

const START = 8;
const END = 17;
const SEGMENT = 15;
const DAYS = 5;

const START_DATE = new Date();
const END_DATE = fns.addDays(START_DATE, DAYS - 1);

const random = (min, max) => Math.floor(Math.random() * (max + 1 - min) + min);
const randomFromArray = (array) =>
  array[Math.floor(Math.random() * array.length)];
const toSameDate = (toDate, date) =>
  fns.setYear(
    fns.setMonth(fns.setDate(toDate, fns.getDate(date)), fns.getMonth(date)),
    fns.getYear(date)
  );
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

const generateCards = (arr, index) => {
  const chance = Math.random();
  let duration;
  if (chance <= 10 / 180) {
    duration = 180;
    removeInArray(arr, index, 180 / 15 - 1);
  } else if (chance <= 10 / 150) {
    duration = 150;
    removeInArray(arr, index, 150 / 15 - 1);
  } else if (chance <= 10 / 120) {
    duration = 120;
    removeInArray(arr, index, 120 / 15 - 1);
  } else if (chance <= 10 / 90) {
    duration = 90;
    removeInArray(arr, index, 90 / 15 - 1);
  } else if (chance <= 10 / 60) {
    duration = 60;
    removeInArray(arr, index, 60 / 15 - 1);
  } else if (chance <= 10 / 45) {
    duration = 45;
    removeInArray(arr, index, 45 / 15 - 1);
  } else if (chance <= 10 / 30) {
    duration = 30;
    removeInArray(arr, index, 30 / 15 - 1);
  } else {
    duration = 15;
    removeInArray(arr, index, 15 / 15 - 1);
  }
  return duration;
};

const generateCardsData = (card) => {
  // card: date, master, service's duration
  const client = randomFromArray(clients);
  const services_15 = services.filter((s) => s.duration === 15);
  const fit_services = services.filter(
    (s) => s.duration === card.service.duration
  );
  const service = randomFromArray(fit_services) || randomFromArray(services_15);
  const done = fns.isBefore(new Date(card.date), new Date());
  const status = done ? 2 : random(0, 1);

  return {
    ...card,
    service,
    client,
    status,
    id: faker.datatype.uuid(),
  };
};

const clients = _.times(CLIENTS, (n) => {
  return {
    id: faker.datatype.uuid(),
    avatar: Math.random() > 0.5 ? faker.image.avatar() : null,
    phone: faker.phone.number("+7 (9##) ###-##-##"),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
  };
});

const client = clients.map((client) => ({
  ...client,
  age: faker.random.numeric(2),
  registeredAt: faker.date.past(),
  sex: faker.helpers.arrayElement(["М", "Ж"]),
}));

const masters = _.times(MASTERS, (n) => {
  return {
    id: faker.datatype.uuid(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    avatar: Math.random() > 0.5 ? faker.image.avatar() : null,
    purpose: faker.helpers.arrayElement(purposes),
  };
});

const master = _.times(MASTERS, (n) => {
  return {
    id: faker.datatype.uuid(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    avatar: Math.random() > 0.5 ? faker.image.avatar() : null,
    purpose: faker.helpers.arrayElement(purposes),
    phrase: faker.lorem.words(random(2, 7)),
    about: _.times(random(2, 5), () => faker.lorem.words(random(4, 16))),
    bests: _.times(random(0, 5), () => faker.lorem.words(random(4, 16))),
    reviews: _.times(random(0, 5), () => faker.lorem.paragraph()),
  };
});

const service = _.times(SERVICES, () => {
  return {
    id: faker.datatype.uuid(),
    title: faker.lorem.words(random(1, 3)),
    duration: faker.helpers.arrayElement(durations),
  };
});

const services = service.map((s) => ({
  ...s,
  about: _.times(random(2, 5), () => faker.lorem.words(random(4, 16))),
  steps: _.times(random(3, 5), () => faker.lorem.words(random(4, 16))),
  price: faker.commerce.price(300, 20000, 0),
  reviews: _.times(random(0, 5), () => faker.lorem.paragraph()),
  photos: _.times(random(0, 5), () => faker.image.fashion()),
}));

const secret = {
  worktime: {
    start: new Date("2000-01-01T08:00:00"),
    end: new Date("2000-01-01T17:00:00"),
  },
  logo: faker.image.abstract(),
  company: faker.company.name(),
};

const getCards = (
  density = 0.5 // 0 - 1
) =>
  masters
    .map((master) => {
      return fns
        .eachDayOfInterval({
          start: START_DATE,
          end: END_DATE,
        })
        .map((day) => {
          const start = fns.setMinutes(fns.setHours(day, START), 0);
          const end = fns.setMinutes(fns.setHours(day, END), 0);

          return timeArrayToSegments(getIntervals(start, end, SEGMENT))
            .map((seg, index, arr) => {
              const duration = generateCards(arr, index);
              return {
                date: new Date(seg.start),
                master,
                service: { duration },
              };
            })
            .filter((c) => c)
            .filter(() => Math.random() > density)
            .flat();
        })
        .flat();
    })
    .flat()
    .map(generateCardsData);

module.exports = function () {
  return {
    clients,
    masters,
    services,
    cards: getCards(),
    client,
    master,
    service,
    secret,
  };
};
