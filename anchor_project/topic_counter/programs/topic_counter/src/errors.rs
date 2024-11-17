use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("The title exceeds the maximum length of 32 bytes.")]
    TitleTooLong,
    #[msg("The content exceeds the maximum length of 200 bytes.")]
    ContentTooLong,
}
