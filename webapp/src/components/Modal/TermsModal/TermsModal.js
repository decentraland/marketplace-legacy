import React from 'react'

import { localStorage } from 'lib/localStorage'

import BaseModal from '../BaseModal'
import Icon from 'components/Icon'
import Button from 'components/Button'

import './TermsModal.css'

export default class TermsModal extends React.PureComponent {
  static propTypes = {
    ...BaseModal.propTypes
  }

  constructor(props) {
    super(props)
    this.state = {
      acceptedTerms: false
    }
  }

  handleOnClose = () => {
    if (this.state.acceptedTerms) {
      this.props.onClose()
      localStorage.setItem('seenTermsModal', new Date().getTime())
    }
  }

  onAgree = () => {
    this.setState({ acceptedTerms: true }, this.handleOnClose)
  }

  render() {
    return (
      <BaseModal
        className="TermsModal modal-lg"
        {...this.props}
        onClose={this.handleOnClose}
      >
        <div className="banner">
          <h2>
            <Icon name="decentraland" /> Welcome to the LAND Manager
          </h2>
        </div>

        <div className="modal-body">
          <div className="text">
            <h2>Terms & Conditions</h2>
            <h4>1. Acceptance of terms</h4>
            <p>
              Decentraland provides this “LAND Manager” as a platform for
              managing cryptographic ownership in the virtual world, allowing
              users to control transactions which are then recorded in the
              ownership contract hosted on the Ethereum blockchain. The LAND
              Manager, and any other features, tools, materials, or other
              services offered from time to time by Decentraland are referred to
              herein as the “Service.” Please read these Terms of Use (the
              “Terms” or “Terms of Use”) carefully before using the Service. By
              using or otherwise accessing the Services, you (1) accept and
              agree to be bound by these Terms (2) consent to the collection,
              use, disclosure and other handling of information as described in
              our Privacy Policy, available at (
              <a href="https://land.decentraland.org/privacy">
                https://land.decentraland.org/privacy
              </a>) and (3) any additional terms, rules and conditions of
              participation issued by Decentraland from time to time. If you do
              not agree to the Terms, then you must not access or use the
              Service.
            </p>

            <h4>2. Beta Disclaimer and Modification of Terms of Use</h4>
            <p>
              The LAND Manager is still in testing phase and is provided on an
              “as is” and “as available” basis and may contain defects and
              software bugs. You are advised to safeguard important data,
              property and content, to use caution, and to not rely in any way
              on the correct or secure functionality or performance of the
              Service and the LAND Manager. Except for Section 17, providing for
              binding arbitration and waiver of class action rights,
              Decentraland reserves the right, at its sole discretion, to modify
              or replace the Terms of Use at any time. The most current version
              of these Terms will be posted on our Site. You shall be
              responsible for reviewing and becoming familiar with any such
              modifications. Use of the Services by you after any modification
              to the Terms constitutes your acceptance of the Terms of Use as
              modified.
            </p>

            <h4>3. Eligibility</h4>
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
              acknowledge that Decentraland is not liable for your compliance or
              failure to comply with such laws.
            </p>

            <h4>4. Account Access and Security</h4>
            <p>
              Access to the LAND Manager is provided via a third party private
              key manager selected by you (e.g., a Web3 Provider, Metamask, a
              USB interface for Ledger Wallet, the Mist browser, or other).
              Security and secure access to each account in the LAND Manager is
              provided solely by the third party private key manager you select
              to administer your private key. You and the third party private
              key manager you select are entirely responsible for security
              related to access of the LAND Manager. Decentraland bears no
              responsibility for any breach of security or unauthorized access
              to your account. You are advised to: (a) avoid any use of the same
              password with your selected third party private key manager that
              you have ever used outside of the third party private key manager;
              and (b) keep your password and any related secret information
              secure and confidential and do not share them with anyone else.
              Decentraland cannot and will not be liable for any loss or damage
              arising from your sharing or other loss of your private key or
              related information, or any other damage or loss arising from
              unauthorized access to your LAND Manager account. Transactions
              that take place using the Service are confirmed and managed via
              the Ethereum blockchain. You understand that your Ethereum public
              address will be made publicly visible whenever you engage in a
              transaction using the Service.
            </p>

            <h3>5. REPRESENTATIONS AND RISKS</h3>
            <h4>5.1 Disclaimer</h4>
            <p>
              You acknowledge and agree that your use of the Service is at your
              sole risk. The Service is provided on an “AS IS” and “as
              available” basis, without warranties of any kind, either express
              or implied, including, without limitation, implied warranties of
              merchantability, fitness for a particular purpose or
              non-infringement. You acknowledge and agree that Decentraland has
              no control over, and no duty to take any action regarding: which
              users gain access to or use the Service; what effects the Service
              may have on you; the land you own; how you may interpret or use
              the Service; or what actions you may take or fail to take as a
              result of having been exposed to the Service. You release
              Decentraland from all liability for your inability to access to
              the Service or any content therein. Decentraland is not and cannot
              be responsible for and makes no representations, warranties or
              covenants concerning any content contained in or accessed through
              the Service, and Decentraland will not be responsible or liable
              for the accuracy, copyright compliance, legality or decency of
              material contained in or accessed through the Service.
            </p>

            <h4>5.2 Sophistication and Risk of Cryptographic Systems</h4>
            <p>
              By utilizing the Service or interacting with the Service or
              platform or anything contained or provided therein in any way, you
              represent that you understand the inherent risks associated with
              cryptographic systems; and warrant that you have an understanding
              of the usage and intricacies of native cryptographic tokens, like
              Ether (ETH) and Bitcoin (BTC), smart contract based tokens such as
              those that follow the Ethereum Token Standard (<a href="https://github.com/ethereum/EIPs/issues/20">
                https://github.com/ethereum/EIPs/issues/20
              </a>), MANA, and blockchain-based software systems.
            </p>

            <h4>5.3 Risk of Regulatory Actions in One or More Jurisdictions</h4>
            <p>
              Decentraland, MANA, LAND, and ETH could be impacted by one or more
              regulatory inquiries or regulatory action, which could impede or
              limit the ability of Decentraland to continue to develop, or which
              could impede or limit your ability to access or use the Service or
              Ethereum blockchain. New regulations or policies may materially
              adversely affect the development of the Decentraland ecosystem,
              and therefore the potential utility or value of land parcels and
              Mana.
            </p>

            <h4>
              5.4 Risk of Weaknesses or Exploits in the Field of Cryptography
            </h4>
            <p>
              You acknowledge and agree that cryptography is a progressing
              field. Advances in code cracking or technical advances such as the
              development of quantum computers may present risks to
              cryptocurrencies, the Service, and the LAND Manager, which could
              result in the theft or loss of your cryptographic tokens or
              property. To the extent possible, Decentraland intends to
              undertake reasonable measures to update the protocol underlying
              the Service to account for any advances in cryptography and to
              incorporate additional security measures that Decentraland should
              become aware of, but Decentraland does not guarantee or otherwise
              represent that Decentraland can provide security for the system.
              By using the Service and the LAND manager, you acknowledge and
              agree to undertake these risks.
            </p>

            <h4>5.5 Volatility of Crypto Currencies</h4>
            <p>
              You acknowledge and agree that MANA, Ether and blockchain
              technologies and associated currencies tokens, and other assets
              are highly volatile due to many factors including but not limited
              to popularity, adoption, speculation, regulation, technology and
              security risks. You also acknowledge and agree that the cost of
              transacting on such technologies is variable and may increase at
              any time causing impact to any activities taking place on the
              Ethereum blockchain. You acknowledge and agree these risks and
              represent that Decentraland cannot be held liable for changes and
              fluctuations in value or increased costs.
            </p>

            <h4>5.6 Application Security</h4>
            <p>
              You acknowledge and agree that the Service and related
              applications are software code and are subject to flaws and
              acknowledge that you are solely responsible for evaluating any
              code provided by the Services or Content and the trustworthiness
              of any third-party websites, products, smart-contracts, or Content
              you access or use through the Service. You further expressly
              acknowledge and agree that Ethereum applications can be written
              maliciously or negligently, that Decentraland cannot be held
              liable for your interaction with such applications and that such
              applications may cause the loss of property or even identity. This
              warning and others later provided by Decentraland in no way
              evidence or represent an on-going duty to alert you to all of the
              potential risks of utilizing the Service.
            </p>

            <p>
              5.7 Decentraland neither owns nor controls MetaMask, Ledger
              Wallet, the Mist browser, Google Chrome, the Ethereum network, any
              Web3 Provider or any other third party site, product, or service
              that you might access, visit, or use for the purpose of enabling
              you to use the various features of the Service. We shall not be
              liable for the acts or omissions of any such third parties, nor
              shall we be liable for any damage that you may suffer as a result
              of your transactions or any other interaction with any such third
              parties.
            </p>

            <p>
              5.8 You are solely responsible for determining what, if any, taxes
              apply to your land parcel related transactions. Decentraland is
              not responsible for determining the taxes that apply to your
              transactions entered through the Service or otherwise involving
              any land parcel.
            </p>

            <p>
              5.9 You acknowledge and agree that the Service does not store,
              send, or receive land parcels. This is because land parcels exist
              only by virtue of the ownership record maintained on the Service’s
              supporting blockchain in the Ethereum network. Any transfer of
              land parcel occurs within the supporting blockchain in the
              Ethereum network, and not within the Service.
            </p>

            <p>
              5.10 There are risks associated with using an Internet-based
              currency, including, but not limited to, the risk of hardware,
              software and Internet connections failure or problems, the risk of
              malicious software introduction, and the risk that third parties
              may obtain unauthorized access to information stored within your
              wallet. You accept and acknowledge that Decentraland will not be
              responsible for any communication failures, disruptions, errors,
              distortions or delays you may experience when using the Ethereum
              network, however caused.
            </p>

            <p>
              5.11 A lack of use or public interest in the creation and
              development of distributed ecosystems could negatively impact the
              development of the Decentraland ecosystem, and therefore the
              potential utility or value of land parcels and Mana.
            </p>

            <p>
              5.12 Upgrades by Ethereum to the Ethereum platform, a hard fork in
              the Ethereum platform, or a change in how transactions are
              confirmed on the Ethereum platform may have unintended, adverse
              effects on the Decentraland ecosystem.
            </p>

            <h4>6. Transactions and Fees</h4>
            <p>
              6.1 If you elect to purchase, trade, or sell a parcel with or from
              other users via the Service, any financial transactions that you
              engage in will be conducted solely through the Ethereum network.
              We will have no insight into or control over these payments or
              transactions, nor do we have the ability to reverse any
              transactions. With that in mind, we will have no liability to you
              or to any third party for any claims or damages that may arise as
              a result of any transactions that you engage in via the Service,
              or any other transactions that you conduct via the Ethereum
              network.
            </p>

            <p>
              6.2 Ethereum requires the payment of a transaction fee (a “Gas
              Fee”) for every transaction that occurs on the Ethereum network.
              The Gas Fee funds the network of computers that run the
              decentralized Ethereum network. This means that you will need to
              pay a Gas Fee for each transaction that occurs via the Service.
            </p>

            <p>
              6.3 As between us, you will be solely responsible to pay any and
              all sales, use, value-added and other taxes, duties, and
              assessments (except taxes on our net income) now or hereafter
              claimed or imposed by any governmental authority (collectively,
              “Taxes”) associated with your use of the Service (including,
              without limitation, any Taxes that may become payable as the
              result of your ownership, or transfer of any parcel). Except for
              income taxes levied on Decentraland, you: (i) will pay or
              reimburse us for all national, federal, state, local or other
              taxes and assessments of any jurisdiction, including value added
              taxes and taxes as required by international tax treaties, customs
              or other import or export taxes, and amounts levied in lieu
              thereof based on charges set, services performed or payments made
              hereunder, as are now or hereafter may be imposed under the
              authority of any national, state, local or any other taxing
              jurisdiction; and (ii) shall not be entitled to deduct the amount
              of any such taxes, duties or assessments from payments made to us
              pursuant to these Terms.
            </p>

            <h4>7. Changes</h4>
            <p>
              We may make changes to the Terms from time to time. When we make
              changes, we will make the updated Terms available through the
              Service and update the “Last Updated” date at the beginning of
              these Terms accordingly. Please check these Terms periodically for
              changes. Any changes to the Terms will apply on the date that they
              are made, and your continued access to or use of the Service after
              the Terms have been updated will constitute your binding
              acceptance of the updates. If you do not agree to any revised
              Terms, you must not access or use the Service.
            </p>

            <h4>8. Children</h4>
            <p>
              You affirm that you are over the age of 13, as the Service is not
              intended for children under 13. IF YOU ARE 13 OR OLDER BUT UNDER
              THE AGE OF 18, OR THE LEGAL AGE OF MAJORITY WHERE YOU RESIDE IF
              THAT JURISDICTION HAS AN OLDER AGE OF MAJORITY, THEN YOU AGREE TO
              REVIEW THESE TERMS WITH YOUR PARENT OR GUARDIAN TO MAKE SURE THAT
              BOTH YOU AND YOUR PARENT OR GUARDIAN UNDERSTAND AND AGREE TO THESE
              TERMS. YOU AGREE TO HAVE YOUR PARENT OR GUARDIAN REVIEW AND ACCEPT
              THESE TERMS ON YOUR BEHALF. IF YOU ARE A PARENT OR GUARDIAN
              AGREEING TO THE TERMS FOR THE BENEFIT OF A CHILD OVER 13, THEN YOU
              AGREE TO AND ACCEPT FULL RESPONSIBILITY FOR THAT CHILD’S USE OF
              THE SERVICE, INCLUDING ALL FINANCIAL CHARGES AND LEGAL LIABILITY
              THAT HE OR SHE MAY INCUR.
            </p>

            <h4>9. Indemnity</h4>
            <p>
              You shall release and indemnify, defend and hold harmless
              Decentraland and its parents, subsidiaries, affiliates and
              agencies, as well as the officers, directors, employees,
              shareholders and representatives of any of the foregoing entities,
              from and against any and all losses, liabilities, expenses,
              damages, costs (including attorneys’ fees and court costs) claims
              or actions of any kind whatsoever arising or resulting from your
              use of the Service, your violation of these Terms of Use, and any
              of your acts or omissions. Decentraland reserves the right, at its
              own expense, to assume exclusive defense and control of any matter
              otherwise subject to indemnification by you and, in such case, you
              agree to cooperate with Decentraland in the defense of such
              matter.
            </p>

            <h4>10. DISCLAIMERS</h4>
            <p>
              10.1 YOU ACKNOWLEDGE AND AGREE THAT YOU ASSUME FULL RESPONSIBILITY
              FOR YOUR USE OF THE SITE AND SERVICE. YOU ACKNOWLEDGE AND AGREE
              THAT ANY INFORMATION YOU SEND OR RECEIVE DURING YOUR USE OF THE
              SITE AND SERVICE MAY NOT BE SECURE AND MAY BE INTERCEPTED OR LATER
              ACQUIRED BY UNAUTHORIZED PARTIES. YOU ACKNOWLEDGE AND AGREE THAT
              YOUR USE OF THE SITE AND SERVICE IS AT YOUR OWN RISK. YOU
              ACKNOWLEDGE AND AGREE THAT THE SERVICE IS PROVIDED “AS IS“ AND “AS
              AVAILABLE“ WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR
              IMPLIED. RECOGNIZING SUCH, YOU ACKNOWLEDGE AND AGREE THAT, TO THE
              FULLEST EXTENT PERMITTED BY APPLICABLE LAW, NEITHER DECENTRALAND
              NOR ITS SUPPLIERS OR LICENSORS WILL BE LIABLE TO YOU FOR ANY
              DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE,
              EXEMPLARY OR OTHER DAMAGES OF ANY KIND, INCLUDING WITHOUT
              LIMITATION DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA OR
              OTHER TANGIBLE OR INTANGIBLE LOSSES OR ANY OTHER DAMAGES BASED ON
              CONTRACT, TORT, STRICT LIABILITY, INFRINGEMENT OF INTELLECTUAL
              PROPERTY OR THEFT OR MISAPPROPRIATION OF PROPERTY OR ANY OTHER
              THEORY (EVEN IF DECENTRALAND HAD BEEN ADVISED OF THE POSSIBILITY
              OF SUCH DAMAGES), RESULTING FROM THE SITE OR SERVICE; THE USE OR
              THE INABILITY TO USE THE SITE OR SERVICE; UNAUTHORIZED ACCESS TO
              OR ALTERATION OF YOUR TRANSMISSIONS OR DATA; STATEMENTS OR CONDUCT
              OF ANY THIRD PARTY ON THE SITE OR SERVICE; ANY ACTIONS WE TAKE OR
              FAIL TO TAKE AS A RESULT OF COMMUNICATIONS YOU SEND TO US; HUMAN
              ERRORS; TECHNICAL MALFUNCTIONS; FAILURES, INCLUDING PUBLIC UTILITY
              OR TELEPHONE OUTAGES; OMISSIONS, INTERRUPTIONS, LATENCY, DELETIONS
              OR DEFECTS OF ANY DEVICE OR NETWORK, PROVIDERS, OR SOFTWARE
              (INCLUDING, BUT NOT LIMITED TO, THOSE THAT DO NOT PERMIT
              PARTICIPATION IN THE SERVICE); ANY INJURY OR DAMAGE TO COMPUTER
              EQUIPMENT; INABILITY TO FULLY ACCESS THE SITE OR SERVICE OR ANY
              OTHER WEBSITE; THEFT, TAMPERING, DESTRUCTION, OR UNAUTHORIZED
              ACCESS TO, IMAGES OR OTHER CONTENT OF ANY KIND; DATA THAT IS
              PROCESSED LATE OR INCORRECTLY OR IS INCOMPLETE OR LOST;
              TYPOGRAPHICAL, PRINTING OR OTHER ERRORS, OR ANY COMBINATION
              THEREOF; OR ANY OTHER MATTER RELATING TO THE SITE OR SERVICE. SOME
              JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES OR
              THE LIMITATION OR EXCLUSION OF LIABILITY FOR INCIDENTAL OR
              CONSEQUENTIAL DAMAGES. ACCORDINGLY, SOME OF THE ABOVE LIMITATIONS
              MAY NOT APPLY TO YOU.
            </p>

            <p>
              10.2 DECENTRALAND HEREBY EXPRESSLY DISCLAIMS, WAIVES, RELEASES AND
              RENOUNCES ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING, WITHOUT
              LIMITATION, ANY WARRANTY OF MERCHANTABILITY, FITNESS FOR A
              PARTICULAR PURPOSE, TITLE, OR NONINFRINGEMENT.
            </p>

            <p>
              10.3 WITHOUT LIMITING THE GENERALITY OF THE FOREGOING, WE, OUR
              SUBSIDIARIES, AFFILIATES, AND LICENSORS DO NOT REPRESENT OR
              WARRANT TO YOU THAT: (I) YOUR ACCESS TO OR USE OF THE SERVICE WILL
              MEET YOUR REQUIREMENTS, (II) YOUR ACCESS TO OR USE OF THE SERVICE
              WILL BE UNINTERRUPTED, TIMELY, SECURE OR FREE FROM ERROR, (III)
              USAGE DATA PROVIDED THROUGH THE SERVICE WILL BE ACCURATE, (III)
              THE SERVICE OR ANY CONTENT, SERVICES, OR FEATURES MADE AVAILABLE
              ON OR THROUGH THE SERVICE ARE FREE OF VIRUSES OR OTHER HARMFUL
              COMPONENTS, OR (IV) THAT ANY DATA THAT YOU DISCLOSE WHEN YOU USE
              THE SERVICE WILL BE SECURE.
            </p>

            <p>
              10.4 YOU ACCEPT THE INHERENT SECURITY RISKS OF PROVIDING
              INFORMATION AND DEALING ONLINE OVER THE INTERNET, AND AGREE THAT
              WE HAVE NO LIABILITY OR RESPONSIBILITY FOR ANY BREACH OF SECURITY
              UNLESS IT IS DUE TO OUR GROSS NEGLIGENCE.
            </p>

            <p>
              10.5 DECENTRALAND WILL NOT BE RESPONSIBLE OR LIABLE TO YOU FOR ANY
              LOSSES YOU INCUR AS THE RESULT OF YOUR USE OF THE ETHEREUM NETWORK
              AND ANY OTHER ELECTRONIC WALLET, INCLUDING BUT NOT LIMITED TO ANY
              LOSSES, DAMAGES OR CLAIMS ARISING FROM: (A) USER ERROR, SUCH AS
              FORGOTTEN PASSWORDS OR INCORRECTLY CONSTRUED SMART CONTRACTS OR
              OTHER TRANSACTIONS; (B) SERVER FAILURE OR DATA LOSS; (C) CORRUPTED
              WALLET FILES; (D) UNAUTHORIZED ACCESS OR ACTIVITIES BY THIRD
              PARTIES, INCLUDING BUT NOT LIMITED TO THE USE OF VIRUSES,
              PHISHING, BRUTEFORCING OR OTHER MEANS OF ATTACK AGAINST THE
              SERVICE, ETHEREUM NETWORK, OR ANY OTHER ELECTRONIC WALLET.
            </p>

            <p>
              10.6 LAND PARCELS ARE INTANGIBLE DIGITAL ASSETS THAT EXIST ONLY BY
              VIRTUE OF THE OWNERSHIP RECORD MAINTAINED IN THE ETHEREUM NETWORK.
              ALL SMART CONTRACTS ARE CONDUCTED AND OCCUR ON THE DECENTRALIZED
              LEDGER WITHIN THE ETHEREUM PLATFORM. WE HAVE NO CONTROL OVER AND
              MAKE NO GUARANTEES OR PROMISES WITH RESPECT TO THE OWNERSHIP
              RECORD OR SMART CONTRACTS.
            </p>

            <p>
              10.7 DECENTRALAND IS NOT RESPONSIBLE FOR LOSSES DUE TO BLOCKCHAIN
              OR ANY OTHER FEATURES OF THE ETHEREUM NETWORK OR ANY OTHER
              ELECTRONIC WALLET, INCLUDING BUT NOT LIMITED TO LATE REPORT BY
              DEVELOPERS OR REPRESENTATIVES (OR NO REPORT AT ALL) OF ANY ISSUES
              WITH THE BLOCKCHAIN SUPPORTING THE ETHEREUM NETWORK, INCLUDING
              FORKS, TECHNICAL NODE ISSUES, OR ANY OTHER ISSUES HAVING FUND
              LOSSES AS A RESULT.
            </p>

            <h4>11. LIMITATION ON LIABILITY</h4>
            <p>
              11.1 YOU UNDERSTAND AND AGREE THAT WE, OUR SUBSIDIARIES,
              AFFILIATES, AND LICENSORS WILL NOT BE LIABLE TO YOU OR TO ANY
              THIRD PARTY FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
              CONSEQUENTIAL, OR EXEMPLARY DAMAGES WHICH YOU MAY INCUR, HOWSOEVER
              CAUSED AND UNDER ANY THEORY OF LIABILITY, INCLUDING, WITHOUT
              LIMITATION, ANY LOSS OF PROFITS (WHETHER INCURRED DIRECTLY OR
              INDIRECTLY), LOSS OF GOODWILL OR BUSINESS REPUTATION, LOSS OF
              DATA, COST OF PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES, OR ANY
              OTHER INTANGIBLE LOSS, EVEN IF WE HAVE BEEN ADVISED OF THE
              POSSIBILITY OF SUCH DAMAGES.
            </p>

            <p>
              11.2 YOU AGREE THAT OUR TOTAL, AGGREGATE LIABILITY TO YOU FOR ANY
              AND ALL CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR YOUR
              ACCESS TO OR USE OF (OR YOUR INABILITY TO ACCESS OR USE) ANY
              PORTION OF THE SERVICE, WHETHER IN CONTRACT, TORT, STRICT
              LIABILITY, OR ANY OTHER LEGAL THEORY, IS LIMITED TO THE AMOUNT OF
              GREATER OF (A) THE AMOUNTS YOU ACTUALLY PAID US UNDER THESE TERMS
              IN THE 12 MONTH PERIOD PRECEDING THE DATE THE CLAIM AROSE, OR (B)
              $100.
            </p>

            <p>
              11.3 YOU ACKNOWLEDGE AND AGREE THAT WE HAVE MADE THE SERVICE
              AVAILABLE TO YOU AND ENTERED INTO THESE TERMS IN RELIANCE UPON THE
              WARRANTY DISCLAIMERS AND LIMITATIONS OF LIABILITY SET FORTH
              HEREIN, WHICH REFLECT A REASONABLE AND FAIR ALLOCATION OF RISK
              BETWEEN THE PARTIES AND FORM AN ESSENTIAL BASIS OF THE BARGAIN
              BETWEEN US. WE WOULD NOT BE ABLE TO PROVIDE THE SERVICE TO YOU
              WITHOUT THESE LIMITATIONS.
            </p>

            <p>
              11.4 SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION
              OF INCIDENTAL OR CONSEQUENTIAL DAMAGES, AND SOME JURISDICTIONS
              ALSO LIMIT DISCLAIMERS OR LIMITATIONS OF LIABILITY FOR PERSONAL
              INJURY FROM CONSUMER PRODUCTS, SO THE ABOVE LIMITATIONS MAY NOT
              APPLY TO PERSONAL INJURY CLAIMS.
            </p>

            <h4>12. Our Proprietary Rights</h4>
            <p>
              12.1 All title, ownership and intellectual property rights in and
              to the Service are owned exclusively by Decentraland or its
              licensors. You acknowledge and agree that the Service contains
              proprietary and confidential information that is protected by
              applicable intellectual property and other laws. Except as
              expressly authorized by Decentraland, you agree not to copy,
              modify, rent, lease, loan, sell, distribute, perform, display or
              create derivative works based on the Service, in whole or in part.
              Decentraland’s exclusive ownership shall include all elements of
              the Service, and all intellectual property rights therein. The
              visual interfaces, graphics (including, without limitation, all
              art and drawings associated with Service), design, systems,
              methods, information, computer code, software, services, “look and
              feel”, organization, compilation of the content, code, data, and
              all other elements of the Service (collectively, the “Decentraland
              Materials”) are owned by Decentraland, and are protected by
              copyright, trade dress, patent, and trademark laws, international
              conventions, other relevant intellectual property and proprietary
              rights, and applicable laws. All Decentraland Materials are the
              copyrighted property of Decentraland or its licensors, and all
              trademarks, service marks, and trade names contained in the
              Decentraland Materials are proprietary to Decentraland or its
              licensors. Except as expressly set forth herein, your use of the
              Service does not grant you ownership of or any other rights with
              respect to any content, code, data, or other materials that you
              may access on or through the Service. We reserve all rights in and
              to the Decentraland Materials not expressly granted to you in the
              Terms. For the sake of clarity, you understand and agree: (i) that
              any “purchase” of a parcel, whether via the Service or otherwise,
              does not give you any rights or licenses in or to the Decentraland
              Materials (including, without limitation, our copyright in and to
              the art and drawings associated with the Service and content
              therein) other than those expressly contained in these Terms; and
              (ii) that you do not have the right to reproduce, distribute, or
              otherwise commercialize any elements of the Decentraland Materials
              (including, without limitation, our copyright in and to the art
              and drawings associated with the Service and content therein) in
              any way without our prior written consent in each case, which
              consent we may withhold in our sole and absolute discretion.
            </p>

            <p>
              12.2 You may choose to submit comments, bug reports, ideas or
              other feedback about the Service, including without limitation
              about how to improve the Service (collectively, “Feedback”). By
              submitting any Feedback, you agree that we are free to use such
              Feedback at our discretion and without additional compensation to
              you, and to disclose such Feedback to third parties (whether on a
              non-confidential basis, or otherwise). You hereby grant us a
              perpetual, irrevocable, nonexclusive, worldwide license under all
              rights necessary for us to incorporate and use your Feedback for
              any purpose.
            </p>

            <p>
              12.3 You acknowledge and agree that you are responsible for your
              own conduct while accessing or using the Service, and for any
              consequences thereof. You agree to use the Service only for
              purposes that are legal, proper and in accordance with these Terms
              and any applicable laws or regulations. By way of example, and not
              as a limitation, you may not, and may not allow any third party
              to: (i) send, upload, distribute or disseminate any unlawful,
              defamatory, harassing, abusive, fraudulent, obscene, or otherwise
              objectionable content; (ii) distribute viruses, worms, defects,
              Trojan horses, corrupted files, hoaxes, or any other items of a
              destructive or deceptive nature; (iii) impersonate another person
              (via the use of an email address or otherwise); (iv) upload, post,
              transmit or otherwise make available through the Service any
              content that infringes the intellectual proprietary rights of any
              party; (v) use the Service to violate the legal rights (such as
              rights of privacy and publicity) of others; (vi) engage in,
              promote, or encourage illegal activity (including, without
              limitation, money laundering); (vii) interfere with other users’
              enjoyment of the Service; (viii) exploit the Service for any
              unauthorized commercial purpose; (ix) modify, adapt, translate, or
              reverse engineer any portion of the Service; (x) remove any
              copyright, trademark or other proprietary rights notices contained
              in or on the Service or any part of it; (xi) reformat or frame any
              portion of the Service; (xii) display any content on the Service
              that contains any hate-related or violent content or contains any
              other material, products or services that violate or encourage
              conduct that would violate any criminal laws, any other applicable
              laws, or any third party rights; or (xiii) use any robot, spider,
              site search/retrieval application, or other device to retrieve or
              index any portion of the Service or the content posted on the
              Service, or to collect information about its users for any
              unauthorized purpose.; (xiv) create user accounts by automated
              means or under false or fraudulent pretenses; or (xv) access or
              use the Service for the purpose of creating a product or service
              that is competitive with any of our products or services.
            </p>

            <h4>13. Links</h4>
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

            <h4>14. Termination and suspension</h4>
            <p>
              You shall have a right to terminate these Terms at any time by
              canceling and discontinuing your access to and use of the Service.
              Decentraland may terminate or suspend all or part of the Service
              and your Decentraland access immediately, without prior notice or
              liability. You agree that any suspension or termination of your
              access to the Service may be without prior notice, and that we
              will not be liable to you or to any third party for any such
              suspension or termination. If we terminate these Terms or suspend
              or terminate your access to or use of the Service due to your
              breach of these Terms or any suspected fraudulent, abusive, or
              illegal activity, then termination of these Terms will be in
              addition to any other remedies we may have at law or in equity.
              Upon any termination or expiration of these Terms, whether by you
              or us, you may no longer have access to information that you have
              posted on the Service or that is related to your account, and you
              acknowledge that we will have no obligation to maintain any such
              information in our databases or to forward any such information to
              you or to any third party. Upon termination of your access, your
              right to use the Service will immediately cease. The following
              provisions of these Terms survive any termination of these Terms:
              REPRESENTATIONS AND RISKS; TRANSACTION AND FEES; INDEMNITY;
              DISCLAIMERS; LIMITATION ON LIABILITY; OUR PROPRIETARY RIGHTS;
              LINKS; TERMINATION AND SUSPENSION; NO THIRD PARTY BENEFICIARIES;
              BINDING ARBITRATION AND CLASS ACTION WAIVER; GENERAL INFORMATION.
            </p>

            <h4>15. No Third Party Beneficiaries</h4>
            <p>
              You agree that, except as otherwise expressly provided in these
              Terms, there shall be no third party beneficiaries to the Terms.
            </p>

            <h4>
              16. Notice and Procedure for Making Claims of Copyright
              Infringement
            </h4>
            <p>
              If you believe that your copyright or the copyright of a person on
              whose behalf you are authorized to act has been infringed, please
              provide Decentraland’s Copyright Agent a written Notice containing
              the following information: · an electronic or physical signature
              of the person authorized to act on behalf of the owner of the
              copyright or other intellectual property interest; · a description
              of the copyrighted work or other intellectual property that you
              claim has been infringed; · a description of where the material
              that you claim is infringing is located on the Service; · your
              address, telephone number, and email address; · a statement by you
              that you have a good faith belief that the disputed use is not
              authorized by the copyright owner, its agent, or the law; · a
              statement by you, made under penalty of perjury, that the above
              information in your Notice is accurate and that you are the
              copyright or intellectual property owner or authorized to act on
              the copyright or intellectual property owner&#39;s behalf.
              Decentraland’s Copyright Agent can be reached at: Email:
              legal@decentraland.org
            </p>

            <h3>17. Binding Arbitration and Class Action Waiver</h3>
            <p>
              PLEASE READ THIS SECTION CAREFULLY – IT MAY SIGNIFICANTLY AFFECT
              YOUR LEGAL RIGHTS, INCLUDING YOUR RIGHT TO FILE A LAWSUIT IN COURT
            </p>

            <h4>17.1 Initial Dispute Resolution</h4>
            <p>
              The parties shall use their best efforts to engage directly to
              settle any dispute, claim, question, or disagreement and engage in
              good faith negotiations which shall be a condition to either party
              initiating a lawsuit or arbitration.
            </p>

            <h4>17.2 Binding Arbitration</h4>
            <p>
              If the parties do not reach an agreed upon solution within a
              period of 30 days from the time informal dispute resolution under
              the Initial Dispute Resolution provision begins, then either party
              may initiate binding arbitration as the sole means to resolve
              claims, subject to the terms set forth below.
            </p>
            <p>
              Specifically, any dispute that is not resolved under the Initial
              Dispute Resolution provision shall be determined by final and
              binding arbitration under the London Court of International
              Arbitration (“LCIA”) Rules, which rules are deemed to be
              incorporated by reference into this clause. The following shall
              apply in respect of such arbitration: (i) the number of
              arbitrators shall be three (one nominated by each party and one
              nominated by the LCIA); (ii) the decision of the arbitrators will
              be binding and enforceable against the parties and a judgment upon
              any award rendered by the arbitrators may be entered in any court
              having jurisdiction thereto (provided that in no event will the
              arbitrator have the authority to make any award that provides for
              punitive or exemplary damages or to award damages excluded by
              these Terms or in excess of the limitations contained in these
              Terms); (iii) the seat, or legal place, of arbitration shall be
              London, England; and (iv) the language to be used in the arbitral
              proceedings shall be English, any documents submitted as evidence
              that are in another language must be accompanied by an English
              translation and the award will be in the English language.
              Claimants and respondents shall bear its or their own costs of the
              arbitration, including attorney&#39;s fees, and share equally the
              arbitrators&#39; fees and LCIA&#39;s administrative costs. For
              purposes of cost sharing, all claimants shall be considered one
              party and all respondents shall be considered one party. The
              parties shall maintain strict confidentiality with respect to all
              aspects of any arbitration commenced pursuant to these Terms and
              shall not disclose the fact, conduct or outcome of the arbitration
              to any non-parties or non-participants, except to the extent
              required by applicable Law or to the extent necessary to
              recognize, confirm or enforce the final award or decision in the
              arbitration, without the prior written consent of all parties to
              the arbitration.
            </p>

            <h4>17.3 Class Action Waiver</h4>
            <p>
              The parties further agree that any arbitration shall be conducted
              in their individual capacities only and not as a class action or
              other representative action, and the parties expressly waive their
              right to file a class action or seek relief on a class basis. YOU
              AND DECENTRALAND AGREE THAT EACH MAY BRING CLAIMS AGAINST THE
              OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY, AND NOT AS A
              PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE
              PROCEEDING. If any court or arbitrator determines that the class
              action waiver set forth in this paragraph is void or unenforceable
              for any reason or that an arbitration can proceed on a class
              basis, then the arbitration provision set forth above shall be
              deemed null and void in its entirety and the parties shall be
              deemed to have not agreed to arbitrate disputes.
            </p>

            <h4>
              17.4 Exception - Litigation of Intellectual Property and Small
              Claims Court Claims
            </h4>
            <p>
              Notwithstanding the parties&#39; decision to resolve all disputes
              through arbitration, either party may bring an action in state or
              federal court to protect its intellectual property rights
              (“intellectual property rights” including patents, copyrights,
              moral rights, trademarks, and trade secrets, but not privacy or
              publicity rights). Either party may also seek relief in a small
              claims court for disputes or claims within the scope of that
              court’s jurisdiction.
            </p>

            <h4>17.5 30-Day Right to Opt Out</h4>
            <p>
              You have the right to opt-out and not be bound by the arbitration
              and class action waiver provisions set forth above by sending
              written notice of your decision to opt-out to the following email
              address:{' '}
              <a href="mailto:legal@decentraland.org">legal@decentraland.org</a>.
              Your notice must be sent within 30 days of your first use of the
              Service, otherwise you shall be bound to arbitrate disputes in
              accordance with the terms of those paragraphs. If you opt-out of
              these arbitration provisions, Decentraland also will not be bound
              by them.
            </p>

            <h4>17.6 Changes to This Section</h4>
            <p>
              Decentraland will provide 60-days’ notice of any changes to this
              section. Changes will become effective on the 60th day, and will
              apply prospectively only to any claims arising after the 60th day.
            </p>

            <p>
              For any dispute not subject to arbitration you and Decentraland
              agree to submit to the personal and exclusive jurisdiction of and
              venue of the High Court in London, under English Law. You further
              agree to accept service of process by mail, and hereby waive any
              and all jurisdictional and venue defenses otherwise available.
            </p>

            <p>
              These Terms and the relationship between you and Decentraland
              shall be governed by the laws of the High Court in London, under
              English Law, without regard to conflict of law provisions.
            </p>

            <h3>18. General Information</h3>
            <h4>18.1 Entire Agreement</h4>
            <p>
              These Terms (and any additional terms, rules and conditions of
              participation that Decentraland may post on the Service)
              constitute the entire agreement between you and Decentraland with
              respect to the Service and supersedes any prior agreements, oral
              or written, between you and Decentraland. In the event of a
              conflict between these Terms and the additional terms, rules and
              conditions of participation, the latter will prevail over the
              Terms to the extent of the conflict.
            </p>

            <h4>18.2 Waiver and Severability of Terms</h4>
            <p>
              The failure of Decentraland to exercise or enforce any right or
              provision of the Terms shall not constitute a waiver of such right
              or provision. If any provision of the Terms is found by an
              arbitrator or court of competent jurisdiction to be invalid, the
              parties nevertheless agree that the arbitrator or court should
              endeavor to give effect to the parties&#39; intentions as
              reflected in the provision, and the other provisions of the Terms
              remain in full force and effect.
            </p>

            <h4>18.3 Statute of Limitations</h4>
            <p>
              You agree that regardless of any statute or law to the contrary,
              any claim or cause of action arising out of or related to the use
              of the Service or the Terms must be filed within one (1) year
              after such claim or cause of action arose or be forever barred.
            </p>

            <h4>18.4 Section Titles</h4>
            <p>
              The section titles in the Terms are for convenience only and have
              no legal or contractual effect.
            </p>

            <h4>18.5 Communications</h4>
            <p>
              Users with questions, complaints or claims with respect to the
              Service may contact us using the relevant contact information set
              forth above and at legal@decentraland.org.
            </p>
          </div>

          <div className="get-started">
            <Button type="primary" onClick={this.onAgree}>
              I AGREE
            </Button>
          </div>
        </div>
      </BaseModal>
    )
  }
}
