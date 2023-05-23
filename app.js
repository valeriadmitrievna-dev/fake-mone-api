const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const utils = require("./utils");
const { faker } = require("@faker-js/faker");
const cors = require("cors");

const DATA = require("./data");
const dataHelpers = require("./data-helpers");
let { cards, appointments } = require("./cards");
const { isBefore } = require("date-fns");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Сервер запушен!" });
});

app.get("/services", (req, res) => {
  const { q: reqQ, categories: reqCategories, ids = [] } = req.query;
  const categories = reqCategories?.map((c) => +c) || [];
  const q = reqQ?.toLowerCase() || "";

  const services = DATA.SERVICES.filter(
    (service) =>
      (q.length ? service.title.toLowerCase().startsWith(q) : true) &&
      (categories.length ? categories.includes(service.category.key) : true) &&
      (ids.length ? ids.includes(service.id) : true)
  ).map((service) => ({
    id: service.id,
    category: service.category,
    duration: service.duration,
    price: service.price,
    title: service.title,
  }));

  return res.status(200).json(services);
});

app.get("/services/client", (req, res) => {
  try {
    const { id, limit = 4, page = 1 } = req.query;

    const client = DATA.CLIENTS.find((c) => c.id === id);
    if (!client) return res.status(404).json({ error: "Invalid client id" });

    const services = cards
      .filter((c) => c.client.id === id)
      .map((card) => card.services)
      .flat();
    const pages = Math.ceil(services.length / limit);
    const slice = services.slice((page - 1) * limit, page * limit);

    return res.status(200).json({ pages, services: slice });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/services/:id", (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Не предоставлен service.id" });

  const service = DATA.SERVICES.find((s) => s.id === id);
  if (!service)
    return res.status(404).json({ error: "Услуга с таким ID не найдена" });

  return res.status(200).json(service);
});

app.get("/services/:id/short", (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Не предоставлен service.id" });

  const service = DATA.SERVICES.find((s) => s.id === id);
  if (!service)
    return res.status(404).json({ error: "Услуга с таким ID не найдена" });

  return res.status(200).json({
    id: service.id,
    title: service.title,
    duration: service.duration,
    price: service.price,
    category: service.category,
  });
});

app.get("/clients", (req, res) => {
  const { q = "" } = req.query;
  const clients = DATA.CLIENTS.filter(
    (client) =>
      client.firstname.toLowerCase().startsWith(q.toLowerCase()) ||
      client.lastname.toLowerCase().startsWith(q.toLowerCase())
  ).map((client) => ({
    id: client.id,
    firstname: client.firstname,
    lastname: client.lastname,
    phone: client.phone,
    avatar: client.avatar,
  }));
  return res.status(200).json(clients);
});

app.get("/clients/:id", (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Не предоставлен client.id" });

  const client = DATA.CLIENTS.find((s) => s.id === id);
  if (!client)
    return res.status(404).json({ error: "Клиент с таким ID не найден" });

  return res.status(200).json(client);
});

app.get("/clients/:id/short", (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Не предоставлен client.id" });

  const client = DATA.CLIENTS.find((s) => s.id === id);
  if (!client)
    return res.status(404).json({ error: "Клиент с таким ID не найден" });

  return res.status(200).json({
    id: client.id,
    avatar: client.avatar,
    firstname: client.firstname,
    lastname: client.lastname,
    phone: client.phone,
  });
});

app.get("/clients/:id/cards", (req, res) => {
  const { id } = req.params;
  const { count = 5 } = req.query;
  if (!id) return res.status(400).json({ error: "Не предоставлен client.id" });

  const client = DATA.CLIENTS.find((s) => s.id === id);
  if (!client)
    return res.status(404).json({ error: "Клиент с таким ID не найден" });

  const cardsByClient = cards.filter((a) => a.client.id === id);
  const result = dataHelpers.getCardsForClient(cardsByClient, count);

  return res.status(200).json(result);
});

app.get("/masters", (req, res) => {
  const { page, limit, q, category } = req.query;
  const masters = DATA.MASTERS;

  if (page && limit) {
    const slice = masters.slice((page - 1) * limit, page * limit);
    return res.status(200).json(slice);
  } else {
    const searchedMasters = masters
      .filter((master) => {
        const matchFirstName = q
          ? master.firstname.toLowerCase().startsWith(q.toLowerCase())
          : true;
        const matchLastName = q
          ? master.lastname.toLowerCase().startsWith(q.toLowerCase())
          : true;
        const matchCategory = category
          ? !!master.categories.find((c) => c.key === +category)
          : true;

        return matchCategory && (matchFirstName || matchLastName);
      })
      .map((master) => ({
        id: master.id,
        firstname: master.firstname,
        lastname: master.lastname,
        purpose: master.purpose,
        categories: master.categories,
        avatar: master.avatar,
      }));
    return res.status(200).json(searchedMasters);
  }
});

app.get("/masters/page", (req, res) => {
  const { id, limit } = req.query;
  if (!id) return res.status(400).json({ error: "Не предоставлен master.id" });
  if (!limit)
    return res
      .status(400)
      .json({ error: "Не предоставлено количество отображаемых колонок" });

  const master = DATA.MASTERS.find((m) => m.id === id);
  if (!master)
    return res.status(404).json({ error: "Мастер с таким ID не найден" });

  const index = DATA.MASTERS.findIndex((m) => m.id === id) + 1;
  const page = Math.ceil(index / limit);

  return res.status(200).json(page);
});

