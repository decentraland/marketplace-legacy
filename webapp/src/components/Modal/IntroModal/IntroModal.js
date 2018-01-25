import React from 'react'

import BaseModal from '../BaseModal'
import Icon from 'components/Icon'
import Button from 'components/Button'

import './IntroModal.css'

export default class IntroModal extends React.PureComponent {
  static propTypes = {
    ...BaseModal.propTypes
  }

  render() {
    const { onClose, ...props } = this.props

    return (
      <BaseModal className="IntroModal modal-lg" onClose={onClose} {...props}>
        <div className="banner">
          <h2>
            <Icon name="decentraland" /> Welcome to the LAND Manager
          </h2>
        </div>

        <div className="modal-body">
          <div className="text">
            <h3>Terms & Conditions</h3>
            <h4>Acceptance of terms</h4>
            <p>
              Decentraland provides a platform for managing cryptographic tokens
              representing land in a virtual world (the “LAND Manager”),
              allowing users to interact with the LAND contract hosted on the
              Ethereum blockchain through their provided wallet software, also
              known as the piece of software providing the Web3 interface (the
              “Web3 Provider”), i.e. the MetaMask browser plugin, the USB
              interface for Ledger Wallet, or by means of visiting the website
              using the Mist browser. The user is fully in control over what
              transactions they approve, through their Web3 Provider. The Site,
              and any other features, tools, materials, or other services
              offered from time to time by Decentraland are referred to here as
              the “Service.” Please read these Terms of Use (the “Terms” or
              “Terms of Use”) carefully before using the Service. By using or
              otherwise accessing the Services, or clicking to accept or agree
              to these Terms where that option is made available, you (1) accept
              and agree to these Terms (2) consent to the collection, use,
              disclosure and other handling of information as described in our
              Privacy Policy and (3) any additional terms, rules and conditions
              of participation issued by Decentraland from time to time. If you
              do not agree to the Terms, then you may not access or use the
              Content or Services.
            </p>

            <h4>Modification of Terms of Use</h4>
            <p>
              Except for Section 14, providing for binding arbitration and
              waiver of class action rights, Decentraland reserves the right, at
              its sole discretion, to modify or replace the Terms of Use at any
              time. The most current version of these Terms will be posted on
              our Site. You shall be responsible for reviewing and becoming
              familiar with any such modifications. Use of the Services by you
              after any modification to the Terms constitutes your acceptance of
              the Terms of Use as modified.
            </p>

            <h4>Eligibility</h4>
            <p>
              You hereby represent and warrant that you are fully able and
              competent to enter into the terms, conditions, obligations,
              affirmations, representations and warranties set forth in these
              Terms and to abide by and comply with these Terms. Decentraland is
              a global platform and by accessing the Content or Services, you
              are representing and warranting that, you are of the legal age of
              majority in your jurisdiction as is required to access such
              Services and Content and enter into arrangements as provided by
              the Service. You further represent that you are otherwise legally
              permitted to use the service in your jurisdiction including owning
              cryptographic tokens of value, and interacting with the Services
              or Content in any way. You further represent you are responsible
              for ensuring compliance with the laws of your jurisdiction and
              acknowledge that Decentraland is not liable for your compliance
              with such laws.
            </p>

            <h3>REPRESENTATIONS, WARRANTIES AND RISKS</h3>
            <h4>Warranty disclaimer</h4>
            <p>
              You expressly understand and agree that your use of the Service is
              at your sole risk. The Service (including the Service and the
              Content) are provided on an “AS IS” and “as available” basis,
              without warranties of any kind, either express or implied,
              including, without limitation, implied warranties of
              merchantability, fitness for a particular purpose or
              non-infringement. You acknowledge that Decentraland has no control
              over, and no duty to take any action regarding: which users gain
              access to or use the Service; what effects the Content may have on
              you; how you may interpret or use the Content; or what actions you
              may take as a result of having been exposed to the Content. You
              release Decentraland from all liability for you having acquired or
              not acquired Content through the Service. Decentraland makes no
              representations concerning any Content contained in or accessed
              through the Service, and Decentraland will not be responsible or
              liable for the accuracy, copyright compliance, legality or decency
              of material contained in or accessed through the Service.
            </p>

            <h4>Sophistication and Risk of Cryptographic Systems</h4>
            <p>
              By utilizing the Service or interacting with the Content or
              platform in any way, you represent that you understand the
              inherent risks associated with cryptographic systems; and warrant
              that you have an understanding of the usage and intricacies of
              native cryptographic tokens, like Ether (ETH) and Bitcoin (BTC),
              smart contract based tokens such as those that follow the Ethereum
              Token Standard (<a href="https://github.com/ethereum/EIPs/issues/20">
                https://github.com/ethereum/EIPs/issues/20
              </a>), and blockchain-based software systems.
            </p>

            <h4>Risk of Regulatory Actions in One or More Jurisdictions</h4>
            <p>
              Decentraland and ETH could be impacted by one or more regulatory
              inquiries or regulatory action, which could impede or limit the
              ability of Decentraland to continue to develop, or which could
              impede or limit your ability to access or use the Service or
              Ethereum blockchain.
            </p>

            <h4>Risk of Weaknesses or Exploits in the Field of Cryptography</h4>
            <p>
              You understand that Ethereum and other blockchain technologies and
              associated currencies or tokens are highly volatile due to many
              factors including but not limited to adoption, speculation,
              technology and security risks. You also acknowledge that the cost
              of transacting on such technologies is variable and may increase
              at any time causing impact to any activities taking place on the
              Ethereum blockchain. You acknowledge these risks and represent
              that Decentraland cannot be held liable for such fluctuations or
              increased costs.
            </p>

            <h4>Application Security</h4>
            <p>
              You acknowledge that Ethereum applications are code subject to
              flaws and acknowledge that you are solely responsible for
              evaluating any code provided by the Services or Content and the
              trustworthiness of any third-party websites, products,
              smart-contracts, or Content you access or use through the Service.
              You further expressly acknowledge and represent that Ethereum
              applications can be written maliciously or negligently, that
              Decentraland cannot be held liable for your interaction with such
              applications and that such applications may cause the loss of
              property or even identity. This warning and others later provided
              by Decentraland in no way evidence or represent an on-going duty
              to alert you to all of the potential risks of utilizing the
              Service or Content.
            </p>

            <h3>Indemnity</h3>
            <p>
              You agree to release and to indemnify, defend and hold harmless
              Decentraland and its parents, subsidiaries, affiliates and
              agencies, as well as the officers, directors, employees,
              shareholders and representatives of any of the foregoing entities,
              from and against any and all losses, liabilities, expenses,
              damages, costs (including attorneys’ fees and court costs) claims
              or actions of any kind whatsoever arising or resulting from your
              use of the Service, your violation of these Terms of Use, and any
              of your acts or omissions that implicate publicity rights,
              defamation or invasion of privacy. Decentraland reserves the
              right, at its own expense, to assume exclusive defense and control
              of any matter otherwise subject to indemnification by you and, in
              such case, you agree to cooperate with Decentraland in the defense
              of such matter.
            </p>

            <h3>Limitation on liability</h3>
            <p>
              YOU ACKNOWLEDGE AND AGREE THAT YOU ASSUME FULL RESPONSIBILITY FOR
              YOUR USE OF THE SITE AND SERVICE. YOU ACKNOWLEDGE AND AGREE THAT
              ANY INFORMATION YOU SEND OR RECEIVE DURING YOUR USE OF THE SITE
              AND SERVICE MAY NOT BE SECURE AND MAY BE INTERCEPTED OR LATER
              ACQUIRED BY UNAUTHORIZED PARTIES. YOU ACKNOWLEDGE AND AGREE THAT
              YOUR USE OF THE SITE AND SERVICE IS AT YOUR OWN RISK. RECOGNIZING
              SUCH, YOU UNDERSTAND AND AGREE THAT, TO THE FULLEST EXTENT
              PERMITTED BY APPLICABLE LAW, NEITHER DECENTRALAND NOR ITS
              SUPPLIERS OR LICENSORS WILL BE LIABLE TO YOU FOR ANY DIRECT,
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, EXEMPLARY
              OR OTHER DAMAGES OF ANY KIND, INCLUDING WITHOUT LIMITATION DAMAGES
              FOR LOSS OF PROFITS, GOODWILL, USE, DATA OR OTHER TANGIBLE OR
              INTANGIBLE LOSSES OR ANY OTHER DAMAGES BASED ON CONTRACT, TORT,
              STRICT LIABILITY OR ANY OTHER THEORY (EVEN IF DECENTRALAND HAD
              BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES), RESULTING FROM
              THE SITE OR SERVICE; THE USE OR THE INABILITY TO USE THE SITE OR
              SERVICE; UNAUTHORIZED ACCESS TO OR ALTERATION OF YOUR
              TRANSMISSIONS OR DATA; STATEMENTS OR CONDUCT OF ANY THIRD PARTY ON
              THE SITE OR SERVICE; ANY ACTIONS WE TAKE OR FAIL TO TAKE AS A
              RESULT OF COMMUNICATIONS YOU SEND TO US; HUMAN ERRORS; TECHNICAL
              MALFUNCTIONS; FAILURES, INCLUDING PUBLIC UTILITY OR TELEPHONE
              OUTAGES; OMISSIONS, INTERRUPTIONS, LATENCY, DELETIONS OR DEFECTS
              OF ANY DEVICE OR NETWORK, PROVIDERS, OR SOFTWARE (INCLUDING, BUT
              NOT LIMITED TO, THOSE THAT DO NOT PERMIT PARTICIPATION IN THE
              SERVICE); ANY INJURY OR DAMAGE TO COMPUTER EQUIPMENT; INABILITY TO
              FULLY ACCESS THE SITE OR SERVICE OR ANY OTHER WEBSITE; THEFT,
              TAMPERING, DESTRUCTION, OR UNAUTHORIZED ACCESS TO, IMAGES OR OTHER
              CONTENT OF ANY KIND; DATA THAT IS PROCESSED LATE OR INCORRECTLY OR
              IS INCOMPLETE OR LOST; TYPOGRAPHICAL, PRINTING OR OTHER ERRORS, OR
              ANY COMBINATION THEREOF; OR ANY OTHER MATTER RELATING TO THE SITE
              OR SERVICE. SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF
              CERTAIN WARRANTIES OR THE LIMITATION OR EXCLUSION OF LIABILITY FOR
              INCIDENTAL OR CONSEQUENTIAL DAMAGES. ACCORDINGLY, SOME OF THE
              ABOVE LIMITATIONS MAY NOT APPLY TO YOU.
            </p>

            <h3>Our proprietary rights</h3>
            <p>
              All title, ownership and intellectual property rights in and to
              the Service are owned by Decentraland or its licensors. You
              acknowledge and agree that the Service contains proprietary and
              confidential information that is protected by applicable
              intellectual property and other laws. Except as expressly
              authorized by Decentraland, you agree not to copy, modify, rent,
              lease, loan, sell, distribute, perform, display or create
              derivative works based on the Service, in whole or in part.
              Decentraland issues a license for Decentraland, found here.
            </p>

            <h3>Links</h3>
            <p>
              The Service provides, or third parties may provide, links to other
              World Wide Web or accessible sites, applications or resources.
              Because Decentraland has no control over such sites, applications
              and resources, you acknowledge and agree that Decentraland is not
              responsible for the availability of such external sites,
              applications or resources, and does not endorse and is not
              responsible or liable for any content, advertising, products or
              other materials on or available from such sites or resources. You
              further acknowledge and agree that Decentraland shall not be
              responsible or liable, directly or indirectly, for any damage or
              loss caused or alleged to be caused by or in connection with use
              of or reliance on any such content, goods or services available on
              or through any such site or resource.
            </p>

            <h3>Termination and suspension</h3>
            <p>
              Decentraland may terminate or suspend all or part of the Service
              and your Decentraland access immediately, without prior notice or
              liability, if you breach any of the terms or conditions of the
              Terms. Upon termination of your access, your right to use the
              Service will immediately cease. The following provisions of the
              Terms survive any termination of these Terms: INDEMNITY; WARRANTY
              DISCLAIMERS; LIMITATION ON LIABILITY; OUR PROPRIETARY RIGHTS;
              LINKS; TERMINATION; NO THIRD PARTY BENEFICIARIES; BINDING
              ARBITRATION AND CLASS ACTION WAIVER; GENERAL INFORMATION.
            </p>

            <h3>No third party beneficiaries</h3>
            <p>
              You agree that, except as otherwise expressly provided in these
              Terms, there shall be no third party beneficiaries to the Terms.
            </p>
          </div>

          <div className="get-started">
            <Button type="primary" onClick={onClose}>
              Get Started
            </Button>
          </div>
        </div>
      </BaseModal>
    )
  }
}
