# Anchor Program for Simple Fullstack Solana Project

This directory contains the Anchor program (smart contract) for the Simple Fullstack Solana Project. The program is written in Rust and deployed on the Solana blockchain to handle on-chain logic and state management. To see the deployed program on devnet, please visit https://explorer.solana.com/address/8Z3i8SXQZsMT76QZJRpjNZTve1YCiXNuyRP3LeyU7Vrc?cluster=devnet

## Project Overview

The Anchor program defines the core logic and state transitions for the application. It interacts with client applications, such as the frontend, to process transactions and maintain the application's state on the blockchain.

## Features

- **Program Derived Addresses (PDAs):** Utilizes PDAs for secure and deterministic account addressing.
- **Instruction Handlers:** Defines handlers for various instructions to manage state and execute logic.
- **TypeScript Tests:** Includes tests to validate program functionality and ensure reliability.

## Prerequisites

Before building and deploying the Anchor program, ensure you have the following installed:

- [Rust](https://www.rust-lang.org/tools/install) (with `cargo`)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)
- [Anchor CLI](https://project-serum.github.io/anchor/getting-started/installation.html)

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/akaMiWP/simple-fullstack-solana-project.git
   ```

2. **Navigate to the Anchor Project Directory:**

   ```bash
   cd simple-fullstack-solana-project/anchor_project
   ```

3. **Install Dependencies:**

   ```bash
   anchor build
   ```

## Building the Program

To build the Anchor program:

```bash
anchor build
```

This command compiles the Rust code and generates the necessary artifacts in the `target` directory.

## Testing the Program

To run the tests:

```bash
anchor test
```

The tests are located in the `tests` directory and are written in TypeScript. They validate the program's functionality and ensure correct behavior.

## Deploying the Program

1. **Configure Solana CLI:**

   Set the Solana CLI to the desired cluster (e.g., Devnet):

   ```bash
   solana config set --url https://api.devnet.solana.com
   ```

2. **Deploy the Program:**

   ```bash
   anchor deploy
   ```

   After deployment, note the program's public key (program ID) for client interactions.

## Program ID

The program ID is a unique identifier for the deployed program on the Solana blockchain. Ensure that the client applications interacting with this program are configured with the correct program ID.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes. Ensure that your code adheres to the project's coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License
