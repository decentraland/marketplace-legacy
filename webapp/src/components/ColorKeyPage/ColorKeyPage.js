import React from 'react'

import { locations } from 'locations'
import { Button } from 'semantic-ui-react'
import StaticPage from 'components/StaticPage'

import './ColorKeyPage.css'

export default function ColorKey() {
  return (
    <StaticPage className="ColorKeyPage">
      <h2>LAND manager color key</h2>

      <div className="message">
        <div className="land-color-keys">
          <div className="land">
            <div className="key my-parcels" />
            <div className="text">YOURS</div>
          </div>
          <div className="land">
            <div className="key taken" />
            <div className="text">TAKEN</div>
          </div>
          <div className="land">
            <div className="key district" />
            <div className="text">DISTRICT</div>
          </div>
          <div className="land">
            <div className="key contribution" />
            <div className="text">CONTRIBUTION</div>
          </div>
          <div className="land">
            <div className="key roads" />
            <div className="text">ROADS</div>
          </div>
          <div className="land">
            <div className="key plaza" />
            <div className="text">PLAZA</div>
          </div>
          <div className="land">
            <div className="key unowned" />
            <div className="text">UNOWNED</div>
          </div>
          <div className="land">
            <div className="key loading" />
            <div className="text">LOADING</div>
          </div>
        </div>
      </div>

      <Button as="a" href={locations.root} primary={true}>
        GO BACK
      </Button>
    </StaticPage>
  )
}
