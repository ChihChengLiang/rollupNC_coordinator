import config from '../config/config.js';
import knex from '../DB/dbClient.js'

export default class Update{
    constructor(_pubkey_x, _pubkey_y, _balance_delta, _nonce_delta){
        this.pubkey_x = _pubkey_x,
        this.pubkey_y = _pubkey_y,
        this.balance_delta = _balance_delta,
        this._nonce_delta = _nonce_delta
    }

    async save(){
        var result = await knex('accounts').where('pubkeyX', this.pubkey_x)
        .increment('balance', this.balance_delta)
        .increment('nonce', this._nonce_delta)
        return result;
    }
}