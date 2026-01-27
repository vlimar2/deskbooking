const deskService = require('../service/deskService');

exports.listAvailable = (req, res) => {
  const desks = deskService.listAvailableDesks();
  res.json(desks);
};

exports.reserve = (req, res) => {
  const deskId = parseInt(req.body.deskId);
  if (!deskId) return res.status(400).json({ error: 'Missing deskId' });
  const desk = deskService.reserveDesk(deskId, req.user.id);
  if (!desk) return res.status(404).json({ error: 'Desk not available' });
  res.json(desk);
};
