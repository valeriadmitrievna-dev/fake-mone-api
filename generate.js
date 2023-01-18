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

const random = (min, max) => Math.floor(Math.random() * (max - min) + min);
const randomFromArray = (array) =>
  array[Math.floor(Math.random() * array.length)];
const toSameDate = (toDate, date) =>
  fns.setYear(
    fns.setMonth(fns.setDate(toDate, fns.getDate(date)), fns.getMonth(date)),
    fns.getYear(date)
  );

const clients = _.times(100, (n) => {
  return {
    id: faker.datatype.uuid(),
    avatar: faker.image.avatar(),
    phone: faker.phone.number("+# (###) ###-##-##"),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
  };
});

const client = _.times(100, (n) => {
  const cardNumbers = faker.random.numeric(4);
  const cardAlphas = faker.random.alpha(2).toUpperCase();
  const card = cardNumbers + "/" + cardAlphas;

  return {
    id: faker.datatype.uuid(),
    avatar: faker.image.avatar(),
    age: faker.random.numeric(2),
    registeredAt: faker.date.past(),
    phone: faker.phone.number("+# (###) ###-##-##"),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    sex: faker.helpers.arrayElement(["М", "Ж"]),
    card,
  };
});

const masters = _.times(40, (n) => {
  return {
    id: faker.datatype.uuid(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    avatar: faker.image.avatar(),
    purpose: faker.helpers.arrayElement(purposes),
    phrase: faker.lorem.words(random(2, 7)),
    about: _.times(random(2, 5), () => faker.lorem.words(random(4, 16))),
    bests: _.times(random(0, 5), () => faker.lorem.words(random(4, 16))),
    reviews: _.times(random(0, 5), () => faker.lorem.paragraph()),
  };
});

const services = _.times(40, () => {
  const codeNumbers = faker.random.numeric(4);
  const codeAlphas = faker.random.alpha(2).toUpperCase();
  const code = codeNumbers + "/" + codeAlphas;

  return {
    id: faker.datatype.uuid(),
    title: faker.lorem.words(random(1, 3)),
    duration: faker.helpers.arrayElement(durations),
    code,
    about: _.times(random(2, 5), () => faker.lorem.words(random(4, 16))),
    steps: _.times(random(3, 5), () => faker.lorem.words(random(4, 16))),
    price: faker.commerce.price(300, 20000, 0),
    reviews: _.times(random(0, 5), () => faker.lorem.paragraph()),
    photos: _.times(random(0, 5), () => faker.image.fashion()),
  };
});

const cards = data.cards.map((card) => {
  const diff = fns.differenceInDays(card.date, data.cards[0].date);
  const client = randomFromArray(clients);
  const master = randomFromArray(masters);
  const services_15 = services.filter((s) => s.duration === 15);
  const fit_services = services.filter(
    (s) => s.duration === card.service.duration
  );
  const service = randomFromArray(fit_services) || randomFromArray(services_15);

  return {
    ...card,
    date: fns.addDays(toSameDate(card.date, new Date()), diff),
    client,
    master,
    service,
  };
});

module.exports = function () {
  return {
    clients,
    masters,
    services,
    cards,
    client,
  };
};
