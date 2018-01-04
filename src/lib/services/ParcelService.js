import { ParcelState } from '../models'
import { Project } from '../models'

class ParcelService {
  constructor() {
    this.ParcelState = ParcelState
    this.Project = Project
  }
}

export default ParcelService
