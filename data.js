const fns = require("date-fns");
const { faker } = require("@faker-js/faker");
faker.setLocale("ru");
faker.locale = "ru";

const utils = require("./utils");

const TAGS = [
  {
    id: faker.datatype.uuid(),
    title: "Регулярный",
    color: "#D0DBF0",
  },
  {
    id: faker.datatype.uuid(),
    title: "Высокий чек",
    color: "#DFEEE7",
  },
  {
    id: faker.datatype.uuid(),
    title: "Красота по-русски",
    color: "#D5C8F5",
  },
  {
    id: faker.datatype.uuid(),
    title: "Бьюти-план",
    color: "#FDF6E3",
  },
  {
    id: faker.datatype.uuid(),
    title: "Приведи друга",
    color: "#E4CBA7",
  },
];

const CATEGORIES = [
  { key: 1, title: "Уход за волосами", purpose: "Парикмахер" },
  { key: 2, title: "Уход за ногтями", purpose: "Маникюрщик" },
  { key: 3, title: "Уход за кожей", purpose: "Косметолог" },
  { key: 4, title: "Услуги визажиста", purpose: "Визажист" },
  { key: 5, title: "Спа-услуги", purpose: "Специалист по спа-уходу" },
  { key: 6, title: "Другие услуги", purpose: "Мастер узкого назначения" },
];

const getCategory = (n) => CATEGORIES.find((c) => c.key === n) || null;

const CLIENTS = Array.from(Array(30).keys()).map(() => {
  const tagsCount = utils.random(0, TAGS.length);
  const firstname = faker.name.firstName();
  const lastname = faker.name.lastName();

  return {
    id: faker.datatype.uuid(),
    avatar: Math.random() > 0.5 ? faker.image.avatar() : null,
    phone: faker.phone.number("+7 (9##) ###-##-##"),
    firstname,
    lastname,
    about: faker.lorem.text().slice(0, utils.random(0, 200)),
    tags: utils.shuffleArray(TAGS).slice(0, tagsCount),
    registeredAt: utils.randomDateInRange(
      fns.subMonths(new Date(), 12),
      new Date()
    ),
    sex: utils.random(0, 1),
    birth: utils.randomDateInRange(
      fns.subYears(new Date(), 60),
      fns.subYears(new Date(), 16)
    ),
    email: faker.internet.email(firstname, lastname),
    rating: utils.random(0, 5),
    onlineAccess: utils.random(0, 1),
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

  return {
    id: faker.datatype.uuid(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    avatar: Math.random() > 0.5 ? faker.image.avatar() : null,
    categories,
    purpose: categories.length > 1 ? "Мастер-универсал" : categories[0].purpose,
    about: faker.lorem.text().slice(0, utils.random(0, 200)),
    reviews: {
      id: faker.datatype.uuid(),
      date: utils.randomDateInRange(fns.subYears(new Date(), 1), new Date()),
      from: utils.randomFromArray(CLIENTS).id,
      body: Array.from(Array(utils.random(1, 5)).keys()).map(() =>
        faker.lorem.words(utils.random(5, 20))
      ),
    },
  };
});

const SERVICES = [
  {
    title: "Стрижка",
    category: getCategory(1),
    id: faker.datatype.uuid(),
    duration: 45,
  },
  {
    title: "Окрашивание",
    category: getCategory(1),
    id: faker.datatype.uuid(),
    duration: 90,
  },
  {
    title: "Укладка",
    category: getCategory(1),
    id: faker.datatype.uuid(),
    duration: 60,
  },
  {
    title: "Наращивание волос",
    category: getCategory(1),
    id: faker.datatype.uuid(),
    duration: 120,
  },
  {
    title: "Маникюр",
    category: getCategory(2),
    id: faker.datatype.uuid(),
    duration: 90,
  },
  {
    title: "Педикюр",
    category: getCategory(2),
    id: faker.datatype.uuid(),
    duration: 30,
  },
  {
    title: "Наращивание ногтей",
    category: getCategory(2),
    id: faker.datatype.uuid(),
    duration: 90,
  },
  {
    title: "Чистка лица",
    category: getCategory(3),
    id: faker.datatype.uuid(),
    duration: 60,
  },
  {
    title: "Массаж",
    category: getCategory(3),
    id: faker.datatype.uuid(),
    duration: 30,
  },
  {
    title: "Увлажнение кожи лица",
    category: getCategory(3),
    id: faker.datatype.uuid(),
    duration: 15,
  },
  {
    title: "Лечение проблемной кожи",
    category: getCategory(3),
    id: faker.datatype.uuid(),
    duration: 15,
  },
  {
    title: "Солярий",
    category: getCategory(3),
    id: faker.datatype.uuid(),
    duration: 45,
  },
  {
    title: "Макияж",
    category: getCategory(4),
    id: faker.datatype.uuid(),
    duration: 30,
  },
  {
    title: "Уход за бровями",
    category: getCategory(4),
    id: faker.datatype.uuid(),
    duration: 30,
  },
  {
    title: "Уход за ресницами",
    category: getCategory(4),
    id: faker.datatype.uuid(),
    duration: 30,
  },
  {
    title: "Окрашивание бровей",
    category: getCategory(4),
    id: faker.datatype.uuid(),
    duration: 45,
  },
  {
    title: "Наращивание ресниц",
    category: getCategory(4),
    id: faker.datatype.uuid(),
    duration: 120,
  },
  {
    title: "Сауна",
    category: getCategory(5),
    id: faker.datatype.uuid(),
    duration: 60,
  },
  {
    title: "Баня",
    category: getCategory(5),
    id: faker.datatype.uuid(),
    duration: 60,
  },
  {
    title: "Гидромассаж",
    category: getCategory(5),
    id: faker.datatype.uuid(),
    duration: 45,
  },
  {
    title: "Термальные процедуры",
    category: getCategory(5),
    id: faker.datatype.uuid(),
    duration: 60,
  },
  {
    title: "Татуировка",
    category: getCategory(6),
    id: faker.datatype.uuid(),
    duration: 60,
  },
  {
    title: "Пирсинг",
    category: getCategory(6),
    id: faker.datatype.uuid(),
    duration: 15,
  },
  {
    title: "Эпиляция",
    category: getCategory(6),
    id: faker.datatype.uuid(),
    duration: 45,
  },
  {
    title: "Депиляция",
    category: getCategory(6),
    id: faker.datatype.uuid(),
    duration: 45,
  },
  {
    title: "Коррекция фигуры",
    category: getCategory(6),
    id: faker.datatype.uuid(),
    duration: 90,
  },
].map((service) => ({
  ...service,
  price: Math.round(utils.random(300, 5000) / 100) * 100,
  about: faker.lorem.text().slice(0, utils.random(0, 200)),
  steps: Array.from(Array(utils.random(3, 7)).keys()).map(() =>
    faker.lorem.words(utils.random(2, 7))
  ),
  reviews: {
    id: faker.datatype.uuid(),
    date: utils.randomDateInRange(fns.subYears(new Date(), 1), new Date()),
    from: utils.randomFromArray(CLIENTS).id,
    body: Array.from(Array(utils.random(1, 5)).keys()).map(() =>
      faker.lorem.words(utils.random(5, 20))
    ),
  },
}));

module.exports = {
  SERVICES,
  CLIENTS,
  TAGS,
  CATEGORIES,
  MASTERS,
};
