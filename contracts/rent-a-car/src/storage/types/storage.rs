use soroban_sdk::{contracttype, Address};

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    Token,
    ContractBalance,
    AdminCommission,
    AdminBalance,
    Car(Address),
    Rental(Address, Address),
}