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
let appointments = require("./appointments");

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

app.get("/clients/:id/appointments", (req, res) => {
  const { id } = req.params;
  const { count = 5 } = req.query;
  if (!id) return res.status(400).json({ error: "Не предоставлен client.id" });

  const client = DATA.CLIENTS.find((s) => s.id === id);
  if (!client)
    return res.status(404).json({ error: "Клиент с таким ID не найден" });

  const appointmentsByClient = appointments.filter((a) => a.client.id === id);
  const result = dataHelpers.getAppointmentsForClient(
    appointmentsByClient,
    count
  );

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

app.get("/appointments", (req, res) => {
  return res.status(200).json(appointments);
});

app.get("/appointments/group", (req, res) => {
  const { masters = [], date = new Date() } = req.query;

  const columns = dataHelpers.getAppointmentsForGroup(
    appointments,
    masters,
    new Date(date)
  );

  return res.status(200).json(columns);
});

app.get("/appointments/master", (req, res) => {
  const { master, dates = [] } = req.query;

  const columns = dataHelpers.getAppointmentsForDate(
    appointments,
    master,
    dates
  );

  return res.status(200).json(columns);
});

app.get("/appointments/:id", (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ error: "Не предоставлен appointment.id" });

  const appointment = appointments.find((a) => a.id === id);
  if (!appointment)
    return res.status(404).json({ error: "Встреча с таким ID не найдена" });

  return res.status(200).json(appointment);
});

app.put("/appointments/:id", (req, res) => {
  const { id } = req.params;
  const newAppointment = req.body;

  const appointment = appointments.find((appointment) => appointment.id === id);
  if (!appointment)
    return res.status(404).json({ error: "Встреча с таким ID не найдена" });

  appointments = appointments.map((a) => {
    if (a.id === id) {
      return { ...a, ...newAppointment };
    }

    return a;
  });

  return res.status(200).json({
    previous: appointment,
    new: newAppointment,
  });
});

app.post("/appointments", (req, res) => {
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

  const appointment = {
    id: faker.datatype.uuid(),
    client,
    master,
    services,
    duration: duration || utils.getFullDuration(services),
    date,
    status: 0,
  };

  appointments.push(appointment);
  return res.status(200).json(appointment);
});

app.get("/categories", (req, res) => {
  res.status(200).json(DATA.CATEGORIES);
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
