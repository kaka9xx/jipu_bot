const users = new Map();

module.exports = {
  async findOrCreate(userId) {
    if (!users.has(userId)) {
      users.set(userId, { id: userId, tokens: 0, lastClaim: null });
    }
    return users.get(userId);
  },

  async save(user) {
    users.set(user.id, user);
    return user;
  },

  async remove(userId) {
    users.delete(userId);
  }
};
