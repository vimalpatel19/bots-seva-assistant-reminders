const MSG_SABHA_ASSIGNMENT = "sabhaAssignments";
const MSG_SABHA_FOLLOW_UP = "sabhaFollowUp";
const MSG_SABHA_SUMMARY = "sabhaSummary";
const MSG_WEEKLY_CALL = "weeklyCall";

// Returns message based on the provided schedule status and description
const getMessage = (status, description) => {
    let msg = "I don't know why I am sending this message!";

    if (status === "idle") {
        switch(description) {
            case MSG_SABHA_ASSIGNMENT:
                msg = "*Sabha Sanchalaks*\nIf you haven't done already, please assign presentations for our upcoming sabha ASAP! The faster you assign it, the more time the presenter will have to prepare!";
                break;
            
            case MSG_SABHA_FOLLOW_UP:
                msg = "*Sabha Sanchalaks*\nWe can getting close to Sunday. Please follow-up with the assigned presenters for this week to make sure that they are ready for sabha!";
                break;

            case MSG_SABHA_SUMMARY:
                msg = "*Sabha Sanchalaks*\nFriendly reminder to send out last sabha's summary to parents if you haven't already done so!";
                break;

            case MSG_WEEKLY_CALL:
                msg = "Jai Swaminarayan karyakars! Are you available for this week's call at 9PM tonight?";
                break;
        }
    }
    else if (status === "triggered" || status === "retry") {
        switch(description) {
            case MSG_SABHA_ASSIGNMENT:
                msg = "I haven't heard back from all sabha sanchalaks! *Please reply back if you have assigned presentations for your group*";
                break;

            case MSG_SABHA_SUMMARY:
                msg = "I haven't received confirmation that all sabha summaries have been sent out. *Please reply back if you have sent out last week's sabha summary for your group!*";
                break;

            case MSG_WEEKLY_CALL:
                msg = "Let's re-schedule since most of the karyakars cannot make it! How about 9PM tomorrow evening instead?";
                break;
        }
    }

    return msg;
};

module.exports = {
    getMessage
};