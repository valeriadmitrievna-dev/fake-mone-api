const jsonServer = require("json-server");
const server = jsonServer.create();
const generateDB = require("./generate");
const DB = generateDB();
const router = jsonServer.router(DB);
const middlewares = jsonServer.defaults();
const fns = require("date-fns");
const cors = require("cors");

server.use(cors());

function calculateTotalPrice(cards) {
  let totalPrice = 0;
  cards.forEach((card) => {
    card.services.forEach((service) => {
      totalPrice += service.price;
    });
  });
  return totalPrice;
}

const getMinutesByInterval = (interval) => {
  const duration = fns.intervalToDuration(interval);
  const minutes = (duration.minutes ?? 0) + (duration.hours ?? 0) * 60;

  return minutes;
};

function calculateOccupancyPercentage(cards, worktime) {
  const workdayDuration = getMinutesByInterval(worktime);
  let occupiedDuration = 0;

  cards.forEach((card) => {
    const cardDuration = card.services.reduce((a, b) => a + b.duration, 0);
    occupiedDuration += cardDuration;
  });

  const occupancy = (occupiedDuration / workdayDuration) * 100;

  return Math.round(occupancy);
}

server.get("/masters-count", (req, res) => {
  const count = DB.masters.length;
  res.status(200).json(count);
});

server.get("/cards_for_group", (req, res) => {
  try {
    const { masters, date } = req.query;

    if (!masters) {
      return res.status(400).json({ error: "Masters is required" });
    }
    if (!Array.isArray(masters)) {
      return res.status(400).json({ error: "Masters should be array of ids" });
    }
    if (!date) {
      return res.status(400).json({ error: "Date is required" });
    }

    const { worktime } = DB.secret;

    const result = masters.map((master) => {
      const cards = DB.cards.filter(
        (card) =>
          card.master.id === master &&
          fns.isSameDay(new Date(card.date), new Date(date))
      );

      const price = calculateTotalPrice(cards);
      const occupancy = calculateOccupancyPercentage(cards, worktime);

      return {
        date,
        master: DB.masters.find((m) => m.id === master).id,
        cards,
        price,
        occupancy,
        count: cards.length,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ error: error.message });
  }
});

server.get("/cards_for_master", (req, res) => {
  try {
    const { master, dateStart, dateEnd } = req.query;

    if (!master) {
      return res.status(400).json({ error: "Masters is required" });
    }

    if (!dateStart || !dateEnd) {
      return res.status(400).json({ error: "Date is required" });
    }

    const { worktime } = DB.secret;

    const result = fns
      .eachDayOfInterval({ start: new Date(dateStart), end: new Date(dateEnd) })
      .map((day) => {
        const cards = DB.cards.filter(
          (card) =>
            card.master.id === master &&
            fns.isSameDay(new Date(card.date), new Date(day))
        );

        const price = calculateTotalPrice(cards);
        const occupancy = calculateOccupancyPercentage(cards, worktime);

        return {
          date: day,
          master,
          cards,
          price,
          occupancy,
          count: cards.length,
        };
      });

    res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

server.get("/active_card", (req, res) => {
  try {
    const { cardId, _limit } = req.query;
    if (!cardId) return res.status(400).json({ error: "Card ID is required" });
    const card = DB.cards.find((c) => c.id === cardId);

    if (!card)
      return res
        .status(404)
        .json({ error: `Card with ID:${cardId} doesn't exist` });

    const masterIndex =
      DB.masters.findIndex((m) => m.id === card.master.id) + 1;
    const masterPage = Math.ceil(masterIndex / _limit);

    res.status(200).json({ page: masterPage });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

server.get("/page_by_master", (req, res) => {
  try {
    const { id, _limit } = req.query;
    if (!id) return res.status(400).json({ error: "Master ID is required" });
    const master = DB.masters.find((m) => m.id === id);

    if (!master)
      return res
        .status(404)
        .json({ error: `Master with ID: ${id} doesn't exist` });

    const masterIndex = DB.masters.findIndex((m) => m.id === id) + 1;
    const masterPage = Math.ceil(masterIndex / _limit);

    res.status(200).json({ page: masterPage });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

server.get("/cards_for_column", (req, res) => {
  try {
    const { master, date } = req.query;
    if (!master)
      return res.status(400).json({ error: "Master ID is required" });
    if (!date) return res.status(400).json({ error: "Date is required" });
    const cards = DB.cards.filter(
      (c) =>
        c.master.id === master &&
        fns.isSameDay(new Date(c.date), new Date(date))
    );

    res.status(200).json(cards);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

server.get("/services_array", (req, res) => {
  const { ids } = req.query;
  const services = DB.service.filter((service) => !!ids.includes(service.id));

  return res.status(200).json(services);
});

server.get("/client-appointments-pages", (req, res) => {
  const { id, count } = req.query;

  if (!id)
    return res
      .status(400)
      .json({ error: "Отсутсвует обязательное поле: id клиента." });
  if (!count)
    return res.status(400).json({
      error:
        "Отсутсвует обязательное поле: колиечество встреч на одну страницу.",
    });
  const appointments = DB.cards.filter((card) => card.client.id === id).length;
  const pages = Math.ceil(appointments / count);

  return res.status(200).json(pages);
});

server.use(middlewares);
server.use(router);

server.listen(5000, () => {
  console.log("JSON Server is running on port 5000");
});
