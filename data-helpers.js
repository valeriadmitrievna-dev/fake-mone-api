const { isSameDay, isBefore, isAfter } = require("date-fns");
const { faker } = require("@faker-js/faker");
const DATA = require("./data");

module.exports = {
  // cards: Card[]; masters: string[]; date: Date
  getCardsForGroup: (cards, masters, date) => {
    const cardsByDate = cards.filter((a) => isSameDay(new Date(a.date), date));

    if (!cardsByDate.length) return [];

    const groupedByMasters = masters.map((master) => {
      return {
        date,
        master,
        cards: cardsByDate.filter((card) => card.master.id === master),
      };
    });

    return groupedByMasters;
  },

  // cards: Card[]; master: string; dates: Date[]
  getCardsForDate: (cards, master, dates) => {
    const cardsByMaster = cards.filter((card) => card.master.id === master);

    if (!cardsByMaster.length) return [];

    const groupedByMasters = dates.map((date) => {
      return {
        date,
        master,
        cards: cardsByMaster.filter((card) =>
          isSameDay(new Date(card.date), new Date(date))
        ),
      };
    });

    return groupedByMasters;
  },

  // cards: Card[]; count: number
  getCardsForClient: (cards, count) => {
    const sortedCards = cards.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    const last = sortedCards
      .filter((a) => isBefore(new Date(a.date), new Date()))
      .at(-1);
    const upcoming = sortedCards
      .filter((a) => isAfter(new Date(a.date), new Date()))
      .slice(0, count);

    return { last, upcoming };
  },
};
