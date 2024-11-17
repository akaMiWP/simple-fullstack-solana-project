use crate::instructions::*;
use anchor_lang::prelude::*;

pub mod instructions;

declare_id!("7PNBCvkBFzRfoGEuZhnPzT58YNyPpGkNBxdJpjseXJRc");

#[program]
pub mod topic_counter {
    use super::*;

    pub fn create_topic(ctx: Context<AddTopic>, title: String, content: String) -> Result<()> {
        add_topic(ctx, title, content)
    }
}
