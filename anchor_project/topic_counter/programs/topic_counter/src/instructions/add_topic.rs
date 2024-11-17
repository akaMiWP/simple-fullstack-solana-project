use super::errors::ErrorCode;
use super::TopicStorage;
use anchor_lang::prelude::*;

pub fn add_topic(ctx: Context<AddTopic>, title: String, content: String) -> Result<()> {
    require!(title.len() < 32, ErrorCode::TitleTooLong);
    require!(content.len() < 200, ErrorCode::ContentTooLong);

    let topic_account = &mut ctx.accounts.topic_account;
    topic_account.topic_author = ctx.accounts.topic_owner.key();

    let mut title_array = [0u8; 32];
    let bytes = title.as_bytes();
    let len = bytes.len().min(32);
    title_array[..len].copy_from_slice(&bytes[..len]);
    topic_account.title = title_array;

    let mut content_array = [0u8; 200];
    let bytes = content.as_bytes();
    let len = bytes.len().min(200);
    content_array[..len].copy_from_slice(&bytes[..len]);
    topic_account.content = content_array;

    let topic_storage = &mut ctx.accounts.topic_storage;
    topic_storage.total_topics = topic_storage
        .total_topics
        .checked_add(1)
        .expect("Not overflow");

    Ok(())
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct AddTopic<'info> {
    #[account(mut)]
    pub topic_owner: Signer<'info>,

    #[account(
        init,
        payer = topic_owner,
        space = 8 + 32 + 32 + 200,
        seeds = [
            b"topic",
            title.as_bytes(),
            topic_owner.key().as_ref()
        ],
        bump
    )]
    pub topic_account: Account<'info, Topic>,

    #[account(
        mut,
        seeds=[b"topic_storage"],
        bump
    )]
    pub topic_storage: Account<'info, TopicStorage>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct Topic {
    pub topic_author: Pubkey,
    pub title: [u8; 32],
    pub content: [u8; 200],
}
