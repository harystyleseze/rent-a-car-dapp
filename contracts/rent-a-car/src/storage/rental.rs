use soroban_sdk::{Address, Env};
use crate::storage::{structs::rental::Rental, types::storage::DataKey};

pub fn has_rental(env: &Env, renter: &Address, owner: &Address) -> bool {
    env.storage()
        .instance()
        .has(&DataKey::Rental(renter.clone(), owner.clone()))
}

pub fn read_rental(env: &Env, renter: &Address, owner: &Address) -> Rental {
    env.storage()
        .instance()
        .get(&DataKey::Rental(renter.clone(), owner.clone()))
        .unwrap()
}

pub fn write_rental(env: &Env, renter: &Address, owner: &Address, rental: &Rental) {
    env.storage()
        .instance()
        .set(&DataKey::Rental(renter.clone(), owner.clone()), rental);
}

pub fn remove_rental(env: &Env, renter: &Address, owner: &Address) {
    env.storage()
        .instance()
        .remove(&DataKey::Rental(renter.clone(), owner.clone()));
}
