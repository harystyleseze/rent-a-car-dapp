use soroban_sdk::{contract, contractimpl, Address, Env};
use crate::{
    interface::RentACarContractTrait,
    storage::{
        admin_balance::{read_admin_balance, write_admin_balance},
        admin_commission::{read_admin_commission, write_admin_commission},
        car::{has_car, read_car, write_car, remove_car},
        contract_balance::{read_contract_balance, write_contract_balance},
        rental::{has_rental, read_rental, write_rental, remove_rental},
        types::{
            CarStatus,
            Error,
        },
        structs::{
            Car,
            Rental,
        },
        admin::{has_admin, read_admin, write_admin},
        token::{read_token, write_token},
    },
    methods::token::token_transfer,
};

#[contract]
pub struct RentACarContract;

#[contractimpl]
impl RentACarContractTrait for RentACarContract {
    fn __constructor(env: &Env, admin: Address, token: Address) -> Result<(), Error> {
        if admin == token {
            return Err(Error::AdminTokenConflict);
        }

        if has_admin(&env) {
            return Err(Error::ContractInitialized);
        }

        write_admin(env, &admin);
        write_token(env, &token);

        Ok(())
    }

    fn set_admin_commission(env: &Env, commission: i128) -> Result<(), Error> {
        let admin = read_admin(env);
        admin.require_auth();

        if commission < 0 {
            return Err(Error::AmountMustBePositive);
        }

        write_admin_commission(env, &commission);
        Ok(())
    }

    fn get_admin_commission(env: &Env) -> i128 {
        read_admin_commission(env)
    }

    fn add_car(env: &Env, owner: Address, price_per_day: i128) -> Result<(), Error> {
        let admin = read_admin(env);
        admin.require_auth();

        if price_per_day <= 0 {
            return Err(Error::AmountMustBePositive);
        }

        if has_car(env, &owner) {
            return Err(Error::CarAlreadyExist);
        }

        let car = Car {
            price_per_day,
            car_status: CarStatus::Available,
            available_to_withdraw: 0,
        };

        write_car(env, &owner, &car);
        Ok(())
    }

    fn get_car_status(env: &Env, owner: Address) -> Result<CarStatus, Error> {
        if !has_car(env, &owner) {
            return Err(Error::CarNotFound);
        }

        let car = read_car(env, &owner);
        Ok(car.car_status)
    }

    fn rental(env: &Env, renter: Address, owner: Address, total_days_to_rent: u32) -> Result<(), Error> {
        renter.require_auth();

        if total_days_to_rent == 0 {
            return Err(Error::RentalDurationCannotBeZero);
        }

        if renter == owner {
            return Err(Error::SelfRentalNotAllowed);
        }

        if !has_car(env, &owner) {
            return Err(Error::CarNotFound);
        }

        let mut car = read_car(env, &owner);

        if car.car_status != CarStatus::Available {
            return Err(Error::CarAlreadyRented);
        }

        // Calculate total amount and commission
        let total_amount = car.price_per_day * total_days_to_rent as i128;
        let commission = (total_amount * read_admin_commission(env)) / 100;
        let owner_amount = total_amount - commission;

        // Update car status and available funds
        car.car_status = CarStatus::Rented;
        car.available_to_withdraw += owner_amount;

        let rental = Rental {
            total_days_to_rent,
            amount: total_amount,
            commission,
            is_active: true,
        };

        // Update contract balances
        let mut contract_balance = read_contract_balance(&env);
        contract_balance += total_amount;
        
        let mut admin_balance = read_admin_balance(&env);
        admin_balance += commission;

        write_contract_balance(&env, &contract_balance);
        write_admin_balance(&env, &admin_balance);
        write_car(env, &owner, &car);
        write_rental(env, &renter, &owner, &rental);

        // Transfer tokens from renter to contract
        token_transfer(&env, &renter, &env.current_contract_address(), &total_amount);
        Ok(())
    }

    fn return_car(env: &Env, renter: Address, owner: Address) -> Result<(), Error> {
        renter.require_auth();

        if !has_rental(env, &renter, &owner) {
            return Err(Error::RentalNotFound);
        }

        let rental = read_rental(env, &renter, &owner);
        if !rental.is_active {
            return Err(Error::RentalNotFound);
        }

        let mut car = read_car(env, &owner);
        car.car_status = CarStatus::Available;

        let mut updated_rental = rental;
        updated_rental.is_active = false;

        write_car(env, &owner, &car);
        write_rental(env, &renter, &owner, &updated_rental);

        Ok(())
    }

    fn remove_car(env: &Env, owner: Address) -> Result<(), Error> {
        let admin = read_admin(env);
        admin.require_auth();

        if !has_car(env, &owner) {
            return Err(Error::CarNotFound);
        }

        remove_car(env, &owner);
        Ok(())
    }

    fn payout_owner(env: &Env, owner: Address, amount: i128) -> Result<(), Error> {
        owner.require_auth();

        if amount <= 0 {
            return Err(Error::AmountMustBePositive);
        }

        if !has_car(env, &owner) {
            return Err(Error::CarNotFound);
        }

        let mut car = read_car(&env, &owner);

        // Check if car is returned (not rented)
        if car.car_status == CarStatus::Rented {
            return Err(Error::CarNotReturned);
        }

        if amount > car.available_to_withdraw {
            return Err(Error::InsufficientBalance);
        }

        let mut contract_balance = read_contract_balance(&env);

        if amount > contract_balance {
            return Err(Error::BalanceNotAvailableForAmountRequested);
        }

        car.available_to_withdraw -= amount;
        contract_balance -= amount;

        write_car(&env, &owner, &car);
        write_contract_balance(&env, &contract_balance);

        token_transfer(&env, &env.current_contract_address(), &owner, &amount);
        Ok(())
    }

    fn payout_admin(env: &Env, amount: i128) -> Result<(), Error> {
        let admin = read_admin(env);
        admin.require_auth();

        if amount <= 0 {
            return Err(Error::AmountMustBePositive);
        }

        let admin_balance = read_admin_balance(&env);

        if amount > admin_balance {
            return Err(Error::InsufficientBalance);
        }

        let mut contract_balance = read_contract_balance(&env);

        if amount > contract_balance {
            return Err(Error::BalanceNotAvailableForAmountRequested);
        }

        let new_admin_balance = admin_balance - amount;
        contract_balance -= amount;

        write_admin_balance(&env, &new_admin_balance);
        write_contract_balance(&env, &contract_balance);

        token_transfer(&env, &env.current_contract_address(), &admin, &amount);
        Ok(())
    }

    fn get_admin_balance(env: &Env) -> i128 {
        read_admin_balance(env)
    }
}