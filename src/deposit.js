import config from '../config/config.js';
import knex from '../DB/dbClient.js'


// class transaction
export default class Deposit {
  constructor(_pubkeyX, _pubkeyY, _amount, _tokenType) {
    this.pubkeyX = _pubkeyX;
    this.pubkeyY = _pubkeyY;
    this.amount = _amount
    this.tokenType = _tokenType;
  }

  async save() {
      var result = await knex('deposits').insert({
          pubkeyX: this.pubkeyX,
          pubkeyY: this.pubkeyY,
          amount: this.amount,
          tokenType: this.tokenType
      })
      return result
  }
}