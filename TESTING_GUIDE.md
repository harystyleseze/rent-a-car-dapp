# Rent-A-Car DApp - Testing Guide

## Setup

### 1. Build the Contract

```bash
cd contracts/rent-a-car
stellar contract build
```

### 2. Deploy the Contract

```bash
# Deploy to testnet
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/rent_a_car.wasm \
  --source <your-secret-key> \
  --network testnet

# Save the CONTRACT_ID that gets returned
```

### 3. Configure Environment

```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env and add your CONTRACT_ID
VITE_CONTRACT_ID=<your-contract-id>
```

### 4. Initialize the Contract

```bash
# Replace placeholders with actual values
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source <admin-secret-key> \
  --network testnet \
  -- \
  __constructor \
  --admin <admin-address> \
  --token <token-contract-address>
```

## Testing Flows

### Commission Management

#### Set Commission (10%)

```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source <admin-secret-key> \
  --network testnet \
  -- \
  set_admin_commission \
  --commission 10
```

#### Get Commission

```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --network testnet \
  -- \
  get_admin_commission
```

### Car Management

#### Add Car

```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source <admin-secret-key> \
  --network testnet \
  -- \
  add_car \
  --owner <owner-address> \
  --price_per_day 150000000
```

#### Get Car Status

```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --network testnet \
  -- \
  get_car_status \
  --owner <owner-address>
```

### Rental Flow

#### 1. Rent a Car (3 days @ 150 XLM/day = 450 XLM)

- Total: 450 XLM
- Commission (10%): 45 XLM
- Owner gets: 405 XLM

```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source <renter-secret-key> \
  --network testnet \
  -- \
  rental \
  --renter <renter-address> \
  --owner <owner-address> \
  --total_days_to_rent 3
```

#### 2. Return the Car

```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source <renter-secret-key> \
  --network testnet \
  -- \
  return_car \
  --renter <renter-address> \
  --owner <owner-address>
```

### Payout Flow

#### Owner Withdraws Funds (after car returned)

```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source <owner-secret-key> \
  --network testnet \
  -- \
  payout_owner \
  --owner <owner-address> \
  --amount 405000000
```

#### Admin Withdraws Commission

```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source <admin-secret-key> \
  --network testnet \
  -- \
  payout_admin \
  --amount 45000000
```

#### Check Admin Balance

```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --network testnet \
  -- \
  get_admin_balance
```

## Frontend Testing

### 1. Start the Development Server

```bash
npm install
npm start
```

### 2. Testing with the UI

1. **Connect Wallet**: Install Freighter wallet extension
2. **Select Role**: Choose Admin, Owner, or Renter
3. **Admin Actions**:
   - Set commission percentage
   - Add new cars
   - Remove cars
   - Withdraw commission

4. **Owner Actions**:
   - View their cars
   - Withdraw earnings (when car is available)

5. **Renter Actions**:
   - Browse available cars
   - Rent a car
   - Return rented cars

## Important Notes

- All amounts are in stroops (1 XLM = 10,000,000 stroops)
- Owner can only withdraw when car status is "Available" (not rented)
- Commission is automatically calculated and allocated during rental
- Renter must have sufficient token balance to rent

## Troubleshooting

### Contract Build Issues

```bash
# Ensure Rust toolchain is installed
rustup target add wasm32-unknown-unknown

# Clean and rebuild
cargo clean
stellar contract build
```

### Frontend Issues

```bash
# Clear node modules and reinstall
rm -rf node_modules
npm install

# Check TypeScript errors
npx tsc --noEmit
```

### Transaction Failures

- Verify all addresses are correct
- Ensure sufficient XLM balance
- Check that car status allows the operation
- Verify authorization (require_auth)
