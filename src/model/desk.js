// Desk model (in-memory)
class Desk {
  constructor(id, isAvailable = true, reservedBy = null) {
    this.id = id;
    this.isAvailable = isAvailable;
    this.reservedBy = reservedBy;
  }
}

module.exports = Desk;
