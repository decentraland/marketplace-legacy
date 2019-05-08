import { Doctor } from './Doctor'
import { Diagnosis } from './Diagnosis'
import { BlockchainEvent } from '../../src/BlockchainEvent'
import { eventNames } from '../../src/ethereum'

export class ApprovalDoctor extends Doctor {
  async diagnose() {
    return new ApprovalDiagnosis()
  }
}

export class ApprovalDiagnosis extends Diagnosis {
  constructor() {
    super()
    this.faultyAssets = []
    this.fromBlock = 0
  }

  async getFaultyAssets() {
    return this.faultyAssets
  }

  hasProblems() {
    // Always run this doctor.
    // There is no way to check if a specific approval is missing because of how the contract
    // stores those mappings
    return true
  }

  async prepare(fromBlock) {
    this.fromBlock = fromBlock || 0

    return Promise.all([
      BlockchainEvent.deleteByName(eventNames.ApprovalForAll, fromBlock),
      BlockchainEvent.deleteByName(eventNames.UpdateManager, fromBlock)
    ])
  }

  async doTreatment() {
    const { fromBlock } = this

    const [approvalForAllEvents, updateManagerEvents] = await Promise.all([
      BlockchainEvent.findByName(eventNames.ApprovalForAll, fromBlock),
      BlockchainEvent.findByName(eventNames.UpdateManager, fromBlock)
    ])

    await this.replayEvents([...approvalForAllEvents, ...updateManagerEvents])
  }
}
