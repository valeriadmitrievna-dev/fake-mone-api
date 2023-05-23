const fns = require("date-fns");
const { faker } = require("@faker-js/faker");

const DATA = require("./data");
const utils = require("./utils");

const START = 8;
const END = 17;
const DAYS = 15;
const SEGMENT = 15;

const START_DATE = fns.subDays(new Date(), Math.round(DAYS / 2));
const END_DATE = fns.addDays(START_DATE, DAYS - 1);

const generateCardDuration = (arr, index) => {
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

const generateCardData = (card) => {
  // card: date, master, service's duration
  const fit_15 = DATA.SERVICES.filter((s) => s.duration === 15);
  const card_services = utils.getNRandomsFromArray(fit_15, 1);
  const client = utils.randomFromArray(DATA.CLIENTS);
  const duration = utils.getFullDuration(card_services);

  return {
    ...card,
    services: card_services,
    client,
    id: faker.datatype.uuid(),
    duration,
  };
};

const getCards = (
  density = 0.5 // 0 - 1
) =>
  DATA.MASTERS.map((master) => {
    return fns
      .eachDayOfInterval({
        start: START_DATE,
        end: END_DATE,
      })
      .map((day) => {
        const start = fns.setMinutes(fns.setHours(day, START), 0);
        const end = fns.setMinutes(fns.setHours(day, END), 0);

        return utils
          .timeArrayToSegments(utils.getIntervals(start, end, SEGMENT))
          .map((seg, index, arr) => {
            const duration = generateCardDuration(arr, index);
            return {
              date: new Date(seg.start),
              master,
              service: { duration },
              duration,
            };
          })
          .filter((c) => c)
          .filter(() => Math.random() > density)
          .flat();
      })
      .flat();
  })
    .flat()
    .map(generateCardData);

const cards = getCards().map((c) => {
  const sumDuration = c.service.duration;
  const cardServices = [];

  while (utils.getFullDuration(cardServices) < sumDuration) {
    const shuffledServices = utils.shuffleArray(DATA.SERVICES);
    const toAdd = shuffledServices.find(
      (s) => s.duration + utils.getFullDuration(cardServices) <= sumDuration
    );
    if (toAdd)
      cardServices.push({
        id: toAdd.id,
        title: toAdd.title,
        duration: toAdd.duration,
        category: toAdd.category,
        price: toAdd.price,
      });
    else continue;
  }

  const status = utils.random(0, 3);

  return {
    id: c.id,
    date: c.date,
    master: {
      id: c.master.id,
      firstname: c.master.firstname,
      lastname: c.master.lastname,
      purpose: c.master.purpose,
      avatar: c.master.avatar,
      categories: c.master.categories,
    },
    client: {
      id: c.client.id,
      firstname: c.client.firstname,
      lastname: c.client.lastname,
      avatar: c.client.avatar,
      phone: c.client.phone,
    },
    services: cardServices,
    status,
    duration: utils.getFullDuration(cardServices),
  };
});

const getAppointments = () => {
  let appointments = cards.map((card) => ({
    id: faker.datatype.uuid(),
    separatable: true,
    expires: null,
    cards: [card],
  }));

  const appointmentsToCombine = utils.getNRandomsFromArray(appointments, 4);
  const cardsToCombine = appointmentsToCombine.map((a) => a.cards).flat();
  appointments = appointments.filter(
    (a) => !appointmentsToCombine.find((ac) => ac.id === a.id)
  );
  appointments.push({
    id: faker.datatype.uuid(),
    expires: new Date(2023, 5, 1),
    separatable: false,
    cards: cardsToCombine,
  });

  return appointments;
};

module.exports = {
  cards,
  appointments: getAppointments(),
};
