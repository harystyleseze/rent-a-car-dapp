use soroban_sdk::{Address, Env};
use crate::storage::types::{CarStatus, Error};

pub trait RentACarContractTrait {
    fn __constructor(env: &Env, admin: Address, token: Address) -> Result<(), Error>;
    fn set_admin_commission(env: &Env, commission: i128) -> Result<(), Error>;
    fn get_admin_commission(env: &Env) -> i128;
    fn add_car(env: &Env, owner: Address, price_per_day: i128) -> Result<(), Error>;
    fn get_car_status(env: &Env, owner: Address) -> Result<CarStatus, Error>;
    fn rental(env: &Env, renter: Address, owner: Address, total_days_to_rent: u32) -> Result<(), Error>;
    fn return_car(env: &Env, renter: Address, owner: Address) -> Result<(), Error>;
    fn remove_car(env: &Env, owner: Address) -> Result<(), Error>;
    fn payout_owner(env: &Env, owner: Address, amount: i128) -> Result<(), Error>;
    fn payout_admin(env: &Env, amount: i128) -> Result<(), Error>;
    fn get_admin_balance(env: &Env) -> i128;
}