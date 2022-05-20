const { relatorys } = require('../models')

module.exports = class RelatorysRepository {
  constructor () {
    return {
      name: 'relatory',
      functions: {
        create: this.create,
        getByUserId: this.getByUserId,
        updateActionsByUserId: this.updateActionsByUserId,
        deleteByUserId: this.deleteByUserId
      }
    }
  }

  async create (newRelatory) {
    return await relatorys.create(newRelatory)
  }

  async getByUserId (userid) {
    return await relatorys.findOne({ where: { userid } })
  }

  async updateActionsByUserId (userid, newAction) {
    return await relatorys.update({ actions: newAction }, { where: { userid } })
  }

  async deleteByUserId (userid) {
    return await relatorys.destroy({ where: { userid } })
  }
}
