use soroban_sdk::testutils::Address as _;
use crate::tests::config::contract::ContractTest;

#[test]
pub fn test_set_admin_commission() {
    let ContractTest { contract, .. } = ContractTest::setup();
    
    let commission = 10; // 10%
    contract.set_admin_commission(&commission);
    
    let stored_commission = contract.get_admin_commission();
    assert_eq!(stored_commission, commission);
}

#[test]
pub fn test_rental_with_commission() {
    let ContractTest { env, contract, token, .. } = ContractTest::setup();
    
    env.mock_all_auths();
    
    let owner = Address::generate(&env);
    let renter = Address::generate(&env);
    let price_per_day = 1500_i128;
    let total_days = 3;
    let commission = 10; // 10%
    
    let (_, token_admin, _) = token;
    token_admin.mint(&renter, &10_000_i128);
    
    contract.set_admin_commission(&commission);
    contract.add_car(&owner, &price_per_day);
    
    contract.rental(&renter, &owner, &total_days);
    
    let total_amount = price_per_day * total_days as i128;
    let expected_commission = (total_amount * commission) / 100;
    let expected_owner_amount = total_amount - expected_commission;
    
    let admin_balance = contract.get_admin_balance();
    assert_eq!(admin_balance, expected_commission);
    
    let car_status = contract.get_car_status(&owner).unwrap();
    assert_eq!(car_status, CarStatus::Rented);
}