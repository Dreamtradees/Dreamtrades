export type FollowUpScript = {
  id: string;
  title: string;
  when: string;
  body: string;
};

/**
 * Messages the team copies and sends by hand.
 * Placeholders stay as {name} so a person fills them in before sending.
 */
export const FOLLOW_UP_SCRIPTS: FollowUpScript[] = [
  {
    id: "welcome",
    title: "Welcome",
    when: "Send the day someone joins, once you have their name and a chat handle.",
    body: `Hey {name}, it's DreamTrades.

Good to meet you. You don't need a perfect setup to start — just tell me if you've opened a chart before, and whether gold is the market you want to learn first.

We'll take it one step at a time. Reply here whenever you're free.`,
  },
  {
    id: "48h-no-account",
    title: "48 hours, no broker account",
    when: "Two days after the welcome, if they still have no broker account on the desk.",
    body: `Hey {name}, checking in from DreamTrades.

It's been a couple of days. No rush — opening a broker account is the next practical step when you're ready. If something is in the way (your country, documents, or which broker to use), tell me and I'll walk you through it.

Reply on this chat whenever you can.`,
  },
  {
    id: "7d-no-deposit",
    title: "7 days, no deposit",
    when: "About a week after the account is open, if the first deposit is still empty.",
    body: `Hey {name}, DreamTrades here.

Your account is open, which is the hard part done. The first deposit is what turns practice into a real book — start with an amount you can leave alone, not rent or bill money.

If you want, tell me the amount you're comfortable with and I'll help you think through size before you send it.`,
  },
  {
    id: "funded-vip",
    title: "Funded and VIP invite",
    when: "After the first deposit is logged, when you are ready to invite them into VIP.",
    body: `Hey {name}, this is DreamTrades.

You're funded — that's a real milestone. From here we keep it slow: review your first trades, run the checklist, and size the risk before you click.

When you want the VIP room, reply "VIP" and I'll send you the invite myself.`,
  },
];
