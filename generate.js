function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

module.exports = function () {
  const _ = require("lodash");
  const { faker } = require("@faker-js/faker");
  faker.setLocale("ru");
  faker.locale = "ru";

  const master_purposes = [
    "Парикмахер-стилист",
    "Мастер маникюра и педикюра",
    "Косметолог",
    "Визажист",
    "Массажист",
    "Мастер-универсал",
  ];

  const durations = [15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180];

  return {
    clients: _.times(100, (n) => {
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
    }),
    masters: _.times(20, (n) => {
      return {
        id: faker.datatype.uuid(),
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        avatar: faker.image.avatar(),
        purpose: faker.helpers.arrayElement(master_purposes),
        phrase: faker.lorem.words(randomNumber(2, 7)),
        about: _.times(randomNumber(2, 5), () =>
          faker.lorem.words(randomNumber(4, 16))
        ),
        bests: _.times(randomNumber(0, 5), () =>
          faker.lorem.words(randomNumber(4, 16))
        ),
        reviews: _.times(randomNumber(0, 5), () => faker.lorem.paragraph()),
      };
    }),
    services: _.times(20, () => {
      const codeNumbers = faker.random.numeric(4);
      const codeAlphas = faker.random.alpha(2).toUpperCase();
      const code = codeNumbers + "/" + codeAlphas;

      return {
        id: faker.datatype.uuid(),
        title: faker.lorem.words(randomNumber(1, 3)),
        duration: faker.helpers.arrayElement(durations),
        code,
        about: _.times(randomNumber(2, 5), () =>
          faker.lorem.words(randomNumber(4, 16))
        ),
        steps: _.times(randomNumber(3, 5), () =>
          faker.lorem.words(randomNumber(4, 16))
        ),
        price: faker.commerce.price(300, 20000, 0),
        reviews: _.times(randomNumber(0, 5), () => faker.lorem.paragraph()),
        photos: _.times(randomNumber(0, 5), () => faker.image.fashion())
      };
    }),
  };
};
