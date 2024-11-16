use anchor_lang::prelude::*;

declare_id!("7PNBCvkBFzRfoGEuZhnPzT58YNyPpGkNBxdJpjseXJRc");

#[program]
pub mod topic_counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
