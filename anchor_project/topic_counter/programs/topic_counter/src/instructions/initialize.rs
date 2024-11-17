use super::errors::ErrorCode;
use anchor_lang::prelude::*;

pub fn initialize(ctx: Context<InitializeStorage>) -> Result<()> {
    let topic_storage = &mut ctx.accounts.topic_storage;
    topic_storage.total_topics = 0;

    Ok(())
}

#[derive(Accounts)]
pub struct InitializeStorage<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        init,
        payer = admin,
        space = 8 + 8,
        seeds=[b"topic_storage"],
        bump
    )]
    pub topic_storage: Account<'info, TopicStorage>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct TopicStorage {
    pub total_topics: u64,
}
