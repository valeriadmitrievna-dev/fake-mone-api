const { isSameDay, isBefore, isAfter } = require("date-fns");
const { faker } = require("@faker-js/faker");
const DATA = require("./data");

module.exports = {
  // appointments: Appointment[]; masters: string[]; date: Date
  getAppointmentsForGroup: (appointments, masters, date) => {
    const appointmentsByDate = appointments.filter((a) =>
      isSameDay(new Date(a.date), date)
    );

    if (!appointmentsByDate.length) return [];

    const groupedByMasters = masters.map((master) => {
      return {
        date,
        master,
        appointments: appointmentsByDate.filter(
          (appointment) => appointment.master.id === master
        ),
      };
    });

    return groupedByMasters;
  },

  // appointments: Appointment[]; master: string; dates: Date[]
  getAppointmentsForDate: (appointments, master, dates) => {
    const appointmentsByMaster = appointments.filter(
      (appointment) => appointment.master.id === master
    );

    if (!appointmentsByMaster.length) return [];

    const groupedByMasters = dates.map((date) => {
      return {
        date,
        master,
        appointments: appointmentsByMaster.filter((appointment) =>
          isSameDay(new Date(appointment.date), new Date(date))
        ),
      };
    });

    return groupedByMasters;
  },

  // appointments: Appointment[]; count: number
  getAppointmentsForClient: (appointments, count) => {
    const sortedAppointments = appointments.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    const lastAppointment = sortedAppointments
      .filter((a) => isBefore(new Date(a.date), new Date()))
      .at(-1);
    const appointmentsAfterNow = sortedAppointments
      .filter((a) => isAfter(new Date(a.date), new Date()))
      .slice(0, count);

    return { lastAppointment, appointmentsAfterNow };
  },
};