app.get("/masters/count", (req, res) => {
  const count = DATA.MASTERS.length;
  return res.status(200).json(count);
});

app.get("/masters/:id", (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Не предоставлен master.id" });

  const master = DATA.MASTERS.find((s) => s.id === id);
  if (!master)
    return res.status(404).json({ error: "Мастер с таким ID не найден" });

  return res.status(200).json(master);
});

app.get("/masters/:id/short", (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Не предоставлен master.id" });

  const master = DATA.MASTERS.find((s) => s.id === id);
  if (!master)
    return res.status(404).json({ error: "Мастер с таким ID не найден" });

  return res.status(200).json({
    id: master.id,
    firstname: master.firstname,
    lastname: master.lastname,
    purpose: master.purpose,
    avatar: master.avatar,
    categories: master.categories,
  });
});

app.get("/cards", (req, res) => {
  return res.status(200).json(cards);
});

app.get("/cards/group", (req, res) => {
  const { masters = [], date = new Date() } = req.query;

  const columns = dataHelpers.getCardsForGroup(cards, masters, new Date(date));

  return res.status(200).json(columns);
});

app.get("/cards/client", (req, res) => {
  try {
    const { id, limit = 4, page = 1 } = req.query;

    const client = DATA.CLIENTS.find((c) => c.id === id);
    if (!client) return res.status(404).json({ error: "Invalid client id" });

    const _cards = cards.filter((c) => c.client.id === id);
    const pages = Math.ceil(_cards.length / limit);
    const slice = _cards.slice((page - 1) * limit, page * limit);

    return res.status(200).json({ pages, cards: slice });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/cards/master", (req, res) => {
  const { master, dates = [] } = req.query;

  const columns = dataHelpers.getCardsForDate(cards, master, dates);

  return res.status(200).json(columns);
});

app.get("/cards/:id", (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Не предоставлен card.id" });

  const card = cards.find((a) => a.id === id);
  if (!card)
    return res.status(404).json({ error: "Встреча с таким ID не найдена" });

  return res.status(200).json(card);
});

app.put("/cards/:id", (req, res) => {
  const { id } = req.params;
  const newCard = req.body;

  const card = cards.find((card) => card.id === id);
  if (!card)
    return res.status(404).json({ error: "Встреча с таким ID не найдена" });

  cards = cards.map((a) => {
    if (a.id === id) {
      return { ...a, ...newCard };
    }

    return a;
  });

  return res.status(200).json({
    previous: card,
    new: newCard,
  });
});

app.post("/cards", (req, res) => {
  const { client, date, duration, master, services } = req.body;

  if (!client) {
    return res.status(400).json({
      error: "Для создания встречи должен быть выбран хотя бы один клиент",
    });
  }
  if (!services?.length) {
    return res.status(400).json({
      error: "Для создания встречи должена быть выбрана хотя бы одна услуга",
    });
  }
  if (!master) {
    return res.status(400).json({
      error:
        "Для создания встречи должен быть выбран мастер, оказывающий выбранную(ые) услугу(и)",
    });
  }
  if (!date) {
    return res
      .status(400)
      .json({ error: "Для создания встречи должен быть указана дата приёма" });
  }

  const checkClient = DATA.CLIENTS.find((c) => c.id === client.id);
  const checkMaster = DATA.MASTERS.find((m) => m.id === master.id);
  const checkServices = services.every((s) =>
    DATA.SERVICES.find((_s) => _s.id === s.id)
  );

  if (!checkClient) {
    return res.status(404).json({ error: "Такого клиента не существует" });
  }
  if (!checkMaster) {
    return res.status(404).json({ error: "Такого мастера не существует" });
  }
  if (!checkServices) {
    return res
      .status(404)
      .json({ error: "Среди услуг есть минимум одна, которой не существует" });
  }

  const card = {
    id: faker.datatype.uuid(),
    client,
    master,
    services,
    duration: duration || utils.getFullDuration(services),
    date,
    status: 0,
  };

  cards.push(card);
  return res.status(200).json(card);
});

app.get("/categories", (req, res) => {
  res.status(200).json(DATA.CATEGORIES);
});

app.get("/tags", (req, res) => {
  res.status(200).json(DATA.TAGS);
});

app.get("/appointments", (req, res) => {
  return res.status(200).json(appointments);
});

app.get("/appointments/:id", (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ error: "Не предоставлен appointment.id" });

  const appointment = appointments.find((s) => s.id === id);
  if (!appointment)
    return res
      .status(404)
      .json({ error: "Группа встреч с таким ID не найдена" });

  return res.status(200).json(appointment);
});

app.get("/appointments/byCard/:id", (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Не предоставлен card.id" });

  const appointment = appointments.find(
    (appointment) => !!appointment.cards.find((card) => card.id === id)
  );
  if (!appointment)
    return res
      .status(404)
      .json({ error: "Не найдена группа встреч с такой записью в ней" });

  return res.status(200).json(appointment);
});

// middlewares

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Ошибка на сервере." });
});

app.use((req, res, next) => {
  return res.status(404).json({ error: "Страница не найдена" });
});

app.listen(5000, () => {
  console.log("JSON Server is running on port 5000");
});
