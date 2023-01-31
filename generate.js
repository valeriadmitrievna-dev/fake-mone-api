const _ = require("lodash");
const { faker } = require("@faker-js/faker");
faker.setLocale("ru");
faker.locale = "ru";
const fns = require("date-fns");

const data = require("./data");

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
const MASTERS = 24
const SERVICES = 40

const random = (min, max) => Math.floor(Math.random() * (max - min) + min);
const randomFromArray = (array) =>
  array[Math.floor(Math.random() * array.length)];
const toSameDate = (toDate, date) =>
  fns.setYear(
    fns.setMonth(fns.setDate(toDate, fns.getDate(date)), fns.getMonth(date)),
    fns.getYear(date)
  );

const clients = _.times(CLIENTS, (n) => {
  return {
    id: faker.datatype.uuid(),
    avatar: Math.random() > 0.5 ? faker.image.avatar() : null,
    phone: faker.phone.number("+7 (9##) ###-##-##"),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
  };
});

const client = _.times(CLIENTS, (n) => {
  return {
    id: faker.datatype.uuid(),
    age: faker.random.numeric(2),
    registeredAt: faker.date.past(),
    avatar: Math.random() > 0.5 ? faker.image.avatar() : null,
    phone: faker.phone.number("+7 (9##) ###-##-##"),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    sex: faker.helpers.arrayElement(["М", "Ж"]),
  };
});

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

const services = _.times(SERVICES, () => {
  return {
    id: faker.datatype.uuid(),
    title: faker.lorem.words(random(1, 3)),
    duration: faker.helpers.arrayElement(durations),
    about: _.times(random(2, 5), () => faker.lorem.words(random(4, 16))),
    steps: _.times(random(3, 5), () => faker.lorem.words(random(4, 16))),
    price: faker.commerce.price(300, 20000, 0),
    reviews: _.times(random(0, 5), () => faker.lorem.paragraph()),
    photos: _.times(random(0, 5), () => faker.image.fashion()),
  };
});

const cards = data.cards.map((card, index) => {
  const diff = fns.differenceInDays(card.date, data.cards[0].date);
  const client = randomFromArray(clients);
  const master = index <= 2 ? masters[0] : randomFromArray(masters);
  const services_15 = services.filter((s) => s.duration === 15);
  const fit_services = services.filter(
    (s) => s.duration === card.service.duration
  );
  const service = randomFromArray(fit_services) || randomFromArray(services_15);

  return {
    ...card,
    date: fns.addDays(toSameDate(new Date(card.date), new Date()), diff),
    client,
    master,
    service,
    id: faker.datatype.uuid(),
  };
});

const secret = {
  worktime: {
    start: new Date("2000-01-01T08:00:00"),
    end: new Date("2000-01-01T17:00:00"),
  },
  logo: faker.image.abstract(),
  company: faker.company.name(),
};

module.exports = function () {
  return {
    clients,
    masters,
    services,
    cards,
    client,
    master,
    service,
    secret,
  };
};
