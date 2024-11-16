use anchor_lang::prelude::*;

declare_id!("7PNBCvkBFzRfoGEuZhnPzT58YNyPpGkNBxdJpjseXJRc");

#[program]
pub mod topic_counter {
    use super::*;

    pub fn initialize(ctx: Context<InitializeTopic>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeTopic<'info> {
    #[account(mut)]
    pub topic_owner: Signer<'info>,

    #[account(
        init,
        payer = topic_owner,
        space = 8 + 32 + 32 + 200,
    )]
    pub topic_account: Account<'info, Topic>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct Topic {
    pub topic_author: Pubkey,
    pub title: [u8; 32],
    pub content: [u8; 200],
}
