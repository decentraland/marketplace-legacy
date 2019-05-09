import { ReqQueryParams } from './ReqQueryParams'

export class BlockchainEventsReqQueryParams {
  constructor(req) {
    this.reqQueryParams = new ReqQueryParams(req)
  }

  sanitize() {
    return {
      address: this.getContractAddress(),
      name: this.getEventName(),
      args: this.getArgs(),
      fromBlock: this.getFromBlock(),
      toBlock: this.getToBlock()
    }
  }

  getContractAddress() {
    return this.reqQueryParams.get('address', '')
  }

  getEventName() {
    return this.reqQueryParams.get('name', '')
  }

  getArgs() {
    return JSON.parse(this.reqQueryParams.get('args', '[]')).map(arg => {
      if (arg.name === 'value') {
        // If the value is 1e+10 will appear as 1 e10. We need to replace that empty space to +
        arg.value = arg.value.replace(' ', '+')
      }

      return arg
    })
  }

  getFromBlock() {
    return this.reqQueryParams.get('from_block', 0)
  }

  getToBlock() {
    return this.reqQueryParams.get('to_block', 'latest')
  }
}
