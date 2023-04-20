const { faker } = require("@faker-js/faker");
faker.setLocale("ru");
faker.locale = "ru";
const fns = require("date-fns");

const utils = require("./utils");
const dataHelpers = require("./data-helpers");

const START = 8;
const END = 17;
const DAYS = 60;

const START_DATE = fns.subDays(new Date(), 15);
const END_DATE = fns.addDays(START_DATE, DAYS - 1);

const TAGS = [
  { title: "Постоянный", color: "#B0BBDB" },
  { title: "Лояльный", color: "#A8D9E0" },
  { title: "Красота по-русски", color: "#A0D9F9" },
  { title: "Бьюти-план", color: "#E4C0BF" },
  { title: "Приведи друга", color: "#A0D5C9" },
];

const CATEGORIES = [
  { key: 1, title: "Уход за волосами", purpose: "Парикмахер" },
  { key: 2, title: "Уход за ногтями", purpose: "Маникюрщик" },
  { key: 3, title: "Уход за кожей лица и тела", purpose: "Косметолог" },
  { key: 4, title: "Услуги визажиста", purpose: "Визажист" },
  { key: 5, title: "Спа-услуги", purpose: "Специалист по спа-уходу" },
  { key: 6, title: "Другие услуги", purpose: "Мастер узкого назначения" },
];

const getCategory = (n) => CATEGORIES.find((c) => c.key === n) || null;

const SERVICES = [
  {
    title: "Стрижка",
    category: getCategory(1),
    master: null,
    id: faker.datatype.uuid(),
    duration: 45,
  },
  {
    title: "Окрашивание",
    category: getCategory(1),
    master: null,
    id: faker.datatype.uuid(),
    duration: 90,
  },
  {
    title: "Укладка",
    category: getCategory(1),
    master: null,
    id: faker.datatype.uuid(),
    duration: 60,
  },
  {
    title: "Наращивание волос",
    category: getCategory(1),
    master: null,
    id: faker.datatype.uuid(),
    duration: 120,
  },
  {
    title: "Маникюр",
    category: getCategory(2),
    master: null,
    id: faker.datatype.uuid(),
    duration: 90,
  },
  {
    title: "Педикюр",
    category: getCategory(2),
    master: null,
    id: faker.datatype.uuid(),
    duration: 30,
  },
  {
    title: "Наращивание ногтей",
    category: getCategory(2),
    master: null,
    id: faker.datatype.uuid(),
    duration: 90,
  },
  {
    title: "Чистка лица",
    category: getCategory(3),
    master: null,
    id: faker.datatype.uuid(),
    duration: 60,
  },
  {
    title: "Массаж",
    category: getCategory(3),
    master: null,
    id: faker.datatype.uuid(),
    duration: 30,
  },
  {
    title: "Увлажнение кожи лица",
    category: getCategory(3),
    master: null,
    id: faker.datatype.uuid(),
    duration: 15,
  },
  {
    title: "Лечение проблемной кожи",
    category: getCategory(3),
    master: null,
    id: faker.datatype.uuid(),
    duration: 15,
  },
  {
    title: "Солярий",
    category: getCategory(3),
    master: null,
    id: faker.datatype.uuid(),
    duration: 45,
  },
  {
    title: "Макияж",
    category: getCategory(4),
    master: null,
    id: faker.datatype.uuid(),
    duration: 30,
  },
  {
    title: "Уход за бровями",
    category: getCategory(4),
    master: null,
    id: faker.datatype.uuid(),
    duration: 30,
  },
  {
    title: "Уход за ресницами",
    category: getCategory(4),
    master: null,
    id: faker.datatype.uuid(),
    duration: 30,
  },
  {
    title: "Окрашивание бровей",
    category: getCategory(4),
    master: null,
    id: faker.datatype.uuid(),
    duration: 45,
  },
  {
    title: "Наращивание ресниц",
    category: getCategory(4),
    master: null,
    id: faker.datatype.uuid(),
    duration: 120,
  },
  {
    title: "Сауна",
    category: getCategory(5),
    master: null,
    id: faker.datatype.uuid(),
    duration: 60,
  },
  {
    title: "Баня",
    category: getCategory(5),
    master: null,
    id: faker.datatype.uuid(),
    duration: 60,
  },
  {
    title: "Гидромассаж",
    category: getCategory(5),
    master: null,
    id: faker.datatype.uuid(),
    duration: 45,
  },
  {
    title: "Термальные процедуры",
    category: getCategory(5),
    master: null,
    id: faker.datatype.uuid(),
    duration: 60,
  },
  {
    title: "Татуировка",
    category: getCategory(6),
    master: null,
    id: faker.datatype.uuid(),
    duration: 60,
  },
  {
    title: "Пирсинг",
    category: getCategory(6),
    master: null,
    id: faker.datatype.uuid(),
    duration: 15,
  },
  {
    title: "Эпиляция",
    category: getCategory(6),
    master: null,
    id: faker.datatype.uuid(),
    duration: 45,
  },
  {
    title: "Депиляция",
    category: getCategory(6),
    master: null,
    id: faker.datatype.uuid(),
    duration: 45,
  },
  {
    title: "Коррекция фигуры",
    category: getCategory(6),
    master: null,
    id: faker.datatype.uuid(),
    duration: 90,
  },
].map((service) => ({
  ...service,
  price: utils.random(300, 5000),
  about: Array.from(Array(utils.random(3, 5)).keys()).map(() =>
    faker.lorem.words(utils.random(2, 7))
  ),
  steps: Array.from(Array(utils.random(3, 7)).keys()).map(() =>
    faker.lorem.words(utils.random(2, 7))
  ),
  reviews: Array.from(Array(utils.random(1, 5)).keys()).map(() =>
    faker.lorem.words(utils.random(5, 20))
  ),
}));

