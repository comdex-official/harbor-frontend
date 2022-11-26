import { Button, Checkbox, Modal } from "antd";
import React, { useState } from "react";
import "./index.scss";

const TermsModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(
    localStorage.getItem("agreement_accepted") === null
  );

  const [isChecked, setIsChecked] = useState(false);

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Modal
        title="Terms Conditions"
        className="terms-modal"
        closeIcon={false}
        footer={false}
        width={800}
        centered
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="pdf-view">
          <h4 className="mb-0 text-center">Harbor Terms of Use</h4>
          <p className="text-center">Date Last Revised: [22nd Nov 2022]</p>
          <p>
            Please review these Terms of Use of Harbor (the <b>“Terms”</b>)
            carefully, as they set forth legally binding terms and conditions
            between you and the Company that govern your access and/or use of
            (a) the website located at https://harborprotocol.one/ (the{" "}
            <b>“Website”</b>); (b) the Harbor Smart Contracts (as defined
            below); and (c) the Comdex Chain (as defined below) on which the
            Harbor Smart Contracts (as defined below) are deployed, including
            related trademarks, and other intellectual property, whether such
            access and/or use is via (i) the Website <b>(“Website Access”) </b>
            or (ii) command line, locally installed programs, Software
            Development Kits <b>(“SDK”)</b>, software code and blockchain and
            smart contract explorers (collectively <b>“Direct Access”)</b>.
          </p>
          <p>
            For purposes of these Terms, the Website, the Harbor Smart Contracts
            (as defined below) and Comdex Chain (as defined below) shall be
            collectively referred to as <b>“Harbor”</b>.
          </p>
          <p>
            By accessing and/or using Harbor, you (<b>“you”</b> or the{" "}
            <b>“User”</b>) agree to these Terms on behalf of yourself and any
            entity you represent, and you represent and warrant that you have
            the right and authority to do so.
          </p>
          <div className="border-box">
            <p>
              Harbor (which includes the Website, the Harbor Smart Contracts (as
              defined below) and Comdex Chain (as defined below)) are not
              intended for (a) access and/or use by Excluded Persons (as defined
              below); or (b) access and/or use by any person or entity in, or
              accessing or using the Website from, an Excluded Jurisdiction.
            </p>
            <p>
              Accordingly, Excluded Persons (as defined below) should not access
              and/or use Harbor (which includes the Website, the Harbor Smart
              Contracts (as defined below) and Comdex Chain (as defined below)).
            </p>
          </div>

          <p className="mt-3">
            The Website is owned and operated by Comdex Business Ventures Ltd (
            <b>“Company”</b>), an entity formed under the laws of the British
            Virgin Islands and the Harbor Smart Contracts (as defined below) are
            copyrighted works belonging to the Company and/or its Affiliate(s)
            (as defined below) (each of User and Company, a <b>“Party”</b>, and
            collectively, the <b>“Parties”</b>).
          </p>
          <p>
            You acknowledge that you shall be deemed to have accepted these
            Terms by accessing and/or using Harbor– whether by Website Access or
            Direct Access.
          </p>
          <p>
            <b>
              Company reserves the right to change these Terms in its sole
              discretion from time to time. The “Date Last Revised” specified on
              these Terms indicates the date on which the Terms were last
              changed. You will be notified of those changes and given the
              opportunity to review and accept the updated Terms when you next
              access and/or use Harbor. Your acceptance of, and/or your
              continued access and/or use of Harbor following notice of, the
              updated Terms shall indicate your acknowledgement of and agreement
              to be bound by such the updated Terms.
            </b>
          </p>

          <h5>1. Overview of Harbor</h5>
          <ol type="1">
            <li>
              1 Harbor has been developed by Company to enable Users to
              undertake any one or more of the following (“Harbor Activities”) :
              <p className="mt-2">
                <u>Vault module:</u>
              </p>
              <ol type="a">
                <li className="m-4">
                  Users can create and borrow (“Mint”) stablecoins known as
                  “Composite” (“$CMST”) (as described in greater details in the
                  following link:{" "}
                  <a href="https://docs.harborprotocol.one/composite">
                    https://docs.harborprotocol.one/composite
                  </a>
                  ), by depositing sufficient approved assets (“Whitelisted
                  Assets”) as a collateral (“Collateral”) in a Harbor Smart
                  Contract address (known as “Vault”), resulting in a
                  collateralised debt position for the User;
                </li>
                <li>
                  depending on the Whitelisted Asset to be used as Collateral
                  and its respective risk profile, there may be multiple Vault
                  types supporting the same Whitelisted Asset available for
                  Users to choose from;
                </li>
                <li>
                  apart from depositing Whitelisted Asset, Users can swap other
                  supported stablecoin supported by Harbor directly for $CMST
                  (“Stablemint”), rather than borrowing $CMST which will help
                  the $CMST to maintain its peg to US$1, subject to limits as
                  may be imposed by Harbor;
                </li>
                <li>
                  by interacting with Harbor through the Vault module, Users may
                  be charged Transaction Fees (as defined below) that may
                  include a Drawdown Fee Stability Fee, and Stablemint Fee (in
                  respect of a Stablemint transaction) (each as defined below);
                </li>
                <li>
                  <p className="mt-2">
                    <u>Locker module:</u>
                  </p>
                  Users may lock their $CMST into a Harbor Smart Contracts
                  address (“Locker”) on Harbor which allows such Users to earn
                  variable interest (“Locker Stability Rate”) on the value of
                  the $CMST locked;
                </li>
                <li>
                  such Users can withdraw any or all of their $CMST from the
                  Locker at any time;
                </li>
                <li>
                  <p>
                    <u>Liquidation module:</u>
                  </p>
                  when the value of a User's Collateral in the Vault drops
                  either due to a drop in the value of the Collateral or if the
                  net borrowed $CMST (inclusive of interest accrued) increases,
                  resulting in the drop of a collateralization ratio below a
                  predetermined liquidation ratio, Harbor will liquidate the
                  User’s Collateral via auction to recapitalise the $CMST debt
                  to ensure that $CMST is sufficiently collateralised;
                </li>
                <li>
                  to prevent Harbor from liquidating such User’s Collateral, a
                  User may choose to repay $CMST to the Vault to decrease his
                  net borrowing position or deposit more Collateral into the
                  Vault to raise the collateralization ratio before it reaches
                  the predetermined liquidation ratio;
                </li>
                <li>
                  when a User’s Collateral is liquidated through the Liquidation
                  module, Users may be charged a Liquidation Fee (as defined
                  below);
                </li>
                <li>
                  <p>
                    <u>Stake:</u>
                  </p>
                  Users can Stake their Harbor tokens with Harbor in order to
                  obtain tokens known as “veHarbor” (“veHarbor”). The term
                  “Stake” involves a transfer of tokens to a designated Harbor
                  Smart Contracts address and thereafter not transferring such
                  tokens from that designated address;
                </li>
                <li>
                  Users who hold veHarbor will be eligible to vote and
                  participate in governance matters relating to Harbor, receive
                  further incentives, rewards and additional veHarbor emissions
                  as set out in great details at sub-paragraph (l) to (o) below.
                </li>
                <li>
                  <p>
                    <u>Governance:</u>
                  </p>
                  The decision-making capabilities of the Harbor are intended to
                  be managed by Users who hold veHarbor. Users can participate
                  in Harbor’s governance matters, including but not limited to
                  voting on proposals relating to key parameters, such as
                  setting the Whitelisted Assets, Transaction Fees and Locker
                  Stability Rate of the Harbor. The longer a User holds
                  veHARBOR, the more voting power is accorded to such a User.
                </li>
                <li>
                  <p>
                    <u>Vault Voting:</u>
                  </p>
                  Users with veHarbor may vote on their chosen Vaults to
                  determine which Vaults receive Harbor tokens emissions during
                  a particular week. Harbor tokens emissions will be allocated
                  in proportion to the the total number of votes each Vault
                  receives.
                </li>
                <li>
                  <p>
                    <u>Rewards:</u>
                  </p>
                  <p>
                    Users with veHarbor may be entitled to earn further
                    incentives and rewards from the Harbor that may include a
                    share of Stability Fees, Drawdown Fees and Liquidation Fees
                    and such other revenue collected on the Harbor protocol.
                  </p>
                </li>
                <li>
                  <p>
                    <ul>Rebase:</ul>
                  </p>
                  Users with veHarbor may be entitled to receive additional
                  veHarbor distributed by Harbor based on the veHarbor to Harbor
                  ratio (determined by Harbor protocol) such that a User’s
                  holding of veHarbor can remain proportionate to the total
                  supply of veHarbor;
                </li>
              </ol>
            </li>
            <li>
              Harbor enables Users to undertake Harbor Activities through the
              use of smart contracts comprising computer code written based on
              various blockchain standard and programming languages
              (collectively, “Harbor Smart Contracts”) developed and published
              by Company and/or its Affiliate(s) (as defined below) at Github at
              <a href="https://github.com/comdex-official/comdex">
                https://github.com/comdex-official/comdex
              </a>
              .(“Github Page”)
            </li>
            <li>
              For purposes of these Terms:
              <ol type="a">
                <li>
                  “Affiliates” of an entity means the owners, directors,
                  officers, employees, advisors, agents of such entity and
                  companies in which such entity has an interest;
                </li>
                <li>
                  “Comdex Chain” means the blockchain known as Comdex developed
                  based on the Cosmos SDK;
                </li>
                <li>
                  “Harbor Documentation” means the document repository on Harbor
                  accessible at
                  <a href="https://docs.harborprotocol.one/">
                    https://docs.harborprotocol.one/
                  </a>
                  , including the Mint Tutorial (as defined below), Earn
                  Tutorial (as defined below), Auction Tutorial (as defined
                  below), Governance Tutorial (as defined below) and
                  Frequently-Asked-Questions (“FAQs”) on Harbor accessible at
                  <a href="https://docs.harborprotocol.one/Faq">
                    https://docs.harborprotocol.one/Faq
                  </a>
                  ;
                </li>
                <li>
                  “HARBOR Tokens” or “HARBOR” means the fungible cryptographic
                  tokens associated with the Harbor protocol, as set out in
                  greater details in the Harbor Documentation.
                </li>
                <li>
                  “IBC” means the Inter-Blockchain Communication Protocol; and
                </li>
                <li>
                  “Stake” has the meaning ascribed thereto in Section 1.1(k).
                </li>
              </ol>
            </li>
            <li>
              <p>
                <u>Website Access.</u>
              </p>
              <ol type="a">
                <li>
                  The Website is a user interface designed by Company to
                  facilitate use of the Harbor Smart Contract deployed on the
                  Comdex Chain by providing a user-friendly interface to access
                  / use the Harbor Smart Contracts and the Comdex Chain although
                  the Harbor Smart Contracts are also accessible / can be used
                  via Direct Access. Company may modify or discontinue support
                  for the Website at any time, in its sole discretion.
                </li>
                <li>
                  You are hereby granted a non-exclusive, non-transferable,
                  revocable, limited licence to electronically access and use
                  the Website in the manner described in these Terms. You do not
                  have the right, and nothing in these Terms shall be construed
                  as granting you the right, to sub-license any rights in
                  connection with the access and/or use of the Website. Company
                  may revoke or terminate this licence at any time if you use,
                  or attempt to use, the Website in a manner prohibited by these
                  Terms, or if your rights under these Terms are terminated
                  pursuant to Section 6.
                </li>
                <li>
                  The Website allows a User to read and display data associated
                  with any Harbor Supported Blockchain-compatible wallet address
                  for which that User controls the associated private key and
                  uses to interact with the Harbor Smart Contracts by generating
                  standardised transaction messages in order to undertake a
                  Harbor Activity and/or Harbor Transaction using Harbor –
                  including providing a dashboard displaying a User’s Harbor
                  Supported Tokens in such User’s Harbor Supported
                  Blockchain-compatible address that is connected to the Harbor
                  Smart Contracts as well as the Harbor Supported Tokens
                  deposited by such User and other User(s) in Harbor Supported
                  Blockchain-compatible addresses associated with Harbor Smart
                  Contracts.
                </li>
                <li>
                  In order to access and/or use Harbor via the Website, a User
                  must first connect a Harbor Supported Blockchain-compatible
                  wallet to the Harbor Smart Contracts.
                </li>
              </ol>
            </li>
            <li>
              Direct Access. With the necessary technical expertise, it is
              possible for a User to generate transaction messages to interact
              with the Harbor Smart Contracts via Direct Access directly without
              use of the Website.{" "}
              <span className="text-danger">
                Company is not involved in and has no oversight of any Direct
                Access and expressly disclaims all responsibility, and User
                acknowledges that Company and its Affiliates shall have no
                responsibility for any loss occasioned to a User by or
                attributable to Direct Access.
              </span>
            </li>
            <li>
              <p>
                <u>Harbor Smart Contracts.</u>
              </p>
              <ol type="a">
                <li>
                  Company has led the development of and has deployed
                  (“Deployment”) the Harbor Smart Contracts on the Comdex Chain.
                </li>
                <li>
                  Apart from Website Access and Direct Access, the Harbor Smart
                  Contracts may also be accessible now or in the future through
                  other applications built on the Comdex Chain. On Deployment,
                  the Harbor Smart Contracts hold no digital assets.
                </li>
                <li>
                  The Harbor Smart Contracts and its source code are publicly
                  available and accessible at the Github Page pursuant to the
                  Business Source License as set out at
                  https://github.com/comdex-official/comdex/blob/development/LICENSE
                  (“License”). You agree that your right to access and/or use
                  the Harbor Smart Contracts is subject to the License and the
                  Terms expressly provided herein. In the event of any
                  inconsistency between any provision set out in the License and
                  these Terms, the provision in these Terms shall prevail. You
                  further agree that you shall not acquire and/or own any legal
                  right, title and/or interest in the Harbor Smart Contracts or
                  any intellectual property rights associated thereto, which
                  shall be wholly owned by the Company (and/or its Affiliates).
                  For as long as the License is applicable to the Harbor Smart
                  Contracts, you agree that any production use and/or business
                  use of the Harbor Smart Contracts is strictly prohibited.
                </li>
              </ol>
            </li>
            <li>
              <p>
                <u>Transaction Fees.</u>
              </p>
              <ol type="a">
                <li>
                  A transaction fee shall be chargeable to a User for each
                  Harbor-related transaction (“Harbor Transaction”) executed
                  through the Harbor Smart Contracts. Such transaction fee may
                  include but not may not be limited to the following:
                  <ol type="i">
                    <li>
                      transaction fee, paid in the form of “gas” for each
                      transaction executed on the Comdex Chain or such other
                      Harbor supported blockchain;
                    </li>
                    <li>
                      Drawdown Fee, which is a fixed percentage of $CMST,
                      collected from a User’s debt at every withdrawal of $CMST
                      through the Vault module (“Drawdown Fee”);
                    </li>
                    <li>
                      Stability Fee, which is the interest incurred and payable
                      by Users who mint and borrow $CMST from their Vault
                      (“Stability Fee”);
                    </li>
                    <li>
                      Liquidation Fee, which is the fee charged when a User’s
                      Collateral is liquidated on Harbor (“Liquidation Fee”);
                      and
                    </li>
                    <li>
                      Stablemint Fee, which is a fee charged for every
                      transaction involving the Stablemint module (“Stablemint
                      Fee”);
                    </li>
                  </ol>
                </li>
                <li>
                  The transaction fee for a specific Harbor Transaction will be
                  displayed to Users of the Website during the initiation of
                  such Harbor Transaction and must be accepted by a User before
                  executing such Harbor Transaction
                </li>
                <li>
                  A User hereby consents to such fees being debited from such
                  User’s Harbor Supported Blockchain-compatible wallet that such
                  User connects to the Harbor Smart Contracts for purposes of
                  effecting a Harbor Transaction, at the time such Harbor
                  Transaction is processed. Similar transaction fees may also be
                  levied on Users accessing and using the Harbor Smart Contracts
                  via Direct Access.
                </li>
                <li>
                  Such transaction fees may be subject of variation through
                  on-chain Governance with such variation implemented by the
                  Company via variations to the Harbor Smart Contracts.
                </li>
              </ol>
            </li>
          </ol>
          <h5>2. Using Harbor</h5>
          <ol type="1">
            <li>
              <ol type="a">
                <p>
                  <u>Minting $CMST:</u>
                </p>
                Minting $CMST may be effected via the “Mint” feature accessible
                through the Website or Direct Access. The process for effecting
                a Mint of $CMST is illustrated in a tutorial under the tab
                entitled “Vaults” at{" "}
                <a href="https://docs.harborprotocol.one/vaults">
                  https://docs.harborprotocol.one/vaults
                </a>{" "}
                (“Mint Tutorial”), as supplemented by the FAQs.
              </ol>
            </li>
            <li>
              <p>
                <u>Earn</u>
              </p>
              <ol type="a">
                <li>
                  User may choose to lock $CMST and earn rewards in the form of
                  variable interest via the “Earn” feature accessible via
                  Website Access or Direct Access. The process for earning
                  interest on $CMST is illustrated in a tutorial accessible at
                  <a href="https://docs.harborprotocol.one/locker">
                    https://docs.harborprotocol.one/locker
                  </a>{" "}
                  (“Earn Tutorial”) as supplemented by the FAQs.
                </li>
                <li>
                  A User accessing and/or using Harbor for earning interest on
                  $CMST is deemed to have read and understood the Harbor
                  Documentation, and acknowledges and accepts all risks and fees
                  relating to earning interest on $CMST as set out in the Harbor
                  Documentation.
                </li>
              </ol>
            </li>
            <li>
              <p>
                <u>Auction :</u>
              </p>
              <ol type="a">
                <li>
                  User may choose to participate in auction on Harbor via the
                  “Auction” feature accessible via Website Access or Direct
                  Access. The process for auction is illustrated in a tutorial
                  accessible at https://docs.harborprotocol.one/auctions
                  (“Auction Tutorial”) as supplemented by the FAQs.
                </li>
              </ol>
            </li>
            <li>
              <p>
                <u>Stake:</u>
              </p>
              <ol type="a">
                <li>
                  Users may choose to Stake their Harbor tokens with Harbor in
                  order to obtain veHarbor. The process of Staking Harbor tokens
                  is illustrated in a tutorial accessible at
                  https://docs.harborprotocol.one/reward-incentive (“Staking
                  Tutorial”) as supplemented by the FAQs.;
                </li>
                <li>
                  A User accessing and/or using Harbor for Staking is deemed to
                  have read and understood the Harbor Documentation, and
                  acknowledges and accepts all risks and fees relating to
                  Staking as set out in the Harbor Documentation, in particular
                  that a User may not be able to unStake his Harbor tokens for
                  the duration that such User has chosen to stake the Harbor
                  tokens for.
                </li>
              </ol>
            </li>
            <li>
              <p>
                <u>Governance:</u>
              </p>
              <ol type="a">
                <li>
                  A User holding HARBOR Tokens may participate in Governance
                  matters relating to the future development of Harbor via the
                  “Govern” feature accessible through the Website or Direct
                  Access. The process for effecting participation in Governance
                  is illustrated in a tutorial under the tab entitled
                  “Governance” at
                  <a href="https://docs.harborprotocol.one/governance">
                    https://docs.harborprotocol.one/governance
                  </a>{" "}
                  (“Governance Tutorial”), as supplemented by the FAQs.
                </li>
                <li>
                  A User accessing and/or using Harbor for Governance Voting is
                  deemed to have read and understood the Harbor Documentation,
                  and acknowledges and accepts all risks and fees relating to
                  Governance Voting as set out in the Harbor Documentation, in
                  particular that transaction fees are chargeable in respect of
                  Staking and Governance Voting.
                </li>
              </ol>
            </li>
            <li>
              <p>
                <u>Vault Voting:</u>
              </p>
              <ol type="a">
                <li>
                  User may choose to vote in respect of Harbor token emissions
                  on Harbor via the “Vault Voting” feature accessible via
                  Website Access or Direct Access. The process for voting is
                  illustrated in a tutorial accessible at
                  https://docs.harborprotocol.one/vault-voting (“Voting
                  Tutorial”) as supplemented by the FAQs.
                </li>
              </ol>
            </li>
            <li>
              <p>
                <u>Rewards:</u>
              </p>
              <ol type="a">
                <li>
                  Users with veHarbor may be entitled to earn further incentives
                  and rewards from the Harbor that may include a share of
                  Stability Fees, Drawdown Fees and Liquidation Fees and such
                  other revenue collected on the Harbor protocol. The process
                  for receiving such incentives and rewards is illustrated in a
                  tutorial accessible at
                  https://docs.harborprotocol.one/reward-incentive (“Rewards
                  Tutorial”) as supplemented by the FAQs.
                </li>
              </ol>
            </li>
            <li>
              <p>
                <u>Rebase:</u>
              </p>
              <ol type="a">
                <li>
                  Users with veHarbor will be entitled to receive additional
                  veHarbor (“Rebase veHarbor Tokens”) distributed by Harbor
                  based on the veHarbor to Harbor ratio (determined by Harbor
                  protocol) such that a User’s holding of veHarbor can remain
                  proportionate to the total supply of veHarbor. The process for
                  receiving Rebase veHarbor Tokens is illustrated in a tutorial
                  accessible at https://docs.harborprotocol.one/emissions
                  (“Rebase Tutorial”) as supplemented by the FAQs;
                </li>
              </ol>
            </li>
          </ol>
          <h5>3 Representations & Warranties</h5>
          <ol type="3">
            <li>
              You make the following representations and warranties regarding
              your access and/or use of Harbor{" "}
              <ol type="a">
                <li>
                  THAT you are legally permitted to access and/or use Harbor in
                  your jurisdiction and your access and/or use of Harbor is in
                  compliance with the laws of your jurisdiction, and you
                  acknowledge that the Company is not liable for your compliance
                  or non-compliance with any such laws;
                </li>
                <li>
                  THAT your agreement to these Terms and your access and/or use
                  of Harbor does not constitute, and that you do not expect it
                  to result in, a breach, default, or violation of any
                  applicable law or any contract or agreement to which you are a
                  party or are otherwise bound;
                </li>
                <li>
                  THAT you are not an Excluded Person and are not in an Excluded
                  Jurisdiction, and are not accessing or using Harbor from an
                  Excluded Jurisdiction and for purposes hereof :
                  <ol type="i">
                    <li>
                      “Excluded Jurisdiction” means any of the following
                      jurisdictions : (1) the United States of America and its
                      territories and possessions (collectively, the “United
                      States”); (2) the Republic of India; (3) United Arab
                      Emirates; (4) the Republic of Singapore; (5) a
                      jurisdiction identified by the Financial Action Task Force
                      (FATF) for strategic AML/CFT deficiencies and included in
                      FATF’s listing of “High-risk and Other Monitored
                      Jurisdictions” accessible at
                      https://www.fatf-gafi.org/publications/high-risk-and-other-monitored-jurisdictions/d
                      ocuments/increased-monitoring-october-2022.html or
                      “Jurisdictions Subject to a Call for Action” accessible at
                      https://www.fatf-gafi.org/publications/high-risk-and-other-monitored-jurisdictions/d
                      ocuments/call-for-action-october-2022.html and/or (6) a
                      jurisdiction in which Harbor would be subject of
                      licensing; and
                    </li>
                    <li>
                      “Excluded Persons” refers to the following person(s) : (1)
                      a person who is a citizen, domiciled in, resident of, or
                      physically present / located in an Excluded Jurisdiction;
                      (2) a body corporate: (a) which is incorporated in, or
                      operates out of, an Excluded Jurisdiction, or (b) which is
                      under the control of one or more individuals who is/are
                      citizen(s) of, domiciled in, residents of, or physically
                      present / located in, an Excluded Jurisdiction; (3) an
                      individual or body corporate included in United Nations
                      Consolidated List (accessible at
                      https://www.un.org/securitycouncil/content/un-sc-consolidated-list);
                      and/or (4) an individual or body corporate which is
                      otherwise prohibited or ineligible in any way, whether in
                      full or in part, under any laws applicable to such
                      individual or body corporate from accessing and/or using
                      Harbor; and/or (5) a U.S. person.
                      <p>For purposes of these Terms, a “U.S. person” means:</p>
                      <ol type="A">
                        <li>
                          any natural person resident in the United States;
                        </li>
                        <li>
                          any partnership or corporation organised or
                          incorporated under the laws of the United States;
                        </li>
                        <li>
                          any estate of which any executor or administrator is a
                          U.S. person;
                        </li>
                        <li>
                          any trust of which any trustee is a U.S. person;
                        </li>
                        <li>
                          any agency or branch of a foreign entity located in
                          the United States;
                        </li>
                        <li>
                          any non-discretionary account or similar account
                          (other than an estate or trust) held by a dealer or
                          other fiduciary for the benefit or account of a U.S.
                          person;
                        </li>
                        <li>
                          any discretionary account or similar account (other
                          than an estate or trust) held by a dealer or other
                          fiduciary organised, incorporated, or (if an
                          individual) resident in the United States;
                        </li>
                        <li>
                          any partnership or corporation if:
                          <ol type="i">
                            <li>
                              organised or incorporated under the laws of any
                              foreign jurisdiction; and
                            </li>
                            <li>
                              formed by a U.S. person principally for the
                              purpose of investing in securities not registered
                              under the Securities Act of 1933 of the United
                              States of America, unless it is organised or
                              incorporated, and owned, by accredited investors
                              (as defined in Regulation D of that Act) who are
                              not natural persons, estates or trusts; and
                            </li>
                          </ol>
                        </li>
                        <li>
                          any citizen of United States who is a military
                          personnel of United States who is not resident in or
                          outside of the United States,
                          <p>but does not include :</p>
                        </li>
                        <li>
                          any discretionary account or similar account (other
                          than an estate or trust) held for the benefit or
                          account of a non-U.S. person by a dealer or other
                          professional fiduciary organized, incorporated, or (if
                          an individual) resident in the United States;
                        </li>
                        <li>
                          any estate of which any professional fiduciary acting
                          as executor or administrator is a U.S. person if:
                          <ol type="i">
                            <li>
                              an executor or administrator of the estate who is
                              not a U.S. person has sole or shared investment
                              discretion with respect to the assets of the
                              estate; and
                            </li>
                            <li>the estate is governed by foreign law;</li>
                          </ol>
                        </li>
                        <li>
                          any trust of which any professional fiduciary acting
                          as trustee is a U.S. person, if a trustee who is not a
                          U.S. person has sole or shared investment discretion
                          with respect to the trust assets, and no beneficiary
                          of the trust (and no settlor if the trust is
                          revocable) is a U.S. person;
                        </li>
                        <li>
                          an employee benefit plan established and administered
                          in accordance with the law of a country other than the
                          United States and customary practices and
                          documentation of such country;
                        </li>
                        <li>
                          any agency or branch of a U.S. person located outside
                          the United States if:
                          <ol type="1">
                            <li>
                              agency or branch operates for valid business
                              reasons; and
                            </li>
                            <li>
                              the agency or branch is engaged in the business of
                              insurance or banking and is subject to substantive
                              insurance or banking regulation, respectively, in
                              the jurisdiction where located; and
                            </li>
                          </ol>
                        </li>
                        <li>
                          The International Monetary Fund, the International
                          Bank for Reconstruction and Development, the
                          Inter-American Development Bank, the Asian Development
                          Bank, the African Development Bank, the United
                          Nations, and their agencies, affiliates and pension
                          plans, and any other similar international
                          organizations, their agencies, affiliates and pension
                          plans;
                        </li>
                      </ol>
                    </li>
                  </ol>
                </li>
                <li>
                  THAT you will not, and will not attempt to, authorise anyone
                  other than you to access and/or use Harbor using a Harbor
                  Supported Blockchain-compatible wallet owned by you or for
                  which you control the private keys, or otherwise engage in
                  Prohibited Use (as defined below) using such Harbor Supported
                  Blockchain-compatible wallet;
                </li>
                <li>
                  THAT you will not disrupt, interfere with, or otherwise
                  adversely affect the normal flow of Harbor or otherwise act in
                  a manner that may negatively affect other Users’ experience
                  when accessing and/or using Harbor including taking advantage
                  of software vulnerabilities and any other act that
                  intentionally abuses or exploits the design of Harbor;
                </li>
                <li>
                  THAT:
                  <ol type="i">
                    <li>
                      you have read and understood the Harbor Documentation
                      (including the Mint Tutorial, Earn Tutorial, Auction
                      Tutorial, Staking Tutorial, Governance Tutorial, Voting
                      Tutorial, Rewards Tutorial, Rebase Tutorial and FAQs) and
                      accept all risks set out therein, including smart contract
                      risks and market volatility risks;
                    </li>
                    <li>
                      you are sophisticated in using and evaluating blockchain
                      technologies and related blockchain-based digital assets,
                      including the Comdex Chain and smart contract systems; and
                    </li>
                    <li>
                      you have evaluated and understand all functions of and all
                      risks associated with your access and/or use of Harbor and
                      your undertaking of any Harbor Activity and/or Harbor
                      Transaction using Harbor and have not relied on any
                      information, statement, representation, or warranty,
                      express or implied, made by or on behalf of Company with
                      respect to the access and/or use of Harbor and your
                      undertaking of any Harbor Activity and/or Harbor
                      Transaction using Harbor.
                    </li>
                  </ol>
                </li>
              </ol>
            </li>
            <li>
              All of the above representations and warranties are true,
              complete, accurate and not misleading from the time of your
              acceptance of these Terms and are deemed repeated each time you
              access and/or use Harbor.
            </li>
          </ol>
          <h5>4 Prohibited Use</h5>
          <ol type="1">
            <li>
              You may not, directly or indirectly, engage in any of the
              following activities in connection with your access and/or use of
              Harbor (“Prohibited Uses”):
              <ol type="a">
                <li>
                  A violation of any law, rule, or regulation of any
                  jurisdiction that is applicable to you;
                </li>
                <li>
                  Violations or breaches of these Terms or any other document
                  from time to time governing the access and/or use of Harbor;
                </li>
                <li>
                  Permit others to access and/or use Harbor or otherwise
                  undertake any Harbor Activity and/or Harbor Transaction using
                  a Harbor Supported Blockchain-compatible wallet address that
                  you control;
                </li>
                <li>
                  Perform, or attempt to perform, any actions that would
                  interfere with the normal operation of Harbor or affect the
                  access and/or use of Harbor by other Users;
                </li>
                <li>
                  Engage in, or knowingly facilitate, any fraudulent, deceptive,
                  or manipulative transaction activity in any digital asset
                  using Harbor, including by engaging or participating in
                  “front-running”, “wash trading”, “pump and dump schemes”, or
                  similar activities;
                </li>
                <li>
                  Engage in, or knowingly facilitate, any money laundering,
                  terrorist financing, or other illegal activities;
                </li>
                <li>
                  Access or attempt to access non-public systems, programs,
                  data, or services;
                </li>
                <li>
                  Copy, reproduce, republish, upload, post, transmit, resell, or
                  distribute in any way, any data, content or any part of
                  Harbor, except as expressly permitted by applicable laws; and
                </li>
                <li>
                  Reverse engineer or attempt to reverse engineer Harbor except
                  as expressly permitted by applicable law.
                </li>
              </ol>
            </li>
          </ol>
          <h5>5 Waivers</h5>
          <ol type="1">
            <li>
              You agree and acknowledge that the Company and its Affiliates
              shall not be liable for any direct, indirect, special, incidental,
              consequential or other losses of any kind, in tort, contract or
              otherwise (including but not limited to loss of fund, asset,
              revenue, income or profits, and loss of use or data), arising out
              of or in connection with your access and/or use of Harbor or your
              undertaking of any Harbor Activity and/or Harbor Transaction.
            </li>
            <li>
              You undertake not to initiate or participate, and waive the right
              to participate in, any class action lawsuit or a class -wide
              arbitration against the Company and/or its Affiliates in respect
              of your access and/or use of Harbor or your undertaking of any
              Harbor Activity and/or Harbor Transaction.
            </li>
            <li>
              By accepting these Terms, you waive all rights, claims and/or
              causes of action (present or future) under law (including any
              tortious claims) or contract against the Company and its
              Affiliates in connection with your access and/or use of Harbor or
              your undertaking of any Harbor Activity and/or Harbor Transaction.
            </li>
          </ol>
          <h5>6 Termination</h5>
          <ol type="1">
            <li>
              These Terms will remain in full force and effect for so long as
              you access and/or use Harbor or undertake any Harbor Activity
              and/or Harbor Transaction. The Company may suspend or terminate
              your rights to access and/or use Harbor at any time for any reason
              at the Company’s sole discretion, including for any access and/or
              use of Harbor in violation of these Terms.
            </li>
            <li>
              Upon termination of your rights under these Terms, your right to
              access and/or use Harbor will terminate immediately.
            </li>
            <li>
              The Company will not have any liability whatsoever to you for any
              termination of your rights under these Terms, including
              blacklisting any blockchain address you provide to the Company.
              Even after your rights under these Terms are terminated, Sections
              5, 6.3, 7 and 8 of these Terms will remain in effect.
            </li>
          </ol>
          <h5>7 Disclaimers and Limitation of Liability</h5>
          <ol>
            <li>
              <p>
                <u>Disclaimer</u>
              </p>
              <ol type="a">
                <li>
                  HARBOR (WHICH INCLUDES THE WEBSITE, THE HARBOR SMART CONTRACTS
                  AND COMDEX CHAIN) ARE PROVIDED ON AN “AS-IS” AND “AS
                  AVAILABLE” BASIS, AND COMPANY EXPRESSLY DISCLAIMS ANY AND ALL
                  WARRANTIES AND CONDITIONS OF ANY KIND, WHETHER EXPRESS,
                  IMPLIED, OR STATUTORY, INCLUDING ALL WARRANTIES OR CONDITIONS
                  OF MERCHANTABILITY, MERCHANTABLE QUALITY, FITNESS FOR A
                  PARTICULAR PURPOSE, TITLE, QUIET ENJOYMENT, ACCURACY, OR
                  NON-INFRINGEMENT. COMPANY DOES NOT MAKE ANY WARRANTY THAT
                  HARBOR WILL MEET YOUR REQUIREMENTS, WILL BE AVAILABLE ON AN
                  UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE BASIS, OR WILL BE
                  ACCURATE, RELIABLE, FREE OF VIRUSES OR OTHER HARMFUL CODE,
                  COMPLETE, LEGAL, OR SAFE. IF APPLICABLE LAW REQUIRES ANY
                  WARRANTIES WITH RESPECT TO HARBOR, ALL SUCH WARRANTIES ARE
                  LIMITED IN DURATION TO SIXTY (60) DAYS FROM THE DATE OF FIRST
                  USE.
                </li>
                <li>
                  COMPANY DOES NOT ENDORSE ANY THIRD PARTY AND SHALL NOT BE
                  RESPONSIBLE IN ANY WAY FOR ANY TRANSACTIONS YOU ENTER INTO
                  WITH ANY OTHER THIRD PARTY, OR FOR ANY LOSS ARISING FROM YOUR
                  RELIANCE ON ANY REPRESENTATION MADE BY OR ANY INFORMATION
                  PROVIDED BY ANY OTHER THIRD PARTY. YOU AGREE THAT THE COMPANY
                  AND ITS AFFILIATES WILL NOT BE LIABLE FOR ANY LOSS OR DAMAGES
                  OF ANY SORT INCURRED AS A RESULT OF ANY INTERACTIONS BETWEEN
                  YOU AND ANY THIRD PARTY.
                </li>
              </ol>
            </li>
            <li>
              <p>
                <u>Limitation of Liability.</u>
              </p>
              <ol type="a">
                <li>
                  SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF
                  LIABILITY, INCLUDING LIMITATION OF LIABILITY FOR CONSEQUENTIAL
                  OR INCIDENTAL DAMAGES, SO THE FOLLOWING LIMITATION MAY NOT
                  APPLY TO YOU AND YOU MAY HAVE ADDITIONAL RIGHTS.
                </li>
                <li>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL THE
                  COMPANY AND/OR ITS AFFILIATES BE LIABLE TO YOU OR ANY THIRD
                  PARTY FOR ANY LOST PROFITS, LOST DATA, OR ANY INDIRECT,
                  CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL OR PUNITIVE
                  DAMAGES ARISING OUT OF YOUR USE OF HARBOR, EVEN IF THE COMPANY
                  HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. ACCESS
                  TO, AND USE OF, HARBOR IS AT YOUR OWN DISCRETION AND RISK, AND
                  YOU WILL BE SOLELY RESPONSIBLE FOR ANY DAMAGE TO YOUR DEVICE
                  OR COMPUTER SYSTEM, OR LOSS OF DATA, OR LOSS OF FUND RESULTING
                  THEREFROM.
                </li>
                <li>
                  THE COMPANY AND ITS AFFILIATES SHALL NOT BE LIABLE FOR ANY
                  LOSS OR DAMAGE ARISING OUT OF YOUR FAILURE TO KEEP YOUR
                  PRIVATE KEYS OR LOGIN CREDENTIALS TO YOUR WALLET SECURE OR ANY
                  OTHER UNAUTHORIZED ACCESS TO OR TRANSACTIONS INVOLVING YOUR
                  WALLET.
                </li>
                <li>
                  TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW,
                  NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, THE
                  LIABILITY OF THE COMPANY TO YOU FOR ANY DAMAGES ARISING FROM
                  OR RELATED TO THIS AGREEMENT (FOR ANY CAUSE WHATSOEVER AND
                  REGARDLESS OF THE FORM OF THE ACTION), WILL AT ALL TIMES BE
                  LIMITED TO A MAXIMUM OF THE AMOUNT OF TRANSACTION FEES PAID BY
                  YOU IN CONNECTION WITH YOUR ACCESS AND/OR USE OF HARBOR DURING
                  THE PRECEDING TWELVE (12) MONTHS. THE EXISTENCE OF MORE THAN
                  ONE CLAIM WILL NOT ENLARGE THIS LIMIT.
                </li>
              </ol>
            </li>
            <li>
              <p>
                <u>Indemnification.</u> You agree to indemnify and hold the
                Company and its Affiliates (each an “Indemnified Party”, and
                collectively “Indemnified Parties”) harmless from any loss,
                claim or demand made, including costs and attorneys’ fees, due
                to or arising out of:
              </p>
              <ol type="i">
                <li>
                  your access and/or use of Harbor (which includes the Website,
                  the Harbor Smart Contracts and Comdex Chain) or your
                  undertaking of any Harbor Activity and/or Harbor Transaction
                  (including Mint, Earn, Auctions and/or Governance Voting);
                </li>
                <li>your non-observance of these Terms; and/or</li>
                <li>your violation of applicable laws or regulations.</li>
              </ol>
              <p>
                The relevant Indemnified Party reserves the right, at your
                expense, to assume the exclusive defense and control of any
                matter for which you are required to provide indemnification,
                and you agree to cooperate in the defense of these claims. You
                agree not to settle any matter without the prior written consent
                of the relevant Indemnified Party or Indemnified Parties. The
                relevant Indemnified Party will use reasonable efforts to notify
                you of any such claim, action or proceeding upon becoming aware
                of it.
              </p>
            </li>
            <li>
              <u>Taxes.</u> You are solely responsible for determining the tax
              implications and tax reporting requirements associated with your
              access and/or use of Harbor and/or associated with any Harbor
              Activity and/or Harbor Transactions you undertake, and for paying
              any applicable taxes in each applicable jurisdiction in relation
              thereto. The Company is not responsible for determining whether
              there are tax implications or tax reporting in connection with
              your access and/or use of Harbor and/or associated with any Harbor
              Activity and/or Harbor Transactions you undertake, or for paying
              any applicable taxes in relation thereto.
            </li>
            <li>
              <p>
                <u>
                  Potential Risks Associated with Access and/or Use of Harbor
                  (which includes the Website, the Harbor Smart Contracts and
                  the Comdex Chain).
                </u>
              </p>
              <ol type="a">
                <li>
                  Like all software, Harbor (which includes the Website, the
                  Harbor Smart Contracts and the Comdex Chain) may be subject to
                  exploits. The Company is not responsible for exploits of any
                  kind. While the Company has taken a number of precautions to
                  ensure the security of Harbor (which includes the Website, the
                  Harbor Smart Contracts and the Comdex Chain), the technology
                  is relatively new and it is not possible to guarantee that the
                  code is completely free from bugs or errors. Users accept all
                  risks that arise from access and/or use of Harbor (which
                  includes the Website, the Harbor Smart Contracts and the
                  Comdex Chain), including, and not limited to, the risk of any
                  digital assets being lost due to a failure, malfunction or
                  exploit of Harbor (whether in relation to the Website, the
                  Harbor Smart Contracts and/or the Comdex Chain).
                </li>
                <li>
                  You are solely responsible for securing the private keys
                  associated with any Harbor Supported Blockchain-compatible
                  wallet you may use when accessing and/or using Harbor. You
                  understand that anyone who obtains your private keys and
                  access to your device may access such Harbor Supported
                  Blockchain-compatible wallet controlled with those private
                  keys with or without your authorisation and may transfer out
                  any digital assets from the blockchain address associated with
                  such Harbor Supported Blockchain-compatible wallet.
                </li>
                <li>
                  The value of any digital asset, where value is attached to
                  such an asset, may fluctuate. The Company makes no guarantees
                  as to the price or value of any digital asset on any secondary
                  market, including the yield attributable to any Harbor
                  Activity and/or Harbor Transaction that you undertake.
                </li>
                <li>
                  The following risks are associated with blockchain-based
                  digital assets involved in connection with your access and/or
                  use of Harbor and your undertaking of Harbor Activities and/or
                  Harbor Transactions : the risk of losing private keys, theft
                  resulting from third parties discovering your private key,
                  value fluctuation of digital assets on the secondary market,
                  disruptions to the Comdex Chain and/or other IBC-enabled
                  blockchains connected to Harbor caused by network congestion,
                  lack of usability of, or loss of value with respect to,
                  digital assets due to a hard fork or other disruption to the
                  Comdex Chain and/or other IBC-enabled blockchains connected to
                  Harbor, or errors or vulnerabilities in the smart contract
                  code associated with a given digital asset or transactions
                  involving digital assets. Transfers on the Comdex Chain are
                  irreversible. Once an instruction, signed by the required
                  private key(s), to transfer a digital asset from one
                  blockchain address to another has been executed, it cannot be
                  undone.
                </li>
                <li>
                  Support for your access and/or use of Harbor (which includes
                  the Website, the Harbor Smart Contracts and the Comdex Chain)
                  whether via the Website and/or Direct Access or for your
                  undertaking of any Harbor Activity and/or Harbor Transaction
                  (including Mint, Earn, Auctions and/or Governance Voting) may
                  be modified or discontinued at any time, and the Company
                  reserves the right, at any time, in the Company’s sole
                  discretion, to modify the Website and/or the Harbor Smart
                  Contracts.
                </li>
                <li>
                  In the event of a change or other network disruption to Comdex
                  Chain and/or other IBC-enabled blockchains connected to
                  Harbor, whether resulting in a fork of Comdex Chain and/or
                  other IBC-enabled blockchains connected to Harbor, Harbor may
                  halt and stop functioning and you may not be able to undertake
                  or complete any Harbor Activity and/or Harbor Transaction. In
                  addition, in the event of a fork, Harbor Activity and/or
                  Harbor Transaction on the Comdex Chain and/or other
                  IBC-enabled blockchains connected to Harbor may be disrupted.
                </li>
                <li>
                  The Comdex Chain and/or other IBC-enabled blockchains
                  connected to Harbor charge a fee for engaging in a transaction
                  on the applicable network. Those network transaction fees
                  fluctuate over time depending on a variety of factors. You are
                  solely responsible for paying network transaction fees
                  associated with any Harbor Activity and/or Harbor Transaction
                  you undertake using Harbor whether on the Comdex Chain and/or
                  other IBC-enabled blockchains connected to Harbor. You are
                  also solely responsible for any other third-party fees that
                  may be incurred in connection with your access and/or use of
                  Harbor.
                </li>
              </ol>
            </li>
          </ol>
          <ol type="none" className="unstyled">
            <li>
              <b>8. Dispute Resolution.</b> Subject always to Sections 5 and 7
              of these Terms, any claim, suit, or dispute arising out of or in
              connection with these Terms, including any question regarding its
              existence, validity or termination, shall be referred to and
              finally be resolved by arbitration in accordance with the
              arbitration rules of the British Virgin Islands, before a panel of
              three (3) arbitrators. Each of the Parties hereby has the right to
              appoint an arbitrator, and the two (2) appointed arbitrators shall
              select the third arbitrator. The panel shall reach its decisions
              by a vote of a majority. Any claim shall be brought individually
              on behalf of the person or entity seeking relief, not on behalf of
              a class or other persons or entities not participating in the
              arbitration and shall not be consolidated with the claim of any
              person who is not asserting a claim arising under or relating to
              this contract. The seat of arbitration shall be the British Virgin
              Islands and the language of any arbitration shall be English.
              Judgment on any award rendered by the arbitrators may be entered
              by any court of competent jurisdiction.
            </li>
          </ol>
          <ol type="none" className="unstyled">
            <li>
              <b>9. Electronic Communications with the Company.</b> The
              communications between you and the Company use electronic means,
              either through the Website or electronic mail, whether the Company
              communicates by posting notices on the Website, or communicates
              with you via email. For contractual purposes, you: (i) hereby
              consent to receive communications from the Company in any
              electronic form; and (ii) hereby agree that all terms and
              conditions, agreements, notices, disclosures, and other
              communications that the Company provides to you electronically
              satisfy any legal requirement that would also be satisfied if such
              communications were to be in a hardcopy writing. The foregoing
              does not affect your non-waivable rights under any applicable law.
            </li>
          </ol>
          <h5>10 Governing Law and Jurisdiction</h5>
          <ol type="1">
            <li>
              These Terms and any dispute or claim arising out of or in
              connection with their subject matter or formation (including
              non-contractual disputes or claims) shall be governed by and
              construed in accordance with the law of the British Virgin
              Islands.
            </li>
            <li>
              Harbor may not be available or permitted by laws for use in some
              jurisdictions (including the Excluded Jurisdictions). The Company
              and its Affiliates do not represent or warrant that Harbor or any
              part thereof is available or permitted by laws for use in any
              particular jurisdiction. In choosing to access and/or use Harbor,
              you do so on your own initiative and at your own risk, and you are
              responsible for complying with all applicable local laws, rules
              and regulations.
            </li>
          </ol>
          <h5>11 General</h5>
          <ol type="1">
            <li>
              <u>Entire Terms.</u> These Terms constitute the entire agreement
              between you and the Company regarding your access and/or use of
              Harbor. The section titles in these Terms are for convenience only
              and have no legal or contractual effect. The word “including”
              means “including without limitation.”
            </li>
            <li>
              <u>Severability.</u> If any provision of these Terms is, for any
              reason, held to be invalid or unenforceable, the other provisions
              of these Terms will be unimpaired and the invalid or unenforceable
              provision will be deemed modified so that it is valid and
              enforceable to the maximum extent permitted by law.
            </li>
            <li>
              <u>Relationship of the Parties.</u> Nothing contained in this
              Agreement will be deemed to be construed by the Parties or any
              third party as creating a partnership, an agency relationship or
              joint venture between the Parties or any of their respective
              employees, representatives, or agents.
            </li>
            <li>
              <u>Third party rights.</u> Save for the Indemnified Parties who
              shall have rights and benefits to the extent accorded thereto
              under these Terms, any person who is not a Party to these Terms
              shall have no right to enforce any provisions of this Terms.
            </li>
            <li>
              <u>Assignment.</u> These Terms, and your rights and obligations
              herein, may not be assigned, subcontracted, delegated, or
              otherwise transferred by you without the Company’s prior written
              consent, and any attempted assignment, subcontract, delegation, or
              transfer in violation of the foregoing will be null and void. The
              Company may freely assign these Terms. The terms and conditions
              set forth in these Terms shall be binding upon assignees.
            </li>
            <li>
              <u>Changes.</u> Company reserves the right to change these Terms
              in its sole discretion from time to time. The “Date Last Revised”
              specified on these Terms indicates the date on which the Terms
              were last changed. You will be notified of those changes and given
              the opportunity to review and accept the updated Terms when you
              next access and/or use Harbor. These changes will be effective
              upon your acceptance of the updated Terms. In addition, continued
              access and/or use of Harbor following notice of such changes shall
              indicate your acknowledgement of such changes and agreement to be
              bound by the terms and conditions of such changes.
            </li>
            <li>
              <u>Waiver.</u> A waiver by the Company of any right or remedy
              under these Terms shall only be effective if it is in writing,
              executed by a duly authorised representative of the Company and
              shall apply only to the circumstances for which it is given. The
              failure of the Company to exercise or enforce any right or remedy
              under these Terms shall not operate as a waiver of such right or
              remedy, nor shall it prevent any future exercise or enforcement of
              such right or remedy. No single or partial exercise of any right
              or remedy shall preclude or restrict the further exercise of any
              such right or remedy or other rights or remedies.
            </li>
          </ol>
        </div>
        <div className="tc-check">
          <Checkbox
            onChange={() => {
              setIsChecked((value) => !value);
            }}
          >
            Accept Terms Conditions
          </Checkbox>
        </div>
        <div className="text-center pt-3">
          <Button
            disabled={!isChecked}
            type="primary"
            onClick={(e) => {
              e.preventDefault();
              setIsModalOpen(false);
              localStorage.setItem("agreement_accepted", "true");
            }}
          >
            Accept
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default TermsModal;
