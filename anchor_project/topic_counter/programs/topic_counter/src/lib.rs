use anchor_lang::prelude::*;

declare_id!("7PNBCvkBFzRfoGEuZhnPzT58YNyPpGkNBxdJpjseXJRc");

#[program]
pub mod topic_counter {
    use super::*;

    pub fn initialize(ctx: Context<InitializeTopic>, title: String, content: String) -> Result<()> {
        require!(title.len() < 32, ErrorCode::TitleTooLong);
        require!(content.len() < 200, ErrorCode::ContentTooLong);

        let topic_account = &mut ctx.accounts.topic_account;
        topic_account.topic_author = ctx.accounts.topic_owner.key();

        let mut titleArray = [0u8; 32];
        let bytes = title.as_bytes();
        let len = bytes.len().min(32);
        titleArray[..len].copy_from_slice(&bytes[..len]);
        topic_account.title = titleArray;

        let mut contentArray = [0u8; 200];
        let bytes = title.as_bytes();
        let len = bytes.len().min(200);
        contentArray[..len].copy_from_slice(&bytes[..len]);
        topic_account.content = contentArray;

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

#[error_code]
pub enum ErrorCode {
    #[msg("The title exceeds the maximum length of 32 bytes.")]
    TitleTooLong,
    #[msg("The content exceeds the maximum length of 200 bytes.")]
    ContentTooLong,
}
