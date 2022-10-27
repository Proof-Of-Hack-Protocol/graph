import { BigInt } from "@graphprotocol/graph-ts"
import {
  ChallengeManager,
  ChallengeBreak,
  Deployed,
  SetUsername
} from "../generated/ChallengeManager/ChallengeManager"
import { Challenge, ChallengeSolved, Player } from "../generated/schema"

export function handleChallengeBreak(event: ChallengeBreak): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let challenge = Challenge.load(event.params.challenge.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!challenge) {
    challenge = new Challenge(event.params.challenge.toHex())

    // Entity fields can be set using simple assignments
    challenge.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  challenge.count = challenge.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  // entity.challenge = event.params.challenge
  // entity.user = event.params.user

  // Entities can be written to the store with `.save()`
  challenge.save()

  let player = Player.load(event.params.user.toHex())
  if (!player) {
    player = new Player(event.params.user.toHex())
    player.save();
  }

  let challengeSolved = ChallengeSolved.load(event.transaction.hash.toHex())
  if (!challengeSolved) {
    challengeSolved = new ChallengeSolved(event.transaction.hash.toHex());
    challengeSolved.player = event.params.user.toHex();
    challengeSolved.challenge = event.params.challenge.toHex();    
  }

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.challengeBreaks(...)
  // - contract.challenges(...)
  // - contract.checkChallenge(...)
  // - contract.getChallengesInstances(...)
  // - contract.userChallengeBreak(...)
  // - contract.usernames(...)
}

export function handleDeployed(event: Deployed): void {}

export function handleSetUsername(event: SetUsername): void {
  let player = Player.load(event.params.user.toHex())
  if (!player) {
    player = new Player(event.params.user.toHex())
  }
  player.username = event.params._name.toString();
  player.save();    
}
