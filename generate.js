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

const TAGS = [
  { title: "Постоянный", color: "#B0BBDB" },
  { title: "Лояльный", color: "#A8D9E0" },
  { title: "Красота по-русски", color: "#A0D9F9" },
  { title: "Бьюти-план", color: "#E4C0BF" },
  { title: "Приведи друга", color: "#A0D5C9" },
];

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

function randomDateInRange(startDate, endDate) {
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();
  const randomTime = startTime + Math.random() * (endTime - startTime);
  const date = new Date(randomTime);
  const result = roundToNearestQuarterHour(date);
  return result;
}

const random = (min, max) => Math.floor(Math.random() * (max + 1 - min) + min);
const randomFromArray = (array) =>
  array[Math.floor(Math.random() * array.length)];
const shuffleArray = (array) => array.sort(() => 0.5 - Math.random());
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

const generateCards = (arr, index) => {
  const chance = Math.random();
  let duration;
  const time = Math.abs(
    fns.differenceInMinutes(arr[index].start, arr[arr.length - 1].end)
  );
  if (chance <= 0.1 && time >= 180) {
    duration = 180;
    removeInArray(arr, index, 180 / 15 - 1);
  } else if (chance <= 0.15 && time >= 150) {
    duration = 150;
    removeInArray(arr, index, 150 / 15 - 1);
  } else if (chance <= 0.15 && time >= 120) {
    duration = 120;
    removeInArray(arr, index, 120 / 15 - 1);
  } else if (chance <= 0.2 && time >= 90) {
    duration = 90;
    removeInArray(arr, index, 90 / 15 - 1);
  } else if (chance <= 0.5 && time >= 60) {
    duration = 60;
    removeInArray(arr, index, 60 / 15 - 1);
  } else if (chance <= 0.5 && time >= 45) {
    duration = 45;
    removeInArray(arr, index, 45 / 15 - 1);
  } else if (chance <= 0.5 && time >= 30) {
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
  const fit_15 = services.filter((s) => s.duration === 15);
  const card_services = getNRandomsFromArray(fit_15, 1);

  const client = randomFromArray(clients);
  const done = fns.isBefore(new Date(card.date), new Date());
  const status = done ? 2 : random(0, 1);

  const duration = getFullDuration(card_services);

  return {
    ...card,
    services: card_services,
    client,
    status,
    id: faker.datatype.uuid(),
    duration,
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
  appointments: {
    count: random(0, 40),
    frequency: random(0, 12) + " раз в " + randomFromArray(["год", "месяц"]),
    last: randomDateInRange(new Date("2023-01-01"), new Date()),
    next: randomDateInRange(new Date("2023-01-01"), new Date()),
    missed: random(0, 10),
  },
  about: _.times(random(2, 5), () => faker.lorem.words(random(4, 16))),
  finanses: {
    banace: random(0, 10000),
    average: random(0, 10000),
    bonus: random(0, 1000),
    wasted: random(0, 20000),
  },
  tags: TAGS.slice(0, random(0, 5)),
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

const master = masters.map((master) => {
  return {
    ...master,
    phrase: faker.lorem.words(random(2, 7)),
    about: _.times(random(2, 5), () => faker.lorem.words(random(4, 16))),
    bests: _.times(random(0, 5), () => faker.lorem.words(random(4, 16))),
    reviews: _.times(random(0, 5), () => faker.lorem.paragraph()),
  };
});

const service = _.times(SERVICES, () => {
  return {
    id: faker.datatype.uuid(),
    title: faker.random.words(),
    duration: faker.helpers.arrayElement(durations),
    price: +faker.commerce.price(300, 20000, 0),
  };
});

const services = service.map((s) => ({
  ...s,
  about: _.times(random(2, 5), () => faker.lorem.words(random(4, 16))),
  steps: _.times(random(3, 5), () => faker.lorem.words(random(4, 16))),
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

const test = () =>
  getCards().map((c) => {
    const sumDuration = c.service.duration;
    const cardServices = [];

    while (getFullDuration(cardServices) < sumDuration) {
      const shuffledServices = shuffleArray(service);
      const toAdd = shuffledServices.find(
        (s) =>
          s.duration + getFullDuration(cardServices) <= sumDuration &&
          !cardServices.find((_s) => _s.id === s.id)
      );
      if (toAdd) cardServices.push(toAdd);
      else continue;
    }

    const status = random(0, 4);

    return {
      id: c.id,
      date: c.date,
      master: c.master,
      client: c.client,
      services: cardServices,
      status,
      duration: getFullDuration(cardServices),
    };
  });

const notifications = [
  {
    id: faker.datatype.uuid(),
    date: new Date("December 19, 2022 08:24:00"),
    title: "Начата работа над проектом MONE CRM",
    body: "В этот день был сделан первый коммит. До сего момента велась работа над дизайном и архитектурой проекта, но в этот день началась работа именно с кодом.",
    variant: "info",
  },
];

module.exports = function () {
  return {
    clients,
    masters,
    services,
    cards: test(),
    client,
    master,
    service,
    secret,
    notifications,
  };
};
