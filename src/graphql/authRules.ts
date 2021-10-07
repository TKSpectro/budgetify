import { prisma } from '~/utils/prisma';
import { Context } from './context';

export const authIsLoggedIn = (_: any, __: any, ctx: Context) => (ctx.user ? true : false);

export const authIsAdmin = (_: any, __: any, ctx: Context) => ctx.user.isAdmin;

export const authIsGroupMember = async (_: any, args: any, ctx: Context) => {
  // Find the group and in that just the member with the current user id
  const groupMember = await prisma.group
    .findUnique({
      where: { id: args.groupId },
    })
    .members({ where: { id: ctx.user.id } });

  return groupMember.length > 0;
};

export const authIsGroupOwner = async (_: any, args: any, ctx: Context) => {
  // Find the group and in that just the owner with the current user id
  const groupOwner = await prisma.group
    .findUnique({
      where: { id: args.groupId },
    })
    .owners({ where: { id: ctx.user.id } });

  return groupOwner.length > 0;
};

export const authIsGroupOwnerOrMemberIdCurrentUser = async (_: any, args: any, ctx: Context) => {
  if (ctx.user.id === args.memberId) return true;

  // Find the group and in that just the owner with the current user id
  const groupOwner = await prisma.group
    .findUnique({
      where: { id: args.groupId },
    })
    .owners({ where: { id: ctx.user.id } });

  return groupOwner.length > 0;
};

export const authIsHouseholdMember = async (_: any, args: any, ctx: Context) => {
  // Find the household and in that just the memeber with the current user id
  const householdMember = await prisma.household
    .findUnique({
      where: { id: args.householdId },
    })
    .members({ where: { id: ctx.user.id } });

  return householdMember.length > 0;
};

export const authIsHouseholdOwner = async (_: any, args: any, ctx: Context) => {
  // Find the household and in that just the owner with the current user id
  const householdOwner = await prisma.household
    .findUnique({
      where: { id: args.householdId },
    })
    .owner();

  return householdOwner?.id === ctx.user.id;
};

export const authIsHouseholdOwnerOrMemberIdCurrentUser = async (
  _: any,
  args: any,
  ctx: Context,
) => {
  // User requested something for himself so we can authorize it
  if (ctx.user.id === args.memberId) return true;

  // Find the household and in that just the owner with the current user id
  const householdOwner = await prisma.household
    .findUnique({
      where: { id: args.householdId },
    })
    .owner();

  return householdOwner?.id === ctx.user.id;
};
