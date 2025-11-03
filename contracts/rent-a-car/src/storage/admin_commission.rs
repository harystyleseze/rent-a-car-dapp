use soroban_sdk::Env;
use crate::storage::types::storage::DataKey;

pub fn read_admin_commission(env: &Env) -> i128 {
    env.storage()
        .instance()
        .get(&DataKey::AdminCommission)
        .unwrap_or(0)
}

pub fn write_admin_commission(env: &Env, commission: &i128) {
    env.storage()
        .instance()
        .set(&DataKey::AdminCommission, commission);
}