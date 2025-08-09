import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { CaseActionsSchema } from "@terminal-x/shared";

const API_BASE = process.env.API_BASE_URL || "http://localhost:4000";

export const data = new SlashCommandBuilder()
  .setName("mod")
  .setDescription("Moderation commands")
  .setDMPermission(false)
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addSubcommand((sub) =>
    sub
      .setName("warn")
      .setDescription("Warn a user")
      .addUserOption((opt) =>
        opt.setName("user").setDescription("User to warn").setRequired(true)
      )
      .addStringOption((opt) =>
        opt.setName("reason").setDescription("Reason")
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName("note")
      .setDescription("Add a private note")
      .addUserOption((opt) =>
        opt.setName("user").setDescription("User").setRequired(true)
      )
      .addStringOption((opt) =>
        opt.setName("note").setDescription("Note").setRequired(true)
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName("timeout")
      .setDescription("Timeout a user for a number of minutes")
      .addUserOption((opt) =>
        opt.setName("user").setDescription("User").setRequired(true)
      )
      .addIntegerOption((opt) =>
        opt
          .setName("duration")
          .setDescription("Duration in minutes")
          .setRequired(true)
      )
      .addStringOption((opt) =>
        opt.setName("reason").setDescription("Reason")
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName("untimeout")
      .setDescription("Remove timeout from a user")
      .addUserOption((opt) =>
        opt.setName("user").setDescription("User").setRequired(true)
      )
      .addStringOption((opt) =>
        opt.setName("reason").setDescription("Reason")
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName("kick")
      .setDescription("Kick a user")
      .addUserOption((opt) =>
        opt.setName("user").setDescription("User").setRequired(true)
      )
      .addStringOption((opt) =>
        opt.setName("reason").setDescription("Reason")
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName("ban")
      .setDescription("Ban a user")
      .addUserOption((opt) =>
        opt.setName("user").setDescription("User").setRequired(true)
      )
      .addStringOption((opt) =>
        opt.setName("reason").setDescription("Reason")
      )
      .addIntegerOption((opt) =>
        opt
          .setName("deleteDays")
          .setDescription("Delete messages from past N days")
          .setMinValue(0)
          .setMaxValue(7)
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName("unban")
      .setDescription("Unban a user")
      .addStringOption((opt) =>
        opt
          .setName("userid")
          .setDescription("ID of the user to unban")
          .setRequired(true)
      )
      .addStringOption((opt) =>
        opt.setName("reason").setDescription("Reason")
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName("softban")
      .setDescription("Soft-ban (ban then unban) a user")
      .addUserOption((opt) =>
        opt.setName("user").setDescription("User").setRequired(true)
      )
      .addStringOption((opt) =>
        opt.setName("reason").setDescription("Reason")
      )
      .addIntegerOption((opt) =>
        opt
          .setName("deleteDays")
          .setDescription("Delete messages from past N days")
          .setMinValue(0)
          .setMaxValue(7)
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName("case")
      .setDescription("View a case by ID")
      .addStringOption((opt) =>
        opt.setName("id").setDescription("Case ID").setRequired(true)
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName("cases")
      .setDescription("List cases for a user")
      .addUserOption((opt) =>
        opt.setName("user").setDescription("User").setRequired(true)
      )
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const sub = interaction.options.getSubcommand(true);
  const guildId = interaction.guildId!;
  const actorId = interaction.user.id;

  try {
    switch (sub) {
      case "warn": {
        const user = interaction.options.getUser("user", true);
        const reason = interaction.options.getString("reason") ?? undefined;
        await fetch(`${API_BASE}/guilds/${guildId}/cases`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetId: user.id,
            actorId,
            reason,
            action: CaseActionsSchema.Enum.WARN,
          }),
        });
        await interaction.reply({
          content: `✅ Warned ${user.tag}${reason ? ` for ${reason}` : ""}.`,
          ephemeral: true,
        });
        break;
      }
      case "note": {
        const user = interaction.options.getUser("user", true);
        const note = interaction.options.getString("note", true);
        await fetch(`${API_BASE}/guilds/${guildId}/cases`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetId: user.id,
            actorId,
            reason: note,
            action: CaseActionsSchema.Enum.NOTE,
          }),
        });
        await interaction.reply({
          content: `📝 Added a note for ${user.tag}.`,
          ephemeral: true,
        });
        break;
      }
      case "timeout": {
        const user = interaction.options.getUser("user", true);
        const duration = interaction.options.getInteger("duration", true);
        const reason = interaction.options.getString("reason") ?? undefined;
        const member = await interaction.guild!.members.fetch(user.id);
        const ms = duration * 60 * 1000;
        await member.timeout(ms, reason ?? undefined);
        await fetch(`${API_BASE}/guilds/${guildId}/cases`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetId: user.id,
            actorId,
            reason,
            durationSec: duration * 60,
            action: CaseActionsSchema.Enum.TIMEOUT,
          }),
        });
        await interaction.reply({
          content: `🔇 Timed out ${user.tag} for ${duration} minute(s).`,
          ephemeral: true,
        });
        break;
      }
      case "untimeout": {
        const user = interaction.options.getUser("user", true);
        const reason = interaction.options.getString("reason") ?? undefined;
        const member = await interaction.guild!.members.fetch(user.id);
        await member.timeout(null, reason ?? undefined);
        await fetch(`${API_BASE}/guilds/${guildId}/cases`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetId: user.id,
            actorId,
            reason,
            action: CaseActionsSchema.Enum.UNMUTE,
          }),
        });
        await interaction.reply({
          content: `🔈 Removed timeout for ${user.tag}.`,
          ephemeral: true,
        });
        break;
      }
      case "kick": {
        const user = interaction.options.getUser("user", true);
        const reason = interaction.options.getString("reason") ?? undefined;
        await interaction.guild!.members.kick(user.id, reason ?? undefined);
        await fetch(`${API_BASE}/guilds/${guildId}/cases`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetId: user.id,
            actorId,
            reason,
            action: CaseActionsSchema.Enum.KICK,
          }),
        });
        await interaction.reply({
          content: `👢 Kicked ${user.tag}.`,
          ephemeral: true,
        });
        break;
      }
      case "ban": {
        const user = interaction.options.getUser("user", true);
        const reason = interaction.options.getString("reason") ?? undefined;
        const deleteDays = interaction.options.getInteger("deleteDays") ?? undefined;
        await interaction.guild!.members.ban(user.id, {
          reason: reason ?? undefined,
          deleteMessageSeconds: deleteDays ? deleteDays * 24 * 60 * 60 : undefined,
        });
        await fetch(`${API_BASE}/guilds/${guildId}/cases`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetId: user.id,
            actorId,
            reason,
            action: CaseActionsSchema.Enum.BAN,
          }),
        });
        await interaction.reply({
          content: `⛔ Banned ${user.tag}.`,
          ephemeral: true,
        });
        break;
      }
      case "unban": {
        const userId = interaction.options.getString("userid", true);
        const reason = interaction.options.getString("reason") ?? undefined;
        await interaction.guild!.members.unban(userId, reason ?? undefined);
        await fetch(`${API_BASE}/guilds/${guildId}/cases`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetId: userId,
            actorId,
            reason,
            action: CaseActionsSchema.Enum.UNBAN,
          }),
        });
        await interaction.reply({
          content: `✅ Unbanned <@${userId}>.`,
          ephemeral: true,
        });
        break;
      }
      case "softban": {
        const user = interaction.options.getUser("user", true);
        const reason = interaction.options.getString("reason") ?? undefined;
        const deleteDays = interaction.options.getInteger("deleteDays") ?? undefined;
        await interaction.guild!.members.ban(user.id, {
          reason: reason ?? undefined,
          deleteMessageSeconds: deleteDays ? deleteDays * 24 * 60 * 60 : undefined,
        });
        await interaction.guild!.members.unban(user.id, reason ?? undefined);
        await fetch(`${API_BASE}/guilds/${guildId}/cases`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetId: user.id,
            actorId,
            reason,
            action: CaseActionsSchema.Enum.SOFTBAN,
          }),
        });
        await interaction.reply({
          content: `🔀 Soft-banned ${user.tag}.`,
          ephemeral: true,
        });
        break;
      }
      case "case": {
        const id = interaction.options.getString("id", true);
        const res = await fetch(`${API_BASE}/guilds/${guildId}/cases/${id}`);
        if (!res.ok) {
          await interaction.reply({
            content: `❌ Case not found.`,
            ephemeral: true,
          });
          break;
        }
        const data = await res.json();
        await interaction.reply({
          content: `Case ${id}: Action ${data.action}, Reason: ${data.reason || "None"}, Target: <@${data.targetId}>, Moderator: <@${data.actorId}>`,
          ephemeral: true,
        });
        break;
      }
      case "cases": {
        const user = interaction.options.getUser("user", true);
        const res = await fetch(`${API_BASE}/guilds/${guildId}/cases?userId=${user.id}`);
        if (!res.ok) {
          await interaction.reply({
            content: `❌ Error fetching cases.`,
            ephemeral: true,
          });
          break;
        }
        const cases = await res.json();
        if (!cases?.length) {
          await interaction.reply({
            content: `${user.tag} has no cases.`,
            ephemeral: true,
          });
        } else {
          const list = cases
            .map((c: any) => `• ${c.id} - ${c.action} - ${c.reason || "No reason"}`)
            .join("\n");
          await interaction.reply({
            content: `Cases for ${user.tag}:\n${list}`,
            ephemeral: true,
          });
        }
        break;
      }
      default: {
        await interaction.reply({
          content: "Unknown subcommand",
          ephemeral: true,
        });
      }
    }
  } catch (err: any) {
    console.error(err);
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    if (!interaction.replied) {
      await interaction.reply({
        content: `❌ Error: ${message}`,
        ephemeral: true,
      });
    }
  }
}
