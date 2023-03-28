const _ = require("lodash");
const { faker } = require("@faker-js/faker");
faker.setLocale("ru");
faker.locale = "ru";
const fns = require("date-fns");
const utils = require("./utils");

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

const generateCards = (arr, index) => {
  const chance = Math.random();
  let duration;
  const time = Math.abs(
    fns.differenceInMinutes(arr[index].start, arr[arr.length - 1].end)
  );
  if (chance <= 0.1 && time >= 180) {
    duration = 180;
    utils.removeInArray(arr, index, 180 / 15 - 1);
  } else if (chance <= 0.15 && time >= 150) {
    duration = 150;
    utils.removeInArray(arr, index, 150 / 15 - 1);
  } else if (chance <= 0.15 && time >= 120) {
    duration = 120;
    utils.removeInArray(arr, index, 120 / 15 - 1);
  } else if (chance <= 0.2 && time >= 90) {
    duration = 90;
    utils.removeInArray(arr, index, 90 / 15 - 1);
  } else if (chance <= 0.5 && time >= 60) {
    duration = 60;
    utils.removeInArray(arr, index, 60 / 15 - 1);
  } else if (chance <= 0.5 && time >= 45) {
    duration = 45;
    utils.removeInArray(arr, index, 45 / 15 - 1);
  } else if (chance <= 0.5 && time >= 30) {
    duration = 30;
    utils.removeInArray(arr, index, 30 / 15 - 1);
  } else {
    duration = 15;
    utils.removeInArray(arr, index, 15 / 15 - 1);
  }
  return duration;
};

const generateCardsData = (card) => {
  // card: date, master, service's duration
  const fit_15 = services.filter((s) => s.duration === 15);
  const card_services = utils.getNRandomsFromArray(fit_15, 1);

  const client = utils.randomFromArray(clients);

  const duration = utils.getFullDuration(card_services);

  return {
    ...card,
    services: card_services,
    client,
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
    count: utils.random(0, 40),
    frequency: utils.random(0, 12) + " раз в " + utils.randomFromArray(["год", "месяц"]),
    last: utils.randomDateInRange(new Date("2023-01-01"), new Date()),
    next: utils.randomDateInRange(new Date("2023-01-01"), new Date()),
    missed: utils.random(0, 10),
  },
  about: _.times(utils.random(2, 5), () => faker.lorem.words(utils.random(4, 16))),
  finanses: {
    banace: utils.random(0, 10000),
    average: utils.random(0, 10000),
    bonus: utils.random(0, 1000),
    wasted: utils.random(0, 20000),
  },
  tags: TAGS.slice(0, utils.random(0, 5)),
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
    phrase: faker.lorem.words(utils.random(2, 7)),
    about: _.times(utils.random(2, 5), () => faker.lorem.words(utils.random(4, 16))),
    bests: _.times(utils.random(0, 5), () => faker.lorem.words(utils.random(4, 16))),
    reviews: _.times(utils.random(0, 5), () => faker.lorem.paragraph()),
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
  about: _.times(utils.random(2, 5), () => faker.lorem.words(utils.random(4, 16))),
  steps: _.times(utils.random(3, 5), () => faker.lorem.words(utils.random(4, 16))),
  reviews: _.times(utils.random(0, 5), () => faker.lorem.paragraph()),
  photos: _.times(utils.random(0, 5), () => faker.image.fashion()),
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

          return utils.timeArrayToSegments(utils.getIntervals(start, end, SEGMENT))
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

    while (utils.getFullDuration(cardServices) < sumDuration) {
      const shuffledServices = utils.shuffleArray(service);
      const toAdd = shuffledServices.find(
        (s) =>
          s.duration + utils.getFullDuration(cardServices) <= sumDuration &&
          !cardServices.find((_s) => _s.id === s.id)
      );
      if (toAdd) cardServices.push(toAdd);
      else continue;
    }

    const status = utils.random(0, 3);

    return {
      id: c.id,
      date: c.date,
      master: c.master,
      client: c.client,
      services: cardServices,
      status,
      duration: utils.getFullDuration(cardServices),
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
