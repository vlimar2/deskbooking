const { desks } = require('../model/db');
const Desk = require('../model/desk');

function listAvailableDesks() {
  return desks.filter(d => d.isAvailable);
}

function reserveDesk(deskId, userId) {
  const desk = desks.find(d => d.id === deskId && d.isAvailable);
  if (!desk) return null;
  desk.isAvailable = false;
  desk.reservedBy = userId;
  return desk;
}

function seedDesks(count = 10) {
  for (let i = 1; i <= count; i++) {
    desks.push(new Desk(i));
  }
}

module.exports = { listAvailableDesks, reserveDesk, seedDesks };