const CLIENTS = Array.from(Array(30).keys()).map(() => {
  const tagsCount = utils.random(0, TAGS.length);

  return {
    id: faker.datatype.uuid(),
    avatar: Math.random() > 0.5 ? faker.image.avatar() : null,
    phone: faker.phone.number("+7 (9##) ###-##-##"),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    about: Array.from(Array(utils.random(3, 5)).keys()).map(() =>
      faker.lorem.words(utils.random(2, 7))
    ),
    finanses: {
      banace: utils.random(0, 20000),
      average: utils.random(0, 20000),
      bonus: utils.random(0, 20000),
      wasted: utils.random(0, 20000),
    },
    appointments: {
      count: utils.random(0, 50),
      frequency: utils.random(0, 10),
      last: utils.randomDateInRange(fns.addDays(new Date(), 30), new Date()),
      next: utils.randomDateInRange(new Date(), fns.addDays(new Date(), 30)),
      missed: utils.random(0, 10),
    },
    tags: utils.shuffleArray(TAGS.map((tag) => tag.title)).slice(0, tagsCount),
    registeredAt: utils.randomDateInRange(
      fns.subMonths(new Date(), 12),
      new Date()
    ),
  };
});

const MASTERS = Array.from(Array(24).keys()).map(() => {
  const categories = [
    ...new Set(
      Array.from(Array(utils.random(1, 2)).keys()).map(() =>
        utils.randomFromArray(CATEGORIES)
      )
    ),
  ];

  const services = SERVICES.filter((s) =>
    categories.map((c) => c.key).includes(s.category.key)
  );
  const popular = utils.shuffleArray(services).slice(0, utils.random(0, 3));

  return {
    id: faker.datatype.uuid(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    avatar: Math.random() > 0.5 ? faker.image.avatar() : null,
    categories,
    purpose: categories.length > 1 ? "Мастер-универсал" : categories[0].purpose,
    popular,
    about: Array.from(Array(utils.random(3, 5)).keys()).map(() =>
      faker.lorem.words(utils.random(2, 7))
    ),
    reviews: Array.from(Array(utils.random(1, 5)).keys()).map(() =>
      faker.lorem.words(utils.random(5, 20))
    ),
  };
});

const getAppointmentsArray = (day, services, startTime, endTime) => {
  const start = new Date(day);
  start.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);
  const end = new Date(day);
  end.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);

  const array = [];

  let current = new Date(start);
  for (const service of services) {
    const endOfDuration = new Date(
      current.getTime() + service.duration * 60 * 1000
    );
    if (endOfDuration > end) {
      break; // no more durations fit in the day
    }

    const client = utils.randomFromArray(CLIENTS);
    const master = utils
      .shuffleArray(MASTERS)
      .find((m) => m.categories.some((c) => c.key === service.category.key));

    array.push({
      date: new Date(current),
      duration: service.duration,
      services: [{ ...service, master }],
      client,
      id: faker.datatype.uuid(),
    });
    current = endOfDuration;
  }

  // calculate free time between durations
  const freeTimeArray = [];
  for (let i = 0; i < array.length - 1; i++) {
    const startOfFreeTime = array[i].end;
    const endOfFreeTime = array[i + 1].start;
    const freeDurationInMinutes =
      (endOfFreeTime - startOfFreeTime) / (1000 * 60);
    if (freeDurationInMinutes > 0) {
      freeTimeArray.push({
        start: startOfFreeTime,
        end: endOfFreeTime,
        duration: freeDurationInMinutes,
      });
    }
  }

  return array;
};

const startTime = fns.setMinutes(fns.setHours(new Date(), START), 0);
const endTime = fns.setMinutes(fns.setHours(new Date(), END), 0);

const APPOINTMENTS = fns
  .eachDayOfInterval({
    start: START_DATE,
    end: END_DATE,
  })
  .map((day) => getAppointmentsArray(day, SERVICES, startTime, endTime))
  .flat();

module.exports = {
  SERVICES,
  CLIENTS,
  TAGS,
  CATEGORIES,
  MASTERS,
  APPOINTMENTS,
};
