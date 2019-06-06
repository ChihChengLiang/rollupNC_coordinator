import config from '../config/config.js';
import knex from '../DB/dbClient.js'


// class transaction
export default class ProcessedTx {
  constructor(
    _index, _txHash, _txRoot, _stateRoot,
    _fromX, _fromY, _toX, _toY,
    _tokenType, _amount
    ) {
    this.index = _index;
    this.txHash = _txHash;
    this.txRoot = _txRoot;
    this.stateRoot = _stateRoot;
    this.fromX = _fromX
    this.fromY = _fromY
    this.toX = _toX
    this.toY = _toY
    this.tokenType = _tokenType
    this.amount = _amount
  }

  async save() {
    // var res = knex('tx').insert([this.fromX, this.fromY, this.toX, this.toY, this.tokenType, this.amount, this.sig])
    var result = await knex('processed_tx').insert({
      index: this.index,
      txHash: this.txHash,
      txRoot: this.txRoot,
      stateRoot: this.stateRoot,
      fromX: this.fromX,
      fromY: this.fromY,
      toX: this.toX,
      toY: this.toY,
      tokenType: this.tokenType,
      amount: this.amount
    })
    return result
  }

  async read() {
    var processed_txs = await knex.select().from('processed_tx')
    return processed_txs
  }
}
