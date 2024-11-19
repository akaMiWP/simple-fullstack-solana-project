use crate::instructions::*;
use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;

declare_id!("8fwUnvsRypGyT17uHcp3gE6mCVT46FXqDhR1DDy4ZNee");

#[program]
pub mod topic_counter {
    use super::*;

    pub fn deploy_program(ctx: Context<InitializeStorage>) -> Result<()> {
        initialize(ctx)
    }

    pub fn create_topic(ctx: Context<AddTopic>, title: String, content: String) -> Result<()> {
        add_topic(ctx, title, content)
    }
}
