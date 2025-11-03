use soroban_sdk::{Address, Env};
use crate::storage::{structs::car::Car, types::storage::DataKey};

pub fn has_car(env: &Env, owner: &Address) -> bool {
    env.storage().instance().has(&DataKey::Car(owner.clone()))
}

pub fn read_car(env: &Env, owner: &Address) -> Car {
    env.storage().instance().get(&DataKey::Car(owner.clone())).unwrap()
}

pub fn write_car(env: &Env, owner: &Address, car: &Car) {
    env.storage().instance().set(&DataKey::Car(owner.clone()), car);
}

pub fn remove_car(env: &Env, owner: &Address) {
    env.storage().instance().remove(&DataKey::Car(owner.clone()));
}