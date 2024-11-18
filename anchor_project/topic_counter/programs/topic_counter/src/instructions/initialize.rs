use super::errors::ErrorCode;
use anchor_lang::prelude::*;

pub fn initialize(ctx: Context<InitializeStorage>) -> Result<()> {
    let topic_storage = &mut ctx.accounts.topic_storage;
    topic_storage.total_topics = 0;
    topic_storage.bump = ctx.bumps.topic_storage;

    Ok(())
}

#[derive(Accounts)]
pub struct InitializeStorage<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        init,
        seeds=[b"topic_storage"],
        bump,
        payer = admin,
        space = 8 + TopicStorage::INIT_SPACE,
    )]
    pub topic_storage: Account<'info, TopicStorage>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct TopicStorage {
    pub total_topics: u64,
    pub bump: u8,
}
